'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  GripVertical,
  Quote,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  photo_url?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    photo_url: '',
    is_active: true,
    display_order: 0,
  })
  const [saving, setSaving] = useState(false)

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      const response = await fetch('/api/admin/testimonials')
      const data = await response.json()

      if (response.ok) {
        setTestimonials(data.testimonials || [])
      } else {
        toast.error(data.error || 'Failed to fetch testimonials')
      }
    } catch (error) {
      toast.error('Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setSelectedTestimonial(null)
    setFormData({
      name: '',
      role: '',
      content: '',
      photo_url: '',
      is_active: true,
      display_order: testimonials.length + 1,
    })
    setDialogOpen(true)
  }

  function openEditDialog(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      photo_url: testimonial.photo_url || '',
      is_active: testimonial.is_active,
      display_order: testimonial.display_order,
    })
    setDialogOpen(true)
  }

  function openDeleteDialog(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    if (!formData.name || !formData.role || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const url = '/api/admin/testimonials'
      const method = selectedTestimonial ? 'PATCH' : 'POST'
      const body = selectedTestimonial
        ? { id: selectedTestimonial.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(selectedTestimonial ? 'Testimonial updated' : 'Testimonial created')
        setDialogOpen(false)
        fetchTestimonials()
      } else {
        toast.error(data.error || 'Failed to save testimonial')
      }
    } catch (error) {
      toast.error('Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedTestimonial) return

    try {
      const response = await fetch(`/api/admin/testimonials?id=${selectedTestimonial.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Testimonial deleted')
        setDeleteDialogOpen(false)
        fetchTestimonials()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete testimonial')
      }
    } catch (error) {
      toast.error('Failed to delete testimonial')
    }
  }

  async function toggleActive(testimonial: Testimonial) {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testimonial.id,
          is_active: !testimonial.is_active,
        }),
      })

      if (response.ok) {
        toast.success(testimonial.is_active ? 'Testimonial hidden' : 'Testimonial visible')
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Failed to update testimonial')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage testimonials displayed on the homepage
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-emerald-btn text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border shadow-premium p-4">
          <p className="text-2xl font-bold text-emerald">{testimonials.length}</p>
          <p className="text-sm text-muted-foreground">Total Testimonials</p>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-premium p-4">
          <p className="text-2xl font-bold text-emerald-deep">
            {testimonials.filter(t => t.is_active).length}
          </p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-premium p-4">
          <p className="text-2xl font-bold text-muted-foreground">
            {testimonials.filter(t => !t.is_active).length}
          </p>
          <p className="text-sm text-muted-foreground">Hidden</p>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-card rounded-lg border border-border shadow-premium">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <Quote className="h-12 w-12 text-emerald/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No testimonials yet</p>
            <Button
              onClick={openCreateDialog}
              variant="outline"
              className="mt-4"
            >
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 flex items-start gap-4 hover:bg-mint-soft transition-colors"
              >
                {/* Order indicator */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-5 w-5 cursor-move" />
                  <span className="text-sm font-medium w-6 text-center">
                    {testimonial.display_order}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </span>
                    {!testimonial.is_active && (
                      <span className="text-xs bg-mint-soft text-muted-foreground px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(testimonial)}
                    title={testimonial.is_active ? 'Hide' : 'Show'}
                  >
                    {testimonial.is_active ? (
                      <Eye className="h-4 w-4 text-emerald-deep" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(testimonial)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(testimonial)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {selectedTestimonial
                ? 'Update the testimonial details below.'
                : 'Add a new testimonial to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grace M."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="New Member"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Testimonial Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share their experience..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL (optional)</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label htmlFor="is_active">Show on Homepage</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-btn text-white"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial from {selectedTestimonial?.name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
