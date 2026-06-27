import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <Card className="bg-card border border-border shadow-premium">
        <CardHeader>
          <CardTitle className="font-display text-foreground">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-emerald">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-mint">
                <User className="h-10 w-10 text-emerald" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium text-foreground">Your Name</h3>
              <p className="text-sm text-muted-foreground">your.email@example.com</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Profile editing will be available after you sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
