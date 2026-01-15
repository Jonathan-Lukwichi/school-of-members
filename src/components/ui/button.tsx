import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0779bf]/30",
  {
    variants: {
      variant: {
        default: "bg-[#0779bf] text-white font-semibold hover:bg-[#0e56b9] shadow-lg shadow-[#0779bf]/20 hover:shadow-[#0779bf]/30",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/20",
        outline:
          "border border-[#0779bf]/30 bg-transparent text-[#0779bf] hover:bg-[#0779bf]/10 hover:border-[#0779bf]/50",
        secondary:
          "bg-[#b5985b] text-[#0a0a0f] font-semibold hover:bg-[#c9a962] shadow-lg shadow-[#b5985b]/20",
        ghost:
          "text-zinc-400 hover:text-white hover:bg-white/5",
        link: "text-[#0779bf] underline-offset-4 hover:underline hover:text-[#0e56b9]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
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
