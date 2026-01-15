'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Users, Loader2, Trash2, Phone, MessageCircle, RefreshCw, UserPlus, Clock, CheckCircle, XCircle, User } from 'lucide-react'

interface Teacher {
  id: string
  full_name: string
  email: string
}

interface Student {
  id: string
  phone: string
  whatsapp_number: string
  full_name: string
  status: 'pending' | 'contacted' | 'active' | 'completed' | 'inactive'
  assigned_teacher_id: string | null
  assigned_teacher: Teacher | null
  last_login: string | null
  login_count: number
  created_at: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'inactive', label: 'Inactive' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  inactive: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  contacted: <MessageCircle className="h-3 w-3" />,
  active: <CheckCircle className="h-3 w-3" />,
  completed: <CheckCircle className="h-3 w-3" />,
  inactive: <XCircle className="h-3 w-3" />,
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [teacherFilter, setTeacherFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchTeachers()
  }, [statusFilter, teacherFilter])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (teacherFilter !== 'all') params.set('teacherId', teacherFilter)

      const response = await fetch(`/api/admin/students?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)
      setStudents(data.students || [])
    } catch (error) {
      toast.error('Failed to fetch students')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers')
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)
      setTeachers(data.teachers || [])
    } catch (error) {
      // Silent fail for teachers
    }
  }

  const handleUpdateStudent = async (updates: Partial<{ status: string; assignedTeacherId: string | null; resetPin: boolean }>) => {
    if (!selectedStudent) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedStudent.id,
          ...updates,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Student updated successfully')

      if (updates.resetPin) {
        toast.success('New PIN sent via WhatsApp')
      }

      setSelectedStudent(null)
      fetchStudents()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update student')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!deleteStudent) return

    try {
      const response = await fetch(`/api/admin/students?id=${deleteStudent.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Student deleted successfully')
      setDeleteStudent(null)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusStats = () => {
    return {
      total: students.length,
      pending: students.filter(s => s.status === 'pending').length,
      contacted: students.filter(s => s.status === 'contacted').length,
      active: students.filter(s => s.status === 'active').length,
      completed: students.filter(s => s.status === 'completed').length,
      inactive: students.filter(s => s.status === 'inactive').length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <h1 className="text-4xl font-bold text-white">Students</h1>
          <p className="text-slate-400 mt-2">
            Manage student registrations and teacher assignments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="glass border-purple-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="glass border-amber-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="glass border-blue-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Contacted</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.contacted}</div>
          </CardContent>
        </Card>
        <Card className="glass border-emerald-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="glass border-purple-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Completed</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card className="glass border-slate-500/20 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Inactive</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-slate-500/20 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-400">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teacherFilter} onValueChange={setTeacherFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teachers</SelectItem>
            {teachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card className="glass border-purple-500/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            All Students
          </CardTitle>
          <CardDescription className="text-slate-400">
            Click on a student to manage their status and teacher assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                  <div className="absolute inset-0 blur-xl bg-purple-500/30" />
                </div>
                <p className="text-slate-400 text-sm">Loading students...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Users className="h-10 w-10 text-purple-400" />
                </div>
                <div className="absolute inset-0 blur-xl bg-purple-500/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Students Found</h3>
              <p className="text-slate-400">
                {statusFilter !== 'all' || teacherFilter !== 'all'
                  ? 'No students match the current filters.'
                  : 'Students will appear here when they register.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="cursor-pointer">
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.full_name}</p>
                          <p className="text-xs text-slate-500">
                            {student.login_count} logins
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-slate-300">
                          <Phone className="h-3 w-3 text-purple-400" />
                          {student.phone}
                        </div>
                        {student.whatsapp_number !== student.phone && (
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <MessageCircle className="h-3 w-3 text-cyan-400" />
                            {student.whatsapp_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      {student.assigned_teacher ? (
                        <div className="flex items-center gap-1 text-slate-300">
                          <UserPlus className="h-4 w-4 text-cyan-400" />
                          <span>{student.assigned_teacher.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <Badge className={STATUS_COLORS[student.status]}>
                        <span className="flex items-center gap-1">
                          {STATUS_ICONS[student.status]}
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <span className="text-sm">{formatDate(student.last_login)}</span>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <span className="text-sm">{formatDate(student.created_at)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteStudent(student)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="glass border-purple-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <DialogHeader>
            <DialogTitle className="text-white">Manage Student</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update student status, assign teacher, or reset PIN
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedStudent.full_name}</h3>
                  <p className="text-sm text-slate-400">{selectedStudent.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <Select
                  value={selectedStudent.status}
                  onValueChange={(value) => handleUpdateStudent({ status: value })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Assigned Teacher</label>
                <Select
                  value={selectedStudent.assigned_teacher_id || 'none'}
                  onValueChange={(value) => handleUpdateStudent({
                    assignedTeacherId: value === 'none' ? null : value
                  })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Teacher</SelectItem>
                    {teachers.filter(t => (t as any).is_active !== false).map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStudent({ resetPin: true })}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Reset PIN & Send via WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteStudent?.full_name}? This action cannot be undone.
              All their progress and data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
