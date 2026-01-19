import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#9ca3af] selection:bg-[#003366]/20 selection:text-[#003366] h-10 w-full min-w-0 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-base text-[#1e293b] shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-[#cbd5e1] focus:border-[#003366]/50 focus:ring-2 focus:ring-[#003366]/20 focus:bg-white",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
