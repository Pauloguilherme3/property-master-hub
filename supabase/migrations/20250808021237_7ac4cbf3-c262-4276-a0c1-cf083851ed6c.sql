-- Create reservations table to store visit requests with admin-managed status
create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  empreendimento_id uuid not null references public.empreendimentos(id) on delete cascade,
  unidade_id uuid not null references public.unidades(id) on delete cascade,
  nome_cliente text not null,
  telefone_cliente text not null,
  cpf_cliente text not null,
  data_visita date not null,
  horario text not null,
  tipo_visita text,
  observacoes text,
  status text not null default 'pendente',
  criado_por_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.reservas enable row level security;

-- Helper function to check admin/collaborator roles without RLS recursion
create or replace function public.is_admin_or_colab(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = _user_id
      and p.role = any (array['administrador'::public.user_role,'colaborador'::public.user_role])
  );
$$;

-- Policies
create policy if not exists "Anyone can create reservation" 
  on public.reservas
  for insert
  to public
  with check (true);

create policy if not exists "Admins or collaborators can read reservations"
  on public.reservas
  for select
  to authenticated
  using (public.is_admin_or_colab(auth.uid()));

create policy if not exists "Users can read their own reservations"
  on public.reservas
  for select
  to authenticated
  using (criado_por_id = auth.uid());

create policy if not exists "Admins or collaborators can update reservations"
  on public.reservas
  for update
  to authenticated
  using (public.is_admin_or_colab(auth.uid()));

-- Trigger to auto-update updated_at
create or replace trigger reservas_set_updated_at
before update on public.reservas
for each row
execute function public.update_updated_at_column();

-- Helpful indexes
create index if not exists idx_reservas_unidade on public.reservas(unidade_id);
create index if not exists idx_reservas_empreendimento on public.reservas(empreendimento_id);
