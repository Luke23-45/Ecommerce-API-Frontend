check the sellers exist. if yes, then we would allow to access the update page. 
C:\Users\Hellx\Documents\Programming\Frontend\nodejs\Product Management\ecommerce_api


const disallowedProfileUpdateFields: string[] = [
    '_id',                         
    'userId',           
    'status',               
    'approvedBy',              
    'activatedAt',         
    'createdAt',                    
    'updatedAt',                   
    '__v',                          
    'memberUserIds',           
    'businessRegistrationNumber',   
    'legalEntityType',             
    'companyTaxId',                
    'businessBankName',            
    'businessBankAccountNumber',   
    'businessRoutingNumber',    

];


const allowedProfileUpdateFields: (keyof IVendorProfile)[] = [
    'companyAddress',    
    'companyName',    
    'contactPersonFirstName',
    'contactPersonLastName',
    'contactPersonEmail',
    'contactPersonPhone',
    'contactPersonRole',
    'website',
    'yearEstablished', 
    'primaryProductCategories',
    'estimatedMonthlySales',
    'businessRegistrationDocumentUrl', 
    'taxCertificateUrl', 
];


export interface IVendorProfile { 
  userId:string;
    companyName: string; 
    businessRegistrationNumber: string; 
    companyAddress: IAddress; 
    legalEntityType: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship' | 'other' | string; 
    contactPersonFirstName: string; 
    contactPersonLastName: string; 
    contactPersonEmail: string; 
    contactPersonPhone?: string;
    contactPersonRole?: string; 
    website?: string; 
    yearEstablished?: Date; 
    companyTaxId?: string; 
    businessBankName?: string; 
    businessBankAccountNumber?: string; 
    businessRoutingNumber?: string; 
    primaryProductCategories?: string[];
    estimatedMonthlySales?: number; 
    businessRegistrationDocumentUrl: string; 
    taxCertificateUrl: string; 
    agreedToTerms: boolean; 
    agreedToPrivacyPolicy: boolean; 
    status: VendorProfileStatus
    approvedBy?: string; 
    activatedAt?: Date;
    members: {
      userId: string; 
      roles: VendorScopedRole[]; 
      permissions?: string[]; 
      addedBy?: string 
      addedAt?: Date;
  }[];
}

