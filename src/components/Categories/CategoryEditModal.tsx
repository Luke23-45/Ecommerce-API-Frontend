// src/components/Admin/Categories/CategoryEditModal.tsx
import React, { useState, useEffect } from 'react';
import styled, {type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';
import { FaTimes, FaCheckCircle, FaBan } from 'react-icons/fa';
import AdminSelect from '../admin/common/AdminSelect/AdminSelect';
import type { Category, CategoryStatus } from '@/types/category';
import { AdminButton,AdminInput } from '../admin/Dashboard/Common/Common.styles';
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.4)}; /* Dark transparent overlay */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure it's on top */
`;

export const ModalContent = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: ${(props) => getTheme(props).spacing(6)};
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding-bottom: ${(props) => getTheme(props).spacing(3)};

    h2 {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
    }

    button {
        background: none;
        border: none;
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        cursor: pointer;
        &:hover { color: ${(props) => getTheme(props).colors.adminStatusError}; }
    }
`;

export const ModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)};
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
`;

export const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(1.5)};
`;

export const FormLabel = styled.label`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.3px;
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(2)};
`;


interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  editingCategory?: Category | null; // Category object if editing, null/undefined if adding
  parentCategoryOptions?: { value: string; label: string }[]; // For re-parenting dropdown
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  parentCategoryOptions = [],
}) => {
  const isAddingNew = !editingCategory;
  const [category, setCategory] = useState<Category>(
    editingCategory || {
      _id: '', // Will be set on save/backend
      name: '',
      slug: '',
      parentCategoryId: null, // Default new to top-level
      level: 0,
      status: 'active',
      displayOrder: 0,
      imageUrl: '',
    }
  );

  // Sync internal state with prop if editingCategory changes (e.g., editing different category)
  useEffect(() => {
    if (editingCategory) {
      setCategory(editingCategory);
    } else {
      // Reset for new category
      setCategory({
        _id: '', name: '', slug: '', parentCategoryId: null, level: 0, status: 'active', displayOrder: 0, imageUrl: ''
      });
    }
  }, [editingCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory(prev => {
        const newCategory = { ...prev, [name]: value };
        // Auto-generate slug from name if adding new and slug is empty
        if (name === 'name' && isAddingNew && !newCategory.slug) {
            newCategory.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        return newCategory;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow manual slug editing
      setCategory(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value === 'null' ? null : e.target.value;
    const parent = parentCategoryOptions.find(opt => opt.value === parentId);
    setCategory(prev => ({
      ...prev,
      parentCategoryId: parentId,
      level: parent ? (parseInt(parent.label.match(/\((\d+)\)/)?.[1] || '0') + 1) : 0 // Basic level derivation
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.name.trim() || !category.slug.trim()) {
      alert("Category Name and Slug are required.");
      return;
    }
    // Simulate assigning temp ID if new and not assigned yet by a previous step
    if (isAddingNew && !category._id) {
        category._id = `temp_cat_${Date.now()}`;
    }
    onSave(category); // Pass current category data up
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent onClick={e => e.stopPropagation()}> {/* Prevent clicks on modal from closing overlay */}
        <ModalHeader>
          <h2>{isAddingNew ? 'Add New Category' : `Edit Category: ${editingCategory?.name}`}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal"><FaTimes /></button>
        </ModalHeader>
        <ModalForm onSubmit={handleSubmit}>
          <FieldGroup>
            <FormLabel htmlFor="name">Category Name</FormLabel>
            <AdminInput type="text" id="name" name="name" value={category.name} onChange={handleChange} required />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="slug">Slug</FormLabel>
            <AdminInput type="text" id="slug" name="slug" value={category.slug} onChange={handleSlugChange} required />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="parentCategoryId">Parent Category</FormLabel>
            <AdminSelect
              id="parentCategoryId"
              name="parentCategoryId"
              value={category.parentCategoryId || 'null'}
              onChange={handleParentChange}
              options={[{ value: 'null', label: 'Top-Level Category' }, ...parentCategoryOptions]}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="status">Status</FormLabel>
            <AdminSelect
              id="status"
              name="status"
              value={category.status}
              onChange={(e) => handleChange(e)} // Pass through like other fields
              options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            />
          </FieldGroup>
          {/* Add more fields here as category data grows, e.g., imageUrl, description, SEO fields */}
          {/* <FieldGroup>
            <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
            <AdminInput type="text" id="imageUrl" name="imageUrl" value={category.imageUrl || ''} onChange={handleChange} placeholder="Optional category image URL" />
          </FieldGroup> */}
        </ModalForm>
        <ModalActions>
          <AdminButton $variant="secondary" onClick={onClose} type="button">
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton $variant="primary" type="submit">
            <FaCheckCircle /> {isAddingNew ? 'Add Category' : 'Save Changes'}
          </AdminButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CategoryEditModal;