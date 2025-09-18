import { ManagerTopNav } from '@/components/layout/role-topnav'
import { RoleGuard } from '@/components/auth/role-guard'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="manager">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <ManagerTopNav />
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </RoleGuard>
  )
}


