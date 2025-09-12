// Role-based access control utilities for Ihsan E-commerce Platform
export type UserRole = 'customer' | 'vendor' | 'vendor_manager' | 'admin'

export interface RolePermissions {
  // Authentication
  register: boolean
  login: boolean
  googleAuth: boolean
  otpSms: boolean
  emailAuth: boolean
  
  // Product browsing
  browseProducts: boolean
  searchProducts: boolean
  imageSearch: boolean
  viewCategories: boolean
  viewBulkDeals: boolean
  viewReadyNow: boolean
  viewGroupBuy: boolean
  
  // Cart & Checkout
  addToCart: boolean
  checkout: boolean
  paystackPayment: boolean
  escrowPayment: boolean
  chooseShipping: boolean
  airShipping: boolean
  seaShipping: boolean
  
  // Orders
  placeOrders: boolean
  viewOrders: boolean
  trackOrders: boolean
  cancelOrders: boolean
  downloadReceipts: boolean
  mapTracking: boolean
  
  // Reviews & Ratings
  writeReviews: boolean
  rateProducts: boolean
  
  // Group Buy
  joinGroupBuy: boolean
  createGroupBuy: boolean
  shareGroupBuyLinks: boolean
  
  // Communication
  liveChat: boolean
  pushNotifications: boolean
  
  // Profile
  manageProfile: boolean
  
  // Vendor-specific
  registerAsSeller: boolean
  manageProducts: boolean
  uploadImages: boolean
  setPricing: boolean
  manageStock: boolean
  tagReadyNow: boolean
  viewVendorOrders: boolean
  manageVendorOrders: boolean
  escrowFunds: boolean
  receivePayments: boolean
  basicAnalytics: boolean
  joinGroupBuyPromotions: boolean
  
  // Manager-specific
  overseeVendors: boolean
  approveProducts: boolean
  editProductListings: boolean
  handleRefunds: boolean
  handleDisputes: boolean
  manageGroupBuys: boolean
  extendDeadlines: boolean
  verifyThresholds: boolean
  limitedAnalytics: boolean
  vendorTrends: boolean
  productTrends: boolean
  
  // Admin-specific
  approveVendors: boolean
  suspendVendors: boolean
  assignRoles: boolean
  demoteRoles: boolean
  manageAllProducts: boolean
  manageAllOrders: boolean
  manageRefunds: boolean
  configureShipping: boolean
  manageShippingRates: boolean
  controlHomepage: boolean
  manageCategories: boolean
  manageBanners: boolean
  featuredProducts: boolean
  fullAnalytics: boolean
  salesAnalytics: boolean
  revenueAnalytics: boolean
  vendorPerformance: boolean
  groupBuyStats: boolean
  sendNotifications: boolean
  systemConfiguration: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  customer: {
    // Authentication
    register: true,
    login: true,
    googleAuth: true,
    otpSms: true,
    emailAuth: true,
    
    // Product browsing
    browseProducts: true,
    searchProducts: true,
    imageSearch: true,
    viewCategories: true,
    viewBulkDeals: true,
    viewReadyNow: true,
    viewGroupBuy: true,
    
    // Cart & Checkout
    addToCart: true,
    checkout: true,
    paystackPayment: true,
    escrowPayment: true,
    chooseShipping: true,
    airShipping: true,
    seaShipping: true,
    
    // Orders
    placeOrders: true,
    viewOrders: true,
    trackOrders: true,
    cancelOrders: true,
    downloadReceipts: true,
    mapTracking: true,
    
    // Reviews & Ratings
    writeReviews: true,
    rateProducts: true,
    
    // Group Buy
    joinGroupBuy: true,
    createGroupBuy: true,
    shareGroupBuyLinks: true,
    
    // Communication
    liveChat: true,
    pushNotifications: true,
    
    // Profile
    manageProfile: true,
    
    // Vendor-specific (false for customers)
    registerAsSeller: false,
    manageProducts: false,
    uploadImages: false,
    setPricing: false,
    manageStock: false,
    tagReadyNow: false,
    viewVendorOrders: false,
    manageVendorOrders: false,
    escrowFunds: false,
    receivePayments: false,
    basicAnalytics: false,
    joinGroupBuyPromotions: false,
    
    // Manager-specific (false for customers)
    overseeVendors: false,
    approveProducts: false,
    editProductListings: false,
    handleRefunds: false,
    handleDisputes: false,
    manageGroupBuys: false,
    extendDeadlines: false,
    verifyThresholds: false,
    limitedAnalytics: false,
    vendorTrends: false,
    productTrends: false,
    
    // Admin-specific (false for customers)
    approveVendors: false,
    suspendVendors: false,
    assignRoles: false,
    demoteRoles: false,
    manageAllProducts: false,
    manageAllOrders: false,
    manageRefunds: false,
    configureShipping: false,
    manageShippingRates: false,
    controlHomepage: false,
    manageCategories: false,
    manageBanners: false,
    featuredProducts: false,
    fullAnalytics: false,
    salesAnalytics: false,
    revenueAnalytics: false,
    vendorPerformance: false,
    groupBuyStats: false,
    sendNotifications: false,
    systemConfiguration: false,
  },
  
