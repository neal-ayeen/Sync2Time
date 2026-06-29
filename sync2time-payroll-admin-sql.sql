-- Run once in Supabase > SQL Editor.
-- Adds synchronized payroll adjustments and admin clock-out permissions.

create table if not exists public.payroll_adjustments (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  deducted_hours numeric(10,2) not null default 0 check (deducted_hours >= 0),
  deducted_amount numeric(12,2) not null default 0 check (deducted_amount >= 0),
  commission numeric(12,2) not null default 0 check (commission >= 0),
  note text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, period_start, period_end)
);

alter table public.payroll_adjustments add column if not exists adjustment_php numeric(12,2) not null default 0;
alter table public.payroll_adjustments add column if not exists deductions_php numeric(12,2) not null default 0;
alter table public.payroll_adjustments add column if not exists commission_php numeric(12,2) not null default 0;
alter table public.payroll_adjustments add column if not exists cutoff_pay_override numeric(12,2);
alter table public.payroll_adjustments add column if not exists gross_pay_override numeric(12,2);
alter table public.payroll_adjustments add column if not exists paystub_approved boolean not null default false;
alter table public.payroll_adjustments add column if not exists approved_at timestamptz;
alter table public.payroll_adjustments add column if not exists approved_by uuid references auth.users(id);
alter table public.payroll_adjustments add column if not exists paystub_emailed_at timestamptz;

alter table public.payroll_adjustments enable row level security;

create table if not exists public.paystub_recipients (
  employee_id uuid primary key references public.profiles(id) on delete cascade,
  recipient_email text not null,
  source_note text not null default 'Employee paystud email.xlsx',
  updated_at timestamptz not null default now()
);

alter table public.paystub_recipients enable row level security;

drop policy if exists "Admins can read paystub recipients" on public.paystub_recipients;
create policy "Admins can read paystub recipients"
on public.paystub_recipients for select to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can insert paystub recipients" on public.paystub_recipients;
create policy "Admins can insert paystub recipients"
on public.paystub_recipients for insert to authenticated
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can update paystub recipients" on public.paystub_recipients;
create policy "Admins can update paystub recipients"
on public.paystub_recipients for update to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
))
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can delete paystub recipients" on public.paystub_recipients;
create policy "Admins can delete paystub recipients"
on public.paystub_recipients for delete to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

insert into public.paystub_recipients (employee_id, recipient_email)
select p.id, source.recipient_email
from public.profiles p
join (values
  ('Angie General', 'angiegeneral12@gmail.com'),
  ('Charles Kith Cañete', 'charles.kith.p.canete@gmail.com'),
  ('Clarissa Mae Concon', 'clarissamaeconcon29@gmail.com'),
  ('Claudine Angelica Pia D. San Juan', 'angelsanjuan.va@gmail.com'),
  ('Emily A. Lima', 'Emilycastillo0242@gmail.com'),
  ('Joana Faye Carlos', 'joan.faye.21@gmail.com'),
  ('Honey Mae Casas', 'honeycasas16@gmail.com'),
  ('Janseen Jorolan', 'jjcredendovides@gmail.com'),
  ('Jody Macuto', 'jlmacuto@gmail.com'),
  ('Justin Guda', 'guda.justin.28@gmail.com'),
  ('Karina A. Ang', 'karina.ang2025@gmail.com'),
  ('Kenizzite R. Novicio', 'kenizziten@gmail.com'),
  ('Krista Angela Ralloma', 'kacralloma@gmail.com'),
  ('Kristine Joy G. Patalita', 'kjgo1994@gmail.com'),
  ('Ma. Jesusa Resureccion C. Alicante', 'mjrcmags@gmail.com'),
  ('Maria Angelica Mendiola', 'riveramaica2@gmail.com'),
  ('Meabel Borreta', 'meabelborreta@gmail.com'),
  ('Michael John Gil Matutina', 'mikematutina@gmail.com'),
  ('Minorka Samarista', 'samaristaminorka22@yahoo.com'),
  ('Nate Sumalde', 'nate.sumaldeva@gmail.com'),
  ('Noor Ainne Garcia', 'itseyngarcia@gmail.com'),
  ('Therese Dawn Bangayan', 'digitallyreese@gmail.com')
) as source(full_name, recipient_email)
  on translate(lower(trim(p.full_name)), 'ñ', 'n') = translate(lower(trim(source.full_name)), 'ñ', 'n')
on conflict (employee_id) do update
set recipient_email = excluded.recipient_email,
    source_note = 'Employee paystud email.xlsx',
    updated_at = now();

drop policy if exists "Employees can read their payroll adjustments" on public.payroll_adjustments;
create policy "Employees can read their payroll adjustments"
on public.payroll_adjustments for select to authenticated
using (
  employee_id = auth.uid()
  or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can read payroll adjustments" on public.payroll_adjustments;
create policy "Admins can read payroll adjustments"
on public.payroll_adjustments for select to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can insert payroll adjustments" on public.payroll_adjustments;
create policy "Admins can insert payroll adjustments"
on public.payroll_adjustments for insert to authenticated
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can update payroll adjustments" on public.payroll_adjustments;
create policy "Admins can update payroll adjustments"
on public.payroll_adjustments for update to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
))
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can delete payroll adjustments" on public.payroll_adjustments;
create policy "Admins can delete payroll adjustments"
on public.payroll_adjustments for delete to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can clock out time entries" on public.time_entries;
create policy "Admins can clock out time entries"
on public.time_entries for update to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
))
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can clear dry run time" on public.time_entries;
create policy "Admins can clear dry run time"
on public.time_entries for delete to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

drop policy if exists "Admins can remove live presence" on public.live_presence;
create policy "Admins can remove live presence"
on public.live_presence for delete to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'admin'
));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'payroll_adjustments'
  ) then
    alter publication supabase_realtime add table public.payroll_adjustments;
  end if;
end
$$;

create table if not exists public.overtime_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  overtime_date date not null,
  hours numeric(6,2) not null check (hours > 0 and hours <= 24),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.overtime_requests enable row level security;

drop policy if exists "Employees can read own overtime requests" on public.overtime_requests;
create policy "Employees can read own overtime requests"
on public.overtime_requests for select to authenticated
using (
  employee_id = auth.uid()
  or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

drop policy if exists "Employees can create own overtime requests" on public.overtime_requests;
create policy "Employees can create own overtime requests"
on public.overtime_requests for insert to authenticated
with check (employee_id = auth.uid() and status = 'pending');

drop policy if exists "Admins can update overtime requests" on public.overtime_requests;
create policy "Admins can update overtime requests"
on public.overtime_requests for update to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'overtime_requests'
  ) then
    alter publication supabase_realtime add table public.overtime_requests;
  end if;
end
$$;
