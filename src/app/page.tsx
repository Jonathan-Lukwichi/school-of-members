'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Heart,
  HandHelping,
  UsersRound,
  Menu,
  X
} from 'lucide-react'

// Hero slides data - Using uploaded church photos
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/603893843_863136529756625_3601433323555904839_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(0,51,102,0.65) 0%, rgba(0,64,128,0.7) 100%)',
    title: 'Welcome to the School of Members',
    subtitle: 'A Year of Growing Faith',
    description: 'Join our spiritual community and grow in your faith with Ramah Full Gospel Church Pretoria',
  },
  {
    id: 2,
    image: '/images/hero/605616953_863675026369442_6652154226306859322_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(200,16,46,0.65) 0%, rgba(160,13,37,0.7) 100%)',
    title: 'Grow • Serve • Belong',
    subtitle: 'Our Three Foundational Pillars',
    description: 'Develop your faith, use your talents in service to the community, and become part of the spiritual family',
  },
  {
    id: 3,
    image: '/images/hero/608702732_865582319512046_5812417327465441922_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(181,152,91,0.65) 0%, rgba(138,115,68,0.7) 100%)',
    title: 'Complete Training Program',
    subtitle: '12 Chapters of Spiritual Growth',
    description: 'A structured program to understand the foundations of our community under the direction of Apostle Narcisse Majila',
  },
]

// Programme cards data - Based on Syllabus Chapters with church photos
const programmes = [
  {
    id: 1,
    title: 'Foundations of Membership',
    image: '/images/hero/603907220_863136993089912_1924723922976510063_n.jpg',
    overlay: 'linear-gradient(to top, rgba(0,51,102,0.9) 0%, rgba(0,51,102,0.3) 100%)',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Pastor-Member Relationship',
    image: '/images/hero/605209775_863138459756432_5544717009163373141_n.jpg',
    overlay: 'linear-gradient(to top, rgba(200,16,46,0.9) 0%, rgba(200,16,46,0.3) 100%)',
    icon: GraduationCap,
  },
  {
    id: 3,
    title: 'Certification & Graduation',
    image: '/images/hero/605633574_863139219756356_2557880040851016723_n.jpg',
    overlay: 'linear-gradient(to top, rgba(181,152,91,0.9) 0%, rgba(181,152,91,0.3) 100%)',
    icon: Award,
  },
  {
    id: 4,
    title: 'Community Life & Service',
    image: '/images/hero/606051694_863676573035954_803516800744340136_n.jpg',
    overlay: 'linear-gradient(to top, rgba(14,165,233,0.9) 0%, rgba(14,165,233,0.3) 100%)',
    icon: UsersRound,
  },
]

