// src/components/Admin/Categories/CategoryForm.tsx
import React, { useState, useEffect, type FormEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner
} from 'react-icons/fa';

import {
  CategoryFormContainer,
  FormHeader,
  FormTitle,
  ActualForm, // Renamed from CategoryActualForm for consistency
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
  ImagePreviewWrapper,
  CategoryImagePreview,
} from './CategoryForm.styles';


import { AdminInput,AdminButton } from '../admin/Dashboard/Common/Common.styles';
import AdminTextArea from '../admin/common/AdminTextArea/AdminTextArea';
import AdminSelect,{ type SelectOption }  from '../admin/common/AdminSelect/AdminSelect';
import FormSectionWrapper, { FieldGroup, FormLabel, MultiFieldRow }  from '../admin/common/FormSectionWrapper/FormSectionWrapper';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import ImageUploader from '../admin/common/ImageUploader/ImageUploader';
// Hooks and Types
import {
  useGetCategoryById,
  useCreateCategory,
  useUpdateCategory,
  useGetPaginatedCategories, // To fetch categories for parent dropdown
} from '@/hooks/admin/product/useCategory'; // Adjust path
import {
  type ICategoryCreatePayload, // This will be our form data type
  type ICategoryUpdatePayload,
  type ICategoryResponse,
} from '@/types/category'; // Adjust path
import { useNotification } from '@/contexts/NotificationContext';
import { type RootState } from '@/store'; // For createdBy/updatedBy from user
import { useSelector } from 'react-redux';

// Default state for a new category
const initialCategoryState: Omit<ICategoryCreatePayload, 'createdBy' | 'updatedBy'> = { // createdBy/updatedBy handled separately
  name: '',
  slug: '', // Will be auto-generated if left empty
  description: '',
  imageUrl: '',
  parentId: null, // Default to top-level
  isActive: true,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  sortOrder: 0,
};

