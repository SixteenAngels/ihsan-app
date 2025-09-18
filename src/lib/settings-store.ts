export type PlatformSettings = {
  approvalRequired: boolean
  commissionPercent: number
  groupBuyEnabled: boolean
  vendorFeaturesEnabled: boolean
}

// In-memory settings store for mock implementation
export const inMemorySettings: PlatformSettings = {
  approvalRequired: true,
  commissionPercent: 10,
  groupBuyEnabled: false,
  vendorFeaturesEnabled: false,
}

export function getSettings(): PlatformSettings {
  return inMemorySettings
}

export function updateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
  if (typeof partial.approvalRequired === 'boolean') {
    inMemorySettings.approvalRequired = partial.approvalRequired
  }
  if (typeof partial.commissionPercent === 'number') {
    inMemorySettings.commissionPercent = Math.max(0, Math.min(100, partial.commissionPercent))
  }
  if (typeof partial.groupBuyEnabled === 'boolean') {
    inMemorySettings.groupBuyEnabled = partial.groupBuyEnabled
  }
  if (typeof partial.vendorFeaturesEnabled === 'boolean') {
    inMemorySettings.vendorFeaturesEnabled = partial.vendorFeaturesEnabled
  }
  return inMemorySettings
}


