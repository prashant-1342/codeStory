import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("summaries")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    const totalCommits = (count || 0) * 30 + 30;

    return Response.json({ count: totalCommits });
  } catch (err) {
    console.error(err);
    return Response.json({ count: 150 });
  }
}
