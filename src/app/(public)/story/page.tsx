import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Crown, Star } from 'lucide-react'
import {
  SectionHeader,
  FounderCard,
  Timeline,
  PurposeGrid,
  AudienceCards,
  LeaderGallery,
  ImageGallery,
} from '@/components/public'
import {
  seoContent,
  welcomeMessage,
  whatIsSchool,
} from '@/data/content'
import { founders } from '@/data/founders'
import { timeline } from '@/data/timeline'

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

export const metadata: Metadata = {
  title: seoContent.story.title,
  description: seoContent.story.description,
}

export default function StoryPage() {
  return (
    <div className="bg-[#0a1419]">
      {/* Panoramic Gallery Hero */}
      <ImageGallery
        images={heroGalleryImages}
        title="About the School of Members"
        subtitle="Discover the vision, history, and heart behind our spiritual training program"
        autoPlay={true}
        interval={5000}
        height="70vh"
      />

      {/* Welcome Message - Dark Card */}
      <section className="py-16 md:py-20 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="dark-card-story">
              <h2 className="text-3xl font-bold text-white mb-6">
                {welcomeMessage.title}
              </h2>
              <div className="text-white/70 leading-relaxed space-y-4">
                {welcomeMessage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Spiritual Father - Patriarch Gallery */}
      <section className="py-16 md:py-20 bg-[#0a1419]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Crown className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Spiritual Leadership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Spiritual Father
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Under the covering and direction of our beloved Patriarch
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <LeaderGallery
              images={patriarchImages}
              name="Patriarch"
              title="Spiritual Father"
            />
          </div>
        </div>
      </section>

      {/* What is School of Members */}
      <section className="py-16 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {whatIsSchool.title}
            </h2>
            <div className="text-white/70 leading-relaxed space-y-4">
              {whatIsSchool.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apostle Narcisse Gallery */}
      <section className="py-16 md:py-20 bg-[#0a1419]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-forest-400/10 border border-forest-400/30 rounded-full px-4 py-2 mb-6">
              <Star className="h-5 w-5 text-forest-400" />
              <span className="text-sm font-medium text-forest-400">Our Leader</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Apostle Narcisse Majila
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Lead Pastor of Ramah Full Gospel Church Pretoria, a powerful instrument used by God for deliverance, restoration, and healing.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <LeaderGallery
              images={apostleNarcisseImages}
              name="Apostle Narcisse Majila"
              title="Lead Pastor"
            />
          </div>
        </div>
      </section>

      {/* Our Purpose - Dark Theme */}
      <section className="py-16 md:py-20 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Purpose
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The School of Members exists to accomplish these six goals in your spiritual journey.
            </p>
          </div>
          <PurposeGrid />
        </div>
      </section>

      {/* Who Should Join - Dark Theme */}
      <section className="py-16 bg-[#0a1419]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Who Should Join?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The School of Members is designed for everyone seeking to grow in their faith.
            </p>
          </div>
          <AudienceCards />
          <div className="mt-12 text-center">
            <blockquote className="text-lg italic text-white/70 max-w-2xl mx-auto">
              "Not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near."
            </blockquote>
            <p className="mt-3 text-forest-400 font-semibold">— Hebrews 10:25</p>
          </div>
        </div>
      </section>

      {/* Church History Timeline - Dark Theme */}
      <section className="py-16 bg-[#0c1a24]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Journey
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A timeline of God&apos;s faithfulness through the years.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Timeline events={timeline} />
          </div>
        </div>
      </section>

      {/* CTA Section - Fluorescent */}
      <section className="cta-forest">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join our community of faithful members and start your spiritual growth today.
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
              href="/vision"
              className="btn-forest-secondary border-white/30 hover:bg-white/10"
            >
              View Our Vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
