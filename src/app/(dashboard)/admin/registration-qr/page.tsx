import { DownloadableQR } from '@/components/admin/downloadable-qr'
import { QrCode } from 'lucide-react'

export const metadata = {
  title: 'Links & QR Codes',
}

export default function LinksAndQRPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
          <QrCode className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Links &amp; QR Codes</h1>
          <p className="text-sm text-muted-foreground">
            Share these to register members or reach the portals. Each can be downloaded as an image
            or a print-ready poster, and includes the link for anyone who can&apos;t scan.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DownloadableQR
          path="/student/register"
          title="Student Registration"
          subtitle="New members scan or click to register."
          posterHeading="SCAN TO REGISTER"
          fileBase="registration-qr"
        />
        <DownloadableQR
          path="/admin/login"
          title="Admin / Staff Login"
          subtitle="Share with admins and teachers to reach the staff portal."
          posterHeading="ADMIN / STAFF LOGIN"
          fileBase="admin-login-qr"
        />
      </div>
    </div>
  )
}
