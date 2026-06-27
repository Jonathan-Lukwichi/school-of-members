'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2, User, Calendar, BookOpen, Lightbulb, Info, ArrowLeft } from 'lucide-react'

const CHAPTERS = Array.from({ length: 12 }, (_, i) => `Chapter ${i + 1}`)
const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AttendancePage() {
  const [fullName, setFullName] = useState('')
  const [sessionDate, setSessionDate] = useState(todayISO())
  const [chapters, setChapters] = useState<string[]>([])
  const [t1, setT1] = useState('')
  const [t2, setT2] = useState('')
  const [t3, setT3] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const toggleChapter = (ch: string) =>
    setChapters((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!sessionDate) return setError('Please select the session date.')
    if (chapters.length === 0) return setError('Please select at least one chapter covered.')
    if (!t1.trim()) return setError('Please share at least your first key takeaway.')

    setLoading(true)
    try {
      const res = await fetch('/api/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          sessionDate,
          chaptersDone: chapters.join(', '),
          takeaway1: t1.trim(),
          takeaway2: t2.trim() || null,
          takeaway3: t3.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 hover:border-emerald/40 focus:border-emerald/60 focus:ring-2 focus:ring-emerald/30'

  return (
    <div className="min-h-screen bg-mint/40 px-4 py-10">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full ring-2 ring-emerald/30">
            <Image src="/images/logo-fresco.png" alt="School of Members" fill className="object-cover" priority />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Session Attendance</h1>
          <p className="text-sm text-muted-foreground">Ramah Full Gospel Church Pretoria</p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-premium">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-emerald">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Attendance recorded!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you, {fullName.split(' ')[0]}. Your attendance and reflections have been submitted.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
            <div className="h-1.5 -mx-6 -mt-6 mb-2 rounded-t-2xl bg-emerald-btn sm:-mx-8 sm:-mt-8" />

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                <Info className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Full name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-foreground">
                <User className="h-4 w-4 text-emerald" /> Full Name <span className="text-emerald">*</span>
              </Label>
              <input
                className={inputCls}
                placeholder="Same name you used at registration"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Session date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="h-4 w-4 text-emerald" /> Date of Session <span className="text-emerald">*</span>
              </Label>
              <input
                type="date"
                className={inputCls}
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Chapters */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-foreground">
                <BookOpen className="h-4 w-4 text-emerald" /> Chapters Covered <span className="text-emerald">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {CHAPTERS.map((ch) => {
                  const active = chapters.includes(ch)
                  return (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChapter(ch)}
                      disabled={loading}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                        active
                          ? 'border-emerald bg-emerald/10 text-emerald-dark'
                          : 'border-border bg-white text-muted-foreground hover:border-emerald/40'
                      }`}
                    >
                      {ch.replace('Chapter ', 'Ch ')}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Takeaways */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-foreground">
                <Lightbulb className="h-4 w-4 text-emerald" /> 3 Key Things You Got From This Session
              </Label>
              <input className={inputCls} placeholder="1. First key takeaway *" value={t1} onChange={(e) => setT1(e.target.value)} disabled={loading} />
              <input className={inputCls} placeholder="2. Second key takeaway" value={t2} onChange={(e) => setT2(e.target.value)} disabled={loading} />
              <input className={inputCls} placeholder="3. Third key takeaway" value={t3} onChange={(e) => setT3(e.target.value)} disabled={loading} />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald hover:brightness-105"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting…
                </>
              ) : (
                'Submit Attendance'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
