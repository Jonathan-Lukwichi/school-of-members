// Auth types for Phone + PIN authentication

export interface StudentSession {
  studentId: string
  phone: string
  fullName: string
  exp: number
}

export interface StudentAuthResult {
  success: boolean
  student?: {
    id: string
    phone: string
    fullName: string
    status: string
  }
  token?: string
  error?: string
}

export interface RegisterStudentInput {
  phone: string
  whatsappNumber: string
  fullName: string
}

export interface LoginStudentInput {
  phone: string
  pin: string
}

export type StudentStatus = 'pending' | 'contacted' | 'active' | 'completed' | 'inactive'

export interface Teacher {
  id: string
  userId: string
  fullName: string
  email: string
  phone: string | null
  whatsappNumber: string | null
  isActive: boolean
  maxStudents: number
  currentStudentCount: number
  createdAt: string
}

export interface Student {
  id: string
  phone: string
  whatsappNumber: string
  fullName: string
  status: StudentStatus
  assignedTeacherId: string | null
  assignedTeacher?: Teacher
  lastLogin: string | null
  loginCount: number
  createdAt: string
  updatedAt: string
}

export interface WhatsAppMessage {
  id: string
  studentId: string
  teacherId: string | null
  messageType: 'welcome' | 'pin' | 'reminder' | 'notification' | 'custom'
  templateName: string | null
  messageContent: string
  twilioSid: string | null
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  errorMessage: string | null
  sentAt: string | null
  deliveredAt: string | null
  readAt: string | null
  createdAt: string
}
