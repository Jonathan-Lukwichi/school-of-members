'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  X,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  title?: string
  onDownload?: () => void
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title, onDownload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setIsLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error)
    setError('Failed to load PDF. Please try again.')
    setIsLoading(false)
  }, [])

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      setPageNumber(value)
    }
  }

  // Reset state when dialog closes
  const handleClose = () => {
    setPageNumber(1)
    setScale(1.0)
    setIsLoading(true)
    setError(null)
    setIsFullscreen(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "bg-slate-900 border-slate-700 p-0 gap-0",
          isFullscreen
            ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
            : "max-w-4xl w-[95vw] h-[90vh] max-h-[90vh]"
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
        <div className="px-4 py-2 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 bg-slate-800">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 text-sm text-slate-300">
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageInput}
                className="w-12 text-center bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-white"
                min={1}
                max={numPages}
              />
              <span>/ {numPages}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages || isLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5 || isLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <button
              onClick={resetZoom}
              className="text-sm text-slate-300 hover:text-white min-w-[50px]"
            >
              {Math.round(scale * 100)}%
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0 || isLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

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

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-slate-800 flex items-start justify-center p-4">
          {error ? (
            <div className="text-red-400 text-center py-8">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={() => { setError(null); setIsLoading(true); }}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="text-slate-400 text-sm">Loading PDF...</span>
                  </div>
                </div>
              )}
              {pdfUrl && (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-xl"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              )}
            </>
          )}
        </div>

        {/* Footer with keyboard shortcuts hint */}
        <div className="px-4 py-2 border-t border-slate-700 bg-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Use arrow keys to navigate • Scroll to zoom
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
