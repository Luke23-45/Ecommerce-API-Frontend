export interface ICategoryCreatePayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  sortOrder?: number;
}

export interface ICategoryUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[] | null;
  sortOrder?: number;
}

export interface ICategoryAncestorFrontend {
  id: string;
  name: string;
  slug: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  ancestors?: ICategoryAncestorFrontend[];
  childrenCount?: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  sortOrder?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;

  fullPathSlug?: string;
  level?: number;
}

export interface ICategoryTreeNode extends ICategoryResponse {
  children?: ICategoryTreeNode[];
  isExpanded?: boolean;
}

export type CategoryStatus = "active" | "inactive";

export interface ICategoryApiQueryOptions {
  page?: number;
  limit?: number;
  filter?: string | Record<string, any>;
  sort?: string | Record<string, 1 | -1>;
  projection?: string;
  lean?: boolean;

  parentId?: string | null;
  isActive?: boolean;
  search?: string;
}
