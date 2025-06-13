// src/components/Admin/Products/ProductForm/index.tsx

import React, { useState, useEffect, useCallback, type FormEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// --- Styles & Layout ---
import { ProductFormContainer, ActualProductForm, FormAlert } from "./ProductForm.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import FormSectionWrapper from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper";

// --- Sub-components for Form Sections ---
import ProductFormHeader from "./ProductFormHeader";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductImages from "./sections/ProductImages";
import ProductPricing from "./sections/ProductPricing";
import ProductPublishing from "./sections/ProductPublishing";
import ProductShipping from "./sections/ProductShipping";
import ProductSeo from "./sections/ProductSeo";
import ProductFormActions from "./ProductFormActions";
import ProductVariationsManager from "./sections/ProductVariationsManager/ProductVariationsManager";

// --- Hooks, Types, and Utils ---
import { useCreateProduct } from "@/hooks/admin/product/product/useProduct";
import { useGetPaginatedCategories } from "@/hooks/admin/product/useCategory";
import type { IProductFormState, IProductVariationFormState } from "@/types/product.types";
import type { ICategoryResponse } from "@/types/category";
import type { SelectOption } from "@/types/common.types";
import { useNotification } from "@/contexts/NotificationContext";
import type { RootState } from "@/store";
import { buildProductFormData } from "@/api/admin/product/product/productApi";

// --- Icons ---
import { FaInfoCircle, FaImage, FaDollarSign, FaList, FaRocket, FaTruck, FaSearch, FaExclamationTriangle } from "react-icons/fa";

// --- Initial State for a New Product ---
// NOTE: Fields like existingMainImageUrls and mainImagesToDeletePublicIds are kept for type consistency with IProductFormState,
// but they will remain empty in this create-only form.
const initialProductFormState: IProductFormState = {
  name: "", description: "", shortDescription: "", currency: "USD", categoryId: "",
  tags: [], mainImageFiles: [], existingMainImageUrls: [], mainImagesToDeletePublicIds: [],
  mainProductImageIndex: '0', status: "draft", visibility: "hidden",
  variations: [], metaTitle: "", metaDescription: "", metaKeywords: [],
  isShippingRequired: true, isHazardousMaterial: false, isAgeRestricted: false, allowReviews: true,
};

// =================================================================================================
// === MAIN COMPONENT (CREATE-ONLY) ================================================================
// =================================================================================================
const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<IProductFormState>(initialProductFormState);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // --- Data Fetching ---
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPaginatedCategories({ limit: 1000, sort: JSON.stringify({ name: 1 }) }, { staleTime: 10 * 60 * 1000 });
  // TODO: Add `useGetActiveBrands` and `useGetActiveSellers` hooks here

  // --- Memoized Options for Select Inputs ---
  const categoryOptions = useMemo<SelectOption[]>(() => {
    if (!categoriesData?.data) return [];
    const buildHierarchicalOptions = (cats: ICategoryResponse[], parentId: string | null = null, depth = 0): SelectOption[] => {
      return cats.filter(c => (c.parentId || null) === parentId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
        .reduce<SelectOption[]>((acc, category) => {
          acc.push({ value: category._id, label: `${'— '.repeat(depth)}${category.name}` });
          acc.push(...buildHierarchicalOptions(cats, category._id, depth + 1));
          return acc;
        }, []);
    };
    return [{ value: "", label: "Select a Category*" }, ...buildHierarchicalOptions(categoriesData.data)];
  }, [categoriesData]);

  // --- Mutation Error Handling ---
  const handleMutationError = useCallback((error: any) => {
    console.error("Creation Error:", error);
    let displayMessage = "An unexpected error occurred. Please try again.";
    if (typeof error === 'string') { displayMessage = error; }
    else if (error?.message && typeof error.message === 'string') { displayMessage = error.message; }
    else if (Array.isArray(error?.errors) && error.errors.length > 0) { displayMessage = error.errors.join(' '); }
    
    setServerError(displayMessage);
    if (error?.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) { setFieldErrors(error.errors); }
    showNotification(displayMessage, "error");
  }, [showNotification]);

  // --- Create Product Mutation ---
  const createProductMutation = useCreateProduct({
    onSuccess: (res) => {
      showNotification(`Product "${res.data.name}" created successfully!`, "success");
      navigate("/admin/products");
    },
    onError: handleMutationError
  });

  // --- Form State Handlers ---
  const handleFieldChange = useCallback((field: keyof IProductFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) { setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; }); }
    setServerError(null);
  }, [fieldErrors]);

  const handleTagsChange = useCallback((tags: string[]) => { setFormData(prev => ({ ...prev, tags })); }, []);
  const handleMetaKeywordsChange = useCallback((keywords: string[]) => { setFormData(prev => ({ ...prev, metaKeywords: keywords })); }, []);
  const handleImagesUpdate = useCallback((files: File[], publicIdsToDelete: string[]) => {
    // In create mode, publicIdsToDelete will always be empty, but we handle it for type consistency.
    setFormData(prev => ({ ...prev, mainImageFiles: files, mainImagesToDeletePublicIds: publicIdsToDelete }));
  }, []);
  const handleVariationsChange = useCallback((variations: IProductVariationFormState[]) => { setFormData(prev => ({ ...prev, variations })); }, []);

  // --- Form Submission ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError(null); setFieldErrors({});
    let validationErrors: Record<string, string> = {};
    if (!formData.name.trim()) validationErrors.name = "Product name is required.";
    if (!formData.categoryId) validationErrors.categoryId = "A category must be selected.";
    if (formData.variations.length === 0) {
      showNotification("A product must have at least one variation.", "warning");
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      showNotification("Please correct highlighted errors.", "warning");
      return;
    }
    if (!user?._id) {
      showNotification("Authentication error. Cannot create product.", "error");
      return;
    }

    const apiFormData = buildProductFormData(formData);
    createProductMutation.mutate(apiFormData);
  };

  const isMutating = createProductMutation.isPending;

  // --- Render Logic ---
  if (isLoadingCategories) return <LoadingSpinner message="Loading form..." fullscreen />;

  return (
    <ProductFormContainer>
      <ProductFormHeader
        isEditMode={false}
        productName={formData.name}
        isSubmitting={isMutating}
        onBack={() => navigate("/admin/products")}
      />
      
      <ActualProductForm onSubmit={handleSubmit} noValidate>
        {serverError && <FormAlert $type="error"><FaExclamationTriangle /> {serverError}</FormAlert>}
        
        <FormSectionWrapper title="Basic Information" icon={<FaInfoCircle />} isExpanded>
          <ProductBasicInfo formData={formData} onFieldChange={handleFieldChange} onTagsChange={handleTagsChange} categoryOptions={categoryOptions} brandOptions={[]} errors={fieldErrors} disabled={isMutating} />
        </FormSectionWrapper>

        <FormSectionWrapper title="Main Product Images" icon={<FaImage />}>
          <ProductImages
            existingImageUrls={[]} // Always empty for new products
            newImageFiles={formData.mainImageFiles || []}
            mainProductImageIndex={formData.mainProductImageIndex}
            onFieldChange={handleFieldChange}
            onUpdate={handleImagesUpdate}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper title="Pricing" icon={<FaDollarSign />}>
          <ProductPricing formData={formData} onFieldChange={handleFieldChange} errors={fieldErrors} disabled={isMutating} />
        </FormSectionWrapper>
        
        <FormSectionWrapper title="Variations & Inventory" icon={<FaList />} isExpanded>
          <ProductVariationsManager key="pvm-new" initialVariations={formData.variations} onVariationsChange={handleVariationsChange} productCurrency={formData.currency} disabled={isMutating} />
        </FormSectionWrapper>
        
        <FormSectionWrapper title="Publishing" icon={<FaRocket />}>
          <ProductPublishing formData={formData} onFieldChange={handleFieldChange} sellerOptions={[]} errors={fieldErrors} disabled={isMutating} isAdminMode={user?.roles.includes('admin') || user?.roles.includes('superAdmin')} />
        </FormSectionWrapper>
        
        <FormSectionWrapper title="Shipping & Compliance" icon={<FaTruck />}>
          <ProductShipping formData={formData} onFieldChange={handleFieldChange} errors={fieldErrors} disabled={isMutating} />
        </FormSectionWrapper>
        
        <FormSectionWrapper title="Search Engine Optimization (SEO)" icon={<FaSearch />}>
            <ProductSeo formData={formData} onFieldChange={handleFieldChange} onMetaKeywordsChange={handleMetaKeywordsChange} errors={fieldErrors} disabled={isMutating} />
        </FormSectionWrapper>

        <ProductFormActions
          isEditMode={false}
          isSubmitting={isMutating}
          onCancel={() => navigate("/admin/products")}
        />
      </ActualProductForm>
    </ProductFormContainer>
  );
};

export default ProductForm;