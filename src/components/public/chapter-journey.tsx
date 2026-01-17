import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// 12 chapters representing the spiritual journey
const chapters = [
  { number: 1, title: 'Introduction to Membership' },
  { number: 2, title: 'The Nature of the Church' },
  { number: 3, title: 'Biblical Foundations' },
  { number: 4, title: 'Pastor-Member Relationship' },
  { number: 5, title: 'Spiritual Covenant' },
  { number: 6, title: 'Responsibilities' },
  { number: 7, title: 'Community Life' },
  { number: 8, title: 'Service & Ministry' },
  { number: 9, title: 'Spiritual Growth' },
  { number: 10, title: 'Giving & Stewardship' },
  { number: 11, title: 'Preparing for Eternity' },
  { number: 12, title: 'Graduation & Commitment' },
]

export function ChapterJourney() {
  return (
    <div className="relative">
      {/* Desktop: Horizontal path */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Path line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] via-[#C8102E] to-[#b5985b] rounded-full transform -translate-y-1/2" />

          {/* Chapters */}
          <div className="grid grid-cols-6 gap-4">
            {chapters.slice(0, 6).map((chapter, index) => (
              <ChapterNode
                key={chapter.number}
                chapter={chapter}
                colorIndex={index}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 gap-4 mt-16">
            {chapters.slice(6, 12).map((chapter, index) => (
              <ChapterNode
                key={chapter.number}
                chapter={chapter}
                colorIndex={index + 6}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Vertical path */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#003366] via-[#C8102E] to-[#b5985b] rounded-full" />

          {/* Chapters */}
          <div className="space-y-6">
            {chapters.map((chapter, index) => (
              <div key={chapter.number} className="relative flex items-center gap-4 pl-4">
                {/* Node */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-md',
                    getColorClass(index)
                  )}
                >
                  {chapter.number}
                </div>
                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-4 flex-1 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Chapter {chapter.number}</p>
                  <h4 className="font-bold text-gray-900">{chapter.title}</h4>
                </div>
              </div>
            ))}

            {/* Graduation node */}
            <div className="relative flex items-center gap-4 pl-4">
              <div className="w-12 h-12 rounded-full bg-[#22c55e] flex items-center justify-center z-10 shadow-md">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="bg-[#22c55e]/10 rounded-lg p-4 flex-1 border border-[#22c55e]/30">
                <p className="text-[#22c55e] font-bold">Certification Complete!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChapterNode({
  chapter,
  colorIndex,
}: {
  chapter: { number: number; title: string }
  colorIndex: number
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Circle node */}
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg transition-transform hover:scale-110',
          getColorClass(colorIndex)
        )}
      >
        {chapter.number}
      </div>
      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-1">Chapter {chapter.number}</p>
        <h4 className="text-sm font-semibold text-gray-800 leading-tight">
          {chapter.title}
        </h4>
      </div>
    </div>
  )
}

function getColorClass(index: number): string {
  const colors = [
    'bg-[#003366]',
    'bg-[#004080]',
    'bg-[#8B5CF6]',
    'bg-[#C8102E]',
    'bg-[#e01b3d]',
    'bg-[#b5985b]',
    'bg-[#0ea5e9]',
    'bg-[#06b6d4]',
    'bg-[#22c55e]',
    'bg-[#16a34a]',
    'bg-[#f59e0b]',
    'bg-[#003366]',
  ]
  return colors[index % colors.length]
}
