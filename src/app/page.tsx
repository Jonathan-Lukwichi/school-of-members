import Link from 'next/link'
import { GraduationCap, BookOpen, Users, BarChart3, Award, Clock, CheckCircle, ArrowRight, Phone, Mail, MapPin, ChevronRight, Play, Star, Shield, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-radial" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Top Bar - University Style */}
      <div className="relative z-20 bg-[#0779bf] text-white py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">+27 12 000 0000</span>
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">info@schoolofmembers.com</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/student/login" className="hover:underline">Student Portal</Link>
              <span className="text-white/40">|</span>
              <Link href="/login" className="hover:underline">Staff Portal</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl sticky top-0">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0779bf] to-[#0e56b9] flex items-center justify-center shadow-lg shadow-[#0779bf]/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-tight">
                  School<span className="text-[#b5985b]">.</span>Members
                </span>
                <span className="text-xs text-zinc-500">Learning Management System</span>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="nav-academic">
                <Link href="#programs" className="nav-academic-item">Programs</Link>
                <Link href="#features" className="nav-academic-item">Features</Link>
                <Link href="#about" className="nav-academic-item">About</Link>
                <Link href="#contact" className="nav-academic-item">Contact</Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 font-medium">
                  Sign in
                </Button>
              </Link>
              <Link href="/student/register">
                <Button className="btn-academic rounded-lg px-5 font-semibold">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section - Academic Style */}
        <section className="hero-academic py-20 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b5985b]/10 border border-[#b5985b]/20 mb-6">
                  <Award className="h-4 w-4 text-[#b5985b]" />
                  <span className="text-sm text-[#b5985b] font-medium">Top Rated Learning Platform</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                  <span className="text-white">Experience Learning.</span>
                  <br />
                  <span className="text-white">Anywhere. </span>
                  <span className="bg-gradient-to-r from-[#0779bf] to-[#22d3ee] bg-clip-text text-transparent">Anytime.</span>
                </h1>

                <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-lg">
                  Join our community of dedicated learners. Access world-class courses, connect with expert instructors, and achieve your educational goals.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/student/register">
                    <Button size="lg" className="btn-academic rounded-lg px-8 py-6 text-base font-semibold w-full sm:w-auto">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="btn-academic-outline rounded-lg px-8 py-6 text-base font-semibold group">
                    <Play className="mr-2 h-5 w-5 group-hover:text-[#0779bf]" />
                    Watch Overview
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0779bf] to-[#0e56b9] border-2 border-[#0a0a0f] flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{String.fromCharCode(64 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <span>Trusted by 500+ students</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[#b5985b] text-[#b5985b]" />
                    ))}
                    <span className="ml-1">4.9</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="stat-card">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Pass Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Active Students</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Courses</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">25+</div>
                  <div className="stat-label">Expert Teachers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#0779bf] text-sm font-semibold uppercase tracking-wider">Our Programs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                Explore Our Courses
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Choose from a variety of programs designed to help you achieve your learning goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Program Card 1 */}
              <div className="course-card group">
                <div className="course-card-image">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0779bf] via-[#0e56b9] to-[#0a3d6e]" />
                  <div className="course-card-badge">Featured</div>
                  <div className="absolute bottom-4 left-4 z-10">
                    <BookOpen className="h-10 w-10 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#0779bf] transition-colors">
                    Foundation Programs
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Build strong fundamentals with our comprehensive foundation courses.
                  </p>
                  <Link href="/student/register" className="inline-flex items-center text-[#0779bf] text-sm font-medium hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Program Card 2 */}
              <div className="course-card group">
                <div className="course-card-image">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b5985b] via-[#a08548] to-[#7d6836]" />
                  <div className="course-card-badge">Popular</div>
                  <div className="absolute bottom-4 left-4 z-10">
                    <Target className="h-10 w-10 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#b5985b] transition-colors">
                    Advanced Studies
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Take your skills to the next level with advanced specialized courses.
                  </p>
                  <Link href="/student/register" className="inline-flex items-center text-[#b5985b] text-sm font-medium hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Program Card 3 */}
              <div className="course-card group">
                <div className="course-card-image">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee] via-[#06b6d4] to-[#0891b2]" />
                  <div className="course-card-badge">New</div>
                  <div className="absolute bottom-4 left-4 z-10">
                    <Zap className="h-10 w-10 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#22d3ee] transition-colors">
                    Professional Certification
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Earn recognized certificates to boost your professional profile.
                  </p>
                  <Link href="/student/register" className="inline-flex items-center text-[#22d3ee] text-sm font-medium hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-transparent via-[#0779bf]/5 to-transparent">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#0779bf] text-sm font-semibold uppercase tracking-wider">Platform Features</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                A comprehensive learning platform built for modern education
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Course Management</h3>
                  <p className="text-sm text-zinc-400">Access organized courses with downloadable modules</p>
                </div>
              </div>

              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Expert Teachers</h3>
                  <p className="text-sm text-zinc-400">Learn from dedicated instructors with personalized guidance</p>
                </div>
              </div>

              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Progress Tracking</h3>
                  <p className="text-sm text-zinc-400">Monitor your learning journey with detailed analytics</p>
                </div>
              </div>

              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Certificates</h3>
                  <p className="text-sm text-zinc-400">Earn recognized certificates upon course completion</p>
                </div>
              </div>

              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Flexible Learning</h3>
                  <p className="text-sm text-zinc-400">Study at your own pace, anytime and anywhere</p>
                </div>
              </div>

              <div className="quick-access-card">
                <div className="quick-access-icon">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Secure Platform</h3>
                  <p className="text-sm text-zinc-400">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[#b5985b] text-sm font-semibold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                What Our Students Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="testimonial-card">
                <p className="text-zinc-300 mb-6 pt-8 leading-relaxed">
                  The quality of instruction and the support from teachers has been exceptional. I highly recommend School of Members to anyone looking to advance their education.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0779bf] to-[#0e56b9] flex items-center justify-center text-white font-semibold">
                    TM
                  </div>
                  <div>
                    <div className="testimonial-name">Thabo Mokoena</div>
                    <div className="testimonial-role">Computer Science Student</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="text-zinc-300 mb-6 pt-8 leading-relaxed">
                  The platform is intuitive and the course content is well-structured. Being able to learn at my own pace while working has been a game-changer.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b5985b] to-[#a08548] flex items-center justify-center text-white font-semibold">
                    NP
                  </div>
                  <div>
                    <div className="testimonial-name">Naledi Phiri</div>
                    <div className="testimonial-role">Business Administration</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="text-zinc-300 mb-6 pt-8 leading-relaxed">
                  The certification I earned through School of Members helped me land my dream job. The practical skills I gained are invaluable in my career.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#06b6d4] flex items-center justify-center text-white font-semibold">
                    JN
                  </div>
                  <div>
                    <div className="testimonial-name">James Nkosi</div>
                    <div className="testimonial-role">Data Analytics Graduate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="welcome-banner">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h3>
                  <p className="text-zinc-400 mb-6">
                    Join our community of learners and take the first step towards achieving your educational goals. Registration is quick and easy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/student/register">
                      <Button className="btn-academic rounded-lg px-6 font-semibold">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="#contact">
                      <Button variant="outline" className="btn-academic-outline rounded-lg px-6 font-semibold">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0779bf]">24/7</div>
                    <div className="text-sm text-zinc-400">Learning Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#b5985b]">100%</div>
                    <div className="text-sm text-zinc-400">Online Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#22d3ee]">Free</div>
                    <div className="text-sm text-zinc-400">Registration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">5+</div>
                    <div className="text-sm text-zinc-400">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="#programs" className="footer-link">Programs</Link></li>
                  <li><Link href="#features" className="footer-link">Features</Link></li>
                  <li><Link href="#about" className="footer-link">About Us</Link></li>
                  <li><Link href="#contact" className="footer-link">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">For Students</h4>
                <ul className="space-y-2">
                  <li><Link href="/student/register" className="footer-link">Apply Now</Link></li>
                  <li><Link href="/student/login" className="footer-link">Student Portal</Link></li>
                  <li><Link href="#" className="footer-link">Course Catalog</Link></li>
                  <li><Link href="#" className="footer-link">FAQs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">For Staff</h4>
                <ul className="space-y-2">
                  <li><Link href="/login" className="footer-link">Staff Portal</Link></li>
                  <li><Link href="#" className="footer-link">Resources</Link></li>
                  <li><Link href="#" className="footer-link">Support</Link></li>
                </ul>
              </div>
              <div id="contact">
                <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Phone className="h-4 w-4 text-[#0779bf]" />
                    +27 12 000 0000
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Mail className="h-4 w-4 text-[#0779bf]" />
                    info@schoolofmembers.com
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400 text-sm">
                    <MapPin className="h-4 w-4 text-[#0779bf] mt-0.5" />
                    123 Education Street<br />Pretoria, South Africa
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-academic py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0779bf] to-[#0e56b9] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white block">School<span className="text-[#b5985b]">.</span>Members</span>
                <span className="text-xs text-zinc-500">Learning Management System</span>
              </div>
            </div>
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} School of Members. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="footer-link">Privacy Policy</Link>
              <Link href="#" className="footer-link">Terms of Use</Link>
              <Link href="#" className="footer-link">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
