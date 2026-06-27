'use client'

import { useState, useEffect, type ReactNode } from 'react'
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
  Sparkles,
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
import { Parallax } from '@/components/shared/parallax'
import { useReveal } from '@/hooks/use-reveal'

// Scroll-reveal wrapper (translateY entrance; opacity stays for AA contrast)
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal-init ${className ?? ''}`}>
      {children}
    </div>
  )
}

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

// Hero images - graduation ensemble photos
const heroImages = [
  '/images/hero/graduationensemble.jpg',
  '/images/hero/graduationensemble1.jpg',
  '/images/hero/graduationensemble2.jpg',
]

// Graduation photos
const graduationPhotos = [
  '/images/hero/graduation.jpg',
  '/images/hero/graduation1.jpg',
  '/images/hero/graduation3.jpg',
  '/images/hero/graduation4.jpg',
  '/images/hero/graduation5.jpg',
  '/images/hero/graduation7.jpg',
  '/images/hero/graduation (2).jpg',
  '/images/hero/graduation (4).jpg',
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
    <div className="min-h-screen bg-white text-ink selection:bg-emerald/20 selection:text-emerald-dark">
      <PublicHeader />

      <main>
        {/* Hero Section - Graduation Ensemble Photos (parallax, hero only) */}
        <Parallax speed={-0.1}>
          <ImageGallery
            images={heroImages}
            title="Experience Our Community"
            subtitle="Moments of worship, teaching, and fellowship that transform lives"
            autoPlay={true}
            interval={4000}
            height="80vh"
            textPosition="center"
          />
        </Parallax>

        {/* Benefits Section */}
        <Section variant="default" className="bg-mint-soft">
          <Container>
            <Reveal>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <Heading size="h2" className="mb-6 text-ink">
                  Benefits from this Program
                </Heading>
                <Text size="lg" className="text-ink-muted">
                  Everything you need to build a strong foundation in your faith journey
                </Text>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <div key={benefit.id} className="bg-white border border-mint rounded-xl p-6 hover:border-emerald transition-all duration-300 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 group">
                      <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-6 group-hover:bg-emerald transition-colors">
                        <Icon className="h-6 w-6 text-emerald group-hover:text-ink transition-colors" />
                      </div>
                      <Heading as="h3" size="h4" className="mb-3 text-ink">
                        {benefit.title}
                      </Heading>
                      <Text className="text-sm text-ink-muted">
                        {benefit.description}
                      </Text>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Path/Journey Section */}
        <Section variant="default" className="bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image Column */}
              <Reveal className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-xl border border-mint">
                  <Image
                    src="/images/hero/teaching moment.jpg"
                    alt="Spiritual Journey"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald/10 to-transparent mix-blend-overlay" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -z-10 -bottom-6 -left-6 w-24 h-24 bg-emerald/15 rounded-full blur-2xl" />
                <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-mint rounded-full blur-2xl" />
              </Reveal>

              {/* Content Column */}
              <Reveal className="order-1 lg:order-2 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald-dark text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="h-3.5 w-3.5" />
                    Start Your Journey
                  </div>
                  <Heading size="h2" className="mb-6 text-ink">
                    Your Path to Spiritual Growth Starts Here
                  </Heading>
                  <Text size="lg" className="text-ink-muted">
                    The School of Members provides a structured program to understand the foundations
                    of our community under the direction of Apostle Narcisse Majila. Join us on this
                    transformative journey.
                  </Text>
                </div>

                {/* Feature List */}
                <ul className="space-y-4">
                  {journeyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <CheckCircle className="h-6 w-6 text-emerald mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <Text className="text-ink group-hover:text-emerald-dark transition-colors">{feature}</Text>
                    </li>
                  ))}
                </ul>

                <Link href="/student/register">
                  <Button size="lg" className="mt-4">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Three Pillars Section */}
        <Section variant="default" className="bg-mint-soft">
          <Container>
            <Reveal>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <Heading size="h2" className="mb-6 text-ink">
                  Our Foundational Pillars
                </Heading>
                <Text size="lg" className="text-ink-muted">
                  Three core principles guide every aspect of our spiritual training program
                </Text>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Grow */}
                <div className="bg-white border border-mint rounded-xl p-8 text-center hover:border-emerald transition-all duration-300 shadow-premium hover:shadow-premium-lg hover:-translate-y-1">
                  <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald/20">
                    <Heart className="h-10 w-10 text-emerald" />
                  </div>
                  <Heading as="h3" size="h4" className="mb-4 text-emerald-dark uppercase tracking-widest">
                    Grow
                  </Heading>
                  <Text className="text-ink-muted">
                    Develop your faith through teachings and the daily practice of the Word of God.
                  </Text>
                </div>

                {/* Serve */}
                <div className="bg-white border border-mint rounded-xl p-8 text-center hover:border-emerald transition-all duration-300 shadow-premium hover:shadow-premium-lg hover:-translate-y-1">
                  <div className="w-20 h-20 rounded-full bg-mint flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald/20">
                    <HandHelping className="h-10 w-10 text-emerald-dark" />
                  </div>
                  <Heading as="h3" size="h4" className="mb-4 text-ink uppercase tracking-widest">
                    Serve
                  </Heading>
                  <Text className="text-ink-muted">
                    Put your talents to work in service to the community and to God with dedication.
                  </Text>
                </div>

                {/* Belong */}
                <div className="bg-white border border-mint rounded-xl p-8 text-center hover:border-emerald transition-all duration-300 shadow-premium hover:shadow-premium-lg hover:-translate-y-1">
                  <div className="w-20 h-20 rounded-full bg-mint flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald/20">
                    <UsersRound className="h-10 w-10 text-emerald-dark" />
                  </div>
                  <Heading as="h3" size="h4" className="mb-4 text-ink uppercase tracking-widest">
                    Belong
                  </Heading>
                  <Text className="text-ink-muted">
                    Fully integrate into the spiritual family and build strong bonds with the community.
                  </Text>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Statistics Bar - emerald gradient with marquee shimmer */}
        <section className="py-16 bg-emerald-btn relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />

          <Container className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-ink/10">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-display font-bold text-ink mb-2">
                    {stat.value}
                  </div>
                  <div className="text-ink/80 font-medium text-sm uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Graduation Showcase Section */}
        <Section variant="default" className="bg-white">
          <Container>
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint border border-emerald/20 mb-6">
                  <GraduationCap className="h-5 w-5 text-emerald" />
                  <span className="text-sm font-medium text-ink">Success Stories</span>
                </div>
                <Heading size="h2" className="mb-6 text-ink">
                  Celebrating Our Graduates
                </Heading>
                <Text size="lg" className="max-w-2xl mx-auto text-ink-muted">
                  Witness the joy of completion as our members receive their certificates of achievement.
                </Text>
              </div>
            </Reveal>

            {/* Graduation Grid */}
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {graduationPhotos.slice(0, 8).map((photo, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer border border-mint hover:border-emerald transition-all duration-300 shadow-premium">
                    <Image
                      src={photo}
                      alt={`Graduation moment ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">Graduation Ceremony</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* View More Link */}
            <div className="text-center mt-12">
              <Link href="/story">
                <Button variant="outline" className="border-emerald text-emerald-dark hover:bg-emerald hover:text-ink hover:border-emerald">
                  View More Moments
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Testimonials Section */}
        <Section variant="default" className="bg-mint-soft">
          <Container>
            <Reveal>
              <div className="text-center mb-16">
                <Heading size="h2" className="mb-6 text-ink">
                  What Our Members Say
                </Heading>
                <Text size="lg" className="max-w-2xl mx-auto text-ink-muted">
                  Hear from those who have completed the School of Members program.
                </Text>
              </div>
            </Reveal>
            <TestimonialCarousel testimonials={testimonials} />
          </Container>
        </Section>

        {/* CTA Section - dark emerald/ink hero backdrop */}
        <section className="auth-gradient py-24 relative overflow-hidden text-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-tint/20 blur-3xl" />
          </div>
          <Container className="relative z-10 text-center">
            <Heading size="h2" className="mb-8 text-white">
              Ready to Start Your Spiritual Journey?
            </Heading>
            <p className="text-white/70 max-w-2xl mx-auto mb-10 text-xl font-medium">
              Join our learning community and take the first step towards achieving
              your spiritual goals. Registration is quick, easy, and free.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/student/register">
                <Button size="lg" className="shadow-emerald">
                  Register Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/story">
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
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
