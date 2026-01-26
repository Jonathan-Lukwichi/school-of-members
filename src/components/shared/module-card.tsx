'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Image as ImageIcon,
  Download,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/supabase/storage'

interface Module {
  id: string
  title: string
  description: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  order_index: number
  created_at: string
}

interface ModuleProgress {
  is_completed: boolean
  download_count: number
}

interface ModuleCardProps {
  module: Module
  progress?: ModuleProgress | null
  isAdmin?: boolean
  onPreview?: () => Promise<void>
  onDownload?: () => Promise<void>
  onEdit?: () => void
  onDelete?: () => void
  onMarkComplete?: () => Promise<void>
  className?: string
}

export function ModuleCard({
  module,
  progress,
  isAdmin = false,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  onMarkComplete,
  className
}: ModuleCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const isCompleted = progress?.is_completed || false
  const downloadCount = progress?.download_count || 0

  const getFileIcon = () => {
    if (!module.file_name) return <FileText className="h-8 w-8 text-gray-400" />

    const ext = module.file_name.split('.').pop()?.toLowerCase()
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    if (ext === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  const handlePreview = async () => {
    if (!onPreview) return
    setIsPreviewing(true)
    try {
      await onPreview()
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleDownload = async () => {
    if (!onDownload) return
    setIsDownloading(true)
    try {
      await onDownload()
    } finally {
      setIsDownloading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!onMarkComplete) return
    setIsMarking(true)
    try {
      await onMarkComplete()
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isCompleted && 'border-green-200 bg-green-50/50',
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            {getFileIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{module.title}</h3>
              {isCompleted && (
                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>

            {module.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {module.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {module.file_size && (
                <span>{formatFileSize(module.file_size)}</span>
              )}
              {downloadCount > 0 && (
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {downloadCount} download{downloadCount !== 1 ? 's' : ''}
                </span>
              )}
              {module.file_name && (
                <span className="truncate max-w-[150px]">{module.file_name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {module.file_url && (
              <Button
                size="sm"
                variant={isCompleted ? 'outline' : 'default'}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </>
                )}
              </Button>
            )}

            {!isAdmin && !isCompleted && onMarkComplete && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkComplete}
                disabled={isMarking}
              >
                {isMarking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Done
                  </>
                )}
              </Button>
            )}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
