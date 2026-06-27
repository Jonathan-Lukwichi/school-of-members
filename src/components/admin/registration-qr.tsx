'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { Download, FileImage, FileText, Copy, Check, QrCode } from 'lucide-react'

const REGISTER_PATH = '/student/register'

export function RegistrationQR() {
  // Encode the registration URL of whatever domain the admin is viewing from,
  // so the QR is automatically correct on production (and on localhost in dev).
  const [registerUrl, setRegisterUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'
    setRegisterUrl(`${origin}${REGISTER_PATH}`)
  }, [])

  const getCanvas = (): HTMLCanvasElement | null =>
    canvasWrapRef.current?.querySelector('canvas') ?? null

  const downloadPNG = () => {
    const canvas = getCanvas()
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, 'school-of-members-registration-qr.png')
    }, 'image/png')
  }

  const downloadPDF = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const imgData = canvas.toDataURL('image/png')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()

    // Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(14, 23, 38) // ink
    doc.text('School of Members', pageW / 2, 32, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(13)
    doc.setTextColor(91, 100, 112) // muted
    doc.text('Ramah Full Gospel Church Pretoria', pageW / 2, 41, { align: 'center' })

    // "Scan to Register" banner
    doc.setFillColor(20, 206, 150) // emerald
    doc.roundedRect(pageW / 2 - 45, 52, 90, 14, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(14, 23, 38)
    doc.text('SCAN TO REGISTER', pageW / 2, 61.5, { align: 'center' })

    // QR image (centered)
    const qrSize = 95
    doc.addImage(imgData, 'PNG', pageW / 2 - qrSize / 2, 78, qrSize, qrSize)

    // URL under the QR
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(13, 176, 130) // emerald-dark
    doc.text(registerUrl, pageW / 2, 78 + qrSize + 12, { align: 'center' })

    doc.setFontSize(11)
    doc.setTextColor(91, 100, 112)
    doc.text(
      'Point your phone camera at the code to join the School of Members.',
      pageW / 2,
      78 + qrSize + 22,
      { align: 'center' }
    )

    doc.save('school-of-members-registration-qr.pdf')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(registerUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
          <QrCode className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Registration QR Code</h2>
          <p className="text-sm text-muted-foreground">Print or share — it opens the student registration form.</p>
        </div>
      </div>

      {/* QR */}
      <div className="flex justify-center">
        <div
          ref={canvasWrapRef}
          className="rounded-2xl border border-border bg-white p-4 shadow-premium"
        >
          {registerUrl ? (
            <QRCodeCanvas
              value={registerUrl}
              size={224}
              level="H"
              marginSize={2}
              fgColor="#0E1726"
              bgColor="#FFFFFF"
              imageSettings={undefined}
            />
          ) : (
            <div className="h-[224px] w-[224px] animate-pulse rounded-lg bg-muted" />
          )}
        </div>
      </div>

      {/* URL + copy */}
      <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <span className="truncate text-sm text-muted-foreground">{registerUrl || '…'}</span>
        <button
          onClick={copyLink}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald transition-colors hover:bg-emerald/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          aria-label="Copy registration link"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Downloads */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          onClick={downloadPNG}
          disabled={!registerUrl}
          variant="outline"
          className="gap-2 border-emerald/30 text-foreground hover:bg-emerald/5"
        >
          <FileImage className="h-4 w-4 text-emerald" />
          Download PNG
        </Button>
        <Button
          onClick={downloadPDF}
          disabled={!registerUrl}
          className="gap-2 bg-emerald-btn font-semibold text-ink shadow-emerald hover:brightness-105"
        >
          <FileText className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Download className="h-3.5 w-3.5" />
        PDF is a ready-to-print “Scan to Register” poster.
      </p>
    </div>
  )
}
