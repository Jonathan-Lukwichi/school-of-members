-- School of Members - Improved Schema Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Create Teachers Table
-- ============================================
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

-- Index for user_id lookup
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_is_active ON teachers(is_active);

-- ============================================
-- 2. Create Students Table (separate from profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    whatsapp_number TEXT NOT NULL,
    full_name TEXT NOT NULL,
    pin_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'active', 'completed', 'inactive')),
    assigned_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for students
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(assigned_teacher_id);

-- ============================================
-- 3. Create WhatsApp Messages Table
-- ============================================
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

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_student ON whatsapp_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_type ON whatsapp_messages(message_type);

-- ============================================
-- 4. Create Student Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS student_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for session lookup
CREATE INDEX IF NOT EXISTS idx_student_sessions_student ON student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_sessions_expires ON student_sessions(expires_at);

-- ============================================
-- 5. Update Enrollments Table
-- ============================================
-- Add student_id column to enrollments (in addition to existing student_id that references profiles)
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS new_student_id UUID REFERENCES students(id) ON DELETE CASCADE;

-- ============================================
-- 6. Update Module Progress Table
-- ============================================
ALTER TABLE module_progress
ADD COLUMN IF NOT EXISTS new_student_id UUID REFERENCES students(id) ON DELETE CASCADE;

-- ============================================
-- 7. Update Attendance Table
-- ============================================
ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS new_student_id UUID REFERENCES students(id) ON DELETE CASCADE;

-- ============================================
-- 8. Update Profiles Table - Add role for teachers
-- ============================================
-- The role column uses an ENUM type (user_role), so we add 'teacher' to the enum
-- Note: ALTER TYPE ... ADD VALUE cannot run inside a transaction in some contexts
-- If this fails, run it separately first before the rest of the migration

DO $$
BEGIN
    -- Check if 'teacher' value already exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'teacher'
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        -- Add 'teacher' to the user_role enum
        ALTER TYPE user_role ADD VALUE 'teacher';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Value already exists, ignore
        NULL;
END $$;

-- ============================================
-- 9. Row Level Security Policies
-- ============================================

-- Enable RLS on new tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (to make migration re-runnable)
DROP POLICY IF EXISTS "Admins can view all teachers" ON teachers;
DROP POLICY IF EXISTS "Admins can manage teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can view themselves" ON teachers;
DROP POLICY IF EXISTS "Admins can view all students" ON students;
DROP POLICY IF EXISTS "Teachers can view assigned students" ON students;
DROP POLICY IF EXISTS "Admins can manage students" ON students;
DROP POLICY IF EXISTS "Admins can view all messages" ON whatsapp_messages;
DROP POLICY IF EXISTS "Teachers can view their messages" ON whatsapp_messages;

-- Teachers policies
CREATE POLICY "Admins can view all teachers" ON teachers
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can manage teachers" ON teachers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Teachers can view themselves" ON teachers
    FOR SELECT USING (user_id = auth.uid());

-- Students policies (admins and teachers can view)
CREATE POLICY "Admins can view all students" ON students
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Teachers can view assigned students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM teachers
            WHERE teachers.user_id = auth.uid()
            AND teachers.id = students.assigned_teacher_id
        )
    );

CREATE POLICY "Admins can manage students" ON students
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- WhatsApp messages policies
CREATE POLICY "Admins can view all messages" ON whatsapp_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Teachers can view their messages" ON whatsapp_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM teachers
            WHERE teachers.user_id = auth.uid()
            AND teachers.id = whatsapp_messages.teacher_id
        )
    );

-- ============================================
-- 10. Functions and Triggers
-- ============================================

-- Function to update teacher student count
CREATE OR REPLACE FUNCTION update_teacher_student_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update count for old teacher (if changed)
    IF TG_OP = 'UPDATE' AND OLD.assigned_teacher_id IS DISTINCT FROM NEW.assigned_teacher_id THEN
        IF OLD.assigned_teacher_id IS NOT NULL THEN
            UPDATE teachers
            SET current_student_count = (
                SELECT COUNT(*) FROM students
                WHERE assigned_teacher_id = OLD.assigned_teacher_id
                AND status IN ('pending', 'contacted', 'active')
            )
            WHERE id = OLD.assigned_teacher_id;
        END IF;
    END IF;

    -- Update count for new teacher
    IF NEW.assigned_teacher_id IS NOT NULL THEN
        UPDATE teachers
        SET current_student_count = (
            SELECT COUNT(*) FROM students
            WHERE assigned_teacher_id = NEW.assigned_teacher_id
            AND status IN ('pending', 'contacted', 'active')
        )
        WHERE id = NEW.assigned_teacher_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for student assignment changes
DROP TRIGGER IF EXISTS trigger_update_teacher_count ON students;
CREATE TRIGGER trigger_update_teacher_count
    AFTER INSERT OR UPDATE OF assigned_teacher_id, status ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_teacher_student_count();

-- Function to get next available teacher (round-robin)
CREATE OR REPLACE FUNCTION get_next_available_teacher()
RETURNS UUID AS $$
DECLARE
    teacher_id UUID;
BEGIN
    SELECT id INTO teacher_id
    FROM teachers
    WHERE is_active = true
    AND current_student_count < max_students
    ORDER BY current_student_count ASC, created_at ASC
    LIMIT 1;

    RETURN teacher_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_teachers_updated_at ON teachers;
CREATE TRIGGER trigger_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_students_updated_at ON students;
CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 11. Create Storage Bucket for WhatsApp Media
-- ============================================
-- Run this separately in Storage section or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('whatsapp-media', 'whatsapp-media', false);
