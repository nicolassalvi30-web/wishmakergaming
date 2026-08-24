import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const BASE_URL = "https://www.wishmakergaming.com";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(500).send("Supabase environment variables are missing");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: reviews, error } = await supabase
      .from("posts")
      .select("slug, published_at")
      .eq("status", "published")
      .not("slug", "is", null)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Sitemap Supabase error:", error);
      return response.status(500).send("Unable to generate sitemap");
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
      lastmod: review.published_at,
    }));

    const pages = [...staticPages, ...reviewPages];

    const urls = pages
      .map((page) => {
        const lastmod = page.lastmod
          ? `
    <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>`
          : "";

        return `
  <url>
    <loc>${escapeXml(page.url)}</loc>${lastmod}
  </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    response.setHeader("Content-Type", "application/xml; charset=utf-8");

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return response.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return response.status(500).send("Unable to generate sitemap");
  }
}
