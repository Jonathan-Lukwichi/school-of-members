'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Plus,
  BookOpen,
  Users,
  FileText,
  Edit,
  Trash2,
  Loader2,
  Eye,
  GraduationCap,
  ImageIcon,
  X
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

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

type TabValue = 'all' | 'active' | 'inactive'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    is_active: true
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    is_active: true
  })
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null)
  const [editThumbnailPreview, setEditThumbnailPreview] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    const preview = URL.createObjectURL(file)

    if (isEdit) {
      setEditThumbnailFile(file)
      setEditThumbnailPreview(preview)
    } else {
      setThumbnailFile(file)
      setThumbnailPreview(preview)
    }
  }

  const uploadThumbnail = async (file: File, courseId: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${courseId}-${Date.now()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('modules')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('modules')
      .getPublicUrl(filePath)

    return urlData.publicUrl
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

      // Create course first
      const { data: courseData, error } = await (supabase
        .from('courses') as any)
        .insert({
          title: newCourse.title,
          description: newCourse.description || null,
          is_active: newCourse.is_active,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      // Upload thumbnail if provided
      if (thumbnailFile && courseData) {
        const thumbnailUrl = await uploadThumbnail(thumbnailFile, courseData.id)

        await (supabase
          .from('courses') as any)
          .update({ thumbnail_url: thumbnailUrl })
          .eq('id', courseData.id)
      }

      toast.success('Course created successfully!')
      setIsDialogOpen(false)
      setNewCourse({ title: '', description: '', is_active: true })
      setThumbnailFile(null)
      setThumbnailPreview(null)
      fetchCourses()
    } catch (error) {
      toast.error('Failed to create course')
    } finally {
      setIsCreating(false)
    }
  }

  const openEditDialog = (course: Course) => {
    setEditingCourse(course)
    setEditForm({
      title: course.title,
      description: course.description || '',
      is_active: course.is_active
    })
    setEditThumbnailPreview(course.thumbnail_url)
    setEditThumbnailFile(null)
    setEditDialogOpen(true)
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse || !editForm.title.trim()) {
      toast.error('Course title is required')
      return
    }

    setIsUpdating(true)
    try {
      let thumbnailUrl = editingCourse.thumbnail_url

      // Upload new thumbnail if provided
      if (editThumbnailFile) {
        thumbnailUrl = await uploadThumbnail(editThumbnailFile, editingCourse.id)
      }

      const { error } = await (supabase
        .from('courses') as any)
        .update({
          title: editForm.title,
          description: editForm.description || null,
          is_active: editForm.is_active,
          thumbnail_url: thumbnailUrl
        })
        .eq('id', editingCourse.id)

      if (error) throw error

      toast.success('Course updated successfully!')
      setEditDialogOpen(false)
      setEditingCourse(null)
      setEditThumbnailFile(null)
      setEditThumbnailPreview(null)
      fetchCourses()
    } catch (error) {
      toast.error('Failed to update course')
    } finally {
      setIsUpdating(false)
    }
  }

  const openDeleteDialog = (course: Course) => {
    setDeletingCourse(course)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return

    setIsDeleting(true)
    try {
      const { error } = await (supabase
        .from('courses') as any)
        .delete()
        .eq('id', deletingCourse.id)

      if (error) throw error

      toast.success('Course deleted successfully!')
      setDeleteDialogOpen(false)
      setDeletingCourse(null)
      fetchCourses()
    } catch (error) {
      toast.error('Failed to delete course. Make sure all modules are deleted first.')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'active') return course.is_active
    if (activeTab === 'inactive') return !course.is_active
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Course Card Component
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-[#003366] to-[#001a33] overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-white/30" />
          </div>
        )}
        {/* Module badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#b5985b] text-white border-0">
            <FileText className="h-3 w-3 mr-1" />
            {course.modules?.[0]?.count || 0} modules
          </Badge>
        </div>
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={course.is_active
              ? 'bg-emerald-500 text-white border-0'
              : 'bg-slate-500 text-white border-0'}
          >
            {course.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-semibold text-lg text-[#1e293b] mb-2 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-[#64748b] mb-4 line-clamp-2 min-h-[40px]">
          {course.description || 'No description available'}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[#64748b]">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrollments?.[0]?.count || 0} enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{formatDate(course.created_at)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/modules`} className="flex-1">
            <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white">
              <Eye className="h-4 w-4 mr-2" />
              Modules
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => openEditDialog(course)}
            className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => openDeleteDialog(course)}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1e293b]">Courses</h1>
          <p className="text-[#64748b] mt-2">
            Manage your courses and modules
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#003366] hover:bg-[#002244] text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-[#e2e8f0] max-w-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003366] to-[#b5985b]" />
            <DialogHeader>
              <DialogTitle className="text-[#1e293b]">Create New Course</DialogTitle>
              <DialogDescription className="text-[#64748b]">
                Add a new course to your learning platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label className="text-[#64748b]">Course Thumbnail</Label>
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-lg p-4 text-center hover:border-[#003366] transition-colors">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          setThumbnailFile(null)
                          setThumbnailPreview(null)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleThumbnailSelect(e, false)}
                      />
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="h-12 w-12 rounded-full bg-[#003366]/10 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-[#003366]" />
                        </div>
                        <p className="text-sm text-[#64748b]">
                          Click to upload thumbnail
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#64748b]">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#64748b]">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                  className="border-[#e2e8f0]"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="text-[#64748b]">Active</Label>
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
              <Button onClick={handleCreateCourse} disabled={isCreating} className="bg-[#003366] hover:bg-[#002244] text-white">
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
        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#003366] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{courses.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Active Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {courses.filter(c => c.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Modules</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#b5985b]/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#b5985b]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">
              {courses.reduce((sum, c) => sum + (c.modules?.[0]?.count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="bg-[#f1f5f9]">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            All Courses ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-white">
            Active ({courses.filter(c => c.is_active).length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-white">
            Inactive ({courses.filter(c => !c.is_active).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#003366]" />
            <p className="text-[#64748b] text-sm">Loading courses...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="h-20 w-20 rounded-2xl bg-[#003366]/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-[#003366]" />
            </div>
            <h3 className="text-lg font-medium text-[#1e293b] mb-2">
              {activeTab === 'all' ? 'No Courses Yet' : `No ${activeTab} Courses`}
            </h3>
            <p className="text-[#64748b] mb-6">
              {activeTab === 'all'
                ? 'Click "New Course" to create your first course.'
                : `No courses are currently ${activeTab}.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Edit Course Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white border border-[#e2e8f0] max-w-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003366] to-[#b5985b]" />
          <DialogHeader>
            <DialogTitle className="text-[#1e293b]">Edit Course</DialogTitle>
            <DialogDescription className="text-[#64748b]">
              Update course details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label className="text-[#64748b]">Course Thumbnail</Label>
              <div className="border-2 border-dashed border-[#e2e8f0] rounded-lg p-4 text-center hover:border-[#003366] transition-colors">
                {editThumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={editThumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => {
                        setEditThumbnailFile(null)
                        setEditThumbnailPreview(null)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleThumbnailSelect(e, true)}
                    />
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="h-12 w-12 rounded-full bg-[#003366]/10 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-[#003366]" />
                      </div>
                      <p className="text-sm text-[#64748b]">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-[#94a3b8]">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-[#64748b]">Course Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter course title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-[#64748b]">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter course description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="border-[#e2e8f0]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-is_active" className="text-[#64748b]">Active</Label>
              <Switch
                id="edit-is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse} disabled={isUpdating} className="bg-[#003366] hover:bg-[#002244] text-white">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Course'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCourse?.title}&quot;?
              This will also delete all associated modules and enrollments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Course'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
