import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Analytics</h1>
        <p className="text-[#64748b]">
          View insights and statistics about your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1e293b]">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-sm text-[#64748b]">
              Chart will appear here when data is available.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1e293b]">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-sm text-[#64748b]">
              Chart will appear here when data is available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
