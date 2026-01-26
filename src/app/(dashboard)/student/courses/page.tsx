'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  module_count: number
}

interface Enrollment {
  id: string
  course_id: string
  progress_percent: number
  status: string
  course: Course
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch all active courses with module count
      const { data: coursesData, error: coursesError } = await (supabase
        .from('courses') as any)
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          is_active,
          created_at,
          modules:modules(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (coursesError) throw coursesError

      // Transform to include module count
      const coursesWithCount = (coursesData || []).map((course: any) => ({
        ...course,
        module_count: course.modules?.[0]?.count || 0
      }))

      setCourses(coursesWithCount)

      // Fetch user's enrollments if logged in
      if (user) {
        const { data: enrollmentsData, error: enrollmentsError } = await (supabase
          .from('enrollments') as any)
          .select(`
            id,
            course_id,
            progress_percent,
            status,
            course:courses(
              id,
              title,
              description,
              thumbnail_url,
              is_active,
              created_at
            )
          `)
          .eq('student_id', user.id)
          .eq('status', 'active')

        if (!enrollmentsError && enrollmentsData) {
          // Get module counts for enrolled courses
          const enrichedEnrollments = await Promise.all(
            enrollmentsData.map(async (enrollment: any) => {
              const { count } = await (supabase
                .from('modules') as any)
                .select('*', { count: 'exact', head: true })
                .eq('course_id', enrollment.course_id)

              return {
                ...enrollment,
                course: {
                  ...enrollment.course,
                  module_count: count || 0
                }
              }
            })
          )
          setEnrollments(enrichedEnrollments)
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }

  const enrolledCourseIds = enrollments.map(e => e.course_id)

  const CourseCard = ({ course, enrollment }: { course: Course; enrollment?: Enrollment }) => (
    <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-[#003366] to-[#001a33] overflow-hidden">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-white/30" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#b5985b] text-white border-0">
            <FileText className="h-3 w-3 mr-1" />
            {course.module_count} modules
          </Badge>
        </div>
        {enrollment && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[#b5985b] transition-all"
              style={{ width: `${enrollment.progress_percent}%` }}
            />
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <h3 className="font-semibold text-lg text-[#1e293b] mb-2 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-[#64748b] mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>

        {enrollment && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#64748b] mb-1">
              <span>Progress</span>
              <span>{enrollment.progress_percent}%</span>
            </div>
            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#003366] rounded-full transition-all"
                style={{ width: `${enrollment.progress_percent}%` }}
              />
            </div>
          </div>
        )}

        <Link href={`/student/courses/${course.id}`}>
          <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white">
            {enrollment ? 'Continue Learning' : 'View Course'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Courses</h1>
        <p className="text-[#64748b]">
          Browse and access your learning materials
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-[#003366]/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e293b]">{courses.length}</p>
              <p className="text-sm text-[#64748b]">Available Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-[#b5985b]/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-[#b5985b]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e293b]">{enrollments.length}</p>
              <p className="text-sm text-[#64748b]">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e293b]">
                {courses.reduce((acc, c) => acc + c.module_count, 0)}
              </p>
              <p className="text-sm text-[#64748b]">Total Modules</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-courses">
        <TabsList className="bg-[#f1f5f9]">
          <TabsTrigger value="all-courses" className="data-[state=active]:bg-white data-[state=active]:text-[#003366]">
            All Courses
          </TabsTrigger>
          <TabsTrigger value="my-courses" className="data-[state=active]:bg-white data-[state=active]:text-[#003366]">
            My Courses ({enrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-courses" className="mt-6">
          {courses.length === 0 ? (
            <Card className="bg-white border border-[#e2e8f0] shadow-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1e293b] mb-2">No Courses Available</h3>
                <p className="text-sm text-[#64748b]">
                  Check back later for new courses!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const enrollment = enrollments.find(e => e.course_id === course.id)
                return (
                  <CourseCard key={course.id} course={course} enrollment={enrollment} />
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-courses" className="mt-6">
          {enrollments.length === 0 ? (
            <Card className="bg-white border border-[#e2e8f0] shadow-sm">
              <CardContent className="p-8 text-center">
                <GraduationCap className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1e293b] mb-2">No Enrolled Courses</h3>
                <p className="text-sm text-[#64748b] mb-4">
                  Start learning by viewing a course from the &quot;All Courses&quot; tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course as Course}
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
