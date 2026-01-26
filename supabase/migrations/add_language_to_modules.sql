-- Add language column to modules table
-- Run this in Supabase SQL Editor

-- Add the language column with default 'en'
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en' CHECK (language IN ('en', 'fr'));

-- Create index for faster language filtering
CREATE INDEX IF NOT EXISTS idx_modules_language ON modules(language);

-- Update existing modules to 'en' if they don't have a language set
UPDATE modules SET language = 'en' WHERE language IS NULL;
