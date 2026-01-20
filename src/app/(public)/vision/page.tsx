import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Compass, Users, GraduationCap } from 'lucide-react'
import {
  SectionHeader,
  ChapterJourney,
  PurposeGrid,
  StaffGrid,
  type StaffMember,
} from '@/components/public'
import {
  seoContent,
  visionStatement,
  missionStatement,
} from '@/data/content'

// Staff members data
const staffMembers: StaffMember[] = [
  {
    name: 'Mr Tresor',
    role: 'Head of Department',
    comment: 'Leading the School of Members with dedication and spiritual guidance.',
    image: '/images/hero/staff.jpg',
  },
  {
    name: 'Mr Nick',
    role: 'Vice President',
    comment: 'Supporting the vision and ensuring excellence in our training program.',
    image: '/images/hero/staff (2).jpg',
  },
  {
    name: 'Ms Eliana',
    role: 'Secretary',
    comment: 'Coordinating operations and keeping the department running smoothly.',
    image: '/images/hero/staff (3).jpg',
  },
  {
    name: 'Mr Jonathan',
    role: 'Teacher',
    comment: 'Passionate about biblical education and mentoring future leaders.',
    image: '/images/hero/staff (4).jpg',
  },
  {
    name: 'Mr Nico',
    role: 'Teacher',
    comment: 'Committed to helping students grow in their spiritual journey.',
    image: '/images/hero/staff (5).jpg',
  },
  {
    name: 'Ms Polelo',
    role: 'Teacher',
    comment: 'Dedicated to nurturing faith and building strong foundations.',
    image: '/images/hero/staff (6).jpg',
  },
]

export const metadata: Metadata = {
  title: seoContent.vision.title,
  description: seoContent.vision.description,
}

export default function VisionPage() {
  return (
    <div className="bg-[#0a1419]">
      {/* Hero Section - Vision Statement */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-forest-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-forest-400/10 border border-forest-400/30 rounded-full px-4 py-2 mb-8">
              <Target className="h-5 w-5 text-forest-400" />
              <span className="text-sm font-medium text-forest-400">Our Vision</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-8">
              &quot;{visionStatement}&quot;
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-forest-400 to-forest-500 mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Mission Statement - Dark Theme */}
      <section className="py-16 md:py-20 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-forest-400/20 border border-forest-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Compass className="h-8 w-8 text-forest-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  {missionStatement}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Staff Section */}
      <section className="py-16 md:py-20 bg-[#0a1419]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-forest-400/10 border border-forest-400/30 rounded-full px-4 py-2 mb-6">
              <Users className="h-5 w-5 text-forest-400" />
              <span className="text-sm font-medium text-forest-400">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Staff
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Dedicated servants leading the School of Members with passion and excellence.
            </p>
          </div>
          <StaffGrid staff={staffMembers} />
        </div>
      </section>

      {/* Core Values / Purpose - Dark Theme */}
      <section className="py-16 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The foundational principles that guide our teaching and community.
            </p>
          </div>
          <PurposeGrid />
        </div>
      </section>

      {/* 12 Chapter Journey - Dark Theme */}
      <section className="py-16 md:py-20 bg-[#0a1419]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The 12-Chapter Journey
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Your path to spiritual maturity through our comprehensive curriculum.
            </p>
          </div>
          <ChapterJourney />
        </div>
      </section>

      {/* What You'll Learn - Dark Theme */}
      <section className="py-16 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-forest-400/10 border border-forest-400/30 rounded-full px-4 py-2 mb-6">
              <GraduationCap className="h-5 w-5 text-forest-400" />
              <span className="text-sm font-medium text-forest-400">Curriculum</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You&apos;ll Learn
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A comprehensive foundation for your spiritual growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                className="dark-card group"
              >
                <div className="w-12 h-12 bg-forest-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest-400/30 transition-colors">
                  <span className="text-forest-400 font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Fluorescent */}
      <section className="cta-forest">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Transformation Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of members who have completed the School of Members program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/student/register"
              className="btn-forest-white"
            >
              Register Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/faq"
              className="btn-forest-secondary border-white/30 hover:bg-white/10"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
