

export type PlatformUserRole = 'super_admin' | 'vendor_staff' | 'individual_seller';
export type UserStatus = 'active' | 'suspended' | 'deactivated';

export interface PlatformUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: PlatformUserRole; 
    status: UserStatus; 
    lastLogin?: string; 
    createdAt: string; 
    vendorId?: string; 
    sellerId?: string; 
}

export interface GeneralSettings {
    platformName: string;
    contactEmail: string;
    contactPhone?: string;
    defaultCurrency: string;
    defaultTimezone: string;
    allowCustomerRegistrations: boolean;
    requireProductApproval: boolean;
    lowStockThreshold: number; 
    
}