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
  CheckCircle,
  Heart,
  HandHelping,
  UsersRound,
  Sparkles,
} from 'lucide-react'
import { PublicHeader } from '@/components/layout/public-header'
import { TestimonialCarousel, type Testimonial } from '@/components/public/testimonial-carousel'
import { PublicFooter } from '@/components/layout/public-footer'
import {
  heroContent,
  statistics,
  featureCards,
} from '@/data/content'
import { createClient } from '@/lib/supabase/client'

// Benefits data
const benefits = [
  {
    id: 1,
    title: 'Biblical Foundation',
    description: 'Learn the core principles of faith through comprehensive Bible-based teachings.',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Community Connection',
    description: 'Build lasting relationships with fellow believers and spiritual mentors.',
    icon: Users,
  },
  {
    id: 3,
    title: 'Personal Growth',
    description: 'Develop your spiritual gifts and discover your purpose in Gods kingdom.',
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Certificate Program',
    description: 'Complete 12 chapters and receive your official membership certificate.',
    icon: GraduationCap,
  },
]

// Journey features
const journeyFeatures = [
  '12 comprehensive chapters of spiritual training',
  'Self-paced online learning with offline access',
  'Interactive quizzes to track your progress',
  'Direct guidance from experienced leaders',
  'Community support and fellowship',
  'Official certificate upon completion',
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
        console.log('Using fallback testimonials')
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a1419]">
      <PublicHeader />

      <main>
        {/* Hero Section - Two Column */}
        <section className="hero-forest relative min-h-[90vh] flex items-center">
          {/* Background Glow Effects */}
          <div className="hero-forest-glow hero-forest-glow-1" />
          <div className="hero-forest-glow hero-forest-glow-2" />

          <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content (60%) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Badge */}
                <div className="badge-forest inline-flex">
                  <Sparkles className="h-4 w-4 mr-2" />
                  12 Chapters of Spiritual Growth
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                  Become a Committed Member in{' '}
                  <span className="text-forest-400">12 Weeks</span> with Certificate
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                  {heroContent.subheadline}
                </p>

                {/* CTA Button */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/student/register" className="btn-forest-primary text-lg">
                    Begin Your Journey
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link href="/story" className="btn-forest-secondary text-lg">
                    Learn More
                  </Link>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="stat-forest">
                    <div className="stat-forest-value">200+</div>
                    <div className="stat-forest-label">Students Enrolled</div>
                  </div>
                  <div className="stat-forest-divider hidden sm:block" />
                  <div className="stat-forest">
                    <div className="stat-forest-value">12</div>
                    <div className="stat-forest-label">Complete Chapters</div>
                  </div>
                  <div className="stat-forest-divider hidden sm:block" />
                  <div className="stat-forest">
                    <div className="stat-forest-value">95%</div>
                    <div className="stat-forest-label">Completion Rate</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image (40%) */}
              <div className="lg:col-span-2 relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  {/* Green Glow Behind Image */}
                  <div className="absolute -inset-4 bg-forest-400/20 rounded-3xl blur-3xl" />

                  {/* Church Image with Green Overlay */}
                  <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-forest-400/30">
                    <Image
                      src="/images/hero/603893843_863136529756625_3601433323555904839_n.jpg"
                      alt="School of Members"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1419] via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-forest-400/10" />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-[#0f2133] border border-forest-400/30 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-forest-400/20 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-forest-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Certificate</p>
                        <p className="text-white/50 text-sm">Upon Completion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#0c1a24]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Benefits from this Program
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Everything you need to build a strong foundation in your faith journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.id} className="benefit-card">
                    <div className="benefit-icon mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Path/Journey Section */}
        <section className="py-20 bg-[#0a1419]">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image Column */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <div className="absolute -inset-4 bg-forest-400/10 rounded-3xl blur-2xl" />
                  <div className="relative h-full w-full rounded-2xl overflow-hidden border border-forest-400/20">
                    <Image
                      src="/images/hero/605616953_863675026369442_6652154226306859322_n.jpg"
                      alt="Spiritual Journey"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1419]/80 to-transparent" />
                    <div className="absolute inset-0 bg-forest-400/10" />
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  Your Path to Spiritual Growth Starts Here
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  The School of Members provides a structured program to understand the foundations
                  of our community under the direction of Apostle Narcisse Majila. Join us on this
                  transformative journey.
                </p>

                {/* Feature List */}
                <ul className="space-y-4">
                  {journeyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-forest-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/student/register" className="btn-forest-primary inline-flex mt-4">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars Section */}
        <section className="py-20 bg-[#0c1a24]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Our Foundational Pillars
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Three core principles guide every aspect of our spiritual training program
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Grow */}
              <div className="dark-card text-center">
                <div className="w-20 h-20 rounded-full bg-forest-400/20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-forest-400" />
                </div>
                <h3 className="text-xl font-bold text-forest-400 mb-3 uppercase tracking-wide">
                  Grow
                </h3>
                <p className="text-white/50 leading-relaxed">
                  Develop your faith through teachings and the daily practice of the Word of God.
                </p>
              </div>

              {/* Serve */}
              <div className="dark-card text-center">
                <div className="w-20 h-20 rounded-full bg-forest-500/20 flex items-center justify-center mx-auto mb-6">
                  <HandHelping className="h-10 w-10 text-forest-500" />
                </div>
                <h3 className="text-xl font-bold text-forest-500 mb-3 uppercase tracking-wide">
                  Serve
                </h3>
                <p className="text-white/50 leading-relaxed">
                  Put your talents to work in service to the community and to God with dedication.
                </p>
              </div>

              {/* Belong */}
              <div className="dark-card text-center">
                <div className="w-20 h-20 rounded-full bg-forest-600/20 flex items-center justify-center mx-auto mb-6">
                  <UsersRound className="h-10 w-10 text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-forest-600 mb-3 uppercase tracking-wide">
                  Belong
                </h3>
                <p className="text-white/50 leading-relaxed">
                  Fully integrate into the spiritual family and build strong bonds with the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="py-12 bg-gradient-to-r from-forest-300 via-forest-400 to-forest-500">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-[#0a1419]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                What Our Members Say
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Hear from those who have completed the School of Members program.
              </p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-forest">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Start Your Spiritual Journey?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Join our learning community and take the first step towards achieving
              your spiritual goals. Registration is quick, easy, and free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/student/register" className="btn-forest-white">
                Register Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/story" className="btn-forest-secondary border-white/30 hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}