// News articles data - with church photos
const newsArticles = [
  {
    id: 1,
    date: 'January 15, 2026',
    title: 'Registration Open for 2026 Session',
    excerpt: 'Registration for the new School of Members session is now open. Join us for a year of spiritual growth and development.',
    image: '/images/hero/615069170_870723538997924_4168573880654188734_n.jpg',
    overlay: 'linear-gradient(to top, rgba(0,51,102,0.85) 0%, rgba(0,51,102,0.4) 100%)',
  },
  {
    id: 2,
    date: 'January 10, 2026',
    title: 'Annual Spiritual Retreat',
    excerpt: 'Our annual spiritual retreat will take place next month. A unique opportunity to strengthen your faith and connection with God.',
    image: '/images/hero/608702732_865582319512046_5812417327465441922_n.jpg',
    overlay: 'linear-gradient(to top, rgba(200,16,46,0.85) 0%, rgba(200,16,46,0.4) 100%)',
  },
  {
    id: 3,
    date: 'January 5, 2026',
    title: 'Graduate Testimonies',
    excerpt: 'Discover inspiring testimonies from our alumni and how the School of Members transformed their spiritual lives.',
    image: '/images/hero/605730001_863139043089707_7171139442108095605_n.jpg',
    overlay: 'linear-gradient(to top, rgba(181,152,91,0.85) 0%, rgba(181,152,91,0.4) 100%)',
  },
  {
    id: 4,
    date: 'January 1, 2026',
    title: 'New Year Message',
    excerpt: 'Apostle Narcisse Majila shares his message of hope and blessing for this new year with the congregation.',
    image: '/images/hero/605913088_863138966423048_422744223419916850_n.jpg',
    overlay: 'linear-gradient(to top, rgba(14,165,233,0.85) 0%, rgba(14,165,233,0.4) 100%)',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="header-up">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#003366]/20 shadow-md flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#003366] block leading-tight">
                  School of Members
                </span>
                <span className="hidden sm:block text-xs text-gray-500">Ramah Full Gospel Church Pretoria</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="#" className="nav-up-item active">Home</Link>
              <Link href="#about" className="nav-up-item">About</Link>
              <Link href="#contact" className="nav-up-item">Contact</Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#003366]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <Link href="#" className="block text-[#003366] font-medium">Home</Link>
              <Link href="#about" className="block text-gray-600">About</Link>
              <Link href="#contact" className="block text-gray-600">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Carousel */}
        <section className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `${slide.overlay}, url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#003366', // Fallback color while image loads
              }}
            >
              <div className="hero-slide-content">
                <p className="text-lg mb-2 opacity-90">{slide.subtitle}</p>
                <h1 className="hero-slide-title">{slide.title}</h1>
                <p className="hero-slide-subtitle">{slide.description}</p>
                <Link href="/student/register" className="btn-up-primary">
                  Learn More <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="hero-arrow hero-arrow-left">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={nextSlide} className="hero-arrow hero-arrow-right">
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Programme Cards */}
        <section id="programmes" className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programmes.map((programme) => {
                const Icon = programme.icon
                return (
                  <Link key={programme.id} href="/student/courses" className="programme-card group">
                    <div
                      className="programme-card-image"
                      style={{
                        backgroundImage: `${programme.overlay}, url(${programme.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white/30 group-hover:text-white/50 transition-all duration-300" />
                      </div>
                    </div>
                    <div className="programme-card-label">
                      {programme.title}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* About Section - Three Pillars */}
        <section id="about" className="about-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                About the School of Members
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Welcome to all who have chosen to make Ramah your spiritual home.
                The School of Members is your guide to understanding the foundations of our community
                under the direction of Apostle Narcisse Majila.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Grow */}
              <div className="about-pillar">
                <div className="about-pillar-icon">
                  <Heart className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title">Grow</h3>
                <p className="about-pillar-text">
                  Develop your faith through teachings and the daily practice of the Word of God.
                </p>
              </div>

              {/* Serve */}
              <div className="about-pillar">
                <div className="about-pillar-icon" style={{ background: '#C8102E' }}>
                  <HandHelping className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title" style={{ color: '#C8102E' }}>Serve</h3>
                <p className="about-pillar-text">
                  Put your talents to work in service to the community and to God with dedication and humility.
                </p>
              </div>

              {/* Belong */}
              <div className="about-pillar">
                <div className="about-pillar-icon" style={{ background: '#b5985b' }}>
                  <UsersRound className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title" style={{ color: '#b5985b' }}>Belong</h3>
                <p className="about-pillar-text">
                  Fully integrate into the spiritual family and build strong bonds with the community.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-16 text-center">
              <blockquote className="text-xl italic text-gray-600 max-w-2xl mx-auto">
                "True faith always walks hand in hand with obedience."
              </blockquote>
              <p className="mt-4 text-[#003366] font-semibold">
                — Pastoral Leadership, Ramah Full Gospel Church
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="stats-bar">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Chapters</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Teachers</div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="campus" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#003366]">
                  News & Events
                </h2>
                <p className="text-gray-600 mt-2">
                  Stay informed about the latest news from our community
                </p>
              </div>
              <Link href="#" className="btn-up-outline hidden md:inline-flex">
                View All News
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsArticles.map((article) => (
                <article key={article.id} className="news-card group">
                  <div
                    className="news-card-image"
                    style={{
                      backgroundImage: `${article.overlay}, url(${article.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="news-card-content">
                    <p className="news-card-date">{article.date}</p>
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-excerpt">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="#" className="btn-up-outline">
                View All News
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-4">
                    Ready to Start Your Spiritual Journey?
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Join our learning community and take the first step towards
                    achieving your spiritual goals. Registration is quick and easy.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/student/register" className="btn-up-secondary">
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <Link href="#contact" className="btn-up-outline">
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Clock className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#003366]">24/7</div>
                    <div className="text-sm text-gray-600">Online Access</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <BookOpen className="h-8 w-8 text-[#C8102E] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#C8102E]">100%</div>
                    <div className="text-sm text-gray-600">Online Courses</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Award className="h-8 w-8 text-[#b5985b] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#b5985b]">Free</div>
                    <div className="text-sm text-gray-600">Registration</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Users className="h-8 w-8 text-[#0ea5e9] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#0ea5e9]">5+</div>
                    <div className="text-sm text-gray-600">Years of Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-up">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            {/* Logo Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                  <Image
                    src="/images/logo-fresco.png"
                    alt="School of Members Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-white block">School of Members</span>
                  <span className="text-xs text-white/60">Ramah Full Gospel Church</span>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Make today count. Grow in your faith with our spiritual community under the leadership of Apostle Narcisse Majila.
              </p>
            </div>

            {/* Core Functions */}
            <div>
              <h4 className="footer-up-title">Core Functions</h4>
              <ul className="footer-up-links">
                <li><Link href="/student/courses">Study</Link></li>
                <li><Link href="#">Teaching</Link></li>
                <li><Link href="#">Community</Link></li>
                <li><Link href="#">Resources</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-up-title">Quick Links</h4>
              <ul className="footer-up-links">
                <li><Link href="#">Spiritual Guidance</Link></li>
                <li><Link href="#contact">Contact</Link></li>
                <li><Link href="#">Support</Link></li>
                <li><Link href="#">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div id="contact">
              <h4 className="footer-up-title">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Phone className="h-4 w-4" />
                  +27 61 691 2540
                </li>
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail className="h-4 w-4" />
                  ramahfullgospelch@gmail.com
                </li>
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Pretoria, South Africa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-up-bottom">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/60 text-sm">
                &copy; {new Date().getFullYear()} School of Members - Ramah Full Gospel Church Pretoria. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Use</Link>
                <Link href="#">Legal Notice</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
