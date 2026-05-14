# WishMakerGaming

Built for Players. Honest Reviews. Better Gaming.

## Deploy
1. Upload these files to your `wishmakergaming` GitHub repo.
2. Vercel will auto-detect Vite.
3. Add these environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.

## Supabase table

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  score numeric,
  category text,
  seo_description text,
  cover_image_url text,
  body text not null,
  status text default 'draft',
  author_id uuid,
  published_at timestamptz,
  updated_at timestamptz default now()
);
```
