-- Students table for PIN-based authentication
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  assigned_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_login TIMESTAMPTZ,
  login_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WhatsApp messages log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Testimonials table (if not exists)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_assigned_teacher ON students(assigned_teacher_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_student ON whatsapp_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
-- Admins can view all students
CREATE POLICY "Admins can view all students" ON students
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can insert students
CREATE POLICY "Admins can insert students" ON students
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update students
CREATE POLICY "Admins can update students" ON students
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access to students" ON students
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for whatsapp_messages
CREATE POLICY "Admins can view all messages" ON whatsapp_messages
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Service role full access to messages" ON whatsapp_messages
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get next available teacher (round-robin)
CREATE OR REPLACE FUNCTION get_next_available_teacher()
RETURNS UUID AS $$
DECLARE
  teacher_id UUID;
BEGIN
  -- Get the admin with the least number of assigned students
  SELECT p.id INTO teacher_id
  FROM profiles p
  LEFT JOIN students s ON s.assigned_teacher_id = p.id
  WHERE p.role = 'admin'
  GROUP BY p.id
  ORDER BY COUNT(s.id) ASC
  LIMIT 1;

  RETURN teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
