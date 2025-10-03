-- Storage RLS Policy for Images bucket
-- Only allows admin and super_admin users to upload/update/delete files

-- Enable RLS on the storage.objects table for the Images bucket
-- Note: This assumes you already have the Images bucket created

-- Policy for SELECT (viewing/downloading files) - allow everyone
CREATE POLICY "Public can view game and org logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'Images');

-- Policy for INSERT (uploading files) - only admin and super_admin
CREATE POLICY "Only admins can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'Images' 
  AND auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role IN ('admin', 'super_admin')
  )
);

-- Policy for UPDATE (updating files) - only admin and super_admin
CREATE POLICY "Only admins can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'Images' 
  AND auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role IN ('admin', 'super_admin')
  )
);

-- Policy for DELETE (deleting files) - only admin and super_admin
CREATE POLICY "Only admins can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'Images' 
  AND auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role IN ('admin', 'super_admin')
  )
);
