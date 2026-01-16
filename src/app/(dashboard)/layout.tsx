import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
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
