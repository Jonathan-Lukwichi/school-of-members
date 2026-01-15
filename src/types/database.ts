export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'student'
export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'suspended'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          file_url: string | null
          file_name: string | null
          file_size: number | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          order_index?: number
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          status: EnrollmentStatus
          progress_percent: number
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          status?: EnrollmentStatus
          progress_percent?: number
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          status?: EnrollmentStatus
          progress_percent?: number
        }
      }
      module_progress: {
        Row: {
          id: string
          student_id: string
          module_id: string
          is_completed: boolean
          completed_at: string | null
          download_count: number
        }
        Insert: {
          id?: string
          student_id: string
          module_id: string
          is_completed?: boolean
          completed_at?: string | null
          download_count?: number
        }
        Update: {
          id?: string
          student_id?: string
          module_id?: string
          is_completed?: boolean
          completed_at?: string | null
          download_count?: number
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          course_id: string
          session_date: string
          status: AttendanceStatus
          notes: string | null
          recorded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          session_date: string
          status: AttendanceStatus
          notes?: string | null
          recorded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          session_date?: string
          status?: AttendanceStatus
          notes?: string | null
          recorded_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      enrollment_status: EnrollmentStatus
      attendance_status: AttendanceStatus
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type ModuleProgress = Database['public']['Tables']['module_progress']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']

// Extended types with relations
export type CourseWithModules = Course & {
  modules: Module[]
}

export type EnrollmentWithCourse = Enrollment & {
  course: Course
}

export type StudentWithEnrollments = Profile & {
  enrollments: EnrollmentWithCourse[]
}

export type AttendanceRecord = Attendance & {
  student: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'>
}
