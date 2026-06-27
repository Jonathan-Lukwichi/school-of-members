import { createBrowserClient } from '@/lib/supabase/client'

export const ALLOWED_FILE_TYPES = {
  modules: [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/png',
    'image/jpeg',
    'image/jpg',
  ],
  thumbnails: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  avatars: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export type BucketName = 'modules' | 'thumbnails' | 'avatars'

export function validateFile(file: File, bucket: BucketName): { valid: boolean; error?: string } {
  const allowedTypes = ALLOWED_FILE_TYPES[bucket]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}

export async function uploadFile(
  file: File,
  bucket: BucketName,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const validation = validateFile(file, bucket)
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Invalid file' }
  }

  const supabase = createBrowserClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${path}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { url: publicUrl, error: null }
}

export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createBrowserClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    return { url: null, error: error.message }
  }

  return { url: data.signedUrl, error: null }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
