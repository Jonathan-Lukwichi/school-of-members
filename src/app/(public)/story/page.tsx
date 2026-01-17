import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import {
  SectionHeader,
  FounderCard,
  Timeline,
  PurposeGrid,
  AudienceCards,
} from '@/components/public'
import {
  seoContent,
  welcomeMessage,
  whatIsSchool,
} from '@/data/content'
import { founders } from '@/data/founders'
import { timeline } from '@/data/timeline'

export const metadata: Metadata = {
  title: seoContent.story.title,
  description: seoContent.story.description,
}

export default function StoryPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003366] to-[#004080] text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About the School of Members
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Discover the vision, history, and heart behind our spiritual training program.
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#003366]/5 to-[#b5985b]/5 rounded-2xl p-8 md:p-12 border border-[#003366]/10">
              <h2 className="text-3xl font-bold text-[#003366] mb-6">
                {welcomeMessage.title}
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                {welcomeMessage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is School of Members */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title={whatIsSchool.title}
              centered={false}
            />
            <div className="text-gray-600 leading-relaxed space-y-4">
              {whatIsSchool.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Our Purpose"
            subtitle="The School of Members exists to accomplish these six goals in your spiritual journey."
          />
          <PurposeGrid />
        </div>
      </section>

      {/* Who Should Join */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Who Should Join?"
            subtitle="The School of Members is designed for everyone seeking to grow in their faith."
          />
          <AudienceCards />
          <div className="mt-8 text-center">
            <blockquote className="text-lg italic text-gray-600 max-w-2xl mx-auto">
              "Not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near."
            </blockquote>
            <p className="mt-2 text-[#003366] font-semibold">— Hebrews 10:25</p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Our Founders"
            subtitle="Meet the spiritual leaders behind the Ramah movement."
          />
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {founders.map((founder, index) => (
              <FounderCard
                key={founder.id}
                founder={founder}
                variant={index === 0 ? 'primary' : 'secondary'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Church History Timeline */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Our Journey"
            subtitle="A timeline of God's faithfulness through the years."
          />
          <div className="max-w-4xl mx-auto">
            <Timeline events={timeline} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#003366] to-[#004080] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join our community of faithful members and start your spiritual growth today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/student/register"
              className="btn-up-secondary inline-flex items-center justify-center"
            >
              Register Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/vision"
              className="btn-up-outline border-white text-white hover:bg-white hover:text-[#003366] inline-flex items-center justify-center"
            >
              View Our Vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
