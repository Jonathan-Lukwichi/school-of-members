import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva("font-heading font-bold text-slate-50 tracking-tight", {
  variants: {
    size: {
      h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]",
      h2: "text-3xl sm:text-4xl md:text-5xl leading-tight",
      h3: "text-2xl sm:text-3xl leading-snug",
      h4: "text-xl sm:text-2xl leading-snug",
    },
    weight: {
      default: "font-bold",
      medium: "font-medium",
      semibold: "font-semibold",
    }
  },
  defaultVariants: {
    size: "h2",
    weight: "default",
  },
})

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, weight, as, children, ...props }, ref) => {
    const Component = as || (size === "h1" ? "h1" : size === "h2" ? "h2" : "h3")
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, weight, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva("text-slate-400 leading-relaxed font-sans", {
  variants: {
    size: {
      default: "text-base md:text-lg",
      sm: "text-sm",
      lg: "text-lg md:text-xl",
      lead: "text-xl md:text-2xl font-light text-slate-300",
    },
    weight: {
      default: "font-normal",
      medium: "font-medium",
    }
  },
  defaultVariants: {
    size: "default",
    weight: "default",
  },
})

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, as: Component = "p", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = "Text"

export { Heading, Text }
