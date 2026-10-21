-- Esquema del Challenge 08. Se puede ejecutar más de una vez en Supabase SQL Editor.
create table if not exists public.tareas (
  id bigint generated always as identity primary key,
  titulo text not null check (char_length(trim(titulo)) between 1 and 120),
  completada boolean not null default false,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.tareas enable row level security;

drop policy if exists "Cada usuario ve sus tareas" on public.tareas;
create policy "Cada usuario ve sus tareas" on public.tareas
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario crea sus tareas" on public.tareas;
create policy "Cada usuario crea sus tareas" on public.tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario actualiza sus tareas" on public.tareas;
create policy "Cada usuario actualiza sus tareas" on public.tareas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario elimina sus tareas" on public.tareas;
create policy "Cada usuario elimina sus tareas" on public.tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Permite recibir cambios en tiempo real sin afectar la RLS de cada usuario.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tareas'
  ) then
    alter publication supabase_realtime add table public.tareas;
  end if;
end $$;

-- Bucket privado: cada persona puede gestionar solamente su propia carpeta.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do update set public = false;

drop policy if exists "Cada usuario lee su avatar" on storage.objects;
create policy "Cada usuario lee su avatar" on storage.objects
  for select to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Cada usuario sube su avatar" on storage.objects;
create policy "Cada usuario sube su avatar" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Cada usuario reemplaza su avatar" on storage.objects;
create policy "Cada usuario reemplaza su avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Cada usuario elimina su avatar" on storage.objects;
create policy "Cada usuario elimina su avatar" on storage.objects
  for delete to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
