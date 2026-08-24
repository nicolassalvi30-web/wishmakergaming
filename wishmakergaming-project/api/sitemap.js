import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BASE_URL = "https://www.wishmakergaming.com";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(req, res) {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("slug, published_at, updated_at")
      .eq("status", "published")
      .not("slug", "is", null)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Sitemap Supabase error:", error);

      return res.status(500).send("Unable to generate sitemap");
    }

    const staticPages = [
      {
        url: `${BASE_URL}/`,
      },
      {
        url: `${BASE_URL}/reviews`,
      },
      {
        url: `${BASE_URL}/about`,
      },
      {
        url: `${BASE_URL}/review-policy`,
      },
    ];

    const reviewPages = (reviews || []).map((review) => ({
      url: `${BASE_URL}/reviews/${review.slug}`,
      lastmod: review.updated_at || review.published_at,
    }));

    const pages = [...staticPages, ...reviewPages];

    const urls = pages
      .map((page) => {
        return `
  <url>
    <loc>${escapeXml(page.url)}</loc>${
      page.lastmod
        ? `
    <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>`
        : ""
    }
  </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);

    return res.status(500).send("Unable to generate sitemap");
  }
}
