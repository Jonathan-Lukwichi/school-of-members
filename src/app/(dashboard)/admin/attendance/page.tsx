import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">
          Record and manage student attendance.
        </p>
      </div>

      <Card className="bg-card border border-border shadow-premium animate-reveal">
        <CardHeader>
          <CardTitle className="text-foreground">Attendance Records</CardTitle>
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
