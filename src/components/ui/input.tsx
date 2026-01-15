import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-zinc-500 selection:bg-[#0779bf]/30 selection:text-white h-10 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-base text-white shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-white/20 focus:border-[#0779bf]/50 focus:ring-2 focus:ring-[#0779bf]/20 focus:bg-white/[0.05]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
