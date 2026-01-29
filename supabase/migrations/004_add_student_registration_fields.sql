-- Migration: Add additional student registration fields
-- Date: 2026-01-29
-- Description: Add address, church_of_provenance, baptized_by_immersion, and preferred_language fields to students table

-- Add new columns to students table
ALTER TABLE students
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS church_of_provenance TEXT,
ADD COLUMN IF NOT EXISTS baptized_by_immersion BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr'));

-- Add comment for documentation
COMMENT ON COLUMN students.address IS 'Physical address of the student';
COMMENT ON COLUMN students.church_of_provenance IS 'Previous church the student attended';
COMMENT ON COLUMN students.baptized_by_immersion IS 'Whether the student has been baptized by immersion (true/false/null)';
COMMENT ON COLUMN students.preferred_language IS 'Preferred language for content: en (English) or fr (French)';
