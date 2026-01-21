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
  navy: 'bg-[#003366]',
  gold: 'bg-[#b5985b]',
  red: 'bg-[#C8102E]',
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'navy',
  subtitleIcon: SubtitleIcon,
  subtitleIconColor = 'text-[#64748b]',
}: StatsCardProps) {
  return (
    <Card className="bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#64748b]">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-xl ${iconColors[iconColor]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#1e293b]">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1">
            {SubtitleIcon && <SubtitleIcon className={`h-3 w-3 ${subtitleIconColor}`} />}
            <p className="text-xs text-[#64748b]">{subtitle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
