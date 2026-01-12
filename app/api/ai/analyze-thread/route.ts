import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai/provider";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { thread_id } = await request.json();
  if (!thread_id) return NextResponse.json({ error: "thread_id required" }, { status: 400 });

  const { data: messages } = await supabase
    .from("conversation_messages")
    .select("direction, content")
    .eq("thread_id", thread_id)
    .order("created_at", { ascending: true })
    .limit(20);

  const ai = getAIProvider();
  const analysis = await ai.analyzeConversation(
    (messages || []).map((m) => ({ direction: m.direction as "inbound" | "outbound", content: m.content })),
  );

  const thread = await supabase.from("conversation_threads").select("deal_id, org_id").eq("id", thread_id).single();
  if (!thread.data?.deal_id) return NextResponse.json({ error: "thread without deal" }, { status: 400 });

  await supabase
    .from("deal_insights")
    .upsert({
      org_id: thread.data.org_id,
      deal_id: thread.data.deal_id,
      intent: analysis.intent,
      budget_estimate: analysis.budget_estimate,
      urgency: analysis.urgency,
      objections: analysis.objections,
      next_steps: analysis.next_steps,
      summary: analysis.summary,
    });

  return NextResponse.json({ status: "ok", analysis });
}
