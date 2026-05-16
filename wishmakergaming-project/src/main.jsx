// force deploy
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  Search, Star, Shield, Gamepad2, LogOut, Edit, Trash2,
  Trophy, Sparkles, Clock, ThumbsUp, ThumbsDown, Image as ImageIcon
} from 'lucide-react';
import './style.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const emptyPost = {
  title: '',
  slug: '',
  score: '',
  category: '',
  seo_description: '',
  cover_image_url: '',
  body: '',
  status: 'draft',
};

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function scoreLabel(score) {
  const s = Number(score);
  if (s >= 9.5) return 'Legendary';
  if (s >= 9.0) return 'Must Play';
  if (s >= 8.5) return 'Excellent';
  if (s >= 8.0) return 'Great';
  if (s >= 7.0) return 'Good';
  if (s >= 6.0) return 'Average';
  if (s >= 5.0) return 'Flawed';
  return 'Skip Unless Fan';
}

function scorePercent(score) {
  return Math.max(0, Math.min(100, Number(score || 0) * 10));
}

function App() {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return <AdminCMS />;
  if (path.startsWith('/about')) return <AboutPage />;
  if (path.startsWith('/review-policy')) return <ReviewPolicyPage />;
  if (path.startsWith('/reviews/')) return <ReviewPage slug={path.split('/reviews/')[1]} />;
  return <HomePage />;
}

function Header() {
  return (
    <header className="header">
      <a href="/" className="brand">
        <div className="logo">WMG</div>
        <div>
          <strong>WishMaker<span>Gaming</span></strong>
          <small>Built for Players. Honest Reviews. Better Gaming.</small>
        </div>
      </a>
      <nav>
  <a href="/">Home</a>
  <a href="/#reviews">Reviews</a>
  <a href="/about">About</a>
  <a href="/review-policy">Review Policy</a>
  <a href="/admin">Admin</a>
</nav>
    </header>
  );
}

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  const filtered = posts.filter(p =>
    [p.title, p.category, p.seo_description].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  const featured = posts[0];

  return (
    <div>
      <Header />
      <main>
        <section className="hero">
          <div className="heroText">
            <p className="eyebrow"><Star size={16}/> WishMakerGaming Reviews</p>
            <h1>Discover Games <span>Worth Your Time</span></h1>
            <p>Honest reviews, clear scores, and player-first recommendations for PC gamers.</p>
            <div className="heroButtons">
              <a href="#reviews" className="primary">Explore Reviews</a>
              <a href="/admin" className="secondary">Open CMS</a>
            </div>
            <div className="stats">
              <div><strong>{posts.length}</strong><small>Published Reviews</small></div>
              <div><strong>4</strong><small>Core Score Pillars</small></div>
              <div><strong>100%</strong><small>Player Focused</small></div>
            </div>
          </div>
          <div className="featured">
            <p className="eyebrow">Featured Review</p>
            {featured ? (
              <>
                {featured.cover_image_url && <img src={featured.cover_image_url} alt={featured.title} />}
                <h2>{featured.title}</h2>
                <div className="score">{featured.score}<small>/10</small></div>
                <p>{featured.seo_description}</p>
                <a href={`/reviews/${featured.slug}`} className="primary small">Read Review</a>
              </>
            ) : (
              <>
                <h2>No reviews published yet</h2>
                <p>Publish your first review from the CMS.</p>
                <a href="/admin" className="primary small">Go to CMS</a>
              </>
            )}
          </div>
        </section>

        <section className="pillars">
          <div><Gamepad2/><h3>Gameplay</h3><p>Fun, control, combat, pacing and mechanics.</p></div>
          <div><Shield/><h3>Replayability</h3><p>Longevity, builds, endgame and reasons to return.</p></div>
          <div><Star/><h3>Presentation</h3><p>Graphics, art direction, animation, UI and audio.</p></div>
          <div><Search/><h3>Value</h3><p>Price vs content, polish and player time respected.</p></div>
        </section>

        <section id="reviews" className="reviews">

  <div className="sectionTop">
    <h2>Top Rated Games</h2>
  </div>

  <div className="grid">
    {[...posts]
      .sort((a,b) => b.score - a.score)
      .slice(0,3)
      .map(post => (
        <a key={post.id} href={`/reviews/${post.slug}`} className="card">
          <img src={post.cover_image_url} alt={post.title} />
          <div className="cardBody">
            <span className="tag">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.seo_description}</p>

            <div className="cardBottom">
              <strong>{post.score}/10</strong>
              <small>
                {post.score >= 9.5
                  ? 'Legendary'
                  : post.score >= 9
                  ? 'Must Play'
                  : 'Excellent'}
              </small>
            </div>
          </div>
        </a>
      ))}
  </div>

  <div className="sectionTop" style={{marginTop:'70px'}}>
    <h2>Latest Reviews</h2>
  </div>

  <div className="grid">
    {posts.map(post => (
      <a key={post.id} href={`/reviews/${post.slug}`} className="card">
        <img src={post.cover_image_url} alt={post.title} />

        <div className="cardBody">
          <span className="tag">{post.category}</span>

          <h3>{post.title}</h3>

          <p>{post.seo_description}</p>

          <div className="cardBottom">
            <strong>{post.score}/10</strong>

            <small>
              {post.score >= 9.5
                ? 'Legendary'
                : post.score >= 9
                ? 'Must Play'
                : 'Excellent'}
            </small>
          </div>
        </div>
      </a>
    ))}
  </div>

</section>
      </main>
      <footer>© WishMakerGaming — Built for Players. Honest Reviews. Better Gaming.</footer>
    </div>
  );
}

