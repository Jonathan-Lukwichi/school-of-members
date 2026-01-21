'use client'

import { Sparkles } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  greeting?: string
  greetingName?: string
  accent?: 'navy' | 'gold' | 'red'
  icon?: LucideIcon
  showBanner?: boolean
}

const accentColors = {
  navy: {
    text: 'text-[#003366]',
    gradient: 'from-[#003366] to-[#b5985b]',
    badge: 'text-[#003366]',
  },
  gold: {
    text: 'text-[#b5985b]',
    gradient: 'from-[#b5985b] to-[#C8102E]',
    badge: 'text-[#b5985b]',
  },
  red: {
    text: 'text-[#C8102E]',
    gradient: 'from-[#C8102E] to-[#003366]',
    badge: 'text-[#C8102E]',
  },
}

export function PageHeader({
  title,
  subtitle,
  greeting,
  greetingName,
  accent = 'navy',
  icon: Icon = Sparkles,
  showBanner = true,
}: PageHeaderProps) {
  const colors = accentColors[accent]

  if (!showBanner) {
    return (
      <div className="relative">
        <h1 className="text-4xl font-bold text-[#1e293b]">{title}</h1>
        {subtitle && (
          <p className="text-[#64748b] mt-2">{subtitle}</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] shadow-sm p-8">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient}`} />
      <div className="relative">
        {greeting && (
          <div className={`flex items-center gap-2 ${colors.badge} text-sm font-medium mb-2`}>
            <Icon className="h-4 w-4" />
            {greeting}
          </div>
        )}
        <h1 className="text-4xl font-bold text-[#1e293b] mb-2">
          {greetingName ? (
            <>
              {title} <span className={colors.text}>{greetingName}!</span>
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle && (
          <p className="text-[#64748b] max-w-md">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
