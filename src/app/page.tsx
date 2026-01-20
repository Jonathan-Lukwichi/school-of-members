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
  ChevronRight,
  ChevronLeft,
  Heart,
  HandHelping,
  UsersRound,
  Handshake,
} from 'lucide-react'
import { PublicHeader } from '@/components/layout/public-header'
import { TestimonialCarousel, type Testimonial } from '@/components/public/testimonial-carousel'
import { PublicFooter } from '@/components/layout/public-footer'
import {
  heroContent,
  statistics,
  welcomePreview,
  featureCards,
} from '@/data/content'
import { createClient } from '@/lib/supabase/client'

// Hero slides data - Using uploaded church photos
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/603893843_863136529756625_3601433323555904839_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(0,51,102,0.75) 0%, rgba(0,64,128,0.8) 100%)',
    title: heroContent.headline,
    subtitle: 'A Year of Growing Faith',
    description: heroContent.subheadline,
  },
  {
    id: 2,
    image: '/images/hero/605616953_863675026369442_6652154226306859322_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(200,16,46,0.75) 0%, rgba(160,13,37,0.8) 100%)',
    title: 'Grow • Serve • Belong',
    subtitle: 'Our Three Foundational Pillars',
    description: 'Develop your faith, use your talents in service to the community, and become part of the spiritual family',
  },
  {
    id: 3,
    image: '/images/hero/608702732_865582319512046_5812417327465441922_n.jpg',
    overlay: 'linear-gradient(135deg, rgba(181,152,91,0.75) 0%, rgba(138,115,68,0.8) 100%)',
    title: 'Complete Training Program',
    subtitle: '12 Chapters of Spiritual Growth',
    description: 'A structured program to understand the foundations of our community under the direction of Apostle Narcisse Majila',
  },
]

// Programme cards data with icons
const programmes = [
  {
    id: 1,
    title: featureCards[0].title,
    description: featureCards[0].description,
    image: '/images/hero/603907220_863136993089912_1924723922976510063_n.jpg',
    overlay: 'linear-gradient(to top, rgba(0,51,102,0.9) 0%, rgba(0,51,102,0.3) 100%)',
    icon: BookOpen,
  },
  {
    id: 2,
    title: featureCards[1].title,
    description: featureCards[1].description,
    image: '/images/hero/605209775_863138459756432_5544717009163373141_n.jpg',
    overlay: 'linear-gradient(to top, rgba(200,16,46,0.9) 0%, rgba(200,16,46,0.3) 100%)',
    icon: Handshake,
  },
  {
    id: 3,
    title: featureCards[2].title,
    description: featureCards[2].description,
    image: '/images/hero/605633574_863139219756356_2557880040851016723_n.jpg',
    overlay: 'linear-gradient(to top, rgba(181,152,91,0.9) 0%, rgba(181,152,91,0.3) 100%)',
    icon: GraduationCap,
  },
  {
    id: 4,
    title: featureCards[3].title,
    description: featureCards[3].description,
    image: '/images/hero/606051694_863676573035954_803516800744340136_n.jpg',
    overlay: 'linear-gradient(to top, rgba(14,165,233,0.9) 0%, rgba(14,165,233,0.3) 100%)',
    icon: UsersRound,
  },
]

// News articles data
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

// Fallback testimonials if database is empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Grace M.',
    role: 'New Member',
    content: 'I gave my life to Christ recently, and the School of Members helped me understand what it truly means to be part of God\'s family. I now feel confident in my faith journey.',
  },
  {
    id: '2',
    name: 'Emmanuel K.',
    role: 'Church Volunteer',
    content: 'I\'ve been a Christian for over 15 years, but I never had a proper foundation in church membership. This program opened my eyes to things I\'d missed!',
  },
  {
    id: '3',
    name: 'Thandi S.',
    role: 'Young Professional',
    content: 'As a busy professional, I appreciated completing this at my own pace. The teachings challenged me to prioritize my church attendance.',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)

  // Fetch testimonials from database
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, name, role, content, photo_url')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(6)

        if (data && data.length > 0) {
          setTestimonials(data)
        }
      } catch (error) {
        // Use fallback testimonials if fetch fails
        console.log('Using fallback testimonials')
      }
    }

    fetchTestimonials()
  }, [])

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
      <PublicHeader />

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
                backgroundColor: '#003366',
              }}
            >
              <div className="hero-slide-content">
                <p className="text-lg mb-2 opacity-90">{slide.subtitle}</p>
                <h1 className="hero-slide-title">{slide.title}</h1>
                <p className="hero-slide-subtitle">{slide.description}</p>
                <Link href="/student/register" className="btn-up-primary">
                  {heroContent.cta} <ArrowRight className="h-4 w-4 ml-2" />
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
                  <div key={programme.id} className="programme-card">
                    <div
                      className="programme-card-image"
                      style={{
                        backgroundImage: `${programme.overlay}, url(${programme.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white/30" />
                      </div>
                    </div>
                    <div className="programme-card-label">
                      {programme.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Welcome Preview Section */}
        <section className="py-16 bg-gradient-to-br from-[#003366]/5 to-[#b5985b]/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-6">
                Welcome to the School of Members
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {welcomePreview}
              </p>
              <Link href="/story" className="btn-up-outline mt-8 inline-flex items-center">
                Read Our Story
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section - Three Pillars */}
        <section id="about" className="about-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                Our Foundational Pillars
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Three core principles guide every aspect of our spiritual training program.
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
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="stats-bar">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-[#f8fafc]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                What Our Members Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from those who have completed the School of Members program.
              </p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* News Section */}
        <section id="news" className="py-16 bg-white">
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
                    <Link href="/story" className="btn-up-outline">
                      Learn More
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
                    <div className="text-sm text-gray-600">Biblical Foundation</div>
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
      <PublicFooter />
    </div>
  )
}
