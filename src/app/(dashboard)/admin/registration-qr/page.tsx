import { DownloadableQR } from '@/components/admin/downloadable-qr'
import { QrCode } from 'lucide-react'

export const metadata = {
  title: 'Registration QR',
}

export default function RegistrationQRPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
          <QrCode className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Registration QR</h1>
          <p className="text-sm text-muted-foreground">
            Share this code so new members can register themselves. Download it as an image or a
            ready-to-print poster.
          </p>
        </div>
      </div>

      <DownloadableQR
        path="/student/register"
        title="Registration QR Code"
        subtitle="Print or share — it opens the student registration form."
        posterHeading="SCAN TO REGISTER"
        fileBase="registration-qr"
      />
    </div>
  )
}
