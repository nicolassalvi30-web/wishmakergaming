import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(500).json({
      error: "Supabase environment variables are missing",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { slug } = request.query;

    let query = supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        score,
        category,
        seo_description,
        cover_image_url,
        status,
        published_at,
        gameplay_score,
        replayability_score,
        presentation_score,
        value_score,
        developer,
        publisher,
        release_date,
        platforms,
        hours_played,
        completion_status,
        multiplayer,
        steam_deck,
        trailer,
        screenshots
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (slug) {
      query = query.eq("slug", slug).single();
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);

      return response.status(500).json({
        error: error.message,
      });
    }

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response.status(200).json(data);
  } catch (error) {
    console.error("API error:", error);

    return response.status(500).json({
      error: "Internal server error",
    });
  }
}
