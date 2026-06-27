'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, FileText, ArrowRight, Loader2, GraduationCap } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  moduleCount: number
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/student/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
          <GraduationCap className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground">Open a course to read and download its chapters.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading…
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-premium">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-emerald/50" />
          <p>No courses available yet. Please check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.id}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-premium transition-all hover:border-emerald/40 hover:shadow-emerald"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-emerald">
                {course.title}
              </h3>
              {course.description && (
                <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted-foreground">{course.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-emerald" /> {course.moduleCount} chapters
                </span>
                <ArrowRight className="h-4 w-4 text-emerald opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
