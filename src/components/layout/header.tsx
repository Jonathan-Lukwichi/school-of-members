'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu, User, Settings } from 'lucide-react'
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
    <header className="sticky top-0 z-30 h-16 border-b border-purple-500/20 bg-[#0d0619]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white hover:bg-purple-500/20">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[#0d0619] border-purple-500/20">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-purple-500/50 transition-all">
              <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a0a2e] border-purple-500/30 text-slate-200">
            <DropdownMenuItem
              onClick={() => router.push('/student/profile')}
              className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 text-purple-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 text-purple-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-purple-500/20" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
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
