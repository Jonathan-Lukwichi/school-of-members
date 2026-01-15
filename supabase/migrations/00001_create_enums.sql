-- Create custom enums for the School of Members platform

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'student');

-- Enrollment status
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');

-- Attendance status
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
