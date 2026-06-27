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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Users, Loader2, Trash2, Phone, MessageCircle, RefreshCw, UserPlus, Clock, CheckCircle, XCircle, User, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { exportToExcel, exportToWord } from '@/lib/export-utils'

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
  email?: string
  address?: string | null
  church_of_provenance?: string | null
  baptized_by_immersion?: boolean | null
  preferred_language?: string
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
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  contacted: 'bg-blue-100 text-blue-700 border border-blue-200',
  active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  completed: 'bg-emerald/10 text-emerald-deep border border-emerald/20',
  inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
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
  const [approvingId, setApprovingId] = useState<string | null>(null)

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

  const handleApproveStudent = async (studentId: string, studentName: string) => {
    setApprovingId(studentId)
    try {
      const response = await fetch('/api/admin/students/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Approval failed')
      }

      if (data.notificationSent) {
        toast.success(`${studentName} approved!`, {
          description: `PIN sent via ${data.notificationMethod}`,
        })
      } else {
        toast.warning(`${studentName} approved but notification failed!`, {
          description: 'Please send the PIN to the student manually.',
        })
      }

      fetchStudents()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve student')
    } finally {
      setApprovingId(null)
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
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage student registrations and teacher assignments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-deep" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-deep">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-slate-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-500">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="flex gap-4 items-center justify-between flex-wrap">
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

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-emerald text-emerald hover:bg-emerald hover:text-ink-deep">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                exportToExcel(students, 'students')
                toast.success('Excel file downloaded!')
              }}
              className="cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
              Export as Excel (.xlsx)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await exportToWord(students, 'students')
                toast.success('Word file downloaded!')
              }}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Export as Word (.docx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Students Table */}
      <Card className="bg-card border border-border shadow-premium overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald to-emerald-deep" />
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            All Students
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Click on a student to manage their status and teacher assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald" />
                <p className="text-muted-foreground text-sm">Loading students...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 rounded-2xl bg-mint flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-emerald" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Students Found</h3>
              <p className="text-muted-foreground">
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
                  <TableRow key={student.id} className="cursor-pointer hover:bg-mint-soft">
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-mint rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.login_count} logins
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 text-emerald" />
                          {student.phone}
                        </div>
                        {student.whatsapp_number !== student.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageCircle className="h-3 w-3 text-emerald-deep" />
                            {student.whatsapp_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => setSelectedStudent(student)}>
                      {student.assigned_teacher ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <UserPlus className="h-4 w-4 text-emerald" />
                          <span>{student.assigned_teacher.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
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
                      <div className="flex items-center justify-end gap-2">
                        {student.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApproveStudent(student.id, student.full_name)
                            }}
                            disabled={approvingId === student.id}
                            className="bg-emerald-btn text-white"
                          >
                            {approvingId === student.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
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
                      </div>
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
        <DialogContent className="bg-card border border-border">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald to-emerald-deep" />
          <DialogHeader>
            <DialogTitle className="text-foreground">Manage Student</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update student status, assign teacher, or reset PIN
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-mint border border-emerald/20 rounded-xl">
                <div className="h-12 w-12 bg-emerald rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{selectedStudent.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
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
                <label className="text-sm font-medium text-muted-foreground">Assigned Teacher</label>
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
