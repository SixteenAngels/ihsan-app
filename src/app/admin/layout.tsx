import { AdminTopNav } from '@/components/layout/role-topnav'
import { RoleGuard } from '@/components/auth/role-guard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <div className="min-h-screen bg-background text-foreground">
        <AdminTopNav />
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </RoleGuard>
  )
}


