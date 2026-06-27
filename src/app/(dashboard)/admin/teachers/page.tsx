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
  DialogTrigger,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, GraduationCap, Users, Loader2, Trash2, Edit, Mail, Phone, MessageCircle } from 'lucide-react'

interface Teacher {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  whatsapp_number: string | null
  is_active: boolean
  max_students: number
  current_student_count: number
  created_at: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null)
  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    password: '',
    maxStudents: 50,
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers')
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)
      setTeachers(data.teachers || [])
    } catch (error) {
      toast.error('Failed to fetch teachers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTeacher = async () => {
    if (!newTeacher.fullName.trim() || !newTeacher.email.trim() || !newTeacher.password) {
      toast.error('Full name, email, and password are required')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newTeacher.fullName,
          email: newTeacher.email,
          phone: newTeacher.phone || null,
          whatsappNumber: newTeacher.whatsappNumber || newTeacher.phone || null,
          password: newTeacher.password,
          maxStudents: newTeacher.maxStudents,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Teacher created successfully!')
      setIsDialogOpen(false)
      setNewTeacher({
        fullName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        password: '',
        maxStudents: 50,
      })
      fetchTeachers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create teacher')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleActive = async (teacher: Teacher) => {
    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: teacher.id,
          isActive: !teacher.is_active,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success(`Teacher ${!teacher.is_active ? 'activated' : 'deactivated'}`)
      fetchTeachers()
    } catch (error) {
      toast.error('Failed to update teacher status')
    }
  }

  const handleDeleteTeacher = async () => {
    if (!deleteTeacher) return

    try {
      const response = await fetch(`/api/admin/teachers?id=${deleteTeacher.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Teacher deleted successfully')
      setDeleteTeacher(null)
      fetchTeachers()
    } catch (error) {
      toast.error('Failed to delete teacher')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teacher accounts and student assignments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher account. They will be able to manage assigned students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={newTeacher.fullName}
                  onChange={(e) => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@example.com"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+27..."
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min={1}
                    value={newTeacher.maxStudents}
                    onChange={(e) => setNewTeacher({ ...newTeacher, maxStudents: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  placeholder="Same as phone if empty"
                  value={newTeacher.whatsappNumber}
                  onChange={(e) => setNewTeacher({ ...newTeacher, whatsappNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeacher} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Teacher'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{teachers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Teachers</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-mint flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-emerald" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {teachers.filter(t => t.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned Students</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-deep/15 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-deep" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {teachers.reduce((sum, t) => sum + (t.current_student_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card className="bg-card border border-border shadow-premium">
        <CardHeader>
          <CardTitle className="text-foreground">All Teachers</CardTitle>
          <CardDescription className="text-muted-foreground">
            Teachers are automatically assigned students using round-robin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-mint flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-emerald" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Teachers Yet</h3>
              <p className="text-muted-foreground">
                Add your first teacher to start assigning students.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{teacher.full_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {teacher.email}
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {teacher.phone}
                          </div>
                        )}
                        {teacher.whatsapp_number && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            {teacher.whatsapp_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{teacher.current_student_count || 0}</span>
                        <span className="text-muted-foreground">/ {teacher.max_students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.is_active ? 'default' : 'secondary'}
                        className={teacher.is_active ? 'bg-emerald/15 text-emerald-deep' : ''}
                      >
                        {teacher.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(teacher.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={teacher.is_active}
                          onCheckedChange={() => handleToggleActive(teacher)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTeacher(teacher)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTeacher} onOpenChange={() => setDeleteTeacher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteTeacher?.full_name}? This action cannot be undone.
              Their assigned students will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeacher}
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
