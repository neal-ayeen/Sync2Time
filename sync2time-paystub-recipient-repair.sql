-- Audit any employees who exist in public.profiles but still do not have
-- a paystub recipient row yet.

select
  p.full_name,
  p.email as login_email
from public.profiles p
left join public.paystub_recipients r on r.employee_id = p.id
where r.employee_id is null
order by p.full_name;

-- Claudine repair
-- Run this after Claudine's public.profiles row exists.

insert into public.paystub_recipients (
  employee_id,
  recipient_email,
  source_note,
  updated_at
)
select
  p.id,
  'angelsanjuan.va@gmail.com',
  'Claudine paystub recipient repair',
  now()
from public.profiles p
where lower(trim(p.full_name)) = lower(trim('Claudine Angelica Pia D. San Juan'))
   or lower(trim(p.email)) = lower(trim('claudine.sanjuan@sync2va.com'))
on conflict (employee_id) do update
set recipient_email = excluded.recipient_email,
    source_note = excluded.source_note,
    updated_at = now();
