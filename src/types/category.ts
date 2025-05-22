export type CategoryStatus = "active" | "inactive";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  level: number;
  status: CategoryStatus;
  displayOrder: number;
  imageUrl?: string;
  children?: Category[];
}
