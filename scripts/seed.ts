import { createClient } from "@supabase/supabase-js";
import { Database } from "../lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(url, key);

async function main() {
  const { data: org } = await supabase
    .from("organizations")
    .upsert({ name: "Demo Org" })
    .select()
    .single();

  if (!org) throw new Error("Org not created");

  const { data: stages } = await supabase
    .from("pipeline_stages")
    .upsert([
      { org_id: org.id, name: "New", order_index: 1 },
      { org_id: org.id, name: "Qualified", order_index: 2 },
      { org_id: org.id, name: "Proposal", order_index: 3 },
      { org_id: org.id, name: "Won", order_index: 4 },
    ])
    .select();

  const stageId = stages?.[0]?.id;

  const { data: contacts } = await supabase
    .from("contacts")
    .insert([
      { org_id: org.id, name: "Juan Pérez", email: "juan@example.com", phone: "+569111" },
      { org_id: org.id, name: "Ana Torres", email: "ana@example.com", phone: "+569222" },
      { org_id: org.id, name: "Luis Vega", email: "luis@example.com", phone: "+569333" },
    ])
    .select();

  const { data: deals } = await supabase
    .from("deals")
    .insert([
      {
        org_id: org.id,
        contact_id: contacts?.[0]?.id!,
        title: "Website redesign",
        stage_id: stageId!,
        status: "open",
        last_activity_at: new Date().toISOString(),
      },
      {
        org_id: org.id,
        contact_id: contacts?.[1]?.id!,
        title: "Ads retainer",
        stage_id: stageId!,
        status: "open",
        last_activity_at: new Date().toISOString(),
      },
      {
        org_id: org.id,
        contact_id: contacts?.[2]?.id!,
        title: "Consulting",
        stage_id: stageId!,
        status: "open",
        last_activity_at: new Date().toISOString(),
      },
    ])
    .select();

  await supabase.from("automations").insert({
    org_id: org.id,
    name: "Follow-up 48h",
    trigger_stage_id: stageId!,
    inactivity_hours: 48,
    create_task_title_template: "Follow-up a {{deal_title}}",
    draft_template: "Hola {{contact_id}}, ¿seguimos adelante?",
  });

  const thread = await supabase
    .from("conversation_threads")
    .insert({
      org_id: org.id,
      contact_id: contacts?.[0]?.id!,
      deal_id: deals?.[0]?.id!,
      channel: "whatsapp",
    })
    .select()
    .single();

  if (thread.data) {
    await supabase.from("conversation_messages").insert([
      {
        org_id: org.id,
        thread_id: thread.data.id,
        direction: "inbound",
        content: "Hola, quiero cotizar un sitio de ecommerce",
      },
      {
        org_id: org.id,
        thread_id: thread.data.id,
        direction: "outbound",
        content: "Claro, cuéntame tu presupuesto aproximado",
      },
    ]);
  }

  console.log("Seed completed", { org: org.id });
}

main();
