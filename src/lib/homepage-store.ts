export type HomepageSettings = {
  banners: string[]
  featuredProductIds: string[]
  discountsNote?: string
}

const settings: HomepageSettings = {
  banners: [],
  featuredProductIds: [],
  discountsNote: ''
}

export function getHomepageSettings(): HomepageSettings {
  return settings
}

export function updateHomepageSettings(partial: Partial<HomepageSettings>): HomepageSettings {
  if (Array.isArray(partial.banners)) settings.banners = partial.banners
  if (Array.isArray(partial.featuredProductIds)) settings.featuredProductIds = partial.featuredProductIds
  if (typeof partial.discountsNote === 'string') settings.discountsNote = partial.discountsNote
  return settings
}


