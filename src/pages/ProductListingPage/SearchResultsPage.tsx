// src/pages/SearchResultsPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "styled-components";
import { useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

// --- Hooks, Types, and Utils ---
import { useSearchProducts } from "@/hooks/admin/product/product/useProduct";
import { type IProductListItemData } from "@/types/product.types";
import { type FilterGroup, mockFilterGroups } from "@/data/mockData";
import { type Product } from "@/types/product";

// --- Child Components ---
import SortOptions from "@/components/ProductListingPage/SortOptions/SortOptions";
import FilterSidebar from "@/components/ProductListingPage/FilterSidebar/FilterSidebar";
import ProductGrid from "@/components/ProductListingPage/ProductGrid/ProductGrid";
import Pagination from "@/components/ProductListingPage/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/ProductListingPage/ItemsPerPageSelector/ItemsPerPageSelector";
import Breadcrumbs, {
  type BreadcrumbLink,
} from "@/components/ProductDetail/Breadcrumbs";
import * as S from "./ProductListingPage.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "@/components/auth/AuthForms";
import {
  useGetAllDescendantsOfCategory,
  useGetPaginatedCategories,
} from "@/hooks/admin/product/useCategory";
import { transformCategoriesToFilterGroup } from "@/utils/filterUtils";
import { CategoryFilterItem } from "@/components/ProductListingPage/FilterSidebar/FilterSidebar.styles";

// Helper to map API data to card data
const transformApiProductToCardData = (
  apiProduct: IProductListItemData
): Product => ({
  id: apiProduct._id,
  name: apiProduct.name,
  price: apiProduct.displaySalePrice || apiProduct.displayPrice,
  originalPrice: apiProduct.displayPrice + 5,
  discountPercentage:
    apiProduct.isOnSale &&
    apiProduct.displaySalePrice &&
    apiProduct.displayPrice > 0
      ? Math.round(
          ((apiProduct.displayPrice - apiProduct.displaySalePrice) /
            apiProduct.displayPrice) *
            100
        )
      : 5,
  imageUrl: apiProduct.mainImageUrl,
  rating: apiProduct.averageRating,
  reviewCount: apiProduct.reviewCount,
  isRocketShipping: true,
});

const SearchResultsPage: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State Driven by URL Search Parameters ---
  const query = searchParams.get("q") || "";
  const category = searchParams.get("categoryId") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const sort = searchParams.get("sort") || "ranking";

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentColumnCount, setCurrentColumnCount] = useState(4);
  const [filterGroups, setFilterGroups] =
    useState<FilterGroup[]>(mockFilterGroups);

  // --- Data Fetching (Uses the search hook) ---
  const {
    data: searchResults,
    isLoading,
    isError,
    error,
    isPreviousData,
  } = useSearchProducts(
    {
      q: query,
      categoryId: category,
      page,
      limit,
      sort, // Pass the sort parameter to the hook
    },
    { keepPreviousData: true }
  );

  const { data: categoryDescendants, isLoading: isLoadingCategories } =
    useGetAllDescendantsOfCategory(
      category,
      { lean: true, projection: "name slug parentId productCount" },
      { enabled: !!category }
    );

  // --- Responsive Columns Logic ---
  const getColumnsForCurrentView = useCallback(() => {
    if (window.innerWidth <= 600) return 2;
    if (window.innerWidth <= 900) return 3;
    return 4;
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setCurrentColumnCount(getColumnsForCurrentView());
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [getColumnsForCurrentView]);

  // --- Event Handlers to Update URL ---
  const updateQueryParams = (newParams: Record<string, string | number>) => {
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      currentParams.set(key, String(value));
    });
    setSearchParams(currentParams);
  };
  const handleSortChange = (sortValue: string) =>
    updateQueryParams({ sort: sortValue, page: 1 });
  const handleItemsPerPageChange = (count: number) =>
    updateQueryParams({ limit: count, page: 1 });
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFilterChange = () => {
    /* Placeholder */
  };
  const handleToggleFilterGroupCollapse = () => {
    /* Placeholder */
  };
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- ** ONLY TRANSFORMS DATA; SORTING IS DONE BY BACKEND ** ---
  const transformedProducts = useMemo(() => {
    if (!searchResults?.data) return [];

    // The API does the sorting. We just transform the pre-sorted data.
    return searchResults.data.map(transformApiProductToCardData);
  }, [searchResults]); // Dependency is only the API data.

  const pageTitle = query
    ? `Results for "${query}"`
    : searchResults?.data[0]?.categoryName || "Products";
  const breadcrumbItems: BreadcrumbLink[] = [
    { label: "Home", link: "/" },
    { label: "Search", link: `/search?q=${query}&categoryId=${category}` },
  ];

  const pageSortOptions = [
    {
      id: "ranking",
      label: "Recommended",
      value: "ranking",
      hasInfoIcon: true,
    },
    { id: "price_asc", label: "Price: Low to High", value: "price_asc" },
    { id: "price_desc", label: "Price: High to Low", value: "price_desc" },
    { id: "newest", label: "Newest Arrivals", value: "newest" },
    { id: "rating_desc", label: "Top Rated", value: "rating_desc" },
  ];
  const dynamicFilterGroups = useMemo<FilterGroup[]>(() => {
    let categoryId = category;
    if (categoryId && categoryDescendants) {
      const categoryFilter = transformCategoriesToFilterGroup(
        categoryDescendants,
        categoryId
      );

      console.log(categoryFilter, "[[[[[[[[[");
      // You could add other static filters here as well, e.g., for price or brand.
      return categoryFilter ? [categoryFilter] : [];
    }
    // Return mock data or an empty array if no category is selected
    return mockFilterGroups;
  }, [category, categoryDescendants]);

  console.log("categoryDescendants", categoryDescendants);

  return (
    <S.PageWrapper>
      <Breadcrumbs items={breadcrumbItems} />
      <S.FilterToggleButton onClick={toggleMobileSidebar}>
        <FaFilter /> filter
      </S.FilterToggleButton>

      <S.MainContent>
        <FilterSidebar
          filterGroups={dynamicFilterGroups}
          onFilterChange={handleFilterChange}
          onToggleCollapse={handleToggleFilterGroupCollapse}
          isOpen={isSidebarOpen}
          onClose={toggleMobileSidebar}
          isLoading={isLoadingCategories}
        />
        <S.ProductDisplayArea style={{ opacity: isPreviousData ? 0.7 : 1 }}>
          <S.PageContentHeader>
            <S.CategoryPageTitle>
              {pageTitle}
              {!isLoading && ` (${searchResults?.totalCount || 0} items)`}
            </S.CategoryPageTitle>
          </S.PageContentHeader>

          <S.HeaderSortContainer>
            <SortOptions
              options={pageSortOptions}
              activeSort={sort}
              onSortChange={handleSortChange}
            />
            <ItemsPerPageSelector
              itemsPerPageOptions={[24, 48, 72]}
              currentItemsPerPage={limit}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </S.HeaderSortContainer>

          {isLoading && <LoadingSpinner message="Searching for products..." />}
          {isError && (
            <ErrorMessage>
              Error: {(error as any).message || "Could not fetch products."}
            </ErrorMessage>
          )}
          {!isLoading && !isError && transformedProducts.length === 0 && (
            <ErrorMessage>
              No products found matching your criteria.
            </ErrorMessage>
          )}
          {!isLoading && !isError && transformedProducts.length > 0 && (
            <>
              <ProductGrid
                products={transformedProducts}
                columnsInCurrentView={currentColumnCount}
              />
              <Pagination
                currentPage={searchResults?.currentPage || 1}
                totalPages={searchResults?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </S.ProductDisplayArea>
      </S.MainContent>
    </S.PageWrapper>
  );
};

export default SearchResultsPage;
