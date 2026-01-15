'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, CheckCircle, Calendar, ArrowRight, Loader2, Sparkles, TrendingUp, Play } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { WelcomeOverlay } from '@/components/shared/welcome-overlay'

interface Profile {
  full_name: string
  email: string
}

interface Enrollment {
  id: string
  progress_percent: number
  course: {
    id: string
    title: string
    description: string | null
  }
}

interface Stats {
  enrolledCourses: number
  completedModules: number
  totalModules: number
  attendanceRate: number
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [stats, setStats] = useState<Stats>({
    enrolledCourses: 0,
    completedModules: 0,
    totalModules: 0,
    attendanceRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Fetch enrollments with course details
      const { data: enrollmentsData } = await (supabase
        .from('enrollments') as any)
        .select(`
          id,
          progress_percent,
          course:courses(id, title, description)
        `)
        .eq('student_id', user.id)
        .eq('status', 'active')

      setEnrollments((enrollmentsData || []) as Enrollment[])

      // Fetch completed modules count
      const { count: completedCount } = await supabase
        .from('module_progress')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('is_completed', true)

      // Fetch total modules for enrolled courses
      let totalModulesCount = 0
      if (enrollmentsData && enrollmentsData.length > 0) {
        const courseIds = (enrollmentsData as Enrollment[]).map((e: Enrollment) => e.course?.id).filter(Boolean)
        const { count } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds)
        totalModulesCount = count || 0
      }

      // Fetch attendance rate
      const { data: attendanceData } = await (supabase
        .from('attendance') as any)
        .select('status')
        .eq('student_id', user.id)

      let attendanceRate = 0
      if (attendanceData && attendanceData.length > 0) {
        const presentCount = attendanceData.filter((a: { status: string }) => a.status === 'present' || a.status === 'late').length
        attendanceRate = Math.round((presentCount / attendanceData.length) * 100)
      }

      setStats({
        enrolledCourses: enrollmentsData?.length || 0,
        completedModules: completedCount || 0,
        totalModules: totalModulesCount,
        attendanceRate
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <div className="absolute inset-0 blur-xl bg-purple-500/30" />
          </div>
          <p className="text-slate-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {profile && (
        <WelcomeOverlay
          userName={profile.full_name || 'Student'}
          storageKey="som_student_welcome"
        />
      )}

      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl glass border-purple-500/20 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
              <Sparkles className="h-4 w-4" />
              Welcome back
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Hello, <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'Student'}!</span>
            </h1>
            <p className="text-slate-400 max-w-md">
              Continue your learning journey. You&apos;re making great progress!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Enrolled Courses */}
          <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Enrolled Courses</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.enrolledCourses}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-purple-400" />
                <p className="text-xs text-purple-400">Active courses</p>
              </div>
            </CardContent>
          </Card>

          {/* Completed Modules */}
          <Card className="glass border-cyan-500/20 hover-lift hover-glow-cyan overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Completed Modules</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.completedModules}</div>
              <div className="flex items-center gap-1 mt-1">
                <BookOpen className="h-3 w-3 text-cyan-400" />
                <p className="text-xs text-cyan-400">Out of {stats.totalModules} total</p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Rate */}
          <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Attendance Rate</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.attendanceRate}%</div>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3 text-emerald-400" />
                <p className="text-xs text-emerald-400">Overall attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <Card className="glass border-purple-500/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-purple-400" />
                  </div>
                  <div className="absolute inset-0 blur-xl bg-purple-500/20" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
                <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                  You haven&apos;t enrolled in any courses yet. Start your learning journey today!
                </p>
                <Link href="/student/courses">
                  <Button className="btn-gradient px-8">
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/student/courses/${enrollment.course?.id}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate group-hover:text-gradient transition-colors">
                          {enrollment.course?.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-cyan-400 min-w-[3rem] text-right">
                            {enrollment.progress_percent}%
                          </span>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                        <Play className="h-5 w-5 text-cyan-400" />
                      </div>
                    </div>
                  </Link>
                ))}
                {enrollments.length > 3 && (
                  <Link href="/student/courses" className="block">
                    <Button variant="outline" className="w-full border-purple-500/30 text-slate-300 hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50">
                      View All Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
