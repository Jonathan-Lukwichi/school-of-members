'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { AdminForm } from '@/components/forms/admin-form'
import { toast } from 'sonner'
import { Plus, Trash2, Users, Shield, Loader2, Mail, Phone } from 'lucide-react'

interface Admin {
  id: string
  email: string
  full_name: string
  phone: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setAdmins(data.admins || [])
    } catch (error) {
      toast.error('Failed to fetch admin users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (data: { fullName: string; email: string; phone?: string; password: string }) => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Admin created successfully!')
      setIsDialogOpen(false)
      fetchAdmins()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create admin')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteAdmin) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/users?id=${deleteAdmin.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Admin deleted successfully!')
      setDeleteAdmin(null)
      fetchAdmins()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete admin')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Admin Users</h1>
          <p className="text-[#64748b]">
            Manage administrator accounts for the platform
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Add a new administrator account. They will have full access to manage the platform.
              </DialogDescription>
            </DialogHeader>
            <AdminForm
              onSubmit={handleCreateAdmin}
              isLoading={isCreating}
              submitLabel="Create Admin"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Admins</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#003366] flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">{admins.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Platform Status</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#e2e8f0] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Recommended</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#b5985b]/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-[#b5985b]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">3-5</div>
            <p className="text-xs text-[#64748b]">Admin accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Administrator Accounts</CardTitle>
          <CardDescription className="text-[#64748b]">
            All users with administrative privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-[#003366]/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#003366]" />
              </div>
              <h3 className="text-lg font-medium text-[#1e293b]">No Admins Found</h3>
              <p className="text-[#64748b]">
                Click "Add Admin" to create the first administrator account.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-[#f8fafc]">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#003366]/10 flex items-center justify-center">
                          <span className="text-[#003366] font-semibold text-sm">
                            {admin.full_name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <span className="text-[#1e293b]">{admin.full_name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[#64748b]">
                        <Mail className="h-4 w-4 text-[#003366]" />
                        {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.phone ? (
                        <div className="flex items-center gap-2 text-[#64748b]">
                          <Phone className="h-4 w-4 text-[#003366]" />
                          {admin.phone}
                        </div>
                      ) : (
                        <span className="text-[#94a3b8]">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[#64748b]">{formatDate(admin.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteAdmin} onOpenChange={() => setDeleteAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteAdmin?.full_name}&apos;s admin account?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
