import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, GraduationCap, Calendar, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <h1 className="text-4xl font-bold text-[#1e293b]">Dashboard</h1>
        <p className="text-[#64748b] mt-2">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Students Card */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Students</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#003366] flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">0</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[#22c55e]" />
              <p className="text-xs text-[#64748b]">Registered students</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Courses Card */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Active Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#b5985b] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">0</div>
            <div className="flex items-center gap-1 mt-1">
              <BookOpen className="h-3 w-3 text-[#b5985b]" />
              <p className="text-xs text-[#64748b]">Available courses</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Enrollments Card */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Enrollments</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#C8102E] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">0</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-[#003366]" />
              <p className="text-xs text-[#64748b]">Active enrollments</p>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate Card */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Attendance Rate</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-[#003366] flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">0%</div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-[#64748b]" />
              <p className="text-xs text-[#64748b]">This week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Registrations */}
        <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
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
        <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
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
