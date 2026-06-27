-- =====================================================================
-- SCHOOL OF MEMBERS — COMPLETE & IDEMPOTENT DATABASE SETUP
-- Run this ENTIRE file once in the Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- Builds the full correct schema (profiles, courses, modules, teachers,
-- students [phone+PIN], enrollments, progress, attendance, testimonials,
-- whatsapp log) + RLS + functions + storage buckets.
-- =====================================================================

-- ============== 0. ENUMS ==============
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'student', 'teacher');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
  END IF;
END $$;
-- Ensure 'teacher' exists even if user_role was created earlier without it
-- (e.g. by the partial complete_setup.sql). No-op when already present.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'teacher';

-- ============== shared updated_at helper ==============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============== 1. PROFILES (admins/teachers; mirrors auth.users) ==============
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
CREATE POLICY "Enable insert for authentication"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create a profile row whenever an auth user is created.
-- SET search_path = public so the SECURITY DEFINER body resolves the user_role
-- type and profiles table; EXCEPTION guard so a profile hiccup never blocks signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 2. COURSES ==============
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active courses are viewable by everyone" ON courses;
CREATE POLICY "Active courses are viewable by everyone"
  ON courses FOR SELECT TO authenticated
  USING (is_active = true OR created_by = auth.uid());
DROP POLICY IF EXISTS "Admins can create courses" ON courses;
CREATE POLICY "Admins can create courses"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
CREATE POLICY "Admins can update courses"
  ON courses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete courses" ON courses;
CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 3. MODULES (with language) ==============
CREATE TABLE IF NOT EXISTS modules (
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
ALTER TABLE modules ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en' CHECK (language IN ('en', 'fr'));
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_modules_language ON modules(language);
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- ============== 4. TEACHERS ==============
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp_number TEXT,
  is_active BOOLEAN DEFAULT true,
  max_students INTEGER DEFAULT 50,
  current_student_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_is_active ON teachers(is_active);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all teachers" ON teachers;
CREATE POLICY "Admins can view all teachers" ON teachers
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "Admins can manage teachers" ON teachers;
CREATE POLICY "Admins can manage teachers" ON teachers
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "Teachers can view themselves" ON teachers;
CREATE POLICY "Teachers can view themselves" ON teachers
  FOR SELECT USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 5. ENROLLMENTS ==============
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status enrollment_status DEFAULT 'active',
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  UNIQUE(student_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own enrollments" ON enrollments;
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Users can create enrollments" ON enrollments;
CREATE POLICY "Users can create enrollments"
  ON enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Users can update enrollments" ON enrollments;
CREATE POLICY "Users can update enrollments"
  ON enrollments FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete enrollments" ON enrollments;
CREATE POLICY "Admins can delete enrollments"
  ON enrollments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- modules policies (now that enrollments exists)
DROP POLICY IF EXISTS "Modules viewable by enrolled students and admins" ON modules;
CREATE POLICY "Modules viewable by enrolled students and admins"
  ON modules FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM enrollments WHERE student_id = auth.uid() AND course_id = modules.course_id AND status = 'active')
  );
DROP POLICY IF EXISTS "Admins can create modules" ON modules;
CREATE POLICY "Admins can create modules"
  ON modules FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update modules" ON modules;
CREATE POLICY "Admins can update modules"
  ON modules FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete modules" ON modules;
CREATE POLICY "Admins can delete modules"
  ON modules FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============== 6. MODULE PROGRESS ==============
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  UNIQUE(student_id, module_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_student ON module_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_module ON module_progress(module_id);
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own progress" ON module_progress;
CREATE POLICY "Students can view own progress"
  ON module_progress FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Students can create own progress" ON module_progress;
CREATE POLICY "Students can create own progress"
  ON module_progress FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "Students can update own progress" ON module_progress;
CREATE POLICY "Students can update own progress"
  ON module_progress FOR UPDATE TO authenticated USING (student_id = auth.uid());

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

DROP TRIGGER IF EXISTS on_module_progress_change ON module_progress;
CREATE TRIGGER on_module_progress_change
  AFTER INSERT OR UPDATE ON module_progress
  FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- ============== 7. ATTENDANCE ==============
CREATE TABLE IF NOT EXISTS attendance (
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
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(session_date);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own attendance" ON attendance;
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can create attendance" ON attendance;
CREATE POLICY "Admins can create attendance"
  ON attendance FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update attendance" ON attendance;
CREATE POLICY "Admins can update attendance"
  ON attendance FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete attendance" ON attendance;
CREATE POLICY "Admins can delete attendance"
  ON attendance FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============== 8. STUDENTS (phone + PIN auth) ==============
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  pin_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'active', 'completed', 'inactive')),
  address TEXT,
  church_of_provenance TEXT,
  baptized_by_immersion BOOLEAN DEFAULT NULL,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),
  assigned_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ensure all columns exist even if table pre-existed in a slimmer form
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS church_of_provenance TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS baptized_by_immersion BOOLEAN DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(assigned_teacher_id);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can view all students" ON students
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "Teachers can view assigned students" ON students;
CREATE POLICY "Teachers can view assigned students" ON students
  FOR SELECT USING (EXISTS (SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid() AND teachers.id = students.assigned_teacher_id));
DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============== 9. WHATSAPP MESSAGES (delivery log) ==============
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('welcome', 'pin', 'reminder', 'notification', 'custom')),
  template_name TEXT,
  message_content TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_student ON whatsapp_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_type ON whatsapp_messages(message_type);
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all messages" ON whatsapp_messages;
CREATE POLICY "Admins can view all messages" ON whatsapp_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "Teachers can view their messages" ON whatsapp_messages;
CREATE POLICY "Teachers can view their messages" ON whatsapp_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid() AND teachers.id = whatsapp_messages.teacher_id));

-- ============== 10. TESTIMONIALS (+ seed) ==============
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active testimonials" ON testimonials;
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- seed once (only if table is empty)
INSERT INTO testimonials (name, role, content, is_active, display_order)
SELECT * FROM (VALUES
  ('Grace M.', 'New Member', 'I gave my life to Christ recently, and the School of Members helped me understand what it truly means to be part of God''s family. I now feel confident in my faith journey.', true, 1),
  ('Emmanuel K.', 'Church Volunteer', 'I''ve been a Christian for over 15 years, but I never had a proper foundation in church membership. This program opened my eyes to things I''d missed!', true, 2),
  ('Thandi S.', 'Young Professional', 'As a busy professional, I appreciated completing this at my own pace. The teachings challenged me to prioritize my church attendance.', true, 3),
  ('David N.', 'Parent', 'This helped me understand my responsibilities not just as a church member, but how my faithfulness impacts my family.', true, 4),
  ('Patrick M.', 'Cell Group Leader', 'Before this course, I was serving without fully understanding the vision. Now I can confidently lead others with clarity.', true, 5),
  ('Blessing O.', 'Transferred Member', 'When I transferred to Ramah, I wasn''t sure what to expect. The School of Members helped me align with the vision. This is my spiritual home.', true, 6)
) AS seed(name, role, content, is_active, display_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

GRANT SELECT ON testimonials TO anon;
GRANT SELECT ON testimonials TO authenticated;
GRANT ALL ON testimonials TO service_role;

-- ============== 11. TEACHER ASSIGNMENT FUNCTIONS ==============
-- round-robin: least-loaded active teacher with spare capacity
CREATE OR REPLACE FUNCTION get_next_available_teacher()
RETURNS UUID AS $$
DECLARE
  teacher_id UUID;
BEGIN
  SELECT id INTO teacher_id
  FROM teachers
  WHERE is_active = true AND current_student_count < max_students
  ORDER BY current_student_count ASC, created_at ASC
  LIMIT 1;
  RETURN teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- keep teachers.current_student_count in sync
CREATE OR REPLACE FUNCTION update_teacher_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.assigned_teacher_id IS DISTINCT FROM NEW.assigned_teacher_id THEN
    IF OLD.assigned_teacher_id IS NOT NULL THEN
      UPDATE teachers SET current_student_count = (
        SELECT COUNT(*) FROM students
        WHERE assigned_teacher_id = OLD.assigned_teacher_id AND status IN ('pending','contacted','active')
      ) WHERE id = OLD.assigned_teacher_id;
    END IF;
  END IF;
  IF NEW.assigned_teacher_id IS NOT NULL THEN
    UPDATE teachers SET current_student_count = (
      SELECT COUNT(*) FROM students
      WHERE assigned_teacher_id = NEW.assigned_teacher_id AND status IN ('pending','contacted','active')
    ) WHERE id = NEW.assigned_teacher_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_teacher_count ON students;
CREATE TRIGGER trigger_update_teacher_count
  AFTER INSERT OR UPDATE OF assigned_teacher_id, status ON students
  FOR EACH ROW EXECUTE FUNCTION update_teacher_student_count();

-- ============== 12. STORAGE BUCKETS + POLICIES ==============
INSERT INTO storage.buckets (id, name, public) VALUES ('modules', 'modules', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true) ON CONFLICT (id) DO NOTHING;

-- avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- thumbnails
DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
CREATE POLICY "Anyone can view thumbnails" ON storage.objects FOR SELECT TO public USING (bucket_id = 'thumbnails');
DROP POLICY IF EXISTS "Admins can upload thumbnails" ON storage.objects;
CREATE POLICY "Admins can upload thumbnails" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update thumbnails" ON storage.objects;
CREATE POLICY "Admins can update thumbnails" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete thumbnails" ON storage.objects;
CREATE POLICY "Admins can delete thumbnails" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'thumbnails' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- modules (private)
DROP POLICY IF EXISTS "Admins can upload module files" ON storage.objects;
CREATE POLICY "Admins can upload module files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update module files" ON storage.objects;
CREATE POLICY "Admins can update module files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete module files" ON storage.objects;
CREATE POLICY "Admins can delete module files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'modules' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Authenticated users can download modules" ON storage.objects;
CREATE POLICY "Authenticated users can download modules" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'modules');

-- ============== 13. ATTENDANCE RECORDS (session reflection submissions) ==============
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  chapters_done TEXT NOT NULL,
  takeaway_1 TEXT NOT NULL,
  takeaway_2 TEXT,
  takeaway_3 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view attendance records" ON attendance_records;
CREATE POLICY "Admins can view attendance records" ON attendance_records
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "Admins can manage attendance records" ON attendance_records;
CREATE POLICY "Admins can manage attendance records" ON attendance_records
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- =====================================================================
-- SETUP COMPLETE — full schema, RLS, functions, and storage are ready.
-- =====================================================================
