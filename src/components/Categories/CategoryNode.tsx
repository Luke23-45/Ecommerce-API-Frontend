// src/components/Admin/Categories/CategoryNode.tsx
import React from 'react';
import { useTheme } from 'styled-components'; // Import useTheme hook
import { FaChevronDown, FaChevronRight, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa'; // FaTag removed as not used in final JSX

import { // These imports are correct
  CategoryTreeNode,
  CategoryRow,
  CategoryDetails,
  ExpandCollapseButton,
  CategoryNameDisplay,
  CategoryStatusBadge,
  CategoryActions,
  CategoryChildrenList,
} from './CategoryList.styles';

import { type Category } from '@/types/category'; 

interface CategoryNodeProps {
  category: Category;
  level: number;
  onEdit: (categoryId: string) => void;
  onAddSubCategory: (parentId: string) => void;
  onDelete: (categoryId: string) => void;
  onToggleExpand: (categoryId: string) => void;
  filteredCategoryIds?: Set<string>;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  level,
  onEdit,
  onAddSubCategory,
  onDelete,
  onToggleExpand,
  filteredCategoryIds,
}) => {
  const theme = useTheme(); // Access the theme object

  const hasChildren = category.children && category.children.length > 0;
  // A category is visible if it directly matches filter OR its parent is expanded AND it contains matching children
  const isCategoryFiltered = filteredCategoryIds ? filteredCategoryIds.has(category._id) : true; // Unused in this corrected snippet's JSX but potentially useful.

  // Simple animation (managed by CSS if needed, otherwise instantly show children)
  // Ensure default is based on how tree is initially built in CategoryList
  const isExpanded = category.isExpanded === undefined ? true : category.isExpanded; 

  return (
    <CategoryTreeNode $level={level} key={category._id} /* key is typically handled by map operation in parent */ >
      <CategoryRow>
        <CategoryDetails onClick={() => hasChildren && onToggleExpand(category._id)}>
          {hasChildren && (
            <ExpandCollapseButton onClick={(e) => { e.stopPropagation(); onToggleExpand(category._id); }} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </ExpandCollapseButton>
          )}
          {/* Spacer for alignment if no expand/collapse button */}
          {!hasChildren && <span style={{ width: '24px', height: '24px', display: 'inline-block' }} />}
          {category.imageUrl && <img src={category.imageUrl} alt={category.name} style={{ width: '24px', height: '24px', marginRight: theme.spacing(2), borderRadius: '4px' }} />}
          <CategoryNameDisplay>{category.name}</CategoryNameDisplay>
          {category.status && <CategoryStatusBadge $status={category.status}>{category.status}</CategoryStatusBadge>} {/* Only show badge if status is present */}
          {category.parentCategoryId && (
            <span style={{ fontSize: theme.typography.admin.sizes.xsmall, color: theme.colors.adminTextSecondary, marginLeft: theme.spacing(3) }}>(ID: {category._id.substring(0, 4)}...)</span>
          )}
        </CategoryDetails>
        <CategoryActions>
          <button onClick={() => onAddSubCategory(category._id)} title="Add Sub-Category"><FaPlus /></button>
          <button onClick={() => onEdit(category._id)} title="Edit Category"><FaEdit /></button>
          <button onClick={() => onDelete(category._id)} title="Delete Category"><FaTrashAlt /></button>
        </CategoryActions>
      </CategoryRow>
      
      {hasChildren && isExpanded && (
        <CategoryChildrenList>
          {category.children?.map(child => (
            <CategoryNode // Recursive rendering
              key={child._id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onAddSubCategory={onAddSubCategory}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
              filteredCategoryIds={filteredCategoryIds}
            />
          ))}
        </CategoryChildrenList>
      )}
    </CategoryTreeNode>
  );
};

export default CategoryNode;