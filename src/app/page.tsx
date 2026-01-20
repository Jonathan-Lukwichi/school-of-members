'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Heart,
  HandHelping,
  UsersRound,
} from 'lucide-react'
import { PublicHeader } from '@/components/layout/public-header'
import { TestimonialCarousel, type Testimonial } from '@/components/public/testimonial-carousel'
import { ImageGallery } from '@/components/public/image-gallery'
import { PublicFooter } from '@/components/layout/public-footer'
import {
  statistics,
} from '@/data/content'
import { createClient } from '@/lib/supabase/client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Heading, Text } from '@/components/ui/typography'

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
    icon: Award,
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

// Panoramic gallery images (service moments + teaching moments)
const galleryImages = [
  '/images/hero/service moments.jpg',
  '/images/hero/service moments (2).jpg',
  '/images/hero/service moments (3).jpg',
  '/images/hero/service moments (4).jpg',
  '/images/hero/service moments (5).jpg',
  '/images/hero/service moments3.jpg',
  '/images/hero/teaching moment.jpg',
  '/images/hero/teaching moment2.jpg',
]

// Graduation photos
const graduationPhotos = [
  '/images/hero/graduation.jpg',
  '/images/hero/graduation1.jpg',
  '/images/hero/graduation3.jpg',
  '/images/hero/graduation4.jpg',
  '/images/hero/graduation5.jpg',
  '/images/hero/graduation6.jpg',
  '/images/hero/graduation7.jpg',
  '/images/hero/graduation8.jpg',
  '/images/hero/graduation9.jpg',
  '/images/hero/graduation (2).jpg',
  '/images/hero/graduation (3).jpg',
  '/images/hero/graduation (4).jpg',
  '/images/hero/graduation (5).jpg',
  '/images/hero/graduation (6).jpg',
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
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-brand-500/30 selection:text-brand-400">
      <PublicHeader />

      <main>
        {/* Panoramic Gallery Section - Main Hero */}
        <ImageGallery
          images={galleryImages}
          title="Experience Our Community"
          subtitle="Moments of worship, teaching, and fellowship that transform lives"
          autoPlay={true}
          interval={4000}
          height="80vh"
        />

        {/* Benefits Section */}
        <Section variant="muted">
          <Container>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Heading size="h2" className="mb-6">
                Benefits from this Program
              </Heading>
              <Text size="lg" className="text-slate-400">
                Everything you need to build a strong foundation in your faith journey
              </Text>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 group">
                    <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-colors">
                      <Icon className="h-6 w-6 text-brand-500" />
                    </div>
                    <Heading as="h3" size="h4" className="mb-3 text-slate-100">
                      {benefit.title}
                    </Heading>
                    <Text className="text-sm">
                      {benefit.description}
                    </Text>
                  </div>
                )
              })}
            </div>
          </Container>
        </Section>

        {/* Path/Journey Section */}
        <Section>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image Column */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800">
                  <Image
                    src="/images/hero/teaching moment.jpg"
                    alt="Spiritual Journey"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent mix-blend-overlay" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -z-10 -bottom-6 -left-6 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
                <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-slate-700/10 rounded-full blur-2xl" />
              </div>

              {/* Content Column */}
              <div className="order-1 lg:order-2 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider mb-6">
                    Start Your Journey
                  </div>
                  <Heading size="h2" className="mb-6">
                    Your Path to Spiritual Growth Starts Here
                  </Heading>
                  <Text size="lg">
                    The School of Members provides a structured program to understand the foundations
                    of our community under the direction of Apostle Narcisse Majila. Join us on this
                    transformative journey.
                  </Text>
                </div>

                {/* Feature List */}
                <ul className="space-y-4">
                  {journeyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <CheckCircle className="h-6 w-6 text-brand-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <Text className="text-slate-300 group-hover:text-slate-200 transition-colors">{feature}</Text>
                    </li>
                  ))}
                </ul>

                <Link href="/student/register">
                  <Button size="lg" className="mt-4">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* Three Pillars Section */}
        <Section variant="highlight">
          <Container>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Heading size="h2" className="mb-6">
                Our Foundational Pillars
              </Heading>
              <Text size="lg">
                Three core principles guide every aspect of our spiritual training program
              </Text>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Grow */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-brand-500/30 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-brand-500/20">
                  <Heart className="h-10 w-10 text-brand-500" />
                </div>
                <Heading as="h3" size="h4" className="mb-4 text-brand-500 uppercase tracking-widest">
                  Grow
                </Heading>
                <Text>
                  Develop your faith through teachings and the daily practice of the Word of God.
                </Text>
              </div>

              {/* Serve */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-brand-500/30 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 ring-1 ring-slate-700">
                  <HandHelping className="h-10 w-10 text-slate-400" />
                </div>
                <Heading as="h3" size="h4" className="mb-4 text-slate-300 uppercase tracking-widest">
                  Serve
                </Heading>
                <Text>
                  Put your talents to work in service to the community and to God with dedication.
                </Text>
              </div>

              {/* Belong */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-brand-500/30 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 ring-1 ring-slate-700">
                  <UsersRound className="h-10 w-10 text-slate-400" />
                </div>
                <Heading as="h3" size="h4" className="mb-4 text-slate-300 uppercase tracking-widest">
                  Belong
                </Heading>
                <Text>
                  Fully integrate into the spiritual family and build strong bonds with the community.
                </Text>
              </div>
            </div>
          </Container>
        </Section>

        {/* Statistics Bar */}
        <section className="py-16 bg-brand-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-500 mix-blend-multiply opacity-50" />
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
          
          <Container className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-brand-800/20">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-heading font-bold text-slate-950 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-900 font-medium text-sm uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Graduation Showcase Section */}
        <Section>
          <Container>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-6">
                <GraduationCap className="h-5 w-5 text-brand-500" />
                <span className="text-sm font-medium text-slate-300">Success Stories</span>
              </div>
              <Heading size="h2" className="mb-6">
                Celebrating Our Graduates
              </Heading>
              <Text size="lg" className="max-w-2xl mx-auto">
                Witness the joy of completion as our members receive their certificates of achievement.
              </Text>
            </div>

            {/* Graduation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {graduationPhotos.slice(0, 8).map((photo, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer border border-slate-800/50 hover:border-brand-500/50 transition-all duration-300">
                  <Image
                    src={photo}
                    alt={`Graduation moment ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">Graduation Ceremony</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Link */}
            <div className="text-center mt-12">
              <Link href="/story">
                <Button variant="outline">
                  View More Moments
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Testimonials Section */}
        <Section variant="muted">
          <Container>
            <div className="text-center mb-16">
              <Heading size="h2" className="mb-6">
                What Our Members Say
              </Heading>
              <Text size="lg" className="max-w-2xl mx-auto">
                Hear from those who have completed the School of Members program.
              </Text>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </Container>
        </Section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
          <Container className="relative z-10 text-center">
            <Heading size="h2" className="mb-8 text-slate-950">
              Ready to Start Your Spiritual Journey?
            </Heading>
            <p className="text-slate-900/80 max-w-2xl mx-auto mb-10 text-xl font-medium">
              Join our learning community and take the first step towards achieving
              your spiritual goals. Registration is quick, easy, and free.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/student/register">
                <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-900 border-none shadow-xl">
                  Register Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/story">
                <Button size="lg" variant="outline" className="bg-transparent border-slate-950 text-slate-950 hover:bg-slate-950/10 hover:text-slate-950 hover:border-slate-950">
                  Learn More
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}