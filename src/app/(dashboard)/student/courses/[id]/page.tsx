'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  FileText,
  CheckCircle,
  Loader2,
  GraduationCap,
  Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Module {
  id: string
  title: string
  description: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  order_index: number
}

interface ModuleProgress {
  module_id: string
  is_completed: boolean
  download_count: number
}

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_active: boolean
}

export default function StudentCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [progress, setProgress] = useState<ModuleProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [previewingId, setPreviewingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/student/login')
        return
      }

      // Fetch course
      const { data: courseData, error: courseError } = await (supabase
        .from('courses') as any)
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch modules
      const { data: modulesData, error: modulesError } = await (supabase
        .from('modules') as any)
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (modulesError) throw modulesError
      setModules(modulesData || [])

      // Check/create enrollment
      const { data: enrollment } = await (supabase
        .from('enrollments') as any)
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (!enrollment) {
        // Auto-enroll the student
        await (supabase
          .from('enrollments') as any)
          .insert({
            student_id: user.id,
            course_id: courseId,
            status: 'active',
            progress_percent: 0
          })
        toast.success('You have been enrolled in this course!')
      }

      // Fetch module progress
      const { data: progressData } = await (supabase
        .from('module_progress') as any)
        .select('module_id, is_completed, download_count')
        .eq('student_id', user.id)
        .in('module_id', (modulesData || []).map((m: Module) => m.id))

      setProgress(progressData || [])

    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (module: Module) => {
    if (!module.file_url) {
      toast.error('No file available for download')
      return
    }

    setDownloadingId(module.id)
    try {
      const response = await fetch(`/api/modules/download/${module.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Open download URL
      window.open(data.downloadUrl, '_blank')
      toast.success('Download started!')

      // Refresh progress
      fetchCourseData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download')
    } finally {
      setDownloadingId(null)
    }
  }

  const handlePreview = async (module: Module) => {
    if (!module.file_url) {
      toast.error('No file available for preview')
      return
    }

    setPreviewingId(module.id)
    try {
      const response = await fetch(`/api/modules/preview/${module.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Open preview URL in new tab
      window.open(data.previewUrl, '_blank')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to preview')
    } finally {
      setPreviewingId(null)
    }
  }

  const handleMarkComplete = async (moduleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Upsert module progress
      const { error } = await (supabase
        .from('module_progress') as any)
        .upsert({
          student_id: user.id,
          module_id: moduleId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,module_id'
        })

      if (error) throw error

      toast.success('Module marked as complete!')
      fetchCourseData()
    } catch (error) {
      toast.error('Failed to mark module as complete')
    }
  }

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.module_id === moduleId)
  }

  const completedCount = progress.filter(p => p.is_completed).length
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1e293b]">Course not found</h2>
        <Link href="/student/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/student/courses" className="inline-flex items-center text-[#64748b] hover:text-[#003366] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-[#003366] to-[#001a33] rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-white/80 text-sm mb-4">
              {course.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white border-0">
                <FileText className="h-3 w-3 mr-1" />
                {modules.length} Modules
              </Badge>
              <Badge className="bg-[#b5985b] text-white border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                {completedCount} Completed
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Modules List */}
      <div>
        <h2 className="text-xl font-semibold text-[#1e293b] mb-4">Course Modules</h2>

        {modules.length === 0 ? (
          <Card className="bg-white border border-[#e2e8f0]">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1e293b] mb-2">No Modules Yet</h3>
              <p className="text-sm text-[#64748b]">
                This course doesn&apos;t have any modules yet. Check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modules.map((module, index) => {
              const moduleProgress = getModuleProgress(module.id)
              const isCompleted = moduleProgress?.is_completed || false

              return (
                <Card
                  key={module.id}
                  className={`bg-white border shadow-sm transition-all ${
                    isCompleted ? 'border-green-200 bg-green-50/30' : 'border-[#e2e8f0]'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Module Number */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-[#003366]/10 text-[#003366]'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1e293b]">{module.title}</h3>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        {module.description && (
                          <p className="text-sm text-[#64748b] mb-2 line-clamp-2">
                            {module.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                          {module.file_name && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {module.file_name}
                            </span>
                          )}
                          {module.file_size && (
                            <span>{formatFileSize(module.file_size)}</span>
                          )}
                          {moduleProgress?.download_count && moduleProgress.download_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {moduleProgress.download_count} downloads
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {module.file_url && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(module)}
                              disabled={previewingId === module.id}
                              className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                            >
                              {previewingId === module.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(module)}
                              disabled={downloadingId === module.id}
                              className="bg-[#003366] hover:bg-[#002244] text-white"
                            >
                              {downloadingId === module.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </>
                              )}
                            </Button>
                          </>
                        )}
                        {!isCompleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkComplete(module.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
