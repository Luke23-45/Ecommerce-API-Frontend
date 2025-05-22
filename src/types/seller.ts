export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

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
  status: "pending" | "approved" | "rejected" | "suspended";

  createdAt?: Date;
  updatedAt?: Date;
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
}
//"bank_transfer" | "paypal" | "other" payoutMethodPreference