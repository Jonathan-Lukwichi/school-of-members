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

const colors = [
  { bg: 'bg-[#003366]', text: 'text-[#003366]' },
  { bg: 'bg-[#C8102E]', text: 'text-[#C8102E]' },
  { bg: 'bg-[#b5985b]', text: 'text-[#b5985b]' },
  { bg: 'bg-[#0ea5e9]', text: 'text-[#0ea5e9]' },
  { bg: 'bg-[#22c55e]', text: 'text-[#22c55e]' },
  { bg: 'bg-[#8b5cf6]', text: 'text-[#8b5cf6]' },
]

export function PurposeGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purposes.map((purpose, index) => {
        const Icon = iconMap[purpose.icon as keyof typeof iconMap] || BookOpen
        const color = colors[index % colors.length]

        return (
          <div
            key={purpose.id}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
          >
            <div
              className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center mb-4`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${color.text}`}>
              {purpose.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {purpose.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
