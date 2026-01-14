import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Server-side Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 });
  }

  try {
    // Check existing assignment
    const { data: assignment } = await supabaseAdmin
      .from("daily_question_assignments")
      .select(`*, question:daily_questions(*)`)
      .eq("date", date)
      .single();

    if (assignment?.question) {
      return NextResponse.json(assignment.question);
    }

    // No assignment - create one
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentAssignments } = await supabaseAdmin
      .from("daily_question_assignments")
      .select("question_id")
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

    const recentIds = recentAssignments?.map((a) => a.question_id) || [];

    let query = supabaseAdmin
      .from("daily_questions")
      .select("*")
      .eq("is_active", true);

    if (recentIds.length > 0) {
      query = query.not("id", "in", `(${recentIds.join(",")})`);
    }

    const { data: questions } = await query;

    if (!questions || questions.length === 0) {
      const { data: anyQ } = await supabaseAdmin
        .from("daily_questions")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (!anyQ) {
        return NextResponse.json({ error: "No questions" }, { status: 404 });
      }

      await supabaseAdmin
        .from("daily_question_assignments")
        .upsert({ question_id: anyQ.id, date }, { onConflict: "date" });

      return NextResponse.json(anyQ);
    }

    const selected = questions[Math.floor(Math.random() * questions.length)];

    const { data: newAssignment } = await supabaseAdmin
      .from("daily_question_assignments")
      .upsert({ question_id: selected.id, date }, { onConflict: "date" })
      .select(`*, question:daily_questions(*)`)
      .single();

    return NextResponse.json(newAssignment?.question || selected);
  } catch (error) {
    console.error("Error getting question:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
