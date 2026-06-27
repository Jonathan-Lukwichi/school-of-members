'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { BookOpen, CheckCircle, Calendar, ArrowRight, Loader2, Sparkles, TrendingUp, Play } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

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
          <Loader2 className="h-10 w-10 animate-spin text-emerald" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <PageHeader
        greeting="Welcome back"
        greetingName={firstName}
        title="Hello,"
        subtitle="Continue your learning journey. You're making great progress!"
        accent="navy"
        icon={Sparkles}
        showBanner={true}
      />

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          subtitle="Active courses"
          icon={BookOpen}
          iconColor="navy"
          subtitleIcon={TrendingUp}
          subtitleIconColor="text-emerald"
        />

        <StatsCard
          title="Completed Modules"
          value={stats.completedModules}
          subtitle={`Out of ${stats.totalModules} total`}
          icon={CheckCircle}
          iconColor="gold"
          subtitleIcon={BookOpen}
          subtitleIconColor="text-emerald"
        />

        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          subtitle="Overall attendance"
          icon={Calendar}
          iconColor="red"
          subtitleIcon={Calendar}
          subtitleIconColor="text-emerald"
        />
      </div>

      {/* Continue Learning */}
      <Card className="bg-card border border-border shadow-premium overflow-hidden relative animate-reveal">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald to-emerald-light" />
        <CardHeader>
          <CardTitle className="font-display text-foreground flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 rounded-2xl bg-mint flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-emerald" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                You haven&apos;t enrolled in any courses yet. Start your learning journey today!
              </p>
              <Link href="/student/courses">
                <Button className="bg-emerald-btn text-white px-8 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2">
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
                  className="block group focus-visible:outline-none"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-mint-soft hover:bg-card hover:shadow-emerald hover:border-emerald/40 transition-all group-focus-visible:ring-2 group-focus-visible:ring-emerald group-focus-visible:ring-offset-2">
                    <div className="h-14 w-14 rounded-xl bg-emerald flex items-center justify-center">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate group-hover:text-emerald transition-colors">
                        {enrollment.course?.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-2 bg-mint rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald rounded-full transition-all duration-700 ease-premium"
                            style={{ width: `${enrollment.progress_percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-emerald min-w-[3rem] text-right">
                          {enrollment.progress_percent}%
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center group-hover:bg-emerald/20 transition-colors">
                      <Play className="h-5 w-5 text-emerald" />
                    </div>
                  </div>
                </Link>
              ))}
              {enrollments.length > 3 && (
                <Link href="/student/courses" className="block">
                  <Button variant="outline" className="w-full border-emerald/40 text-emerald hover:bg-mint hover:border-emerald/60 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2">
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
  )
}
