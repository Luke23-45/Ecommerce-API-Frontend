export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export type ISellerStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "suspended"
  | "closed"
  | "withdrawn"
  | "processing";

export interface IIndividualSellerProfile {
  _id?: string;
  userId?: string;
  sellerName: string;
  phoneNumber: string;
  address: IAddress;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: Date;
  citizenshipCountry: string;
  taxIdentificationNumber: string;
  payoutMethodPreference: string;
  bankAccountHolderName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  briefDescription?: string;
  primaryProductCategories?: string[];
  estimatedMonthlySales?: number;
  yearsOfSellingExperience?: number;
  otherPlatformsSoldOn?: string;
  agreedToTerms: boolean;
  agreedToPrivacyPolicy: boolean;
  applicationReport: File | null;
  status?:
    | "submitted"
    | "approved"
    | "rejected"
    | "suspended"
    | "processing"
    | "withdrawn";
  documentURI?: string;
  createdAt?: Date;
  updatedAt?: Date;
  documentName?: string;
}
//use mongoId

export interface IIndividualSellerProfileForm {
  sellerName: string;
  phoneNumber: string;
  address: IAddress;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: Date;
  citizenshipCountry: string;
  taxIdentificationNumber: string;

  payoutMethodPreference: string;
  bankAccountHolderName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;

  briefDescription?: string;
  primaryProductCategories?: string[];
  estimatedMonthlySales?: number;
  yearsOfSellingExperience?: number;
  otherPlatformsSoldOn?: string;
  agreedToTerms: boolean;
  agreedToPrivacyPolicy: boolean;
  applicationReport: File | null;
}

export interface IIndividualSellerProfileUpdate {
  sellerName: string;
  phoneNumber: string;
  address: IAddress;
  briefDescription?: string;

  payoutMethodPreference: string;
  bankAccountHolderName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;

  primaryProductCategories?: string[];
  estimatedMonthlySales?: number;
  yearsOfSellingExperience?: number;
  otherPlatformsSoldOn?: string;
  applicationReport?: File | null;
}
//"bank_transfer" | "paypal" | "other" payoutMethodPreference
export interface SellerProfileFormData extends IIndividualSellerProfileUpdate {
  selectedBusinessDocument?: File | null;
}

export interface IIndividualSellerApplicationQueryOptions {
  filter?: { [key: string]: any };
  pagination?: {
    limit: number;
    skip: number;
  };
  sort?: { [key: string]: any } | string;
  projection?: { [key: string]: number | boolean } | string;
  lean?: boolean;
}

export interface IPaginatedIndividualSellerApplicationsResult {
  applications: IIndividualSellerProfile[];
  totalCount: number;
}
