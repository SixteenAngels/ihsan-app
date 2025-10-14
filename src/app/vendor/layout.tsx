import { VendorTopNav } from '@/components/layout/role-topnav'
import { RoleGuard } from '@/components/auth/role-guard'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="vendor">
      <div className="min-h-screen bg-background text-foreground">
        <VendorTopNav />
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </RoleGuard>
  )
}