  vendor: {
    // All customer permissions
    register: true,
    login: true,
    googleAuth: true,
    otpSms: true,
    emailAuth: true,
    browseProducts: true,
    searchProducts: true,
    imageSearch: true,
    viewCategories: true,
    viewBulkDeals: true,
    viewReadyNow: true,
    viewGroupBuy: true,
    addToCart: true,
    checkout: true,
    paystackPayment: true,
    escrowPayment: true,
    chooseShipping: true,
    airShipping: true,
    seaShipping: true,
    placeOrders: true,
    viewOrders: true,
    trackOrders: true,
    cancelOrders: true,
    downloadReceipts: true,
    mapTracking: true,
    writeReviews: true,
    rateProducts: true,
    joinGroupBuy: true,
    createGroupBuy: true,
    shareGroupBuyLinks: true,
    liveChat: true,
    pushNotifications: true,
    manageProfile: true,
    
    // Vendor-specific
    registerAsSeller: true,
    manageProducts: true,
    uploadImages: true,
    setPricing: true,
    manageStock: true,
    tagReadyNow: true,
    viewVendorOrders: true,
    manageVendorOrders: true,
    escrowFunds: true,
    receivePayments: true,
    basicAnalytics: true,
    joinGroupBuyPromotions: true,
    
    // Manager-specific (false for vendors)
    overseeVendors: false,
    approveProducts: false,
    editProductListings: false,
    handleRefunds: false,
    handleDisputes: false,
    manageGroupBuys: false,
    extendDeadlines: false,
    verifyThresholds: false,
    limitedAnalytics: false,
    vendorTrends: false,
    productTrends: false,
    
    // Admin-specific (false for vendors)
    approveVendors: false,
    suspendVendors: false,
    assignRoles: false,
    demoteRoles: false,
    manageAllProducts: false,
    manageAllOrders: false,
    manageRefunds: false,
    configureShipping: false,
    manageShippingRates: false,
    controlHomepage: false,
    manageCategories: false,
    manageBanners: false,
    featuredProducts: false,
    fullAnalytics: false,
    salesAnalytics: false,
    revenueAnalytics: false,
    vendorPerformance: false,
    groupBuyStats: false,
    sendNotifications: false,
    systemConfiguration: false,
  },
  
  vendor_manager: {
    // All customer permissions
    register: true,
    login: true,
    googleAuth: true,
    otpSms: true,
    emailAuth: true,
    browseProducts: true,
    searchProducts: true,
    imageSearch: true,
    viewCategories: true,
    viewBulkDeals: true,
    viewReadyNow: true,
    viewGroupBuy: true,
    addToCart: true,
    checkout: true,
    paystackPayment: true,
    escrowPayment: true,
    chooseShipping: true,
    airShipping: true,
    seaShipping: true,
    placeOrders: true,
    viewOrders: true,
    trackOrders: true,
    cancelOrders: true,
    downloadReceipts: true,
    mapTracking: true,
    writeReviews: true,
    rateProducts: true,
    joinGroupBuy: true,
    createGroupBuy: true,
    shareGroupBuyLinks: true,
    liveChat: true,
    pushNotifications: true,
    manageProfile: true,
    
    // All vendor permissions
    registerAsSeller: true,
    manageProducts: true,
    uploadImages: true,
    setPricing: true,
    manageStock: true,
    tagReadyNow: true,
    viewVendorOrders: true,
    manageVendorOrders: true,
    escrowFunds: true,
    receivePayments: true,
    basicAnalytics: true,
    joinGroupBuyPromotions: true,
    
    // Manager-specific
    overseeVendors: true,
    approveProducts: true,
    editProductListings: true,
    handleRefunds: true,
    handleDisputes: true,
    manageGroupBuys: true,
    extendDeadlines: true,
    verifyThresholds: true,
    limitedAnalytics: true,
    vendorTrends: true,
    productTrends: true,
    
    // Admin-specific (false for managers)
    approveVendors: false,
    suspendVendors: false,
    assignRoles: false,
    demoteRoles: false,
    manageAllProducts: false,
    manageAllOrders: false,
    manageRefunds: false,
    configureShipping: false,
    manageShippingRates: false,
    controlHomepage: false,
    manageCategories: false,
    manageBanners: false,
    featuredProducts: false,
    fullAnalytics: false,
    salesAnalytics: false,
    revenueAnalytics: false,
    vendorPerformance: false,
    groupBuyStats: false,
    sendNotifications: false,
    systemConfiguration: false,
  },
  
