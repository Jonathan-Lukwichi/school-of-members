import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  HelpCircle,
  Clock,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { SectionHeader, FAQAccordion } from '@/components/public'
import { seoContent, contactInfo } from '@/data/content'
import { faqs } from '@/data/faq'

export const metadata: Metadata = {
  title: seoContent.faq.title,
  description: seoContent.faq.description,
}

const benefits = [
  {
    icon: BookOpen,
    title: '12 Comprehensive Chapters',
    description: 'Deep biblical teaching covering all aspects of church membership.',
  },
  {
    icon: Clock,
    title: '24/7 Online Access',
    description: 'Study at your own pace, anytime, anywhere with internet access.',
  },
  {
    icon: Award,
    title: 'Free Registration',
    description: 'No cost to join. We believe spiritual training should be accessible to all.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a community of believers on the same spiritual journey.',
  },
]

const steps = [
  {
    number: 1,
    title: 'Register',
    description: 'Enter your phone number and receive a PIN via WhatsApp.',
  },
  {
    number: 2,
    title: 'Access Portal',
    description: 'Log in to your student portal using your phone number and PIN.',
  },
  {
    number: 3,
    title: 'Start Learning',
    description: 'Begin with Chapter 1 and progress through all 12 chapters.',
  },
  {
    number: 4,
    title: 'Graduate',
    description: 'Complete all chapters and receive your certificate of completion.',
  },
]

export default function FAQPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003366] to-[#004080] text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm font-medium">FAQ & Registration</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about joining the School of Members.
            </p>
          </div>
        </div>
      </section>

      {/* How to Register */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="How to Register"
            subtitle="Join the School of Members in four simple steps."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center"
              >
                {/* Step number */}
                <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>

                {/* Arrow to next step */}
                {step.number < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/student/register" className="btn-up-primary">
              Start Registration
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Benefits of Joining"
            subtitle="Why choose the School of Members for your spiritual growth."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center group hover:border-[#003366] transition-colors"
                >
                  <div className="w-14 h-14 bg-[#003366]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#003366] transition-colors">
                    <Icon className="h-7 w-7 text-[#003366] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Common Questions"
            subtitle="Find answers to the most frequently asked questions."
          />
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} defaultOpen="faq-1" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Our team is here to help you. Reach out to us through any of these channels.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href={`tel:${contactInfo.phone}`}
                className="p-4 rounded-lg bg-[#003366]/5 hover:bg-[#003366]/10 transition-colors"
              >
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-[#003366]">{contactInfo.phone}</p>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="p-4 rounded-lg bg-[#003366]/5 hover:bg-[#003366]/10 transition-colors"
              >
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-[#003366]">{contactInfo.email}</p>
              </a>
              <div className="p-4 rounded-lg bg-[#003366]/5">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-[#003366]">{contactInfo.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#C8102E] to-[#a00d25] text-white">
        <div className="container mx-auto px-6 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Faith?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Registration is free and takes less than a minute. Start your spiritual journey today.
          </p>
          <Link
            href="/student/register"
            className="bg-white text-[#C8102E] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Register Now - It's Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
