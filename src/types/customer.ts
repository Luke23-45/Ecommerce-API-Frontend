export type CustomerAccountStatus =
  | "active"
  | "suspended"
  | "blocked"
  | "pending_verification";

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type?: "shipping" | "billing" | "both";
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  registrationDate: string;
  lastLoginDate?: string;
  totalOrders: number;
  totalSpent: number;
  accountStatus: CustomerAccountStatus;

  notes?: string;

  addresses?: CustomerAddress[];
}
