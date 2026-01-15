import Link from 'next/link'
import { GraduationCap, BookOpen, Users, BarChart3, Award, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0118] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <GraduationCap className="h-10 w-10 text-purple-400" />
              <div className="absolute inset-0 blur-xl bg-purple-500/40" />
            </div>
            <span className="text-2xl font-bold text-gradient">School of Members</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-purple-500/20 font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/student/register">
              <Button className="btn-gradient font-semibold px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">The Future of Learning is Here</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Empower Your</span>
            <br />
            <span className="text-gradient">Learning Journey</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A comprehensive Learning Management System designed to help you track progress,
            manage courses, and achieve your educational goals with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/student/register">
              <Button size="lg" className="btn-gradient font-semibold px-8 py-6 text-lg group">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-500 font-semibold px-8 py-6 text-lg transition-all">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-1">500+</div>
              <div className="text-slate-400">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-1">50+</div>
              <div className="text-slate-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-1">95%</div>
              <div className="text-slate-400">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {/* Feature 1 */}
          <div className="group glass rounded-2xl p-8 hover-lift hover-glow-purple">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Course Management</h3>
            <p className="text-slate-400 leading-relaxed">
              Access organized courses with downloadable modules and track your progress in real-time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group glass rounded-2xl p-8 hover-lift hover-glow-cyan">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Attendance Tracking</h3>
            <p className="text-slate-400 leading-relaxed">
              Monitor your attendance records and stay on top of your commitments effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group glass rounded-2xl p-8 hover-lift hover-glow-purple">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Progress Analytics</h3>
            <p className="text-slate-400 leading-relaxed">
              View detailed analytics and insights about your learning journey and achievements.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient">School of Members?</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience a modern learning platform designed with your success in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-xl p-6 text-center hover-lift">
              <Award className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Certified Courses</h4>
              <p className="text-sm text-slate-400">Earn recognized certificates</p>
            </div>
            <div className="glass rounded-xl p-6 text-center hover-lift">
              <Clock className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Learn at Your Pace</h4>
              <p className="text-sm text-slate-400">Flexible learning schedule</p>
            </div>
            <div className="glass rounded-xl p-6 text-center hover-lift">
              <Users className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Expert Teachers</h4>
              <p className="text-sm text-slate-400">Learn from the best</p>
            </div>
            <div className="glass rounded-xl p-6 text-center hover-lift">
              <CheckCircle className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Track Progress</h4>
              <p className="text-sm text-slate-400">Monitor your achievements</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-12 mt-20">
        <div className="border-t border-purple-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-purple-400" />
              <span className="font-semibold text-gradient">School of Members</span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} School of Members. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                Sign In
              </Link>
              <Link href="/student/register" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
