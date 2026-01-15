import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
