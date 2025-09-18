export type VendorStore = {
  vendorId: string
  name: string
  logoUrl?: string
  bannerUrl?: string
  description?: string
}

const stores: Record<string, VendorStore> = {
  'vendor-1': {
    vendorId: 'vendor-1',
    name: 'Acme Vendor',
    logoUrl: '',
    bannerUrl: '',
    description: 'Quality gadgets and accessories'
  }
}

export function getVendorStore(vendorId: string): VendorStore {
  if (!stores[vendorId]) {
    stores[vendorId] = { vendorId, name: 'My Store' }
  }
  return stores[vendorId]
}

export function updateVendorStore(vendorId: string, partial: Partial<VendorStore>): VendorStore {
  const current = getVendorStore(vendorId)
  stores[vendorId] = { ...current, ...partial, vendorId }
  return stores[vendorId]
}


