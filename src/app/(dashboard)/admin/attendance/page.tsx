import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">
          Record and manage student attendance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a course and date to record attendance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
