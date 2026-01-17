-- Migration: Add testimonials table
-- Description: Create testimonials table for dynamic testimonials on homepage

-- Create testimonials table
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

-- Create index for active testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view active testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial testimonials from content document
INSERT INTO testimonials (name, role, content, is_active, display_order) VALUES
  ('Grace M.', 'New Member', 'I gave my life to Christ recently, and the School of Members helped me understand what it truly means to be part of God''s family. I now feel confident in my faith journey.', true, 1),
  ('Emmanuel K.', 'Church Volunteer', 'I''ve been a Christian for over 15 years, but I never had a proper foundation in church membership. This program opened my eyes to things I''d missed!', true, 2),
  ('Thandi S.', 'Young Professional', 'As a busy professional, I appreciated completing this at my own pace. The teachings challenged me to prioritize my church attendance.', true, 3),
  ('David N.', 'Parent', 'This helped me understand my responsibilities not just as a church member, but how my faithfulness impacts my family.', true, 4),
  ('Patrick M.', 'Cell Group Leader', 'Before this course, I was serving without fully understanding the vision. Now I can confidently lead others with clarity.', true, 5),
  ('Blessing O.', 'Transferred Member', 'When I transferred to Ramah, I wasn''t sure what to expect. The School of Members helped me align with the vision. This is my spiritual home.', true, 6);

-- Grant permissions
GRANT SELECT ON testimonials TO anon;
GRANT SELECT ON testimonials TO authenticated;
GRANT ALL ON testimonials TO service_role;
