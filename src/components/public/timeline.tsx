import { cn } from '@/lib/utils'
import { type TimelineEvent } from '@/data/timeline'

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2" />

      <div className="space-y-8">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              'relative flex items-start gap-6',
              'md:gap-0',
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            )}
          >
            {/* Year bubble */}
            <div
              className={cn(
                'absolute left-0 md:left-1/2 transform md:-translate-x-1/2',
                'w-8 h-8 rounded-full flex items-center justify-center',
                'text-xs font-bold z-10',
                event.isHighlight
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-[#003366] text-white'
              )}
            >
              <span className="sr-only">{event.year}</span>
            </div>

            {/* Content */}
            <div
              className={cn(
                'ml-12 md:ml-0 md:w-1/2',
                index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
              )}
            >
              <div
                className={cn(
                  'bg-white rounded-lg shadow-md p-5 border-l-4 transition-all hover:shadow-lg',
                  event.isHighlight ? 'border-[#C8102E]' : 'border-[#003366]'
                )}
              >
                <span
                  className={cn(
                    'inline-block text-sm font-bold mb-1',
                    event.isHighlight ? 'text-[#C8102E]' : 'text-[#003366]'
                  )}
                >
                  {event.year}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-600 text-sm">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
