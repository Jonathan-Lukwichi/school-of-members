import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and statistics about your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border border-border shadow-premium animate-reveal">
          <CardHeader>
            <CardTitle className="text-foreground">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Chart will appear here when data is available.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-premium animate-reveal">
          <CardHeader>
            <CardTitle className="text-foreground">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Chart will appear here when data is available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
