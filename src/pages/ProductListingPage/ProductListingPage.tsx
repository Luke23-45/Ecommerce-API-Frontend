
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "styled-components";
import { FaFilter, FaAngleDown } from "react-icons/fa"; 

import {
  mockProducts,
  mockFilterGroups,
  mockSortOptions,
  type Product,
  type FilterGroup,
  type FilterOption,
} from "@/data/mockData";

import SortOptions from "@/components/ProductListingPage/SortOptions/SortOptions";
import FilterSidebar from "@/components/ProductListingPage/FilterSidebar/FilterSidebar";
import ProductGrid from "@/components/ProductListingPage/ProductGrid/ProductGrid";
import Pagination from "@/components/ProductListingPage/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/ProductListingPage/ItemsPerPageSelector/ItemsPerPageSelector";
import Breadcrumbs, {
  type Breadcrumb,
} from "@/components/ProductDetail/Breadcrumbs";
import * as S from "./ProductListingPage.styles";
import GrandMarquee from "@/components/home/GrandMarquee";


interface SortOptionUIData {
  id: string;
  label: string;
  value: string;
  hasInfoIcon?: boolean;
}
const pageSortOptions: SortOptionUIData[] = [
  { id: "ranking", label: "Coupang Ranking Order", value: "ranking", hasInfoIcon: true },
  { id: "price_asc", label: "Low Price Order", value: "price_asc" },
  { id: "price_desc", label: "High Price Order", value: "price_desc" },
  { id: "sales", label: "Sales Volume Order", value: "sales" },
  { id: "newest", label: "Newest Order", value: "newest" },
];

const mockBreadcrumbItems: Breadcrumb[] = [
  { label: "Coupang Home", href: "#" },
  { label: "Beauty", href: "#" },
  { label: "Skincare", href: "#" },
  { label: "Skin", isCurrent: true },
];
const ProductListingPage: React.FC = () => {
  const theme = useTheme();

  const getColumnsForCurrentView = useCallback(() => {
    if (typeof window === "undefined") return 4;
    const mobileLWidth = parseInt(theme.breakpoints.mobileL.replace("px", ""));
    const tabletWidth = parseInt(theme.breakpoints.tablet.replace("px", ""));
    const laptopWidth = parseInt(theme.breakpoints.laptop.replace("px", ""));
    if (window.innerWidth <= mobileLWidth) return 1; 
    if (window.innerWidth <= tabletWidth) return 2;
    if (window.innerWidth <= laptopWidth) return 3;
    return 4;
  }, [
    theme.breakpoints.mobileL,
    theme.breakpoints.tablet,
    theme.breakpoints.laptop,
  ]);

  const [currentColumnCount, setCurrentColumnCount] = useState(() =>
    getColumnsForCurrentView()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () =>
      setCurrentColumnCount(getColumnsForCurrentView());
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [getColumnsForCurrentView]);

  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(mockProducts);
  const [filterGroups, setFilterGroups] =
    useState<FilterGroup[]>(mockFilterGroups);
  const [activeSort, setActiveSort] = useState<string>(
    pageSortOptions[0].value
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12); 
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    
    let productsToDisplay = [...mockProducts];
    
    
    
    if (activeSort === "price_asc") {
      productsToDisplay.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      productsToDisplay.sort((a, b) => b.price - a.price);
    }
    setDisplayedProducts(productsToDisplay);
    
  }, [filterGroups, activeSort]); 

  const handleSortChange = (sortValue: string) => {
    setActiveSort(sortValue);
    setCurrentPage(1); 
  };
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFilterChange = (
    groupTitle: string,
    optionValue: string,
    checked: boolean
  ) => {
    setFilterGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.title === groupTitle) {
          let newOptions: FilterOption[];
          if (group.type === "category") {
            newOptions = group.options.map((opt) => ({
              ...opt,
              checked: opt.value === optionValue ? checked : false,
            }));
          } else {
            newOptions = group.options.map((opt) =>
              opt.value === optionValue ? { ...opt, checked } : opt
            );
          }
          return { ...group, options: newOptions };
        }
        return group;
      })
    );
    setCurrentPage(1); 
  };
  const handleToggleFilterGroupCollapse = (groupId: string) => {
    setFilterGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === groupId ? { ...g, isCollapsed: !g.isCollapsed } : g
      )
    );
  };
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const currentProductsOnPage = displayedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const categoryTitleFromData = "Skin/toner"; 

  return (

    <>
        <GrandMarquee />
        <S.PageWrapper>
      <Breadcrumbs items={mockBreadcrumbItems} />
      <S.FilterToggleButton onClick={toggleMobileSidebar}>
        <FaFilter /> filter
      </S.FilterToggleButton>

      <S.MainContent>
        <FilterSidebar
          filterGroups={filterGroups}
          onFilterChange={handleFilterChange}
          onToggleCollapse={handleToggleFilterGroupCollapse}
          isOpen={isSidebarOpen}
          onClose={toggleMobileSidebar}
        />
        <S.ProductDisplayArea>
          <S.PageContentHeader>
            <S.CategoryPageTitle>{categoryTitleFromData}</S.CategoryPageTitle>
          </S.PageContentHeader>

          <S.HeaderSortContainer>
            <SortOptions
              options={pageSortOptions}
              activeSort={activeSort}
              onSortChange={handleSortChange}
            />

            <ItemsPerPageSelector
              itemsPerPageOptions={[20, 40, 60, 100]}
              currentItemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </S.HeaderSortContainer>

          <ProductGrid
            products={currentProductsOnPage}
            columnsInCurrentView={currentColumnCount}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageNeighbours={5} 
          />
        </S.ProductDisplayArea>
      </S.MainContent>
    </S.PageWrapper>
    </>

  );
};

export default ProductListingPage;
