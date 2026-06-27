import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-12', className)}>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-ink-muted max-w-3xl mx-auto text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
