// src/components/Admin/Categories/CategoryNode.tsx
import React, { useCallback } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import {
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaFolder,
  FaFolderOpen,
} from 'react-icons/fa';

// Import the redesigned styled components
import {
  CategoryTreeNodeStyled,
  CategoryRow,
  CategoryDetails,
  ExpandCollapseButton,
  CategoryItemIcon,
  CategoryNameDisplay,
  CategoryInfoText,
  CategoryStatusBadge,
  CategoryActions,
  CategoryChildrenList,
} from './CategoryList.styles';

import type { ICategoryTreeNode, CategoryStatus } from '@/types/category'; // Adjust path as needed

interface CategoryNodeProps {
  category: ICategoryTreeNode;
  onEdit: (categoryId: string, categoryName: string) => void;
  onAddSubCategory: (parentId: string, parentName: string) => void;
  onDelete: (categoryId: string, categoryName: string, hasChildren: boolean) => void;
  onToggleExpand: (categoryId: string) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  onEdit,
  onAddSubCategory,
  onDelete,
  onToggleExpand,
}) => {
  const theme = useTheme() as DefaultTheme;

  const hasChildren = !!(category.children && category.children.length > 0);
  const isExpanded = !!category.isExpanded; // Ensure boolean, default to false

  // Handlers with useCallback for performance, especially since CategoryNode is memoized
  const handleToggle = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent row click if the button itself is clicked
    if (hasChildren) { // Only toggle if there are children
      onToggleExpand(category.id);
    }
  }, [category.id, onToggleExpand, hasChildren]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(category.id, category.name);
  }, [category.id, category.name, onEdit]);

  const handleAddSubClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddSubCategory(category.id, category.name);
  }, [category.id, category.name, onAddSubCategory]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(category.id, category.name, hasChildren);
  }, [category.id, category.name, hasChildren, onDelete]);

  // Combined click handler for the main details area
  const handleRowDetailsClick = useCallback(() => {
    if (hasChildren) {
      onToggleExpand(category.id); // Toggle expand/collapse if it has children
    } else {
      onEdit(category.id, category.name); // Or trigger edit if it's a leaf node
    }
  }, [hasChildren, onToggleExpand, onEdit, category.id, category.name]);

  const isTopLevelLeaf = category.level === 0 && !hasChildren;

  return (
    <CategoryTreeNodeStyled $level={category.level || 0}>
      <CategoryRow
        $level={category.level || 0}
        $isTopLevelWithoutChildren={isTopLevelLeaf}
        $isExpanded={isExpanded} // Pass to styled component
        $hasChildren={hasChildren} // Pass to styled component
        theme={theme} // Pass theme explicitly if styled components require it directly
      >
        <CategoryDetails
          onClick={handleRowDetailsClick}
          title={hasChildren ? (isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`) : `Edit ${category.name}`}
          // Style for cursor is now in CategoryList.styles.ts based on clickability
        >
          {hasChildren ? (
            <ExpandCollapseButton onClick={handleToggle} aria-label={isExpanded ? 'Collapse' : 'Expand'} title={isExpanded ? 'Collapse' : 'Expand'}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </ExpandCollapseButton>
          ) : (
            // Spacer to maintain alignment with nodes that have expander buttons
            <span style={{ width: '28px', height: '28px', flexShrink: 0, display: 'inline-block' }} />
          )}

          {category.imageUrl ? (
            <CategoryItemIcon src={category.imageUrl} alt="" />
          ) : (
            // Default folder icon, styled within CategoryDetails gap
            <span style={{ display: 'flex', alignItems: 'center', color: theme.colors.adminTextSecondary }}>
              {isExpanded && hasChildren ? <FaFolderOpen size="1.1em" /> : <FaFolder size="1.1em" />}
            </span>
          )}
          <CategoryNameDisplay>{category.name}</CategoryNameDisplay>
          {category.status && (
            <CategoryStatusBadge $status={category.status as CategoryStatus}>
              {category.status.replace(/_/g, ' ')} {/* Replace underscores for display */}
            </CategoryStatusBadge>
          )}
          {hasChildren && <CategoryInfoText>({category.children?.length})</CategoryInfoText>}
        </CategoryDetails>

        <CategoryActions>
          <button onClick={handleAddSubClick} title={`Add Sub-category to ${category.name}`}>
            <FaPlus />
          </button>
          <button onClick={handleEditClick} title={`Edit ${category.name}`}>
            <FaEdit />
          </button>
          <button className="delete-btn" onClick={handleDeleteClick} title={`Delete ${category.name}`}>
            <FaTrashAlt />
          </button>
        </CategoryActions>
      </CategoryRow>

      {/* Recursive rendering of children */}
      {isExpanded && hasChildren && (
        <CategoryChildrenList>
          {category.children.map(childNode => (
            <CategoryNode
              key={childNode.id}
              category={childNode}
              onEdit={onEdit}
              onAddSubCategory={onAddSubCategory}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </CategoryChildrenList>
      )}
    </CategoryTreeNodeStyled>
  );
};

// Memoize CategoryNode for performance, as it can be part of a large list/tree
export default React.memo(CategoryNode);