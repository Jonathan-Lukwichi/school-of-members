import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#003366]/30",
  {
    variants: {
      variant: {
        default: "bg-[#003366] text-white font-semibold hover:bg-[#002244] shadow-md hover:shadow-lg",
        destructive:
          "bg-[#C8102E] text-white hover:bg-[#a00d25] shadow-md hover:shadow-lg",
        outline:
          "border-2 border-[#003366] bg-transparent text-[#003366] hover:bg-[#003366] hover:text-white",
        secondary:
          "bg-[#C8102E] text-white font-semibold hover:bg-[#a00d25] shadow-md hover:shadow-lg",
        ghost:
          "text-[#64748b] hover:text-[#003366] hover:bg-[#f1f5f9]",
        link: "text-[#003366] underline-offset-4 hover:underline hover:text-[#002244]",
        gold: "bg-[#b5985b] text-white font-semibold hover:bg-[#a08548] shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
