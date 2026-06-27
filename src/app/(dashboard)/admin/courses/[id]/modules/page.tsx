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
import { toast } from 'sonner'
import { Plus, ArrowLeft, FileText, Upload, Loader2, Trash2, GripVertical, Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBrowserClient } from '@/lib/supabase/client'
import { FileUpload } from '@/components/shared/file-upload'
import { ModuleCard } from '@/components/shared/module-card'
import { PDFViewer } from '@/components/shared/pdf-viewer'

interface Module {
  id: string
  title: string
  description: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  order_index: number
  created_at: string
}

interface Course {
  id: string
  title: string
  description: string | null
}

export default function CourseModulesPage({ params }: { params: { id: string } }) {
  const courseId = params.id
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleteModule, setDeleteModule] = useState<Module | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    language: 'en' as 'en' | 'fr'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null)
  const [currentPdfTitle, setCurrentPdfTitle] = useState<string>('')
  const [currentModuleForDownload, setCurrentModuleForDownload] = useState<Module | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    fetchCourseAndModules()
  }, [courseId])

  const fetchCourseAndModules = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (modulesError) throw modulesError
      setModules(modulesData || [])
    } catch (error) {
      toast.error('Failed to fetch course data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleCreateModule = async () => {
    if (!newModule.title.trim()) {
      toast.error('Module title is required')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('courseId', courseId)
      formData.append('title', newModule.title)
      formData.append('description', newModule.description)
      formData.append('orderIndex', String(modules.length))
      formData.append('language', newModule.language)

      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/modules/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Module created successfully!')
      setIsDialogOpen(false)
      setNewModule({ title: '', description: '', language: 'en' })
      setSelectedFile(null)
      fetchCourseAndModules()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create module')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteModule = async () => {
    if (!deleteModule) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', deleteModule.id)

      if (error) throw error

      toast.success('Module deleted successfully!')
      setDeleteModule(null)
      fetchCourseAndModules()
    } catch (error) {
      toast.error('Failed to delete module')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async (module: Module) => {
    if (!module.file_url) return

    try {
      const response = await fetch(`/api/modules/download/${module.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Open the signed URL in a new tab to download
      window.open(data.downloadUrl, '_blank')
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  const handlePreview = async (module: Module) => {
    if (!module.file_url) return

    try {
      const response = await fetch(`/api/modules/preview/${module.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Open in embedded PDF viewer
      setCurrentPdfUrl(data.previewUrl)
      setCurrentPdfTitle(module.title)
      setCurrentModuleForDownload(module)
      setPdfViewerOpen(true)
    } catch (error) {
      toast.error('Failed to preview file')
    }
  }

  const handleDownloadFromViewer = async () => {
    if (currentModuleForDownload) {
      await handleDownload(currentModuleForDownload)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <Link href="/admin/courses">
          <Button variant="link">Back to courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground">
            Manage course modules and materials
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new module and upload learning materials (PDF or images).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="moduleTitle">Module Title *</Label>
                <Input
                  id="moduleTitle"
                  placeholder="Enter module title"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduleDescription">Description</Label>
                <Textarea
                  id="moduleDescription"
                  placeholder="Enter module description"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  rows={2}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduleLanguage">Language</Label>
                <Select
                  value={newModule.language}
                  onValueChange={(value: 'en' | 'fr') => setNewModule({ ...newModule, language: value })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Français
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Upload File (Optional)</Label>
                <FileUpload
                  bucket="modules"
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  disabled={isUploading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleCreateModule} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedFile ? 'Uploading...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Module
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {course.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{course.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Course Modules ({modules.length})
          </CardTitle>
          <CardDescription>
            Drag to reorder modules. Students will see them in this order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Modules Yet</h3>
              <p className="text-muted-foreground mb-4">
                This course doesn&apos;t have any modules yet. Add your first module to get started.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Module
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((module, index) => (
                <div key={module.id} className="flex items-center gap-2">
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <ModuleCard
                      module={module}
                      isAdmin={true}
                      onPreview={() => handlePreview(module)}
                      onDownload={() => handleDownload(module)}
                      onEdit={() => toast.info('Edit functionality coming soon')}
                      onDelete={() => setDeleteModule(module)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteModule} onOpenChange={() => setDeleteModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteModule?.title}&quot;?
              This will also delete the associated file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={pdfViewerOpen}
        onClose={() => {
          setPdfViewerOpen(false)
          setCurrentPdfUrl(null)
          setCurrentPdfTitle('')
          setCurrentModuleForDownload(null)
        }}
        pdfUrl={currentPdfUrl}
        title={currentPdfTitle}
        onDownload={handleDownloadFromViewer}
      />
    </div>
  )
}
