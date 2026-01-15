-- Create modules table

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

-- Create indexes
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- Enable Row Level Security
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules
-- Enrolled students and admins can view modules
CREATE POLICY "Modules viewable by enrolled students and admins"
    ON modules FOR SELECT
    TO authenticated
    USING (
        -- Admins can see all modules
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR
        -- Students enrolled in the course can see modules
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE student_id = auth.uid()
            AND course_id = modules.course_id
            AND status = 'active'
        )
    );

-- Only admins can create modules
CREATE POLICY "Admins can create modules"
    ON modules FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update modules
CREATE POLICY "Admins can update modules"
    ON modules FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete modules
CREATE POLICY "Admins can delete modules"
    ON modules FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
