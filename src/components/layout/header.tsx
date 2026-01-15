'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu, User, Settings, Bell, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/5">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[#0a0a0f] border-white/[0.06]">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 w-64 focus-within:border-[#0779bf]/30 transition-colors">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 text-[10px] font-medium text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Help */}
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#0779bf] rounded-full shadow-[0_0_8px_rgba(7,121,191,0.6)]" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/[0.06] mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 gap-3 px-2 hover:bg-white/5">
              <Avatar className="h-8 w-8 border-2 border-[#0779bf]/30">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-[#0779bf] to-[#0e56b9] text-white text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-zinc-500">View profile</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#13131a] border-white/[0.08] text-white">
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-white">My Account</p>
              <p className="text-xs text-zinc-500">Manage your account settings</p>
            </div>
            <DropdownMenuItem
              onClick={() => router.push('/student/profile')}
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-zinc-300 mt-1"
            >
              <User className="mr-2 h-4 w-4 text-[#0779bf]" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-zinc-300"
            >
              <Settings className="mr-2 h-4 w-4 text-[#0779bf]" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
