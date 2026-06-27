'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: 'navy' | 'gold' | 'red'
  subtitleIcon?: LucideIcon
  subtitleIconColor?: string
}

const iconColors = {
  navy: 'bg-emerald',
  gold: 'bg-emerald-deep',
  red: 'bg-ink',
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'navy',
  subtitleIcon: SubtitleIcon,
  subtitleIconColor = 'text-muted-foreground',
}: StatsCardProps) {
  return (
    <Card className="bg-card border border-border shadow-premium hover:shadow-premium-lg transition-shadow overflow-hidden animate-reveal">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-xl ${iconColors[iconColor]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1">
            {SubtitleIcon && <SubtitleIcon className={`h-3 w-3 ${subtitleIconColor}`} />}
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
