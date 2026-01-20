import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
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
    <div className="bg-slate-950 min-h-screen">
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
      <Section variant="muted">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-brand-300 to-brand-500" />
              <Heading size="h2" className="mb-6 text-white">
                {welcomeMessage.title}
              </Heading>
              <Text className="space-y-4 text-slate-300">
                {welcomeMessage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Spiritual Leaders - Panoramic Showcase */}
      {/* Note: LeaderShowcase needs to be compatible with new styles or it might look odd. Assuming it is self-contained. */}
      <LeaderShowcase leaders={leaders} autoPlay={true} interval={8000} />

      {/* What is School of Members */}
      <Section variant="default">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6">
              {whatIsSchool.title}
            </Heading>
            <Text className="space-y-4">
              {whatIsSchool.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Our Purpose */}
      <Section variant="highlight">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4">
              Our Purpose
            </Heading>
            <Text className="max-w-2xl mx-auto">
              The School of Members exists to accomplish these six goals in your spiritual journey.
            </Text>
          </div>
          <PurposeGrid />
        </Container>
      </Section>

      {/* Who Should Join */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4">
              Who Should Join?
            </Heading>
            <Text className="max-w-2xl mx-auto">
              The School of Members is designed for everyone seeking to grow in their faith.
            </Text>
          </div>
          <AudienceCards />
          <div className="mt-16 text-center">
            <blockquote className="text-xl italic text-slate-300 max-w-3xl mx-auto font-light leading-relaxed border-l-4 border-brand-500 pl-6 py-2">
              "Not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near."
            </blockquote>
            <p className="mt-4 text-brand-500 font-bold uppercase tracking-widest text-sm">— Hebrews 10:25</p>
          </div>
        </Container>
      </Section>

      {/* Church History Timeline */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4">
              Our Journey
            </Heading>
            <Text className="max-w-2xl mx-auto">
              A timeline of God&apos;s faithfulness through the years.
            </Text>
          </div>
          <div className="max-w-4xl mx-auto">
            <Timeline events={timeline} />
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-500 opacity-90" />
        <Container className="relative z-10 text-center">
          <Heading size="h2" className="mb-6 text-slate-950">
            Ready to Begin Your Journey?
          </Heading>
          <p className="text-slate-900/80 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Join our community of faithful members and start your spiritual growth today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student/register">
              <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-900 border-none">
                Register Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/vision">
              <Button size="lg" variant="outline" className="bg-transparent border-slate-900 text-slate-900 hover:bg-slate-900/10">
                View Our Vision
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}