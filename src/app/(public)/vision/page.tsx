import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Compass } from 'lucide-react'
import {
  SectionHeader,
  ChapterJourney,
  PurposeGrid,
} from '@/components/public'
import {
  seoContent,
  visionStatement,
  missionStatement,
} from '@/data/content'

export const metadata: Metadata = {
  title: seoContent.vision.title,
  description: seoContent.vision.description,
}

export default function VisionPage() {
  return (
    <div>
      {/* Hero Section - Vision Statement */}
      <section className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] text-white py-24 md:py-32 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Our Vision</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              "{visionStatement}"
            </h1>
            <div className="w-24 h-1 bg-[#b5985b] mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-[#C8102E] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {missionStatement}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Purpose */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Our Core Values"
            subtitle="The foundational principles that guide our teaching and community."
          />
          <PurposeGrid />
        </div>
      </section>

      {/* 12 Chapter Journey */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="The 12-Chapter Journey"
            subtitle="Your path to spiritual maturity through our comprehensive curriculum."
          />
          <ChapterJourney />
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="What You'll Learn"
            subtitle="A comprehensive foundation for your spiritual growth."
          />
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
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#003366] font-bold">{index + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#b5985b] to-[#a08548] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Transformation Today
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of members who have completed the School of Members program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/student/register"
              className="bg-white text-[#b5985b] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Register Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/faq"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#b5985b] transition-colors inline-flex items-center justify-center"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
