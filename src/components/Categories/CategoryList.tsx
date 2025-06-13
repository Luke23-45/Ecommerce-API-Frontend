import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { rgba } from "polished";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaPlus,
  FaTags,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
// import { FiFilter } from 'react-icons/fi'; // If a dedicated filter apply button is needed

import {
  CategoryListContainer,
  CategoryListHeader,
  HeaderTitle,
  CategorySearchInput,
  CategoryTreeContainer,
  NoCategoryMessage,
} from "./CategoryList.styles";

import { AdminButton } from "../admin/Dashboard/Common/Common.styles"; // VERIFY THIS PATH
import CategoryNode from "./CategoryNode"; // This component will render individual tree nodes
import LoadingSpinner from "../common/LoadingSpinner/LoadingSpinner"; // VERIFY THIS PATH
import ConfirmationModal from "../admin/common/ConfirmationModal/ConfirmationModal";
import {
  useGetPaginatedCategories,
  useDeleteCategory,
} from "@/hooks/admin/product/useCategory"; // VERIFY THIS PATH
import type { ICategoryResponse, ICategoryTreeNode } from "@/types/category"; // VERIFY THIS PATH
import { useNotification } from "@/contexts/NotificationContext"; // VERIFY THIS PATH

const buildTree = (
  flatList: ICategoryResponse[], // Raw categories from API with 'id' and 'parentId'
  parentId: string | null = null
): ICategoryTreeNode[] => {
  return flatList
    .filter((item) => item.parentId === parentId)
    .sort(
      (a, b) =>
        (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name)
    )
    .map((item) => {
      // Ensure 'id' exists. If your ICategoryResponse uses _id, map it here.
      // For this example, assuming 'id' is already present or transformed from _id.
      const id = item.id || (item as any)._id; // Ensure 'id' is primary
      if (!id) {
        console.warn("Category item missing 'id' or '_id':", item);
        // Return a minimal structure or skip, depending on desired error handling
        // For now, skipping problematic items silently is risky. Let's assume id is present.
      }
      return {
        ...item,
        id: id as string, // Ensure id is a string
        children: buildTree(flatList, id as string),
        // isExpanded and level will be handled by CategoryList state and props to CategoryNode
      };
    });
};

