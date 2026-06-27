import {
  Sparkles,
  Home,
  ArrowRightLeft,
  RefreshCw,
  Crown,
} from 'lucide-react'
import { audienceTypes } from '@/data/content'

const iconMap = {
  Sparkles,
  Home,
  ArrowRightLeft,
  RefreshCw,
  Crown,
}

export function AudienceCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {audienceTypes.map((audience) => {
        const Icon = iconMap[audience.icon as keyof typeof iconMap] || Sparkles

        return (
          <div
            key={audience.id}
            className="bg-white rounded-xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-mint text-center group hover:border-emerald hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-emerald">
              <Icon className="h-6 w-6 text-emerald transition-colors group-hover:text-ink" />
            </div>
            <h3 className="font-display font-bold text-ink mb-1">
              {audience.title}
            </h3>
            <p className="text-sm text-ink-muted">
              {audience.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
