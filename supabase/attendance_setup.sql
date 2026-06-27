-- =====================================================================
-- ATTENDANCE RECORDS — session attendance + reflection submissions
-- Run this whole snippet in the Supabase SQL Editor. "Success" is expected.
-- Students submit via a public QR form; admins view/export on their portal.
-- =====================================================================

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL, -- matched by name if found
  full_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  chapters_done TEXT NOT NULL,        -- e.g. "Chapter 1, Chapter 2"
  takeaway_1 TEXT NOT NULL,
  takeaway_2 TEXT,
  takeaway_3 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Admins can read/manage everything. Inserts come from the public form via an
-- API route using the service-role key (which bypasses RLS), so no public
-- INSERT policy is needed.
DROP POLICY IF EXISTS "Admins can view attendance records" ON attendance_records;
CREATE POLICY "Admins can view attendance records" ON attendance_records
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage attendance records" ON attendance_records;
CREATE POLICY "Admins can manage attendance records" ON attendance_records
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
