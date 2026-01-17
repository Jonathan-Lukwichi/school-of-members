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
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-gray-100 text-center group hover:border-[#003366]"
          >
            <div className="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#003366] transition-colors">
              <Icon className="h-6 w-6 text-[#003366] group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">
              {audience.title}
            </h3>
            <p className="text-sm text-gray-600">
              {audience.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
