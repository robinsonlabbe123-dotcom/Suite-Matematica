export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
      };
      org_members: {
        Row: { id: string; org_id: string; user_id: string; role: string; created_at: string };
        Insert: { id?: string; org_id: string; user_id: string; role?: string; created_at?: string };
        Update: { id?: string; org_id?: string; user_id?: string; role?: string; created_at?: string };
      };
      contacts: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          tags: Json | null;
          notes: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          tags?: Json | null;
          notes?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      pipeline_stages: {
        Row: { id: string; org_id: string; name: string; order_index: number };
        Insert: { id?: string; org_id: string; name: string; order_index: number };
        Update: Partial<Insert>;
      };
      deals: {
        Row: {
          id: string;
          org_id: string;
          contact_id: string;
          title: string;
          stage_id: string;
          value_numeric: number | null;
          currency: string | null;
          status: string | null;
          last_inbound_at: string | null;
          last_activity_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deals"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      conversation_threads: {
        Row: {
          id: string;
          org_id: string;
          contact_id: string;
          deal_id: string | null;
          channel: string;
          external_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          contact_id: string;
          deal_id?: string | null;
          channel: string;
          external_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      conversation_messages: {
        Row: {
          id: string;
          org_id: string;
          thread_id: string;
          direction: "inbound" | "outbound" | "note";
          content: string;
          raw: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          thread_id: string;
          direction: "inbound" | "outbound" | "note";
          content: string;
          raw?: Json | null;
          created_at?: string;
        };
        Update: Partial<Insert>;
      };
      deal_insights: {
        Row: {
          id: string;
          org_id: string;
          deal_id: string;
          intent: string | null;
          budget_estimate: string | null;
          urgency: string | null;
          objections: Json | null;
          next_steps: Json | null;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          deal_id: string;
          intent?: string | null;
          budget_estimate?: string | null;
          urgency?: string | null;
          objections?: Json | null;
          next_steps?: Json | null;
          summary?: string | null;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      tasks: {
        Row: {
          id: string;
          org_id: string;
          deal_id: string | null;
          contact_id: string | null;
          title: string;
          status: "todo" | "doing" | "done";
          due_at: string | null;
          source: "manual" | "automation";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          deal_id?: string | null;
          contact_id?: string | null;
          title: string;
          status?: "todo" | "doing" | "done";
          due_at?: string | null;
          source?: "manual" | "automation";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      message_drafts: {
        Row: {
          id: string;
          org_id: string;
          deal_id: string | null;
          contact_id: string | null;
          task_id: string | null;
          channel: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          deal_id?: string | null;
          contact_id?: string | null;
          task_id?: string | null;
          channel: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Insert>;
      };
      automations: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          is_enabled: boolean;
          trigger_stage_id: string;
          inactivity_hours: number;
          create_task_title_template: string;
          draft_template: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          is_enabled?: boolean;
          trigger_stage_id: string;
          inactivity_hours: number;
          create_task_title_template: string;
          draft_template?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Insert>;
      };
      event_log: {
        Row: {
          id: string;
          org_id: string;
          actor_user_id: string | null;
          type: string;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          actor_user_id?: string | null;
          type: string;
          payload?: Json | null;
          created_at?: string;
        };
        Update: Partial<Insert>;
      };
    };
  };
}
