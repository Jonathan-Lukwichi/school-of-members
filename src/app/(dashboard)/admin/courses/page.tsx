'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, BookOpen, Users, FileText, Edit, Trash2, Loader2, Eye, Sparkles } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = ReturnType<typeof createBrowserClient> extends Promise<infer T> ? T : any

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  modules: { count: number }[]
  enrollments: { count: number }[]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    is_active: true
  })

  const supabase = createBrowserClient()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules(count),
          enrollments(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCourses(data || [])
    } catch (error) {
      toast.error('Failed to fetch courses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) {
      toast.error('Course title is required')
      return
    }

    setIsCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await (supabase
        .from('courses') as any)
        .insert({
          title: newCourse.title,
          description: newCourse.description || null,
          is_active: newCourse.is_active,
          created_by: user.id
        })

      if (error) throw error

      toast.success('Course created successfully!')
      setIsDialogOpen(false)
      setNewCourse({ title: '', description: '', is_active: true })
      fetchCourses()
    } catch (error) {
      toast.error('Failed to create course')
    } finally {
      setIsCreating(false)
    }
  }

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase
        .from('courses') as any)
        .update({ is_active: !currentStatus })
        .eq('id', courseId)

      if (error) throw error

      toast.success(`Course ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchCourses()
    } catch (error) {
      toast.error('Failed to update course status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <h1 className="text-4xl font-bold text-white">Courses</h1>
          <p className="text-slate-400 mt-2">
            Manage your courses and modules
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-purple-500/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
            <DialogHeader>
              <DialogTitle className="text-white">Create New Course</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new course to your learning platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                  className="bg-slate-900/50 border-purple-500/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="text-slate-300">Active</Label>
                <Switch
                  id="is_active"
                  checked={newCourse.is_active}
                  onCheckedChange={(checked) => setNewCourse({ ...newCourse, is_active: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={isCreating} className="btn-gradient">
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{courses.length}</div>
          </CardContent>
        </Card>

        <Card className="glass border-cyan-500/20 hover-lift hover-glow-cyan overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              {courses.filter(c => c.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Modules</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {courses.reduce((sum, c) => sum + (c.modules?.[0]?.count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="glass border-purple-500/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            All Courses
          </CardTitle>
          <CardDescription className="text-slate-400">
            Click on a course to manage its modules
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
                <p className="text-slate-400 text-sm">Loading courses...</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-purple-400" />
                </div>
                <div className="absolute inset-0 blur-xl bg-purple-500/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Courses Yet</h3>
              <p className="text-slate-400 mb-6">
                Click "New Course" to create your first course.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{course.title}</p>
                        {course.description && (
                          <p className="text-sm text-slate-400 line-clamp-1">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-white">{course.modules?.[0]?.count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-cyan-400" />
                        </div>
                        <span className="text-white">{course.enrollments?.[0]?.count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={course.is_active
                          ? 'badge-success'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}
                      >
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{formatDate(course.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/courses/${course.id}/modules`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Modules
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCourseStatus(course.id, course.is_active)}
                          className={course.is_active ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'}
                        >
                          {course.is_active ? 'Deactivate' : 'Activate'}
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
    </div>
  )
}
