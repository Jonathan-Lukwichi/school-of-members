'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { DownloadableQR } from '@/components/admin/downloadable-qr'
import { exportAttendanceToExcel } from '@/lib/export-utils'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, Download, Loader2, Calendar, Inbox } from 'lucide-react'

interface AttendanceRecord {
  id: string
  full_name: string
  session_date: string
  chapters_done: string
  takeaway_1: string
  takeaway_2: string | null
  takeaway_3: string | null
  created_at: string
}

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await (supabase.from('attendance_records') as any)
          .select('*')
          .order('session_date', { ascending: false })
          .order('created_at', { ascending: false })
        setRecords((data || []) as AttendanceRecord[])
      } catch (e) {
        console.error('Failed to load attendance records:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [supabase])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
            <ClipboardCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Attendance Records</h1>
            <p className="text-sm text-muted-foreground">
              Session attendance submitted by students. Collect with the QR, then export to Excel.
            </p>
          </div>
        </div>
        <Button
          onClick={() => exportAttendanceToExcel(records, 'attendance')}
          disabled={records.length === 0}
          className="gap-2 bg-emerald-btn font-semibold text-ink shadow-emerald hover:brightness-105"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* Records table */}
        <div className="min-w-0 rounded-2xl border border-border bg-card shadow-premium">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">
              Submissions {!loading && <span className="text-muted-foreground">({records.length})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 text-emerald/50" />
              <p>No attendance submitted yet.</p>
              <p className="text-sm">Share the QR code at your next session.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Session</th>
                    <th className="px-5 py-3 font-medium">Chapters</th>
                    <th className="px-5 py-3 font-medium">Key Takeaways</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 align-top hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium text-foreground">{r.full_name}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-emerald" />
                          {r.session_date}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{r.chapters_done}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        <ul className="list-inside list-disc space-y-0.5">
                          {[r.takeaway_1, r.takeaway_2, r.takeaway_3].filter(Boolean).map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR to collect attendance */}
        <div className="lg:w-[26rem]">
          <DownloadableQR
            path="/attendance"
            title="Attendance QR Code"
            subtitle="Students scan this at a session to submit attendance."
            posterHeading="SCAN FOR ATTENDANCE"
            fileBase="attendance-qr"
          />
        </div>
      </div>
    </div>
  )
}
