import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, GraduationCap } from 'lucide-react'
import {
  PurposeGrid,
  ImageGallery,
  StaffShowcase,
  type StaffShowcaseMember,
} from '@/components/public'
import {
  seoContent,
  visionStatement,
  missionStatement,
} from '@/data/content'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

// Hero gallery images (staff photos)
const visionGalleryImages = [
  '/images/hero/staff.jpg',
  '/images/hero/staff (2).jpg',
  '/images/hero/staff (3).jpg',
  '/images/hero/staff (4).jpg',
  '/images/hero/staff (5).jpg',
  '/images/hero/staff (6).jpg',
]

// Staff members data with enhanced descriptions
const staffMembers: StaffShowcaseMember[] = [
  {
    name: 'Mr Tresor',
    role: 'Head of Department',
    description: 'Leading the School of Members with dedication and spiritual guidance. Mr Tresor oversees the curriculum development and ensures every student receives quality biblical education that transforms lives.',
    image: '/images/hero/staff.jpg',
  },
  {
    name: 'Mr Nick',
    role: 'Vice President',
    description: 'Supporting the vision and ensuring excellence in our training program. Mr Nick brings strategic leadership and a heart for discipleship to help students reach their full potential in Christ.',
    image: '/images/hero/staff (2).jpg',
  },
  {
    name: 'Ms Eliana',
    role: 'Secretary',
    description: 'Coordinating operations and keeping the department running smoothly. Ms Eliana ensures every administrative detail is handled with excellence, creating a seamless learning experience for all students.',
    image: '/images/hero/staff (3).jpg',
  },
  {
    name: 'Mr Jonathan',
    role: 'Teacher',
    description: 'Passionate about biblical education and mentoring future leaders. Mr Jonathan brings years of ministry experience to help students understand and apply God\'s Word in their daily lives.',
    image: '/images/hero/staff (4).jpg',
  },
  {
    name: 'Mr Nico',
    role: 'Teacher',
    description: 'Committed to helping students grow in their spiritual journey. Mr Nico creates engaging lessons that connect scripture to real-life situations, making learning both practical and profound.',
    image: '/images/hero/staff (5).jpg',
  },
  {
    name: 'Ms Polelo',
    role: 'Teacher',
    description: 'Dedicated to nurturing faith and building strong foundations. Ms Polelo brings warmth and wisdom to every lesson, helping students develop a deep and personal relationship with God.',
    image: '/images/hero/staff (6).jpg',
  },
]

export const metadata: Metadata = {
  title: seoContent.vision.title,
  description: seoContent.vision.description,
}

export default function VisionPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Panoramic Gallery Hero */}
      <ImageGallery
        images={visionGalleryImages}
        title="Our Vision & Mission"
        subtitle={`"${visionStatement}""}`}
        autoPlay={true}
        interval={5000}
        height="70vh"
      />

      {/* Mission Statement */}
      <Section variant="highlight">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Compass className="h-10 w-10 text-brand-500" />
              </div>
              <div>
                <Heading size="h2" className="mb-4">
                  Our Mission
                </Heading>
                <Text size="lg" className="text-slate-300">
                  {missionStatement}
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Meet Our Staff - Panoramic Showcase */}
      <StaffShowcase staff={staffMembers} autoPlay={true} interval={6000} />

      {/* Core Values / Purpose */}
      <Section variant="default">
        <Container>
          <div className="text-center mb-12">
            <Heading size="h2" className="mb-4">
              Our Core Values
            </Heading>
            <Text className="max-w-2xl mx-auto">
              The foundational principles that guide our teaching and community.
            </Text>
          </div>
          <PurposeGrid />
        </Container>
      </Section>

      {/* What You'll Learn */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 mb-6">
              <GraduationCap className="h-5 w-5 text-brand-500" />
              <span className="text-sm font-medium text-brand-500 uppercase tracking-wide">Curriculum</span>
            </div>
            <Heading size="h2" className="mb-4">
              What You&apos;ll Learn
            </Heading>
            <Text className="max-w-2xl mx-auto">
              A comprehensive foundation for your spiritual growth.
            </Text>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Biblical Foundations',
                description: 'Deep understanding of Scripture and its application to daily life.',
              },
              {
                title: 'Church Membership',
                description: 'The significance and responsibilities of belonging to God\'s family.',
              },
              {
                title: 'Pastoral Relationship',
                description: 'The sacred bond between shepherd and sheep in the local church.',
              },
              {
                title: 'Spiritual Disciplines',
                description: 'Prayer, fasting, worship, and other practices for growth.',
              },
              {
                title: 'Service & Ministry',
                description: 'Discovering and using your gifts for God\'s kingdom.',
              },
              {
                title: 'Eternal Perspective',
                description: 'Living in preparation for Christ\'s return.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-brand-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-colors">
                  <span className="text-brand-500 font-bold text-lg font-heading">{index + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-slate-100 mb-3 text-xl">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-500 opacity-90" />
        <Container className="relative z-10 text-center">
          <Heading size="h2" className="mb-6 text-slate-950">
            Start Your Transformation Today
          </Heading>
          <p className="text-slate-900/80 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Join hundreds of members who have completed the School of Members program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student/register">
              <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-900 border-none">
                Register Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="bg-transparent border-slate-900 text-slate-900 hover:bg-slate-900/10">
                View FAQ
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}