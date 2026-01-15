-- Create storage buckets for file uploads

-- Module files bucket (PDFs, documents, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('modules', 'modules', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (profile pictures)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Thumbnails bucket (course thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for modules bucket
CREATE POLICY "Admins can upload module files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'modules'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update module files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'modules'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete module files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'modules'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Enrolled students can download module files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'modules'
    AND (
        -- Admins can access all
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR
        -- Students enrolled in courses with these modules
        EXISTS (
            SELECT 1 FROM enrollments e
            JOIN modules m ON m.course_id = e.course_id
            WHERE e.student_id = auth.uid()
            AND e.status = 'active'
            AND m.file_url LIKE '%' || storage.objects.name || '%'
        )
    )
);

-- Storage policies for avatars bucket (public read, owner write)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for thumbnails bucket (public read, admin write)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'thumbnails'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'thumbnails'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'thumbnails'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
