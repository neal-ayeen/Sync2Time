-- Sync2Time admin deletion alerts
-- Run this once in Supabase SQL Editor.

create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.app_notifications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Employees can read their own notifications" on public.app_notifications;
create policy "Employees can read their own notifications"
on public.app_notifications
for select
to authenticated
using (employee_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can create notifications" on public.app_notifications;
create policy "Admins can create notifications"
on public.app_notifications
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update notifications" on public.app_notifications;
create policy "Admins can update notifications"
on public.app_notifications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Needed so admin can soft-delete incorrect time entries from Attendance.
drop policy if exists "Admins can update time entries" on public.time_entries;
create policy "Admins can update time entries"
on public.time_entries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete time entries" on public.time_entries;
create policy "Admins can delete time entries"
on public.time_entries
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert corrected time entries" on public.time_entries;
create policy "Admins can insert corrected time entries"
on public.time_entries
for insert
to authenticated
with check (public.is_admin());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_notifications'
  ) then
    alter publication supabase_realtime add table public.app_notifications;
  end if;
end
$$;
