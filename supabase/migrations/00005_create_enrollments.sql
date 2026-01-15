-- Create enrollments table

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status enrollment_status DEFAULT 'active',
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),

    -- Prevent duplicate enrollments
    UNIQUE(student_id, course_id)
);

-- Create indexes
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Enable Row Level Security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enrollments
-- Students can view their own enrollments, admins can view all
CREATE POLICY "Students can view own enrollments"
    ON enrollments FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Students can enroll themselves, admins can enroll anyone
CREATE POLICY "Users can create enrollments"
    ON enrollments FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Students can update own enrollment, admins can update any
CREATE POLICY "Users can update enrollments"
    ON enrollments FOR UPDATE
    TO authenticated
    USING (
        student_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete enrollments
CREATE POLICY "Admins can delete enrollments"
    ON enrollments FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