  admin: {
    // All permissions
    register: true,
    login: true,
    googleAuth: true,
    otpSms: true,
    emailAuth: true,
    browseProducts: true,
    searchProducts: true,
    imageSearch: true,
    viewCategories: true,
    viewBulkDeals: true,
    viewReadyNow: true,
    viewGroupBuy: true,
    addToCart: true,
    checkout: true,
    paystackPayment: true,
    escrowPayment: true,
    chooseShipping: true,
    airShipping: true,
    seaShipping: true,
    placeOrders: true,
    viewOrders: true,
    trackOrders: true,
    cancelOrders: true,
    downloadReceipts: true,
    mapTracking: true,
    writeReviews: true,
    rateProducts: true,
    joinGroupBuy: true,
    createGroupBuy: true,
    shareGroupBuyLinks: true,
    liveChat: true,
    pushNotifications: true,
    manageProfile: true,
    registerAsSeller: true,
    manageProducts: true,
    uploadImages: true,
    setPricing: true,
    manageStock: true,
    tagReadyNow: true,
    viewVendorOrders: true,
    manageVendorOrders: true,
    escrowFunds: true,
    receivePayments: true,
    basicAnalytics: true,
    joinGroupBuyPromotions: true,
    overseeVendors: true,
    approveProducts: true,
    editProductListings: true,
    handleRefunds: true,
    handleDisputes: true,
    manageGroupBuys: true,
    extendDeadlines: true,
    verifyThresholds: true,
    limitedAnalytics: true,
    vendorTrends: true,
    productTrends: true,
    approveVendors: true,
    suspendVendors: true,
    assignRoles: true,
    demoteRoles: true,
    manageAllProducts: true,
    manageAllOrders: true,
    manageRefunds: true,
    configureShipping: true,
    manageShippingRates: true,
    controlHomepage: true,
    manageCategories: true,
    manageBanners: true,
    featuredProducts: true,
    fullAnalytics: true,
    salesAnalytics: true,
    revenueAnalytics: true,
    vendorPerformance: true,
    groupBuyStats: true,
    sendNotifications: true,
    systemConfiguration: true,
  },
}

export function getUserPermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role]
}

export function hasPermission(userRole: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[userRole][permission] === true
}

export function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    customer: 1,
    vendor: 2,
    vendor_manager: 3,
    admin: 4
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessAdminPanel(userRole: UserRole): boolean {
  return ['admin', 'vendor_manager'].includes(userRole)
}

export function canManageRoles(userRole: UserRole): boolean {
  return userRole === 'admin'
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    customer: 'Customer (Buyer)',
    vendor: 'Vendor (Seller)',
    vendor_manager: 'Vendor Manager',
    admin: 'Admin'
  }
  return displayNames[role]
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    customer: 'Browse products, place orders, track deliveries, and participate in group buys',
    vendor: 'Sell products, manage inventory, and receive payments through escrow',
    vendor_manager: 'Oversee vendors, approve products, and manage group buy operations',
    admin: 'Full system control, user management, and comprehensive analytics'
  }
  return descriptions[role]
}

export function getAvailableRolesForAssignment(assignerRole: UserRole): UserRole[] {
  if (assignerRole === 'admin') {
    return ['customer', 'vendor', 'vendor_manager']
  }
  return []
}

export function canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
  if (assignerRole !== 'admin') return false
  
  // Admins can assign any role except admin (admin role is system-level)
  return targetRole !== 'admin'
}

export function getRoleHierarchy(): Record<UserRole, number> {
  return {
    admin: 4,
    vendor_manager: 3,
    vendor: 2,
    customer: 1,
  }
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy[role1] > hierarchy[role2]
}
