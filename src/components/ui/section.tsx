import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "bg-background py-20 md:py-28",
      muted: "bg-slate-900/50 py-20 md:py-28 border-y border-slate-800/50",
      highlight: "bg-slate-800/30 py-20 md:py-28 border-y border-slate-700/30",
      hero: "min-h-[90vh] flex items-center justify-center pt-32 pb-20 relative overflow-hidden",
      narrow: "py-12 md:py-16",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