function ReviewCard({ post }) {
  return (
    <a href={`/reviews/${post.slug}`} className="card">
      {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} />}
      <div className="cardBody">
        <span className="tag">{post.category || 'Review'}</span>
        <h3>{post.title}</h3>
        <p>{post.seo_description}</p>
        <div className="cardBottom">
          <strong>{post.score}/10</strong>
          <small>{scoreLabel(post.score)}</small>
        </div>
      </div>
    </a>
  );
}

function getSectionItems(body, heading) {
  const lines = body.split('\n');
  const start = lines.findIndex(l => l.trim().toLowerCase().replace(':','') === heading.toLowerCase());
  if (start === -1) return [];
  const items = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^(cons|pros|final verdict|who should play|compared|gameplay|replayability|graphics|value)/i.test(line) && items.length) break;
    if (!line.includes('Score:') && line.length < 110) items.push(line.replace(/^- /, ''));
    if (items.length >= 7) break;
  }
  return items;
}

function ReviewPage({ slug }) {
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setPost(data);
        if (data) {
          supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .neq('slug', slug)
            .limit(3)
            .then(({ data }) => setRelated(data || []));
        }
      });
  }, [slug]);

  if (!post) return <><Header /><main className="article"><h1>Review not found</h1></main></>;

  const pros = getSectionItems(post.body, 'Pros');
  const cons = getSectionItems(post.body, 'Cons');
  const percent = scorePercent(post.score);

  return (
    <>
      <Header />
      <main className="ultimateReview">
        <section className="reviewCinematicHero" style={{
          backgroundImage: post.cover_image_url
            ? `linear-gradient(90deg, rgba(8,8,15,.98), rgba(8,8,15,.72), rgba(8,8,15,.35)), url(${post.cover_image_url})`
            : undefined
        }}>
          <div className="reviewHeroContent">
            <div className="reviewMeta">
              <span className="tag">{post.category || 'Review'}</span>
              <span><Clock size={14}/> WishMakerGaming Review</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.seo_description}</p>
            <div className="heroReviewActions">
              <a href="#verdict" className="primary">Jump to Verdict</a>
              <a href="#review" className="secondary">Read Full Review</a>
            </div>
          </div>

          <aside className="cinematicScoreCard">
            <div className="scoreRing" style={{'--score': percent}}>
              <span>{post.score}</span>
              <small>/10</small>
            </div>
            <strong>{scoreLabel(post.score)}</strong>
            <p>Official Verdict</p>
          </aside>
        </section>

        <section className="reviewQuickGrid">
          <div className="quickCard"><Gamepad2/><span>Gameplay</span><strong>40%</strong></div>
          <div className="quickCard"><Shield/><span>Replayability</span><strong>20%</strong></div>
          <div className="quickCard"><Star/><span>Presentation</span><strong>20%</strong></div>
          <div className="quickCard"><Search/><span>Value</span><strong>20%</strong></div>
        </section>

        <section id="review" className="reviewMainLayout">
          <article className="reviewArticle">
            <div className="editorialIntro">
              <Sparkles/>
              <div>
                <h2>Quick Verdict</h2>
                <p>{post.seo_description}</p>
              </div>
            </div>

            {(pros.length > 0 || cons.length > 0) && (
              <div className="prosConsPanel">
                <div>
                  <h3><ThumbsUp size={18}/> Pros</h3>
                  {pros.map((p, i) => <p key={i}>+ {p}</p>)}
                </div>
                <div>
                  <h3><ThumbsDown size={18}/> Cons</h3>
                  {cons.map((c, i) => <p key={i}>− {c}</p>)}
                </div>
              </div>
            )}

            <div className="articleBody ultimateBody">
              <div className="articleBody ultimateBody">

  <div className="gameMetaGrid">
    <div>
      <small>Platform</small>
      <strong>PC / Steam</strong>
    </div>

    <div>
      <small>Reviewer</small>
      <strong>WishMaker</strong>
    </div>

    <div>
      <small>Hours Played</small>
      <strong>80+ Hours</strong>
    </div>

    <div>
      <small>Status</small>
      <strong>Completed</strong>
    </div>
  </div>

  {post.body.split('\n').map((line,i) => {
              {post.body.split('\n').map((line, i) => {
                const clean = line.trim();
                if (!clean) return <br key={i}/>;
                if (clean.startsWith('# ')) return <h2 key={i}>{clean.replace('# ', '')}</h2>;
                if (clean.startsWith('## ')) return <h3 key={i}>{clean.replace('## ', '')}</h3>;
                if (clean.match(/^(Gameplay|Replayability|Graphics|Value|Final Verdict|Who Should Play|Pros|Cons|Compared|What Makes)/i)) return <h2 key={i}>{clean}</h2>;
                if (clean.startsWith('- ')) return <li key={i}>{clean.replace('- ', '')}</li>;
                if (clean.toLowerCase().includes('score:')) return <p key={i} className="scoreLine">{line}</p>;
                return <p key={i}>{line}</p>;
              })}
            </div>
          </article>

          <aside className="reviewSticky">
            <div id="verdict" className="stickyVerdict">
              <Trophy/>
              <span>{post.score}/10</span>
              <strong>{scoreLabel(post.score)}</strong>
              <p>{post.seo_description}</p>
            </div>

           <div className="finalScoreBox">
  <h2>WishMakerGaming Final Score</h2>

  <div className="scoreRow">
    <span>Gameplay</span>
    <strong>9.3</strong>
  </div>

  <div className="scoreRow">
    <span>Replayability</span>
    <strong>8.9</strong>
  </div>

  <div className="scoreRow">
    <span>Graphics / Presentation</span>
    <strong>9.8</strong>
  </div>

  <div className="scoreRow">
    <span>Value</span>
    <strong>9.2</strong>
  </div>

  <div className="finalVerdict">
    <span>Final Verdict</span>
    <strong>9.3</strong>
    <p>Must Play</p>
  </div>
</div>

            <div className="mediaPrompt">
              <ImageIcon/>
              <h3>Make It Pop</h3>
              <p>Add 3–5 image URLs inside the article later for a full screenshot gallery system.</p>
            </div>

            {related.length > 0 && (
              <div className="related">
                <h3>Related Reviews</h3>
                {related.map(r => <a key={r.id} href={`/reviews/${r.slug}`}>{r.title}<small>{r.score}/10</small></a>)}
              </div>
            )}
          </aside>
        </section>
      </main>
    </>
  );
}
function AboutPage() {
  return (
    <>
      <Header />
      <main className="staticPage">
        <span className="tag">About WishMakerGaming</span>
        <h1>Built for Players. Honest Reviews. Better Gaming.</h1>
        <p>
          WishMakerGaming is a player-first gaming review site focused on honest opinions,
          clear scoring, and helping gamers decide what is actually worth their time.
        </p>
        <p>
          We focus on games we genuinely play, especially RPGs, action games, horror,
          multiplayer titles, MMOs, and PC gaming experiences.
        </p>
        <p>
          Our goal is simple: no fake hype, no empty scores, no corporate noise — just
          useful reviews from a real gamer perspective.
        </p>
      </main>
    </>
  );
}

function ReviewPolicyPage() {
  return (
    <>
      <Header />
      <main className="staticPage">
        <span className="tag">Review Policy</span>
        <h1>How WishMakerGaming Scores Games</h1>
        <p>
          Every WishMakerGaming review is built around four core pillars:
          Gameplay, Replayability, Graphics / Presentation, and Value.
        </p>

        <div className="policyGrid">
          <div><strong>Gameplay</strong><p>Controls, combat, mechanics, pacing, challenge, and fun factor.</p></div>
          <div><strong>Replayability</strong><p>Long-term value, endgame, builds, multiplayer, and reasons to return.</p></div>
          <div><strong>Presentation</strong><p>Graphics, art direction, sound, animation, atmosphere, and polish.</p></div>
          <div><strong>Value</strong><p>Price vs content, performance, quality, and respect for player time.</p></div>
        </div>

        <h2>Our Promise</h2>
        <p>
          We aim to review games honestly and only publish opinions based on real playtime.
          If we have not played enough of a game, we treat it as a preview or first impression,
          not a final scored review.
        </p>

        <h2>Score Meaning</h2>
        <p>9.5–10: Legendary</p>
        <p>9.0–9.4: Must Play</p>
        <p>8.5–8.9: Excellent</p>
        <p>8.0–8.4: Great</p>
        <p>7.0–7.9: Good</p>
        <p>Below 7: Only recommended for specific audiences.</p>
      </main>
    </>
  );
}
function AdminCMS() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadPosts();
  }, [session]);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function loadPosts() {
    const { data, error } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
    if (error) return setMessage(error.message);
    setPosts(data || []);
  }

  function updateField(key, value) {
    setForm(current => ({
      ...current,
      [key]: value,
      slug: key === 'title' && !editingId ? slugify(value) : current.slug
    }));
  }

  async function savePost(status) {
    if (!form.title || !form.body) return setMessage('Title and review body are required.');
    setLoading(true);
    const payload = {
      ...form,
      status,
      slug: form.slug || slugify(form.title),
      score: form.score ? Number(form.score) : null,
      author_id: session.user.id,
      published_at: status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const req = editingId
      ? supabase.from('posts').update(payload).eq('id', editingId).select().single()
      : supabase.from('posts').insert(payload).select().single();

    const { error } = await req;
    setLoading(false);
    if (error) return setMessage(error.message);

    setMessage(status === 'published' ? 'Published successfully.' : 'Draft saved.');
    setForm(emptyPost);
    setEditingId(null);
    loadPosts();
  }

  async function deletePost(id) {
    if (!confirm('Delete this article?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return setMessage(error.message);
    loadPosts();
  }

  function editPost(post) {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      score: post.score || '',
      category: post.category || '',
      seo_description: post.seo_description || '',
      cover_image_url: post.cover_image_url || '',
      body: post.body || '',
      status: post.status || 'draft',
    });
  }

  if (!session) {
    return (
      <div className="login">
        <form onSubmit={login}>
          <h1>WishMakerGaming CMS</h1>
          <p>Admin login for publishing reviews.</p>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
          {message && <p className="error">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="cms">
        <div className="cmsTop">
          <div>
            <h1>Live CMS</h1>
            <p>Write, save drafts and publish reviews.</p>
          </div>
          <button onClick={logout} className="secondary"><LogOut size={16}/> Logout</button>
        </div>

        {message && <div className="notice">{message}</div>}

        <section className="cmsGrid">
          <div className="editor">
            <h2>{editingId ? 'Edit Article' : 'New Article'}</h2>
            <div className="fields">
              <input value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Article title" />
              <input value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="URL slug" />
              <input value={form.score} onChange={e => updateField('score', e.target.value)} placeholder="Score, e.g. 9.6" />
              <input value={form.category} onChange={e => updateField('category', e.target.value)} placeholder="Category, e.g. RPG" />
              <input className="wide" value={form.cover_image_url} onChange={e => updateField('cover_image_url', e.target.value)} placeholder="Cover image URL" />
              <input className="wide" value={form.seo_description} onChange={e => updateField('seo_description', e.target.value)} placeholder="SEO description" />
            </div>
            <textarea value={form.body} onChange={e => updateField('body', e.target.value)} placeholder="Paste or write full review here..." />
            <div className="actions">
              <button onClick={() => savePost('draft')} disabled={loading}>Save Draft</button>
              <button onClick={() => savePost('published')} disabled={loading} className="primaryBtn">Publish Live</button>
              {editingId && <button onClick={() => {setEditingId(null); setForm(emptyPost)}}>Cancel</button>}
            </div>
          </div>

          <aside className="manager">
            <h2>Content Manager</h2>
            {posts.map(post => (
              <div className="postRow" key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <small>/{post.slug} · {post.status}</small>
                </div>
                <div>
                  <button onClick={() => editPost(post)}><Edit size={14}/></button>
                  <button onClick={() => deletePost(post.id)}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