const filterTreeForSearch = (
  nodes: ICategoryTreeNode[],
  searchTerm: string,
  expandedIds: Set<string> // Current set of expanded IDs, used to preserve user's choices when searchTerm is empty
): ICategoryTreeNode[] => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    // No search term, return the original tree structure, applying current expansion state
    // and calculating levels for all nodes
    const addLevelAndExpansion = (
      currentNodes: ICategoryTreeNode[],
      level: number
    ): ICategoryTreeNode[] => {
      return currentNodes.map((node) => ({
        ...node,
        level,
        isExpanded: expandedIds.has(node.id),
        children: node.children
          ? addLevelAndExpansion(node.children, level + 1)
          : [],
      }));
    };
    return addLevelAndExpansion(nodes, 0);
  }

  // Recursive filter function
  const filterNodes = (
    currentNodes: ICategoryTreeNode[],
    level: number
  ): ICategoryTreeNode[] => {
    return currentNodes
      .map((node) => {
        const isDirectMatch =
          node.name.toLowerCase().includes(term) ||
          (node.slug && node.slug.toLowerCase().includes(term));

        const filteredChildren = node.children
          ? filterNodes(node.children, level + 1)
          : [];

        if (isDirectMatch || filteredChildren.length > 0) {
          return {
            ...node,
            level,
            isExpanded: true, // Auto-expand nodes that match or contain matches
            children: filteredChildren,
          };
        }
        return null; // Node doesn't match and has no matching children
      })
      .filter(Boolean) as ICategoryTreeNode[]; // Remove null entries
  };

  return filterNodes(nodes, 0); // Start filtering from top level (level 0)
};

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    new Set()
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
    hasChildren: boolean;
  } | null>(null);

  const {
    data: paginatedCategoriesResponse,
    isLoading: isInitialLoading,
    isError,
    error: fetchErrorData,
    isFetching,
    refetch,
  } = useGetPaginatedCategories(
    // Fetch all categories. Sort by parentId first to help with some tree building, then sortOrder and name.
    // The client-side buildTree will handle the actual nesting and per-level sorting.
    {
      limit: 10000,
      lean: true,
      sort: JSON.stringify({ parentId: 1, sortOrder: 1, name: 1 }),
    },
    {
      onSuccess: (data) => {
        // Initialize expansion: expand top-level categories by default
        const initialExpanded = new Set<string>();
        data.data.forEach((cat) => {
          const id = cat.id || (cat._id as string);
          if (!cat.parentId && id) {
            // Top-level categories (parentId is null or undefined)
            initialExpanded.add(id);
          }
        });
        setExpandedCategoryIds(initialExpanded);
      },
      keepPreviousData: true,
    }
  );

  // Memoized raw flat list from API, ensuring 'id' property
  const rawFlatCategoriesWithConsistentId: ICategoryResponse[] = useMemo(() => {
    if (!paginatedCategoriesResponse?.data) return [];
    return paginatedCategoriesResponse.data.map((cat) => ({
      ...cat,
      id: cat.id || (cat._id as string), // Ensure 'id' is the primary identifier used
    }));
  }, [paginatedCategoriesResponse?.data]);

  // Memoized full hierarchical tree structure
  const fullCategoryTree: ICategoryTreeNode[] = useMemo(() => {
    if (rawFlatCategoriesWithConsistentId.length === 0) return [];
    return buildTree(rawFlatCategoriesWithConsistentId);
  }, [rawFlatCategoriesWithConsistentId]);

  // Memoized tree structure for display (after filtering and applying expansion/levels)
  const displayedCategories: ICategoryTreeNode[] = useMemo(() => {
    return filterTreeForSearch(
      fullCategoryTree,
      searchTerm,
      expandedCategoryIds
    );
  }, [fullCategoryTree, searchTerm, expandedCategoryIds]);

  const handleToggleExpand = useCallback((categoryId: string) => {
    setExpandedCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleAddTopLevelCategory = useCallback(() => {
    navigate("/admin/products/categories/new"); // Adjust your route as needed
  }, [navigate]);

  const handleEditCategory = useCallback(
    (categoryId: string, _categoryName: string) => {
      navigate(`/admin/products/categories/${categoryId}/edit`);
    },
    [navigate]
  );

  const handleAddSubCategory = useCallback(
    (parentId: string, _parentName: string) => {
      navigate(`/admin/products/categories/${parentId}/new-child`); // Example route
    },
    [navigate]
  );

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: (_data, categoryId) => {
      showNotification(
        `Category "${
          categoryToDelete?.name || categoryId
        }" deleted successfully.`,
        "success"
      );
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      refetch();
    },
    onError: (err: any, categoryId) => {
      showNotification(
        `Failed to delete category "${categoryToDelete?.name || categoryId}": ${
          err.message || "Unknown error"
        }`,
        "error"
      );
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    },
  });

  const handleDeleteCategoryRequest = useCallback(
    (categoryId: string, categoryName: string, hasChildren: boolean) => {
      setCategoryToDelete({ id: categoryId, name: categoryName, hasChildren });
      setIsDeleteModalOpen(true);
      
    },
    []
  );

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  const renderMainContent = () => {
    if (isInitialLoading && rawFlatCategoriesWithConsistentId.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            marginTop: theme.spacing(5),
          }}
        >
          <LoadingSpinner message="Loading categories..." />
        </div>
      );
    }
    if (isError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            color: theme.colors.adminStatusError || "red",
            marginTop: theme.spacing(5),
          }}
        >
          <FaExclamationTriangle
            size="2em"
            style={{ marginBottom: theme.spacing(2) }}
          />
          <p>
            Error loading categories:{" "}
            {(fetchErrorData as any)?.message || "Unknown error"}
          </p>
          <AdminButton
            $variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try Again
          </AdminButton>
        </div>
      );
    }
    if (displayedCategories.length === 0 && !isFetching) {
      return (
        <NoCategoryMessage>
          <FaTags />
          <p>
            {searchTerm
              ? "No categories found matching your search."
              : "No categories created yet. Start by adding a top-level category!"}
          </p>
        </NoCategoryMessage>
      );
    }

    return (
      <CategoryTreeContainer>
        {displayedCategories.map((categoryNode) => (
          <CategoryNode
            key={categoryNode.id}
            category={categoryNode} // This now includes level and isExpanded
            onEdit={handleEditCategory}
            onAddSubCategory={handleAddSubCategory}
            onDelete={handleDeleteCategoryRequest}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </CategoryTreeContainer>
    );
  };

  const totalRawCategoriesCount = rawFlatCategoriesWithConsistentId.length;

  return (
    <CategoryListContainer>
      <CategoryListHeader>
        <HeaderTitle>
          Product Categories ({totalRawCategoriesCount})
        </HeaderTitle>
        <AdminButton $variant="primary" onClick={handleAddTopLevelCategory}>
          <FaPlus /> Add Top-Level Category
        </AdminButton>
      </CategoryListHeader>

      <CategorySearchInput
        type="text"
        placeholder="Search categories by name or slug..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isInitialLoading && totalRawCategoriesCount === 0}
      />

      {isFetching && !isInitialLoading && totalRawCategoriesCount > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: theme.spacing(1.5),
            marginBottom: theme.spacing(2),
            color: theme.colors.adminTextSecondary,
            fontSize: "0.85em",
            fontStyle: "italic",
            background: rgba(theme.colors.accent1 || "#007bff", 0.05),
            borderRadius: "4px",
            border: `1px solid ${rgba(theme.colors.accent1 || "#007bff", 0.1)}`,
          }}
        >
          <FaSpinner
            style={{
              fontSize: "0.9em",
              marginRight: theme.spacing(1.5),
              verticalAlign: "middle",
            }}
            className="spinner-icon"
          />
          Updating list...
        </div>
      )}

      {renderMainContent()}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete Category"
        message={
          categoryToDelete?.hasChildren
            ? `Are you sure you want to delete "${
                categoryToDelete?.name || ""
              }"? WARNING: This category has sub-categories. Depending on backend logic, this might delete them or cause issues.`
            : `Are you sure you want to delete "${
                categoryToDelete?.name || ""
              }"? This action cannot be undone.`
        }
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isDanger={true}
        isLoading={deleteCategoryMutation.isPending}
      />
    </CategoryListContainer>
  );
};

export default CategoryList;
