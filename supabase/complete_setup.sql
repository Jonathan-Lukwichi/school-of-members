-- =============================================
-- SCHOOL OF MEMBERS - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- ============== 1. CREATE ENUMS ==============

CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- ============== 2. CREATE PROFILES TABLE ==============

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
    ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authentication"
    ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 3. CREATE COURSES TABLE ==============

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_courses_created_by ON courses(created_by);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active courses are viewable by everyone"
    ON courses FOR SELECT TO authenticated
    USING (is_active = true OR created_by = auth.uid());

CREATE POLICY "Admins can create courses"
    ON courses FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update courses"
    ON courses FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete courses"
    ON courses FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 4. CREATE MODULES TABLE ==============

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- ============== 5. CREATE ENROLLMENTS TABLE ==============

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status enrollment_status DEFAULT 'active',
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own enrollments"
    ON enrollments FOR SELECT TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create enrollments"
    ON enrollments FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update enrollments"
    ON enrollments FOR UPDATE TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete enrollments"
    ON enrollments FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Now add modules policies (after enrollments exists)
CREATE POLICY "Modules viewable by enrolled students and admins"
    ON modules FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        OR EXISTS (SELECT 1 FROM enrollments WHERE student_id = auth.uid() AND course_id = modules.course_id AND status = 'active')
    );

CREATE POLICY "Admins can create modules"
    ON modules FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update modules"
    ON modules FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete modules"
    ON modules FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============== 6. CREATE MODULE_PROGRESS TABLE ==============

CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    UNIQUE(student_id, module_id)
);

CREATE INDEX idx_progress_student ON module_progress(student_id);
CREATE INDEX idx_progress_module ON module_progress(module_id);

ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
    ON module_progress FOR SELECT TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students can create own progress"
    ON module_progress FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
    ON module_progress FOR UPDATE TO authenticated
    USING (student_id = auth.uid());

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_modules INTEGER;
    completed_modules INTEGER;
    course UUID;
BEGIN
    SELECT course_id INTO course FROM modules WHERE id = NEW.module_id;
    SELECT COUNT(*) INTO total_modules FROM modules WHERE course_id = course;
    SELECT COUNT(*) INTO completed_modules
    FROM module_progress mp JOIN modules m ON mp.module_id = m.id
    WHERE mp.student_id = NEW.student_id AND m.course_id = course AND mp.is_completed = true;

    UPDATE enrollments
    SET progress_percent = CASE WHEN total_modules > 0 THEN (completed_modules * 100 / total_modules) ELSE 0 END
    WHERE student_id = NEW.student_id AND course_id = course;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_module_progress_change
    AFTER INSERT OR UPDATE ON module_progress
    FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- ============== 7. CREATE ATTENDANCE TABLE ==============

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    status attendance_status NOT NULL,
    notes TEXT,
    recorded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id, session_date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course ON attendance(course_id);
CREATE INDEX idx_attendance_date ON attendance(session_date);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own attendance"
    ON attendance FOR SELECT TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can create attendance"
    ON attendance FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update attendance"
    ON attendance FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete attendance"
    ON attendance FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============== 8. CREATE STORAGE BUCKETS ==============

INSERT INTO storage.buckets (id, name, public) VALUES ('modules', 'modules', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true) ON CONFLICT (id) DO NOTHING;

-- Avatars policies
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Thumbnails policies
CREATE POLICY "Anyone can view thumbnails" ON storage.objects FOR SELECT TO public USING (bucket_id = 'thumbnails');
CREATE POLICY "Admins can upload thumbnails" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update thumbnails" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete thumbnails" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Modules bucket policies
CREATE POLICY "Admins can upload module files" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update module files" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete module files" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Authenticated users can download modules" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'modules');

-- ============== SETUP COMPLETE ==============
-- Your database is now ready!
