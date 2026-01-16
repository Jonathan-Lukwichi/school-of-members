import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Profile</h1>
        <p className="text-[#64748b]">
          Manage your account settings.
        </p>
      </div>

      <Card className="bg-white border border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-[#003366]">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-[#003366]/10">
                <User className="h-10 w-10 text-[#003366]" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium text-[#1e293b]">Your Name</h3>
              <p className="text-sm text-[#64748b]">your.email@example.com</p>
            </div>
          </div>

          <p className="text-sm text-[#64748b]">
            Profile editing will be available after you sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
