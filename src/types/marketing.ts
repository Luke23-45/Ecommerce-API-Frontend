// src/types/marketing.ts

export type BannerStatus = "active" | "inactive" | "scheduled" | "expired" | "draft";
export type BannerLocation = "homepage_hero" | "homepage_cta" | "collection_top" | "product_detail_promo" | "checkout_banner" | "sidebar";

export interface PromotionBanner {
    _id: string; // Unique banner ID
    name: string; // Internal name for the banner (e.g., "Winter Sale Homepage Banner")
    imageUrl: string; // URL of the banner image
    linkUrl: string; // URL the banner clicks to
    startDate: string; // ISO string, e.g., '2023-11-01T00:00:00Z'
    endDate?: string; // ISO string (optional, for evergreen banners)
    status: BannerStatus;
    location: BannerLocation; // Where the banner is displayed
    description?: string; // Short internal description
    priority?: number; // For ordering if multiple banners in same spot (lower number = higher priority)
    createdAt?: string;
    updatedAt?: string;
}