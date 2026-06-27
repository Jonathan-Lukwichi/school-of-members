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
    if (isAdminPortal) {
      const supabase = createClient()
      await supabase.auth.signOut()
    } else {
      // Phone+PIN students: clear the som_student_session cookie
      try {
        await fetch('/api/student/logout', { method: 'POST' })
      } catch {
        /* ignore */
      }
    }
    router.push(isAdminPortal ? '/admin/login' : '/student/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-emerald hover:bg-mint">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-ink-deep border-ink-deep">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-background border border-border rounded px-3 py-2 w-64 focus-within:border-emerald focus-within:ring-2 focus-within:ring-emerald/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-card px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Help */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-emerald hover:bg-mint">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-emerald hover:bg-mint relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald rounded-full" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 gap-3 px-2 hover:bg-mint">
              <Avatar className="h-8 w-8 border-2 border-emerald/20">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-emerald text-ink-deep text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">User</p>
                <p className="text-xs text-muted-foreground">View profile</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">My Account</p>
              <p className="text-xs text-muted-foreground">Manage account settings</p>
            </div>
            <DropdownMenuItem
              onClick={() => router.push(isAdminPortal ? '/admin' : '/student/profile')}
              className="hover:bg-mint focus:bg-mint cursor-pointer text-muted-foreground mt-1"
            >
              <User className="mr-2 h-4 w-4 text-emerald" />
              {isAdminPortal ? 'Dashboard' : 'Profile'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-mint focus:bg-mint cursor-pointer text-muted-foreground"
            >
              <Settings className="mr-2 h-4 w-4 text-emerald" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-red-50 focus:bg-red-50 text-red-600 cursor-pointer"
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
