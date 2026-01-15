-- Create module_progress table

CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,

    -- Prevent duplicate progress entries
    UNIQUE(student_id, module_id)
);

-- Create indexes
CREATE INDEX idx_progress_student ON module_progress(student_id);
CREATE INDEX idx_progress_module ON module_progress(module_id);

-- Enable Row Level Security
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_progress
-- Students can view own progress, admins can view all
CREATE POLICY "Students can view own progress"
    ON module_progress FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Students can create their own progress entries
CREATE POLICY "Students can create own progress"
    ON module_progress FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Students can update their own progress
CREATE POLICY "Students can update own progress"
    ON module_progress FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid());

-- Function to update enrollment progress when module is completed
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_modules INTEGER;
    completed_modules INTEGER;
    course UUID;
BEGIN
    -- Get the course ID for this module
    SELECT course_id INTO course FROM modules WHERE id = NEW.module_id;

    -- Count total modules in the course
    SELECT COUNT(*) INTO total_modules FROM modules WHERE course_id = course;

    -- Count completed modules for this student
    SELECT COUNT(*) INTO completed_modules
    FROM module_progress mp
    JOIN modules m ON mp.module_id = m.id
    WHERE mp.student_id = NEW.student_id
    AND m.course_id = course
    AND mp.is_completed = true;

    -- Update enrollment progress
    UPDATE enrollments
    SET progress_percent = CASE
        WHEN total_modules > 0 THEN (completed_modules * 100 / total_modules)
        ELSE 0
    END
    WHERE student_id = NEW.student_id AND course_id = course;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update enrollment progress
CREATE TRIGGER on_module_progress_change
    AFTER INSERT OR UPDATE ON module_progress
    FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();
