insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'bukti-transfer',
  'bukti-transfer',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Private bucket: bukti transfer adalah dokumen sensitif (nomor rekening,
-- nominal). Hanya pemilik file yang bisa lihat/upload lewat RLS di sini;
-- admin melihatnya lewat signed URL dari service-role client (bypass RLS,
-- lihat lib/storage/bukti.ts), bukan lewat policy tambahan.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can view their own bukti transfer'
  ) then
    create policy "Users can view their own bukti transfer"
      on storage.objects for select to authenticated
      using (
        bucket_id = 'bukti-transfer'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload their own bukti transfer'
  ) then
    create policy "Users can upload their own bukti transfer"
      on storage.objects for insert to authenticated
      with check (
        bucket_id = 'bukti-transfer'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
  end if;
end $$;
