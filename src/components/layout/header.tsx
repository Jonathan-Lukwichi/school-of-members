'use client'

import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const isAdminPortal = pathname?.startsWith('/admin')

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Redirect to the appropriate login page based on current portal
    router.push(isAdminPortal ? '/admin/login' : '/student/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#e2e8f0] bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-[#64748b] hover:text-[#003366] hover:bg-[#f1f5f9]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[#003366] border-[#003366]">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded px-3 py-2 w-64 focus-within:border-[#003366] focus-within:ring-2 focus-within:ring-[#003366]/10 transition-all">
          <Search className="h-4 w-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none flex-1"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-[#e2e8f0] bg-white px-1.5 text-[10px] font-medium text-[#64748b]">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Help */}
        <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#003366] hover:bg-[#f1f5f9]">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#003366] hover:bg-[#f1f5f9] relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#C8102E] rounded-full" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#e2e8f0] mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 gap-3 px-2 hover:bg-[#f1f5f9]">
              <Avatar className="h-8 w-8 border-2 border-[#003366]/20">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-[#003366] text-white text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[#1e293b]">User</p>
                <p className="text-xs text-[#64748b]">View profile</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#e2e8f0] text-[#1e293b]">
            <div className="px-3 py-2 border-b border-[#e2e8f0]">
              <p className="text-sm font-medium text-[#1e293b]">My Account</p>
              <p className="text-xs text-[#64748b]">Manage account settings</p>
            </div>
            <DropdownMenuItem
              onClick={() => router.push(isAdminPortal ? '/admin' : '/student/profile')}
              className="hover:bg-[#f1f5f9] focus:bg-[#f1f5f9] cursor-pointer text-[#64748b] mt-1"
            >
              <User className="mr-2 h-4 w-4 text-[#003366]" />
              {isAdminPortal ? 'Dashboard' : 'Profile'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-[#f1f5f9] focus:bg-[#f1f5f9] cursor-pointer text-[#64748b]"
            >
              <Settings className="mr-2 h-4 w-4 text-[#003366]" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#e2e8f0]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-red-50 focus:bg-red-50 text-[#C8102E] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
