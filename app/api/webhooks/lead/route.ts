import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai/provider";
import type { Database } from "@/lib/types";

const requiredFields = ["org_id", "channel", "from", "message"];

type LeadPayload = {
  org_id: string;
  channel: string;
  from: { name?: string; phone?: string; email?: string };
  message: { text: string; timestamp?: string };
  meta?: { external_thread_id?: string };
};

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = (await request.json()) as LeadPayload;
  for (const field of requiredFields) {
    if (!(field in body)) {
      return NextResponse.json({ error: `Missing ${field}` }, { status: 400 });
    }
  }
  const token = request.headers.get("x-webhook-token");
  if (!token || token !== process.env.WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { org_id, channel, from, message, meta } = body;
  const contactPayload = {
    org_id,
    name: from.name || from.phone || from.email || "Lead",
    email: from.email || null,
    phone: from.phone || null,
    status: "New",
  };

  let contact =
    from.phone
      ? (
          await supabase
            .from("contacts")
            .select("*")
            .eq("org_id", org_id)
            .eq("phone", from.phone)
            .maybeSingle()
        ).data
      : null;

  if (!contact && from.email) {
    contact =
      (
        await supabase
          .from("contacts")
          .select("*")
          .eq("org_id", org_id)
          .eq("email", from.email)
          .maybeSingle()
      ).data || null;
  }

  const contactResponse = contact
    ? await supabase
        .from("contacts")
        .update({ ...contactPayload })
        .eq("id", contact.id)
        .select()
        .single()
    : await supabase.from("contacts").insert(contactPayload).select().single();

  if (contactResponse.error || !contactResponse.data) {
    return NextResponse.json({ error: contactResponse.error?.message }, { status: 500 });
  }

  contact = contactResponse.data;

  let threadQuery = supabase
    .from("conversation_threads")
    .select("*")
    .eq("org_id", org_id);

  if (meta?.external_thread_id) {
    threadQuery = threadQuery.eq("external_id", meta.external_thread_id);
  } else {
    threadQuery = threadQuery.eq("contact_id", contact.id);
  }

  const existingThread = await threadQuery.maybeSingle();

  const thread =
    existingThread.data ||
    (await supabase
      .from("conversation_threads")
      .insert({
        org_id,
        contact_id: contact.id,
        deal_id: null,
        channel,
        external_id: meta?.external_thread_id ?? null,
      })
      .select()
      .single()).data;

  if (!thread) {
    return NextResponse.json({ error: "Cannot create thread" }, { status: 500 });
  }

  await supabase.from("conversation_messages").insert({
    org_id,
    thread_id: thread.id,
    direction: "inbound",
    content: message.text,
    raw: { meta },
  });

  const openDeal = await supabase
    .from("deals")
    .select("*")
    .eq("org_id", org_id)
    .eq("contact_id", contact.id)
    .eq("status", "open")
    .maybeSingle();

  const stageResp = await supabase
    .from("pipeline_stages")
    .select("id")
    .eq("org_id", org_id)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  const stage_id = stageResp.data?.id;

  const deal =
    openDeal.data ||
    (await supabase
      .from("deals")
      .insert({
        org_id,
        contact_id: contact.id,
        title: `Lead ${contact.name}`,
        stage_id: stage_id!,
        status: "open",
        last_inbound_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      })
      .select()
      .single()).data;

  if (deal) {
    await supabase
      .from("deals")
      .update({ last_inbound_at: new Date().toISOString(), last_activity_at: new Date().toISOString() })
      .eq("id", deal.id);
  }

  const ai = getAIProvider();
  const analysis = await ai.analyzeConversation([{ direction: "inbound", content: message.text }]);

  await supabase
    .from("deal_insights")
    .upsert({
      org_id,
      deal_id: deal?.id ?? openDeal.data?.id!,
      intent: analysis.intent,
      budget_estimate: analysis.budget_estimate,
      urgency: analysis.urgency,
      objections: analysis.objections,
      next_steps: analysis.next_steps,
      summary: analysis.summary,
    });

  await supabase.from("event_log").insert({
    org_id,
    type: "lead_captured",
    payload: { contact_id: contact.id, deal_id: deal?.id },
  });

  return NextResponse.json({ status: "ok", contact_id: contact.id, deal_id: deal?.id, thread_id: thread.id });
}
