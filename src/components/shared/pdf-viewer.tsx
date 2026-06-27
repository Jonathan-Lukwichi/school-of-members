'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Download,
  X,
  Loader2,
  Maximize2,
  Minimize2,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  title?: string
  onDownload?: () => void
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title, onDownload }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const handleClose = () => {
    setIsLoading(true)
    setIsFullscreen(false)
    onClose()
  }

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "bg-slate-900 border-slate-700 p-0 gap-0",
          isFullscreen
            ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
            : "max-w-5xl w-[95vw] h-[90vh] max-h-[90vh]"
        )}
      >
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-slate-700 flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-sm md:text-base truncate flex-1 pr-4">
            {title || 'PDF Viewer'}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={openInNewTab}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between gap-2 bg-slate-800">
          <p className="text-sm text-slate-400">
            Use the PDF viewer controls below to navigate
          </p>

          {/* Download Button */}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>

        {/* PDF Content - Using iframe for better compatibility */}
        <div className="flex-1 overflow-hidden bg-slate-800 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-emerald" />
                <span className="text-slate-400 text-sm">Loading PDF...</span>
              </div>
            </div>
          )}
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              title={title || 'PDF Document'}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-700 bg-slate-800">
          <p className="text-xs text-slate-500 text-center">
            If the PDF doesn&apos;t load, click the external link icon to open in a new tab
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
