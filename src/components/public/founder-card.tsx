import Image from 'next/image'
import { Phone, Mail, Quote } from 'lucide-react'
import { type Founder } from '@/data/founders'

interface FounderCardProps {
  founder: Founder
  variant?: 'primary' | 'secondary'
}

export function FounderCard({ founder, variant = 'primary' }: FounderCardProps) {
  const borderColor = variant === 'primary' ? 'border-[#003366]' : 'border-[#b5985b]'
  const titleColor = variant === 'primary' ? 'text-[#003366]' : 'text-[#b5985b]'

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`border-t-4 ${borderColor}`}>
        <div className="p-6 md:p-8">
          {/* Header with Image */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mx-auto md:mx-0 flex-shrink-0">
              <Image
                src={founder.image}
                alt={`${founder.title} ${founder.name}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(founder.name)}&size=160&background=003366&color=fff`
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <p className={`text-sm font-semibold uppercase tracking-wide ${titleColor} mb-1`}>
                {founder.title}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {founder.name}
              </h3>
              <p className="text-gray-600">{founder.role}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {founder.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Scripture Quote */}
          {founder.scripture && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#b5985b]">
              <Quote className="h-6 w-6 text-[#b5985b] mb-2" />
              <p className="italic text-gray-700 mb-2">
                "{founder.scripture.text}"
              </p>
              <p className="text-sm font-semibold text-[#003366]">
                — {founder.scripture.reference}
              </p>
            </div>
          )}

          {/* Contact Info */}
          {founder.contact && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Contact
              </p>
              <div className="flex flex-wrap gap-4">
                {founder.contact.phone && (
                  <a
                    href={`tel:${founder.contact.phone}`}
                    className="flex items-center gap-2 text-[#003366] hover:text-[#C8102E] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{founder.contact.phone}</span>
                  </a>
                )}
                {founder.contact.email && (
                  <a
                    href={`mailto:${founder.contact.email}`}
                    className="flex items-center gap-2 text-[#003366] hover:text-[#C8102E] transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{founder.contact.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
