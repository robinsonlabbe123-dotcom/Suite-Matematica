import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServerSupabaseClient();

  const automations = await supabase
    .from("automations")
    .select("*, pipeline_stages(name)")
    .eq("is_enabled", true);

  if (automations.error) {
    return NextResponse.json({ error: automations.error.message }, { status: 500 });
  }

  const now = new Date();
  const results: string[] = [];

  for (const automation of automations.data || []) {
    const threshold = new Date(now.getTime() - automation.inactivity_hours * 60 * 60 * 1000).toISOString();
    const { data: deals, error } = await supabase
      .from("deals")
      .select("*")
      .eq("stage_id", automation.trigger_stage_id)
      .lte("last_activity_at", threshold);

    if (error || !deals) continue;

    for (const deal of deals) {
      const existingTask = await supabase
        .from("tasks")
        .select("id")
        .eq("deal_id", deal.id)
        .eq("org_id", deal.org_id)
        .eq("source", "automation")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingTask.data) continue;

      const taskTitle = automation.create_task_title_template.replace("{{deal_title}}", deal.title);
      const insertedTask = await supabase
        .from("tasks")
        .insert({
          org_id: deal.org_id,
          deal_id: deal.id,
          contact_id: deal.contact_id,
          title: taskTitle,
          status: "todo",
          source: "automation",
        })
        .select()
        .single();

      if (insertedTask.data) {
        if (automation.draft_template) {
          await supabase.from("message_drafts").insert({
            org_id: deal.org_id,
            deal_id: deal.id,
            contact_id: deal.contact_id,
            task_id: insertedTask.data.id,
            channel: "whatsapp",
            content: automation.draft_template.replace("{{contact_id}}", deal.contact_id),
          });
        }

        await supabase.from("event_log").insert({
          org_id: deal.org_id,
          type: "automation_task_created",
          payload: { automation_id: automation.id, deal_id: deal.id },
        });

        results.push(`Task creada para deal ${deal.id}`);
      }
    }
  }

  return NextResponse.json({ status: "ok", results });
}
