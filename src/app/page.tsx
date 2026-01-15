import Link from 'next/link'
import { GraduationCap, BookOpen, Users, BarChart3, Award, Clock, CheckCircle, ArrowRight, Github, Linkedin, Twitter, Plus, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Radial gradient at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-radial" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Glow orbs */}
        <div className="glow-orb-cyan top-20 -left-40" />
        <div className="glow-orb-blue top-40 -right-40" />
      </div>

      {/* Header - Bolt Style */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                school<span className="text-gradient-cyan">.</span>members
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                Features
              </Link>
              <Link href="#courses" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                Courses
              </Link>
              <Link href="#about" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                About
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Social Icons */}
              <div className="hidden md:flex items-center gap-1 mr-2">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
              </div>

              <Link href="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 font-medium">
                  Sign in
                </Button>
              </Link>
              <Link href="/student/register">
                <Button className="btn-primary rounded-lg px-5 font-semibold">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Bolt Style */}
      <main className="relative z-10">
        <div className="container mx-auto px-6 pt-16 pb-32">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-10">
            <Link href="#features" className="group">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:border-cyan-500/30 transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <GraduationCap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-zinc-300">Introducing School of Members</span>
                <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>

          {/* Main Heading - Bolt Style */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span className="text-white">What will you </span>
              <span className="text-gradient-animate italic">learn</span>
              <span className="text-white"> today?</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Create your learning path by enrolling in courses. Track progress, connect with teachers, and achieve your educational goals.
            </p>
          </div>

          {/* Chat-like Input Box - Bolt Style */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="glass rounded-2xl p-2">
              <div className="flex items-center gap-3 bg-[#1e1e2e] rounded-xl p-4">
                <input
                  type="text"
                  placeholder="I want to learn..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
                  readOnly
                />
                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-sm">Explore</span>
                  </div>
                  <Link href="/student/register">
                    <button className="btn-primary rounded-lg px-5 py-2.5 font-semibold flex items-center gap-2">
                      Start now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-32">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
              <div className="text-zinc-500 text-sm">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">50+</div>
              <div className="text-zinc-500 text-sm">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">95%</div>
              <div className="text-zinc-500 text-sm">Completion Rate</div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything you need to <span className="text-gradient">succeed</span>
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                A comprehensive learning platform built for modern education
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Feature 1 */}
              <div className="group card-bolt p-8 hover-lift hover-glow-cyan">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Course Management</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Access organized courses with downloadable modules and track your progress in real-time.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group card-bolt p-8 hover-lift hover-glow-blue">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Teacher Assignment</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Get assigned to dedicated teachers for personalized guidance and support throughout your journey.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group card-bolt p-8 hover-lift hover-glow-cyan">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Progress Analytics</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  View detailed analytics and insights about your learning journey and achievements.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why choose <span className="text-gradient">School of Members</span>?
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Join thousands of students achieving their learning goals
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-6 text-center hover-lift">
                <Award className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white text-sm mb-1">Certified Courses</h4>
                <p className="text-xs text-zinc-500">Earn certificates</p>
              </div>
              <div className="glass rounded-xl p-6 text-center hover-lift">
                <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white text-sm mb-1">Learn Anytime</h4>
                <p className="text-xs text-zinc-500">Flexible schedule</p>
              </div>
              <div className="glass rounded-xl p-6 text-center hover-lift">
                <Users className="h-8 w-8 text-violet-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white text-sm mb-1">Expert Teachers</h4>
                <p className="text-xs text-zinc-500">Learn from the best</p>
              </div>
              <div className="glass rounded-xl p-6 text-center hover-lift">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white text-sm mb-1">Track Progress</h4>
                <p className="text-xs text-zinc-500">Monitor achievements</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass rounded-2xl p-12 max-w-3xl mx-auto card-glow-cyan">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Join our community of learners and begin your educational journey today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/student/register">
                  <Button size="lg" className="btn-primary rounded-lg px-8 py-6 text-lg font-semibold">
                    Create free account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="btn-secondary rounded-lg px-8 py-6 text-lg font-semibold">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Arc Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent rounded-[100%] translate-y-1/2" />
          </div>
          {/* Arc line */}
          <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%]" viewBox="0 0 1200 200" fill="none">
            <path
              d="M0 200 Q600 0 1200 200"
              stroke="url(#arc-gradient)"
              strokeWidth="1"
              fill="none"
            />
            <defs>
              <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="rgba(34, 211, 238, 0.3)" />
                <stop offset="50%" stopColor="rgba(34, 211, 238, 0.5)" />
                <stop offset="70%" stopColor="rgba(34, 211, 238, 0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">
                school<span className="text-cyan-400">.</span>members
              </span>
            </div>
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} School of Members. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/student/register" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
