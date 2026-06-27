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
    text: 'text-emerald',
    gradient: 'from-emerald to-emerald-deep',
    badge: 'text-emerald',
  },
  gold: {
    text: 'text-emerald',
    gradient: 'from-emerald-light to-emerald',
    badge: 'text-emerald',
  },
  red: {
    text: 'text-emerald',
    gradient: 'from-emerald to-emerald-dark',
    badge: 'text-emerald',
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
        <h1 className="font-display text-4xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-premium p-8 animate-reveal">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient}`} />
      <div className="relative">
        {greeting && (
          <div className={`flex items-center gap-2 ${colors.badge} text-sm font-medium mb-2`}>
            <Icon className="h-4 w-4" />
            {greeting}
          </div>
        )}
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          {greetingName ? (
            <>
              {title} <span className={colors.text}>{greetingName}!</span>
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground max-w-md">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
