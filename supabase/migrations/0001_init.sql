-- Extension
create extension if not exists "uuid-ossp";

-- Organizations
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists org_members (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamp with time zone default now()
);

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  tags jsonb,
  notes text,
  status text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists pipeline_stages (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  order_index int not null default 0
);

create table if not exists deals (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  title text not null,
  stage_id uuid not null references pipeline_stages(id) on delete restrict,
  value_numeric numeric,
  currency text,
  status text default 'open',
  last_inbound_at timestamp with time zone,
  last_activity_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists conversation_threads (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  deal_id uuid references deals(id) on delete set null,
  channel text not null,
  external_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists conversation_messages (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  thread_id uuid not null references conversation_threads(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound','note')),
  content text not null,
  raw jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists deal_insights (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  deal_id uuid not null references deals(id) on delete cascade,
  intent text,
  budget_estimate text,
  urgency text,
  objections jsonb,
  next_steps jsonb,
  summary text,
  updated_at timestamp with time zone default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  deal_id uuid references deals(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  title text not null,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  due_at timestamp with time zone,
  source text not null default 'manual' check (source in ('manual','automation')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists message_drafts (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  deal_id uuid references deals(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  task_id uuid references tasks(id) on delete set null,
  channel text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create table if not exists automations (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  is_enabled boolean not null default true,
  trigger_stage_id uuid not null references pipeline_stages(id) on delete cascade,
  inactivity_hours int not null,
  create_task_title_template text not null,
  draft_template text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists event_log (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid,
  type text not null,
  payload jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_contacts_org on contacts(org_id);
create index if not exists idx_deals_org_stage on deals(stage_id, org_id);
create index if not exists idx_tasks_status_org on tasks(status, org_id);
create index if not exists idx_messages_thread_org on conversation_messages(thread_id, org_id);
create unique index if not exists contacts_org_email_unique on contacts(org_id, email) where email is not null;
create unique index if not exists contacts_org_phone_unique on contacts(org_id, phone) where phone is not null;

-- Enable RLS
alter table organizations enable row level security;
alter table org_members enable row level security;
alter table contacts enable row level security;
alter table pipeline_stages enable row level security;
alter table deals enable row level security;
alter table conversation_threads enable row level security;
alter table conversation_messages enable row level security;
alter table deal_insights enable row level security;
alter table tasks enable row level security;
alter table message_drafts enable row level security;
alter table automations enable row level security;
alter table event_log enable row level security;

-- Base policy: user must belong to org
create policy org_member_access on organizations
  using (exists (select 1 from org_members m where m.org_id = id and m.user_id = auth.uid()));

create policy org_member_access_members on org_members
  using (exists (select 1 from org_members m where m.org_id = org_members.org_id and m.user_id = auth.uid()));

create policy org_member_access_contacts on contacts
  using (exists (select 1 from org_members m where m.org_id = contacts.org_id and m.user_id = auth.uid()));

create policy org_member_access_stages on pipeline_stages
  using (exists (select 1 from org_members m where m.org_id = pipeline_stages.org_id and m.user_id = auth.uid()));

create policy org_member_access_deals on deals
  using (exists (select 1 from org_members m where m.org_id = deals.org_id and m.user_id = auth.uid()));

create policy org_member_access_threads on conversation_threads
  using (exists (select 1 from org_members m where m.org_id = conversation_threads.org_id and m.user_id = auth.uid()));

create policy org_member_access_messages on conversation_messages
  using (exists (select 1 from org_members m where m.org_id = conversation_messages.org_id and m.user_id = auth.uid()));

create policy org_member_access_insights on deal_insights
  using (exists (select 1 from org_members m where m.org_id = deal_insights.org_id and m.user_id = auth.uid()));

create policy org_member_access_tasks on tasks
  using (exists (select 1 from org_members m where m.org_id = tasks.org_id and m.user_id = auth.uid()));

create policy org_member_access_drafts on message_drafts
  using (exists (select 1 from org_members m where m.org_id = message_drafts.org_id and m.user_id = auth.uid()));

create policy org_member_access_automations on automations
  using (exists (select 1 from org_members m where m.org_id = automations.org_id and m.user_id = auth.uid()));

create policy org_member_access_events on event_log
  using (exists (select 1 from org_members m where m.org_id = event_log.org_id and m.user_id = auth.uid()));

-- Owners/admins can manage members
create policy manage_memberships on org_members for insert with check (
  exists (select 1 from org_members m where m.org_id = org_members.org_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
create policy manage_memberships_update on org_members for update using (
  exists (select 1 from org_members m where m.org_id = org_members.org_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
