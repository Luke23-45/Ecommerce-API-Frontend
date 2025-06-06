
import { Types } from 'mongoose'; 
                                 

export interface IAttributeBase {
  name: string;
  displayName?: string;
  displayType?: 'swatch' | 'dropdown' | 'radio' | 'text';
  isFilterable?: boolean;
  isRequiredForVariation?: boolean;
}

export interface IAttributeCreatePayload extends IAttributeBase {}

export interface IAttributeUpdatePayload extends Partial<IAttributeBase> {}

export interface IAttributeResponse extends IAttributeBase {
  id: string; 
  slug: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface IAttributeOptionBase {
  attributeId: string; 
  value: string;
  displayName?: string;
  swatchValue?: string;
}

export interface IAttributeOptionCreatePayload extends IAttributeOptionBase {}

export interface IAttributeOptionUpdatePayload extends Partial<Omit<IAttributeOptionBase, 'attributeId'>> {} 

export interface IAttributeOptionResponse extends IAttributeOptionBase {
  id: string; 
  slug: string;
  createdAt: string; 
  updatedAt: string; 
}


export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}


export interface IPaginatedData<T> {
    message: string;
    data: T[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}