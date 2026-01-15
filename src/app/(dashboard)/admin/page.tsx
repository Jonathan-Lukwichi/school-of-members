import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, GraduationCap, Calendar, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Students Card */}
        <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Students</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <p className="text-xs text-emerald-400">Registered students</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Courses Card */}
        <Card className="glass border-cyan-500/20 hover-lift hover-glow-cyan overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Courses</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0</div>
            <div className="flex items-center gap-1 mt-1">
              <BookOpen className="h-3 w-3 text-cyan-400" />
              <p className="text-xs text-cyan-400">Available courses</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Enrollments Card */}
        <Card className="glass border-purple-500/20 hover-lift hover-glow-purple overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Enrollments</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-purple-400" />
              <p className="text-xs text-purple-400">Active enrollments</p>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate Card */}
        <Card className="glass border-cyan-500/20 hover-lift hover-glow-cyan overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Attendance Rate</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0%</div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <p className="text-xs text-slate-400">This week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Registrations */}
        <Card className="glass border-purple-500/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400">
                No recent registrations yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                New students will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="glass border-cyan-500/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-cyan-400" />
              </div>
              <p className="text-sm text-slate-400">
                No recent enrollments yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Course enrollments will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="glass border-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient">0</div>
              <p className="text-xs text-slate-400 mt-1">Teachers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient">0</div>
              <p className="text-xs text-slate-400 mt-1">Modules</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient">0</div>
              <p className="text-xs text-slate-400 mt-1">Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient">0%</div>
              <p className="text-xs text-slate-400 mt-1">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
