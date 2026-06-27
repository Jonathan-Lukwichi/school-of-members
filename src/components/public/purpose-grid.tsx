import {
  BookOpen,
  MessageCircle,
  Lightbulb,
  Heart,
  Clock,
  Award,
} from 'lucide-react'
import { purposes } from '@/data/content'

const iconMap = {
  BookOpen,
  MessageCircle,
  Lightbulb,
  Heart,
  Clock,
  Award,
}

export function PurposeGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purposes.map((purpose) => {
        const Icon = iconMap[purpose.icon as keyof typeof iconMap] || BookOpen

        return (
          <div
            key={purpose.id}
            className="bg-white rounded-xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-mint hover:border-emerald hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-btn shadow-emerald flex items-center justify-center mb-4">
              <Icon className="h-7 w-7 text-ink" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-ink">
              {purpose.title}
            </h3>
            <p className="text-ink-muted leading-relaxed">
              {purpose.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
