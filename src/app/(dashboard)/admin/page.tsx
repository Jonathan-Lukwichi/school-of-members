import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, BookOpen, GraduationCap, Calendar, TrendingUp, Clock, ArrowUpRight, Shield } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header Banner */}
      <PageHeader
        greeting="Admin Portal"
        greetingName="Admin"
        title="Welcome,"
        subtitle="Here's an overview of your platform. Manage students, courses, and track performance."
        accent="red"
        icon={Shield}
        showBanner={true}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={0}
          subtitle="Registered students"
          icon={Users}
          iconColor="navy"
          subtitleIcon={TrendingUp}
          subtitleIconColor="text-[#22c55e]"
        />

        <StatsCard
          title="Active Courses"
          value={0}
          subtitle="Available courses"
          icon={BookOpen}
          iconColor="gold"
          subtitleIcon={BookOpen}
          subtitleIconColor="text-[#b5985b]"
        />

        <StatsCard
          title="Total Enrollments"
          value={0}
          subtitle="Active enrollments"
          icon={GraduationCap}
          iconColor="red"
          subtitleIcon={ArrowUpRight}
          subtitleIconColor="text-[#003366]"
        />

        <StatsCard
          title="Attendance Rate"
          value="0%"
          subtitle="This week"
          icon={Calendar}
          iconColor="navy"
          subtitleIcon={Clock}
          subtitleIconColor="text-[#64748b]"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Registrations */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003366] to-[#b5985b]" />
          <CardHeader>
            <CardTitle className="text-[#1e293b] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#003366] animate-pulse" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#003366]/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-[#003366]" />
              </div>
              <p className="text-sm text-[#64748b]">
                No recent registrations yet.
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                New students will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b5985b] to-[#C8102E]" />
          <CardHeader>
            <CardTitle className="text-[#1e293b] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#b5985b] animate-pulse" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#b5985b]/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-[#b5985b]" />
              </div>
              <p className="text-sm text-[#64748b]">
                No recent enrollments yet.
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Course enrollments will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#003366]">0</div>
              <p className="text-xs text-[#64748b] mt-1">Teachers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#003366]">0</div>
              <p className="text-xs text-[#64748b] mt-1">Modules</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#003366]">0</div>
              <p className="text-xs text-[#64748b] mt-1">Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#003366]">0%</div>
              <p className="text-xs text-[#64748b] mt-1">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