interface CategoryFormRouteParams extends Record<string, string | undefined> {
    categoryId?: string;  // For editing an existing category
    parentId?: string;    // For creating a sub-category under this parent
}

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<CategoryFormRouteParams>();
  const categoryIdToEdit = params.categoryId; // ID of category being edited
  const explicitParentId = params.parentId; // ID of parent if creating a sub-category directly from a route like /:parentId/new-child

  const isEditMode = !!categoryIdToEdit;
  const theme = useTheme();
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Omit<ICategoryCreatePayload, 'createdBy'>>({
      ...initialCategoryState,
      parentId: explicitParentId || null, // Pre-fill parentId if creating a sub-category
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [parentCategoryOptions, setParentCategoryOptions] = useState<SelectOption[]>([]);


  // --- DATA FETCHING ---
  // Fetch existing category for edit mode
  const {
    data: existingCategory,
    isLoading: isLoadingExisting,
    isError: isFetchError,
    error: fetchErrorData,
  } = useGetCategoryById(
    categoryIdToEdit,
    undefined, // No specific projection, get all fields
    undefined, // No lean for forms typically
    { enabled: isEditMode && !!categoryIdToEdit }
  );

  // Fetch all categories for parent dropdown
  const { data: allCategoriesResponse, isLoading: isLoadingCategoriesForSelect } = useGetPaginatedCategories(
    { limit: 1000, sort: JSON.stringify({ name: 1 }), projection: "id name level parentId ancestors" }, // Fetch enough data for select
    { staleTime: 5 * 60 * 1000 }
  );

  // --- MUTATIONS ---
  const createCategoryMutation = useCreateCategory({
    onSuccess: (response) => {
      showNotification(`Category "${response.data.name}" created successfully!`, 'success');
      navigate('/admin/products/categories'); // Or to the new category's view/edit page
    },
    onError: (error: any) => {
      setServerError(error.message || 'Failed to create category. Please check details.');
      if (error.errors && typeof error.errors === 'object') setFormErrors(error.errors);
      showNotification(`Error: ${error.message || 'Creation failed'}`, 'error');
    },
  });

  const updateCategoryMutation = useUpdateCategory({
    onSuccess: (response) => {
      showNotification(`Category "${response.data.name}" updated successfully!`, 'success');
      navigate('/admin/products/categories');
    },
    onError: (error: any) => {
      setServerError(error.message || 'Failed to update category. Please check details.');
      if (error.errors && typeof error.errors === 'object') setFormErrors(error.errors);
      showNotification(`Error: ${error.message || 'Update failed'}`, 'error');
    },
  });


  // --- EFFECTS ---
  // Populate form if in edit mode and data is fetched
  useEffect(() => {
    if (isEditMode && existingCategory) {
      setFormData({
        name: existingCategory.name,
        slug: existingCategory.slug || '',
        description: existingCategory.description || '',
        imageUrl: existingCategory.imageUrl || '',
        parentId: existingCategory.parentId || null,
        isActive: existingCategory.isActive === undefined ? true : existingCategory.isActive,
        metaTitle: existingCategory.metaTitle || '',
        metaDescription: existingCategory.metaDescription || '',
        metaKeywords: existingCategory.metaKeywords || [],
        sortOrder: existingCategory.sortOrder || 0,
      });
    } else if (!isEditMode) { // Reset for create mode or if explicitParentId is set
        setFormData(prev => ({...initialCategoryState, parentId: explicitParentId || prev.parentId || null}));
    }
  }, [isEditMode, existingCategory, explicitParentId]);

  // Prepare parent category options for the select dropdown
  useEffect(() => {
    if (allCategoriesResponse?.data) {
      const getDescendantIds = (catId: string, categories: ICategoryResponse[]): Set<string> => {
          const descendants = new Set<string>();
          const findChildren = (pId: string) => {
              categories.forEach(c => {
                  if (c.parentId === pId) {
                      descendants.add(c.id);
                      findChildren(c.id);
                  }
              });
          };
          findChildren(catId);
          return descendants;
      };

      let excludedIds = new Set<string>();
      if (isEditMode && categoryIdToEdit) {
          excludedIds.add(categoryIdToEdit); // Cannot be its own parent
          const descendantsOfEditing = getDescendantIds(categoryIdToEdit, allCategoriesResponse.data);
          descendantsOfEditing.forEach(id => excludedIds.add(id)); // Cannot be parent to its own descendant
      }

      const options: SelectOption[] = allCategoriesResponse.data
        .filter(cat => !excludedIds.has(cat.id))
        .map(cat => ({
          value: cat.id,
          label: `${'--'.repeat(cat.level || 0)} ${cat.name}`, // Indent based on level
        }));
      setParentCategoryOptions([{ value: '', label: 'None (Top-Level Category)' }, ...options]);
    }
  }, [allCategoriesResponse, isEditMode, categoryIdToEdit]);


  // --- HANDLERS ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: inputValue }));
    if (formErrors[name]) { // Clear specific field error on change
        setFormErrors(prev => ({...prev, [name]: ''}));
    }
    setServerError(null); // Clear general server error on any change
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(kw => kw.trim()).filter(kw => kw);
    setFormData(prev => ({ ...prev, metaKeywords: keywords }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFormErrors({});

    if (!formData.name.trim()) {
      setFormErrors(prev => ({...prev, name: 'Category Name is required.'}));
      showNotification('Category Name is required.', 'warning');
      return;
    }
    if (!user?._id) {
        setServerError('User authentication error. Cannot save category.');
        showNotification('Authentication error.', 'error');
        return;
    }

    if (isEditMode && categoryIdToEdit) {
      const updatePayload: ICategoryUpdatePayload = {
        ...formData,
        updatedBy: new Types.ObjectId(user._id), // Ensure Types.ObjectId if backend expects it
      };
      updateCategoryMutation.mutate({ id: categoryIdToEdit, payload: updatePayload });
    } else {
      const createPayload: ICategoryCreatePayload = {
        ...formData,
        createdBy: new Types.ObjectId(user._id), // Ensure Types.ObjectId
        // updatedBy will be set by service if not part of create payload type
      };
      createCategoryMutation.mutate(createPayload);
    }
  };

  const handleCancel = () => {
    if (formData.parentId && !isEditMode && explicitParentId) { // If creating sub-category & cancelled
      navigate(`/admin/products/categories/${formData.parentId}/options`); // Or parent's category page
    } else if(isEditMode && existingCategory?.parentId){
      navigate(`/admin/products/categories/${existingCategory.parentId}/options`);
    }
    else if (isEditMode && categoryIdToEdit) {
      navigate(`/admin/products/categories`); // Go to list or specific category view if you have one
    }
     else {
      navigate('/admin/products/categories');
    }
  };

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  // --- RENDER LOGIC ---
  if (isLoadingExisting || (isEditMode && !existingCategory && !isFetchError)) {
    return <div style={{display:'flex', justifyContent:'center', padding: '50px'}}><LoadingSpinner message="Loading category details..." /></div>;
  }
  if (isFetchError && isEditMode) {
    return (
      <CategoryFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle /> Error loading category: {(fetchErrorData as any)?.message || 'Could not fetch details.'}
        </FormAlert>
        <AdminButton $variant="secondary" onClick={() => navigate('/admin/products/categories')}>
            <FaArrowLeft /> Back to List
        </AdminButton>
      </CategoryFormContainer>
    );
  }

  return (
    <CategoryFormContainer>
      <FormHeader>
        <FormTitle>{isEditMode ? `Edit Category: ${existingCategory?.name || ''}` : (explicitParentId ? 'Add Sub-Category' : 'Create New Category')}</FormTitle>
        <AdminButton $variant="secondary" onClick={handleCancel}>
            <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }}/> Back to Categories
        </AdminButton>
      </FormHeader>

      {serverError && <FormAlert $type="error"><FaExclamationTriangle />{serverError}</FormAlert>}

      <ActualForm onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <FormSectionWrapper title="Basic Information">
          <FieldGroup>
            <FormLabel htmlFor="name">Category Name*</FormLabel>
            <AdminInput
              type="text" id="name" name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g., Electronics, Men's Apparel" required disabled={isSubmitting}
              className={formErrors.name ? 'input-error' : ''}
            />
            {formErrors.name && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{formErrors.name}</FieldHelperText>}
            <FieldHelperText>The main name of the category.</FieldHelperText>
          </FieldGroup>

          <FieldGroup>
            <FormLabel htmlFor="slug">Slug (URL friendly)</FormLabel>
            <AdminInput
              type="text" id="slug" name="slug" value={formData.slug || ''} onChange={handleChange}
              placeholder="e.g., electronics (auto-generated if empty)" disabled={isSubmitting}
            />
            <FieldHelperText>URL-friendly version of the name. Leave empty to auto-generate.</FieldHelperText>
          </FieldGroup>

          <FieldGroup>
            <FormLabel htmlFor="parentId">Parent Category</FormLabel>
            <AdminSelect
              id="parentId" name="parentId"
              value={formData.parentId || ''} // Use empty string for "None" option value
              onChange={handleChange}
              options={parentCategoryOptions}
              disabled={isSubmitting || isLoadingCategoriesForSelect}
              isLoading={isLoadingCategoriesForSelect}
            />
             {formErrors.parentId && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{formErrors.parentId}</FieldHelperText>}
            <FieldHelperText>Select a parent to create a sub-category.</FieldHelperText>
          </FieldGroup>

           <FieldGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <AdminTextArea
              id="description" name="description" value={formData.description || ''} onChange={handleChange}
              placeholder="Optional: Detailed description of the category..." rows={4} disabled={isSubmitting}
            />
          </FieldGroup>
        </FormSectionWrapper>

        {/* Section 2: Display & SEO */}
        <FormSectionWrapper title="Display & SEO">
            <FieldGroup>
                <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
                <AdminInput
                type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange}
                placeholder="Optional: https://example.com/category-image.png" disabled={isSubmitting}
                />
                {formData.imageUrl && (
                    <ImagePreviewWrapper>
                        <CategoryImagePreview src={formData.imageUrl} alt="Category Preview" />
                    </ImagePreviewWrapper>
                )}
            </FieldGroup>
            <FieldGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2)}}>
                    <input type="checkbox" id="isActive" name="isActive"
                        checked={formData.isActive} onChange={handleChange} disabled={isSubmitting}
                        style={{ transform: 'scale(1.3)'}}
                    />
                    <FormLabel htmlFor="isActive" style={{ textTransform: 'none', marginBottom: '0', cursor: 'pointer' }}>
                        Is Active?
                    </FormLabel>
                </div>
                <FieldHelperText>Inactive categories will not be visible on the storefront.</FieldHelperText>
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="sortOrder">Sort Order</FormLabel>
                <AdminInput type="number" id="sortOrder" name="sortOrder"
                value={formData.sortOrder === undefined ? '' : formData.sortOrder}
                onChange={handleChange} placeholder="0" disabled={isSubmitting}
                style={{maxWidth: '120px'}}
                />
                <FieldHelperText>Order in which categories are displayed (lower numbers usually appear first).</FieldHelperText>
            </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper title="SEO Information (Optional)">
            <FieldGroup>
                <FormLabel htmlFor="metaTitle">Meta Title</FormLabel>
                <AdminInput type="text" id="metaTitle" name="metaTitle"
                value={formData.metaTitle || ''} onChange={handleChange}
                placeholder="Custom title for browser tabs and search engines" disabled={isSubmitting}
                />
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="metaDescription">Meta Description</FormLabel>
                <AdminTextArea id="metaDescription" name="metaDescription"
                value={formData.metaDescription || ''} onChange={handleChange}
                placeholder="Brief summary for search engine results" rows={3} disabled={isSubmitting}
                />
            </FieldGroup>
            <FieldGroup>
                <FormLabel htmlFor="metaKeywords">Meta Keywords (comma-separated)</FormLabel>
                <AdminInput type="text" id="metaKeywords" name="metaKeywords"
                value={formData.metaKeywords?.join(', ') || ''} onChange={handleKeywordsChange}
                placeholder="e.g., electronics, tvs, gaming" disabled={isSubmitting}
                />
            </FieldGroup>
        </FormSectionWrapper>


        <FormStickyActionBar>
            <AdminButton type="button" $variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                <FaBan /> Cancel
            </AdminButton>
            <AdminButton type="submit" $variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner size="1em" color="#FFF" thickness="2px" inline={true}/> : <FaCheckCircle />}
                {isEditMode ? 'Save Changes' : 'Create Category'}
            </AdminButton>
        </FormStickyActionBar>
      </ActualForm>
    </CategoryFormContainer>
  );
};

export default CategoryForm;