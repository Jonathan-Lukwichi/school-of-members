import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-500 selection:bg-purple-500 selection:text-white h-10 w-full min-w-0 rounded-lg border border-purple-500/20 bg-slate-900/50 px-4 py-2 text-base text-white shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-slate-900/80",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
