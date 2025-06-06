// src/interfaces/vendorProfile.interfaces.ts (or update vendor.interfaces.ts)

import { type IAddress } from "./seller";
export type VendorScopedRole = "vendor_member" | "vendor_admin" | string;
export type VendorProfileStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "suspended"
  | "closed"
  | "processing"
  | "withdrawn";

export interface vendorMember {
  userId: string;
  roles: VendorScopedRole[];
  permissions?: string[];
}
export interface updateVendorProfileUpdateFields {
  companyName: string;
  companyAddress: IAddress;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone?: string;
  contactPersonRole?: string;
  website?: string;
  yearEstablished?: number;
  primaryProductCategories?: string[];
  estimatedMonthlySales?: number;
  businessDosubmittedcument: File | null;
}

export interface IVendorProfile {
  userId: string;
  companyName: string;
  businessRegistrationNumber: string;
  companyAddress: IAddress;
  legalEntityType:
    | "corporation"
    | "llc"
    | "partnership"
    | "sole_proprietorship"
    | "other"
    | string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone?: string;
  contactPersonRole?: string;
  website?: string;
  yearEstablished?: number;
  companyTaxId?: string;
  businessBankName?: string;
  businessBankAccountNumber?: string;
  businessRoutingNumber?: string;
  primaryProductCategories?: string[];
  estimatedMonthlySales?: number;
  applicationReport: File | null;
  businessDocument?: File | null;
  documentURL?: string;
  agreedToTerms: boolean;
  agreedToPrivacyPolicy: boolean;
  status: VendorProfileStatus;
  approvedBy?: string;
  activatedAt?: Date;
  documentName?:string;
  members: {
    userId: string;
    roles: VendorScopedRole[];
    permissions?: string[];
    addedBy?: string;
    addedAt?: Date;
  }[];
  updatedAt?:string;
  createdAt?:string;
}
export interface vendorProfileData {
  status: string;
  vendorId: string;
  vendorAdmin: string;
}


export interface IVendorApplicationQueryOptions {
  filter?: { [key: string]: any };
  pagination?: {
    limit: number;
    skip: number;
  };
  sort?: { [key: string]: any } | string;
  projection?: { [key: string]: number | boolean } | string;
  lean?: boolean;
}

export interface IPaginatedVendorApplicationsResult {
  applications: IVendorProfile[];
  totalCount: number;
}
