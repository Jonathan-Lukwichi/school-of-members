import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Attendance</h1>
        <p className="text-[#64748b]">
          Record and manage student attendance.
        </p>
      </div>

      <Card className="bg-white border border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#64748b]">
            Select a course and date to record attendance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
