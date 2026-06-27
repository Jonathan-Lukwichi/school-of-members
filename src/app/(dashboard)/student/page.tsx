'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, ArrowRight, Loader2, Sparkles, GraduationCap, ClipboardCheck, Eye } from 'lucide-react'

interface Module { id: string; title: string }
interface Course {
  id: string
  title: string
  description: string | null
  modules: Module[]
  moduleCount: number
}

export default function StudentDashboard() {
  const [name, setName] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const [meRes, coursesRes] = await Promise.all([
          fetch('/api/student/me'),
          fetch('/api/student/courses'),
        ])
        if (meRes.ok) {
          const me = await meRes.json()
          setName(me.student?.full_name || '')
          setIsPreview(!!me.isAdminPreview)
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data.courses || [])
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const firstName = name ? name.split(' ')[0] : 'there'
  const totalChapters = courses.reduce((sum, c) => sum + c.moduleCount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading your portal…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Admin preview banner */}
      {isPreview && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald/30 bg-mint px-4 py-3 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-emerald-deep">
            <Eye className="h-4 w-4" /> Admin preview — this is exactly what a student sees.
          </span>
          <Link href="/admin" className="ml-auto inline-flex items-center gap-1 font-medium text-emerald hover:underline">
            Exit to admin <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Greeting */}
      <div className="overflow-hidden rounded-2xl bg-emerald-btn p-6 text-ink shadow-emerald sm:p-8">
        <div className="flex items-center gap-2 text-sm font-medium text-ink/80">
          <Sparkles className="h-4 w-4" /> Welcome back
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">Hello, {firstName}!</h1>
        <p className="mt-1 text-ink/80">Continue your School of Members journey.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-premium">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-foreground">{courses.length}</p>
            <p className="text-sm text-muted-foreground">Courses available</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-premium">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
            <BookOpen className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalChapters}</p>
            <p className="text-sm text-muted-foreground">Chapters to explore</p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Your Courses</h2>
          <Link href="/student/courses" className="inline-flex items-center gap-1 text-sm font-medium text-emerald hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-premium">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-emerald/50" />
            <p>No courses available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-premium transition-all hover:border-emerald/40 hover:shadow-emerald"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-emerald">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                )}
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-emerald" /> {course.moduleCount} chapters
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Attendance shortcut */}
      <Link
        href="/attendance"
        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-premium transition-all hover:border-emerald/40"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
          <ClipboardCheck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Submit session attendance</p>
          <p className="text-sm text-muted-foreground">Record the chapters you covered and your key takeaways.</p>
        </div>
        <ArrowRight className="h-5 w-5 text-emerald" />
      </Link>
    </div>
  )
}
