'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { Download, FileImage, FileText, Copy, Check, QrCode } from 'lucide-react'

interface DownloadableQRProps {
  /** Path appended to the current origin, e.g. "/student/register" */
  path: string
  title: string
  subtitle: string
  /** Big banner text on the printable PDF poster, e.g. "SCAN TO REGISTER" */
  posterHeading: string
  /** Base filename for downloads, e.g. "registration-qr" */
  fileBase: string
}

export function DownloadableQR({ path, title, subtitle, posterHeading, fileBase }: DownloadableQRProps) {
  // Encode the URL of whatever domain the admin is viewing from, so the QR is
  // automatically correct on production (and on localhost in dev).
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://school-of-members.vercel.app'
    setUrl(`${origin}${path}`)
  }, [path])

  const getCanvas = (): HTMLCanvasElement | null =>
    canvasWrapRef.current?.querySelector('canvas') ?? null

  const downloadPNG = () => {
    const canvas = getCanvas()
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `school-of-members-${fileBase}.png`)
    }, 'image/png')
  }

  const downloadPDF = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const imgData = canvas.toDataURL('image/png')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(14, 23, 38)
    doc.text('School of Members', pageW / 2, 32, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(13)
    doc.setTextColor(91, 100, 112)
    doc.text('Ramah Full Gospel Church Pretoria', pageW / 2, 41, { align: 'center' })

    doc.setFillColor(20, 206, 150)
    doc.roundedRect(pageW / 2 - 50, 52, 100, 14, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(14, 23, 38)
    doc.text(posterHeading, pageW / 2, 61.5, { align: 'center' })

    const qrSize = 95
    doc.addImage(imgData, 'PNG', pageW / 2 - qrSize / 2, 78, qrSize, qrSize)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(13, 176, 130)
    doc.text(url, pageW / 2, 78 + qrSize + 12, { align: 'center' })

    doc.setTextColor(91, 100, 112)
    doc.text('Point your phone camera at the code to open the form.', pageW / 2, 78 + qrSize + 22, {
      align: 'center',
    })

    doc.save(`school-of-members-${fileBase}.pdf`)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
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
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div ref={canvasWrapRef} className="rounded-2xl border border-border bg-white p-4 shadow-premium">
          {url ? (
            <QRCodeCanvas value={url} size={224} level="H" marginSize={2} fgColor="#0E1726" bgColor="#FFFFFF" />
          ) : (
            <div className="h-[224px] w-[224px] animate-pulse rounded-lg bg-muted" />
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <span className="truncate text-sm text-muted-foreground">{url || '…'}</span>
        <button
          onClick={copyLink}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald transition-colors hover:bg-emerald/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          onClick={downloadPNG}
          disabled={!url}
          variant="outline"
          className="gap-2 border-emerald/30 text-foreground hover:bg-emerald/5"
        >
          <FileImage className="h-4 w-4 text-emerald" />
          Download PNG
        </Button>
        <Button
          onClick={downloadPDF}
          disabled={!url}
          className="gap-2 bg-emerald-btn font-semibold text-ink shadow-emerald hover:brightness-105"
        >
          <FileText className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Download className="h-3.5 w-3.5" />
        PDF is a ready-to-print poster.
      </p>
    </div>
  )
}
