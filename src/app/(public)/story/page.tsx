import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Timeline,
  PurposeGrid,
  AudienceCards,
  ImageGallery,
  LeaderShowcase,
  type Leader,
} from '@/components/public'
import {
  seoContent,
  welcomeMessage,
  whatIsSchool,
} from '@/data/content'
import { timeline } from '@/data/timeline'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

// Hero gallery images (patriarch + apostle narcisse)
const heroGalleryImages = [
  '/images/hero/patriach.jpg',
  '/images/hero/ap narcisse.jpg',
  '/images/hero/patriach (2).jpg',
  '/images/hero/ap narcisse (2).jpg',
  '/images/hero/patriach (3).jpg',
  '/images/hero/ap narcisse (3).jpg',
  '/images/hero/patriach (4).jpg',
  '/images/hero/ap narcisse (4).jpg',
]

// Patriarch images
const patriarchImages = [
  '/images/hero/patriach.jpg',
  '/images/hero/patriach (2).jpg',
  '/images/hero/patriach (3).jpg',
  '/images/hero/patriach (4).jpg',
  '/images/hero/patriach (5).jpg',
  '/images/hero/patriach (6).jpg',
]

// Apostle Narcisse images
const apostleNarcisseImages = [
  '/images/hero/ap narcisse.jpg',
  '/images/hero/ap narcisse (2).jpg',
  '/images/hero/ap narcisse (3).jpg',
  '/images/hero/ap narcisse (4).jpg',
  '/images/hero/ap naricisse.jpg',
]

// Leaders data for panoramic showcase
const leaders: Leader[] = [
  {
    name: 'Bishop Jonas Majila',
    title: 'Patriarch',
    role: 'Spiritual Father',
    description: 'Under the covering and spiritual direction of our beloved Patriarch, the ministry continues to grow and flourish. His wisdom and guidance have been instrumental in shaping the vision of the School of Members and nurturing countless believers in their faith journey.',
    images: patriarchImages,
    badgeIcon: 'crown',
    color: 'amber',
  },
  {
    name: 'Apostle Narcisse Majila',
    title: 'Lead Pastor',
    role: 'Our Leader',
    description: 'Lead Pastor of Ramah Full Gospel Church Pretoria, a powerful instrument used by God for deliverance, restoration, and healing. Under his leadership, the School of Members was established to build strong foundations in every believer and equip them for kingdom service.',
    images: apostleNarcisseImages,
    badgeIcon: 'star',
    color: 'forest',
  },
]

export const metadata: Metadata = {
  title: seoContent.story.title,
  description: seoContent.story.description,
}

export default function StoryPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Panoramic Gallery Hero */}
      <ImageGallery
        images={heroGalleryImages}
        title="About the School of Members"
        subtitle="Discover the vision, history, and heart behind our spiritual training program"
        autoPlay={true}
        interval={5000}
        height="70vh"
      />

      {/* Welcome Message */}
      <Section variant="default" className="bg-mint-soft">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="auth-gradient text-white border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-premium-xl animate-reveal">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-btn" />
              <Heading size="h2" className="mb-6 text-white">
                {welcomeMessage.title}
              </Heading>
              <Text className="space-y-4 text-white/70">
                {welcomeMessage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Spiritual Leaders - Panoramic Showcase */}
      <LeaderShowcase leaders={leaders} autoPlay={true} interval={8000} />

      {/* What is School of Members */}
      <Section variant="default" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-ink">
              {whatIsSchool.title}
            </Heading>
            <Text className="space-y-4 text-ink-muted">
              {whatIsSchool.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Our Purpose */}
      <Section variant="default" className="bg-mint-soft">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4 text-ink">
              Our Purpose
            </Heading>
            <Text className="max-w-2xl mx-auto text-ink-muted">
              The School of Members exists to accomplish these six goals in your spiritual journey.
            </Text>
          </div>
          <PurposeGrid />
        </Container>
      </Section>

      {/* Who Should Join */}
      <Section variant="default" className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4 text-ink">
              Who Should Join?
            </Heading>
            <Text className="max-w-2xl mx-auto text-ink-muted">
              The School of Members is designed for everyone seeking to grow in their faith.
            </Text>
          </div>
          <AudienceCards />
          <div className="mt-16 text-center">
            <blockquote className="text-xl italic text-ink max-w-3xl mx-auto font-light leading-relaxed border-l-4 border-emerald pl-6 py-2">
              &ldquo;Not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.&rdquo;
            </blockquote>
            <p className="mt-4 text-emerald-dark font-bold uppercase tracking-widest text-sm">— Hebrews 10:25</p>
          </div>
        </Container>
      </Section>

      {/* Church History Timeline */}
      <Section variant="default" className="bg-mint-soft">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4 text-ink">
              Our Journey
            </Heading>
            <Text className="max-w-2xl mx-auto text-ink-muted">
              A timeline of God&apos;s faithfulness through the years.
            </Text>
          </div>
          <div className="max-w-4xl mx-auto">
            <Timeline events={timeline} />
          </div>
        </Container>
      </Section>

      {/* CTA Section - dark emerald/ink backdrop */}
      <Section variant="default" className="auth-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-tint/20 blur-3xl" />
        </div>
        <Container className="relative z-10 text-center">
          <Heading size="h2" className="mb-6 text-white">
            Ready to Begin Your Journey?
          </Heading>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Join our community of faithful members and start your spiritual growth today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student/register">
              <Button size="lg" className="shadow-emerald">
                Register Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/vision">
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                View Our Vision
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}
