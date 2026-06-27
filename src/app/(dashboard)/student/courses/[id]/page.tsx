'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Eye, Download, Loader2, Languages } from 'lucide-react'
import { toast } from 'sonner'

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  language: 'en' | 'fr'
  file_name: string | null
}
interface Course {
  id: string
  title: string
  description: string | null
  modules: Module[]
}

export default function StudentCourseDetailPage() {
  const params = useParams()
  const courseId = params?.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [meRes, coursesRes] = await Promise.all([
          fetch('/api/student/me'),
          fetch('/api/student/courses'),
        ])
        if (meRes.ok) {
          const me = await meRes.json()
          if (me.student?.preferred_language === 'fr') setLang('fr')
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json()
          const found = (data.courses || []).find((c: Course) => c.id === courseId) || null
          setCourse(found)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId])

  // Which languages actually have chapters in this course
  const available = useMemo(() => {
    const set = new Set((course?.modules || []).map((m) => m.language))
    return { en: set.has('en'), fr: set.has('fr') }
  }, [course])

  // If the preferred language has no chapters, fall back to the one that does
  useEffect(() => {
    if (!course) return
    if (lang === 'en' && !available.en && available.fr) setLang('fr')
    if (lang === 'fr' && !available.fr && available.en) setLang('en')
  }, [course, available, lang])

  const modules = useMemo(
    () =>
      [...(course?.modules || [])]
        .filter((m) => m.language === lang)
        .sort((a, b) => a.order_index - b.order_index),
    [course, lang]
  )

  const openFile = async (moduleId: string, download: boolean) => {
    setBusyId(moduleId)
    try {
      const res = await fetch(`/api/student/modules/${moduleId}/file`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not open file')
      if (download) {
        const a = document.createElement('a')
        a.href = data.url
        a.download = data.fileName || 'chapter.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        window.open(data.url, '_blank', 'noopener,noreferrer')
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not open file')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading course…
      </div>
    )
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <Link href="/student/courses" className="inline-flex items-center gap-1 text-sm text-emerald hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-premium">
          Course not found or not available.
        </div>
      </div>
    )
  }

  const bothLanguages = available.en && available.fr

  return (
    <div className="space-y-6">
      <Link href="/student/courses" className="inline-flex items-center gap-1 text-sm text-emerald hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      <div className="rounded-2xl bg-ink p-6 text-white shadow-premium sm:p-8">
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/20 text-emerald">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-bold">{course.title}</h1>
        {course.description && <p className="mt-1 text-white/70">{course.description}</p>}
        <p className="mt-3 text-sm text-white/60">{modules.length} chapters</p>
      </div>

      {/* Language switch (only when both versions exist) */}
      {bothLanguages && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Languages className="h-4 w-4 text-emerald" /> Version:
          </span>
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(['en', 'fr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === l ? 'bg-emerald text-ink' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {modules.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-premium">
            No chapters in this version yet.
          </div>
        ) : (
          modules.map((m, i) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-premium"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald/10 font-semibold text-emerald">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground">{m.title}</h3>
                {m.description && <p className="truncate text-sm text-muted-foreground">{m.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!m.file_name || busyId === m.id}
                  onClick={() => openFile(m.id, false)}
                  className="gap-1.5 border-emerald/30 text-foreground hover:bg-emerald/5"
                >
                  {busyId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 text-emerald" />}
                  Read
                </Button>
                <Button
                  size="sm"
                  disabled={!m.file_name || busyId === m.id}
                  onClick={() => openFile(m.id, true)}
                  className="gap-1.5 bg-emerald-btn font-semibold text-ink shadow-emerald hover:brightness-105"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
