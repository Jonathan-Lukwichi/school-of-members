'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { validateFile, BucketName, formatFileSize, ALLOWED_FILE_TYPES } from '@/lib/supabase/storage'

interface FileUploadProps {
  bucket: BucketName
  onFileSelect: (file: File) => void
  onUpload?: (file: File) => Promise<void>
  isUploading?: boolean
  uploadProgress?: number
  accept?: string
  maxSize?: number
  className?: string
  disabled?: boolean
}

export function FileUpload({
  bucket,
  onFileSelect,
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  accept,
  maxSize = 10 * 1024 * 1024,
  className,
  disabled = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = ALLOWED_FILE_TYPES[bucket]
  const acceptString = accept || allowedTypes.join(',')

  const handleFile = useCallback((file: File) => {
    setError(null)

    const validation = validateFile(file, bucket)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
    onFileSelect(file)

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [bucket, onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [disabled, handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const handleUploadClick = useCallback(async () => {
    if (selectedFile && onUpload) {
      await onUpload(selectedFile)
    }
  }, [selectedFile, onUpload])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-emerald" />
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-emerald-deep" />
    }
    return <FileText className="h-8 w-8 text-muted-foreground" />
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging && 'border-emerald bg-mint',
          error && 'border-red-300 bg-red-50',
          !isDragging && !error && 'border-border hover:border-emerald/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled || isUploading}
        />

        {selectedFile ? (
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg"
              />
            ) : (
              <div className="h-16 w-16 bg-mint rounded-lg flex items-center justify-center">
                {getFileIcon(selectedFile)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
              {isUploading && (
                <Progress value={uploadProgress} className="mt-2 h-2" />
              )}
            </div>
            {!isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-emerald/60" />
            <div className="mt-4">
              <p className="font-medium">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {bucket === 'modules' && 'PDF or Images (PNG, JPG) up to 10MB'}
                {bucket === 'thumbnails' && 'Images (PNG, JPG, WebP) up to 10MB'}
                {bucket === 'avatars' && 'Images (PNG, JPG, WebP) up to 10MB'}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {selectedFile && onUpload && !isUploading && (
        <Button
          type="button"
          onClick={handleUploadClick}
          className="mt-4 w-full"
          disabled={disabled}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading... {uploadProgress}%
        </div>
      )}
    </div>
  )
}
