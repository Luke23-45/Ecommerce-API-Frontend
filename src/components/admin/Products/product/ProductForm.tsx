import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, type DefaultTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { Types } from 'mongoose';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaDollarSign,
  FaShoppingCart,
  FaBalanceScale,
  FaRulerCombined,
  FaTag,
  FaBuilding,
  FaUserTie,

} from 'react-icons/fa';

import {
  ProductFormContainer, 
  ActualProductForm,   
  StickyActionBar,
  FormHeader,
  FormTitle,
  FormAlert,           
  FieldHelperText,      
  ImagePreviewWrapper,  
  ProductImagePreview,
} from './ProductForm.styles'; 

import AdminTextArea from '../../common/AdminTextArea/AdminTextArea';
import AdminSelect, { type SelectOption } from '../../common/AdminSelect/AdminSelect';
import { AdminInput,AdminButton } from '../../Dashboard/Common/Common.styles';


import { FieldGroup,FormLabel,MultiFieldRow } from '../../common/FormSectionWrapper/FormSectionWrapper.styles';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import ImageUploader from '../../common/ImageUploader/ImageUploader';
import ProductVariationsManager from './ProductVariationsManager';
import {
  useGetProductById,
  useCreateProduct,
  useUpdateProduct,
} from '@/hooks/admin/product/product/useProduct'; 

import { useGetPaginatedCategories } from '@/hooks/admin/product/useCategory';

import {
  type IProductCreateFormState,
  type IProductResponse,
  type IProductVariationFormState,
  type IDimensionsForm,
  type StockStatusFrontend,
  type ProductStatusFrontend,
  type ProductVisibilityFrontend,
  type WeightUnitFrontend,
  type DimensionUnitFrontend,
} from '@/types/product.types';
import { type ICategoryResponse } from '@/types/category'; 
import { useNotification } from '@/contexts/NotificationContext'; 
import { type RootState } from '@/store'; 
import { buildProductFormData } from '@/api/admin/product/product/productApi';
// Initial state for a new product
const initialProductFormState: IProductCreateFormState = {
  name: '',
  description: '',
  shortDescription: '',
  basePrice: '',
  baseSalePrice: '',
  currency: 'USD',
  categoryId: '',
  brandId: '',
  tags: [],
  mainImageFiles: [],
  existingMainImageUrls: [],
  mainImagesToDelete: [],
  sellerType: 'vendor',
  sellerId: '', 
  status: 'draft',
  visibility: 'hidden',
  variations: [],
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  defaultWeight: '',
  defaultWeightUnit: 'kg',
  defaultDimensions: { length: '', width: '', height: '', unit: 'cm' },
  isShippingRequired: true,
  isHazardousMaterial: false,
  isAgeRestricted: false,
  ageRestrictionMinimum: '',
  allowReviews: true,
};

interface ProductFormProps {
  onSaveSuccess: () => void; 
  onCancel: () => void;    
}


const ProductForm: React.FC<ProductFormProps> = ({ onSaveSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const isEditMode = !!productId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<IProductCreateFormState>(initialProductFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]); // TODO: Fetch brands
  const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([]); // TODO: Fetch 

  //  DATA FETCHING 
  const {
    data: existingProductData,
    isLoading: isLoadingProduct,
    isError: isFetchProductError,
    error: fetchProductError,
    refetch: refetchProduct, // To refetch if needed
  } = useGetProductById(
    productId,
    undefined, // No specific projection needed for form population typically
    false,     // lean: false to get Mongoose docs if they have virtuals/methods you use (unlikely for just form data)
    { enabled: isEditMode && !!productId }
  );

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPaginatedCategories(
    { limit: 1000, sort: JSON.stringify({ name: 1 }), projection: "id name _id level parentId" }, // Fetch for dropdown
    { staleTime: Infinity } // Categories don't change often in this form context
  );

  //  MUTATIONS 
  const createProductMutation = useCreateProduct({
    onSuccess: (response) => {
      showNotification(`Product "${response.data.name}" created successfully!`, 'success');
      onSaveSuccess(); // Call parent callback for navigation
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to create product. Please check details.';
      setFormError(message);
      if (error.data?.errors && typeof error.data.errors === 'object') setFieldErrors(error.data.errors);
      else if (error.errors && typeof error.errors === 'object') setFieldErrors(error.errors);
      showNotification(`Error: ${message}`, 'error');
    },
  });

  const updateProductMutation = useUpdateProduct({
    onSuccess: (response) => {
      showNotification(`Product "${response.data.name}" updated successfully!`, 'success');
      onSaveSuccess();
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update product. Please check details.';
      setFormError(message);
      if (error.data?.errors && typeof error.data.errors === 'object') setFieldErrors(error.data.errors);
      else if (error.errors && typeof error.errors === 'object') setFieldErrors(error.errors);
      showNotification(`Error: ${message}`, 'error');
    },
  });

  //  EFFECTS 
  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && existingProductData) {
      setFormData({
        id: existingProductData.id || existingProductData._id, // Ensure 'id' is present
        name: existingProductData.name || '',
        description: existingProductData.description || '',
        shortDescription: existingProductData.shortDescription || '',
        basePrice: existingProductData.basePrice?.toString() || '',
        baseSalePrice: existingProductData.baseSalePrice?.toString() || '',
        currency: existingProductData.currency || 'USD',
        categoryId: existingProductData.categoryId || '',
        brandId: existingProductData.brandId || '',
        tags: existingProductData.tags || [],
        mainImageFiles: [], // Reset for edit mode, new files are handled separately
        existingMainImageUrls: existingProductData.imageUrls || [],
        mainImagesToDelete: [],
        sellerType: existingProductData.sellerType || 'vendor',
        sellerId: existingProductData.sellerId || '',
        status: existingProductData.status || 'draft',
        visibility: existingProductData.visibility || 'hidden',
        variations: (existingProductData.variations || []).map((v): IProductVariationFormState => ({
            tempId: v.id || v._id || `temp-${Date.now()}-${Math.random()}`, // Use existing ID, or temp for mapping
            sku: v.sku || '',
            price: v.price.toString(),
            salePrice: v.salePrice?.toString() || '',
            inventory: v.inventory.toString(),
            stockStatus: v.stockStatus,
            attributeOptions: (v.attributeOptions || []).map(ao => ({
                attributeId: ao.attributeId as string,
                attributeName: ao.attributeName,
                optionId: ao.optionId as string,
                optionValue: ao.optionValue,
                optionSwatchValue: ao.optionSwatchValue,
            })),
            imageFiles: [],
            existingImageUrls: v.imageUrls || [],
            imagesToDelete: [],
            weight: v.weight?.toString() || '',
            weightUnit: v.weightUnit,
            dimensions: {
                length: v.dimensions?.length?.toString() || '',
                width: v.dimensions?.width?.toString() || '',
                height: v.dimensions?.height?.toString() || '',
                unit: v.dimensions?.unit || 'cm',
            },
            barcode: v.barcode || '',
            costPrice: v.costPrice?.toString() || '',
            lowStockThreshold: v.lowStockThreshold?.toString() || '',
            isActive: v.isActive === undefined ? true : v.isActive,
        })),
        metaTitle: existingProductData.metaTitle || '',
        metaDescription: existingProductData.metaDescription || '',
        metaKeywords: existingProductData.metaKeywords || [],
        defaultWeight: existingProductData.defaultWeight?.toString() || '',
        defaultWeightUnit: existingProductData.defaultWeightUnit || 'kg',
        defaultDimensions: {
            length: existingProductData.defaultDimensions?.length?.toString() || '',
            width: existingProductData.defaultDimensions?.width?.toString() || '',
            height: existingProductData.defaultDimensions?.height?.toString() || '',
            unit: existingProductData.defaultDimensions?.unit || 'cm',
        },
        isShippingRequired: existingProductData.isShippingRequired === undefined ? true : existingProductData.isShippingRequired,
        isHazardousMaterial: existingProductData.isHazardousMaterial || false,
        isAgeRestricted: existingProductData.isAgeRestricted || false,
        ageRestrictionMinimum: existingProductData.ageRestrictionMinimum?.toString() || '',
        allowReviews: existingProductData.allowReviews === undefined ? true : existingProductData.allowReviews,
      });
    } else if (!isEditMode) {
      setFormData(initialProductFormState);
    }
  }, [isEditMode, existingProductData]);

  // Populate category dropdown
  useEffect(() => {
    if (categoriesData?.data) {
        // Build hierarchical options for select
        const buildHierarchicalOptions = (cats: ICategoryResponse[], parentId: string | null = null, depth = 0): SelectOption[] => {
            return cats
                .filter(c => c.parentId === parentId)
                .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
                .reduce((acc, category) => {
                    const id = category.id || category._id as string;
                    acc.push({
                        value: id,
                        label: `${'— '.repeat(depth)}${category.name}`
                    });
                    const children = buildHierarchicalOptions(cats, id, depth + 1);
                    acc.push(...children);
                    return acc;
                }, [] as SelectOption[]);
        };
        const options = buildHierarchicalOptions(categoriesData.data.map(c => ({...c, id: c.id || c._id as string}))); // Ensure ID
      setCategoryOptions([{ value: '', label: 'Select a Category' }, ...options]);
    }
  }, [categoriesData]);

  //  INPUT HANDLERS 
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => {
      if (name.startsWith("defaultDimensions.")) {
        const dimProp = name.split(".")[1] as keyof IDimensionsForm;
        return { ...prev, defaultDimensions: { ...(prev.defaultDimensions), [dimProp]: inputValue } };
      }
      return { ...prev, [name]: inputValue };
    });
    if (fieldErrors[name]) setFieldErrors(prev => ({...prev, [name]: ''}));
    setFormError(null);
  }, [fieldErrors]); // Added fieldErrors to dep array

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  }, []);

  const handleMetaKeywordsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const keywordsArray = e.target.value.split(',').map(kw => kw.trim()).filter(kw => kw);
    setFormData(prev => ({ ...prev, metaKeywords: keywordsArray }));
  }, []);

  // From ImageUploader
  const handleMainImagesUpdate = useCallback((newFiles: File[], currentImageUrls: string[], deletedImageUrls: string[]) => {
    setFormData(prev => ({
        ...prev,
        mainImageFiles: newFiles,
        existingMainImageUrls: currentImageUrls, // Assuming ImageUploader passes back the remaining existing URLs
        mainImagesToDelete: deletedImageUrls,
    }));
  }, []);

  const handleVariationsChange = useCallback((updatedVariations: IProductVariationFormState[]) => {
    setFormData(prev => ({ ...prev, variations: updatedVariations }));
    // Simplified stock status logic, can be enhanced
    const totalInventory = updatedVariations.reduce((sum, v) => sum + (Number(v.inventory) || 0), 0);
    // Further logic from your sample ProductDetail_ can be added here to set formData.inventory & formData.stockStatus
    setFormData(prev => ({
        ...prev,
        inventory: totalInventory.toString(), // Assuming base inventory reflects sum, might be different logic
        stockStatus: totalInventory > 0 ? "in_stock" : "out_of_stock"
    }))
  }, []);

  //  FORM SUBMISSION 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});
    let currentFieldErrors: Record<string, string> = {};

    if (!formData.name.trim()) currentFieldErrors.name = "Product Name is required.";
    if (!formData.categoryId) currentFieldErrors.categoryId = "Category is required.";
    if (!formData.currency) currentFieldErrors.currency = "Currency is required.";
    if (!formData.basePrice || isNaN(parseFloat(formData.basePrice))) currentFieldErrors.basePrice = "Valid Base Price is required.";
    if (formData.variations.length === 0) {
        setServerError("Product must have at least one variation defined.");
        showNotification("Product must have at least one variation.", "warning");
        return;
    }
    // TODO: Add more client-side validation for variations (e.g., unique SKUs within variations)

    if (Object.keys(currentFieldErrors).length > 0) {
        setFieldErrors(currentFieldErrors);
        showNotification("Please correct the form errors.", "warning");
        return;
    }

    if (!user?._id) {
        setServerError("User authentication error. Cannot save product.");
        showNotification("Authentication error, please log in again.", "error");
        return;
    }

    // Construct FormData using the imported helper
    // The buildProductFormData function needs to correctly map IProductCreateFormState to FormData
    // including converting string numbers to actual numbers for the JSON part.
    const productApiFormData = buildProductFormData(formData); // The helper does the main work

    if (isEditMode && productId) {
      console.log("Submitting UPDATE with FormData for productId:", productId);
      // Add product ID to FormData if backend expects it for update (usually not, it's in URL)
      // productApiFormData.append('id', productId); // Usually not needed
      updateProductMutation.mutate({ productId, formData: productApiFormData });
    } else {
      console.log("Submitting CREATE with FormData");
      createProductMutation.mutate(productApiFormData);
    }
  };

  const isMutating = createProductMutation.isPending || updateProductMutation.isPending;
  const isLoadingPage = (isEditMode && isLoadingProduct) || isLoadingCategories;

  //  RENDER LOGIC 
  if (isLoadingPage && !existingProductData && isEditMode) {
    return <div style={{display:'flex', justifyContent:'center', padding: '50px'}}><LoadingSpinner message={isEditMode ? "Loading product..." : "Loading form..."} /></div>;
  }
  if (isFetchProductError && isEditMode) {
    return (
      <ProductFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle style={{marginRight: theme.spacing(2)}} /> Error loading product: {(fetchProductError as any)?.message || 'Details not found.'}
        </FormAlert>
        <AdminButton $variant="secondary" onClick={onCancel}><FaArrowLeft /> Back to List</AdminButton>
      </ProductFormContainer>
    );
  }

  return (
    <ProductFormContainer>
      <FormHeader>
        <FormTitle>{isEditMode ? `Edit Product: ${formData.name || 'Loading...'}` : 'Create New Product'}</FormTitle>
        <AdminButton $variant="secondary" onClick={onCancel} disabled={isMutating}>
            <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }}/> Cancel & Back to List
        </AdminButton>
      </FormHeader>

      {serverError && <FormAlert $type="error"><FaExclamationTriangle /> {serverError}</FormAlert>}

      <ActualProductForm onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <FormSectionWrapper title="Basic Information" icon={<FaInfoCircle />}>
            <FieldGroup>
                <FormLabel htmlFor="name">Product Name*</FormLabel>
                <AdminInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isMutating} />
                {fieldErrors.name && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.name}</FieldHelperText>}
            </FieldGroup>
            {/* Base SKU (optional if all products have variations with SKUs) */}
            {/*
            <FieldGroup>
                <FormLabel htmlFor="baseSku">Base SKU (Optional)</FormLabel>
                <AdminInput type="text" id="baseSku" name="baseSku" value={formData.baseSku || ''} onChange={handleChange} disabled={isMutating} />
            </FieldGroup>
            */}
            <FieldGroup $fullWidth>
                <FormLabel htmlFor="description">Full Description</FormLabel>
                <AdminTextArea id="description" name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Detailed information about the product..." disabled={isMutating} />
            </FieldGroup>
            <FieldGroup $fullWidth>
                <FormLabel htmlFor="shortDescription">Short Summary (for listings)</FormLabel>
                <AdminTextArea id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3} placeholder="Brief overview..." disabled={isMutating} />
            </FieldGroup>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="categoryId">Category*</FormLabel>
                    <AdminSelect id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} options={categoryOptions} required disabled={isMutating || isLoadingCategories} isLoading={isLoadingCategories} />
                    {fieldErrors.categoryId && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.categoryId}</FieldHelperText>}
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="brandId">Brand</FormLabel>
                    <AdminSelect id="brandId" name="brandId" value={formData.brandId || ''} onChange={handleChange} options={[{value: '', label: 'Select Brand'}, ...brandOptions]} disabled={isMutating /* || isLoadingBrands */} isLoading={false /*isLoadingBrands*/} />
                    <FieldHelperText>Optional. Select or add new brand later.</FieldHelperText>
                </FieldGroup>
            </MultiFieldRow>
            <FieldGroup>
                <FormLabel htmlFor="tags">Tags (<FaTag /> comma-separated)</FormLabel>
                <AdminInput type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} placeholder="e.g., modern, eco-friendly" disabled={isMutating} />
            </FieldGroup>
        </FormSectionWrapper>

        {/* Section 2: Main Product Images */}
        <FormSectionWrapper title="Main Product Images" icon={<FaImage />}>
            <ImageUploader
                key={`main-images-${formData.id || 'newProduct'}`} // Force re-mount on product change
                instanceId={`main_${formData.id || 'new'}`} // Unique ID for multiple uploaders on a page
                initialImageUrls={formData.existingMainImageUrls}
                onImagesUpdate={handleMainImagesUpdate}
                maxFiles={10}
                label="Upload or drag product images here (first image is primary)"
            />
        </FormSectionWrapper>

        {/* Section 3: Pricing */}
        <FormSectionWrapper title="Base Pricing" icon={<FaDollarSign/>}>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="basePrice">Base Price*</FormLabel>
                    <AdminInput type="text" id="basePrice" name="basePrice" value={formData.basePrice} onChange={handleChange} required pattern="^\d*([.,]\d{0,2})?$" placeholder="0.00" disabled={isMutating} />
                    {fieldErrors.basePrice && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.basePrice}</FieldHelperText>}
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="baseSalePrice">Base Sale Price</FormLabel>
                    <AdminInput type="text" id="baseSalePrice" name="baseSalePrice" value={formData.baseSalePrice || ''} onChange={handleChange} pattern="^\d*([.,]\d{0,2})?$" placeholder="0.00" disabled={isMutating} />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="currency">Currency*</FormLabel>
                    <AdminSelect id="currency" name="currency" value={formData.currency} onChange={handleChange} options={[{value: 'USD', label: 'USD'}, {value: 'EUR', label: 'EUR'}, { value: "GBP", label: "GBP" }]} required disabled={isMutating} />
                </FieldGroup>
            </MultiFieldRow>
            <FieldHelperText>This is the default price. Variations can have their own specific prices.</FieldHelperText>
        </FormSectionWrapper>

        {/* Section 4: Product Variations & Inventory */}
        <FormSectionWrapper title="Product Variations & Inventory" icon={<FaList/>}>
            <ProductVariationsManager
                key={`variations-${formData.id || 'newProduct'}`} // Force re-render if product context changes
                productVariations={formData.variations}
                onVariationsChange={handleVariationsChange}
                // Needs available attributes (fetched within PVM or passed as props)
                // parentProductCurrency={formData.currency} // Pass currency for consistent display
            />
        </FormSectionWrapper>

        {/* Section 5: Publishing & Seller */}
        <FormSectionWrapper title="Publishing & Seller Information">
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="status">Product Status*</FormLabel>
                    <AdminSelect id="status" name="status" value={formData.status} onChange={handleChange} required disabled={isMutating}
                        options={[
                            {value: "draft", label: "Draft"},
                            {value: "pending_review", label: "Pending Review"},
                            {value: "active", label: "Active"},
                            {value: "archived", label: "Archived"},
                        ]}
                    />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="visibility">Visibility*</FormLabel>
                    <AdminSelect id="visibility" name="visibility" value={formData.visibility} onChange={handleChange} required disabled={isMutating}
                        options={[
                            {value: "public", label: "Public"},
                            {value: "hidden", label: "Hidden"},
                            // {value: "private", label: "Private"}
                        ]}
                    />
                </FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow>
                 <FieldGroup>
                    <FormLabel htmlFor="sellerType">Seller Type*</FormLabel>
                    <AdminSelect id="sellerType" name="sellerType" value={formData.sellerType} onChange={handleChange} required disabled={isMutating}
                        options={[
                            {value: "vendor", label: "Vendor"},
                            {value: "individual_seller", label: "Individual Seller"}
                        ]}
                    />
                </FieldGroup>
                 <FieldGroup>
                    <FormLabel htmlFor="sellerId">Seller/Vendor Account*</FormLabel>
                    <AdminSelect id="sellerId" name="sellerId" value={formData.sellerId} onChange={handleChange}
                        options={[{value: '', label: 'Select Seller/Vendor'}, ...sellerOptions]} // Populate sellerOptions
                        required disabled={isMutating} />
                    {fieldErrors.sellerId && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.sellerId}</FieldHelperText>}
                </FieldGroup>
            </MultiFieldRow>
        </FormSectionWrapper>

        {/* Section 6: Shipping & Compliance */}
        <FormSectionWrapper title="Shipping & Compliance">
             <FieldGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2)}}>
                    <input type="checkbox" id="isShippingRequired" name="isShippingRequired" checked={formData.isShippingRequired} onChange={handleChange} disabled={isMutating} style={{ transform: 'scale(1.3)'}}/>
                    <FormLabel htmlFor="isShippingRequired" style={{ textTransform: 'none', marginBottom: '0', cursor: 'pointer' }}>This product requires shipping</FormLabel>
                </div>
            </FieldGroup>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="defaultWeight">Default Weight (<FaBalanceScale />)</FormLabel>
                    <AdminInput type="text" id="defaultWeight" name="defaultWeight" value={formData.defaultWeight} onChange={handleChange} placeholder="e.g., 2.5" disabled={isMutating} pattern="^\d*([.,]\d{0,3})?$" />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="defaultWeightUnit">Weight Unit</FormLabel>
                    <AdminSelect id="defaultWeightUnit" name="defaultWeightUnit" value={formData.defaultWeightUnit} onChange={handleChange}
                        options={[ {value: 'kg', label: 'kg'}, {value: 'g', label: 'g'}, {value: 'lb', label: 'lb'}, {value: 'oz', label: 'oz'} ]}
                        disabled={isMutating}
                    />
                </FieldGroup>
            </MultiFieldRow>
             <FieldGroup>
                <FormLabel>Default Dimensions (<FaRulerCombined />)</FormLabel>
                <MultiFieldRow>
                    <AdminInput type="text" name="defaultDimensions.length" placeholder="Length" value={formData.defaultDimensions.length} onChange={handleChange} pattern="^\d*([.,]\d{0,2})?$" />
                    <AdminInput type="text" name="defaultDimensions.width" placeholder="Width" value={formData.defaultDimensions.width} onChange={handleChange} pattern="^\d*([.,]\d{0,2})?$" />
                    <AdminInput type="text" name="defaultDimensions.height" placeholder="Height" value={formData.defaultDimensions.height} onChange={handleChange} pattern="^\d*([.,]\d{0,2})?$" />
                    <AdminSelect name="defaultDimensions.unit" value={formData.defaultDimensions.unit} onChange={handleChange}
                        options={[{value: 'cm', label: 'cm'}, {value: 'in', label: 'in'}, {value: 'mm', label: 'mm'}]}
                    />
                </MultiFieldRow>
            </FieldGroup>
             <FieldGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2)}}>
                    <input type="checkbox" id="isHazardousMaterial" name="isHazardousMaterial" checked={formData.isHazardousMaterial} onChange={handleChange} disabled={isMutating} style={{ transform: 'scale(1.3)'}}/>
                    <FormLabel htmlFor="isHazardousMaterial" style={{ textTransform: 'none', marginBottom: '0', cursor: 'pointer' }}>Hazardous Material <FaExclamationTriangle style={{color: "orange"}}/></FormLabel>
                </div>
            </FieldGroup>
             <FieldGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2)}}>
                    <input type="checkbox" id="isAgeRestricted" name="isAgeRestricted" checked={formData.isAgeRestricted} onChange={handleChange} disabled={isMutating} style={{ transform: 'scale(1.3)'}}/>
                    <FormLabel htmlFor="isAgeRestricted" style={{ textTransform: 'none', marginBottom: '0', cursor: 'pointer' }}>Age Restricted <FaBan /></FormLabel>
                </div>
                 {formData.isAgeRestricted && (
                    <FieldGroup style={{paddingLeft: theme.spacing(6), marginTop: theme.spacing(1)}}>
                        <FormLabel htmlFor="ageRestrictionMinimum">Minimum Age</FormLabel>
                        <AdminInput type="text" id="ageRestrictionMinimum" name="ageRestrictionMinimum" value={formData.ageRestrictionMinimum || ''} onChange={handleChange} pattern="^\d*$" placeholder="e.g., 18" disabled={isMutating} style={{maxWidth: '100px'}}/>
                    </FieldGroup>
                 )}
            </FieldGroup>
        </FormSectionWrapper>

        {/* SECTION 7: SEO */}
        <FormSectionWrapper title="Search Engine Optimization (SEO)">
             {/* MetaTitle, MetaDescription, MetaKeywords inputs as before */}
        </FormSectionWrapper>

        <FormStickyActionBar>
            <AdminButton type="button" $variant="secondary" onClick={onCancel} disabled={isMutating}>
                <FaBan /> Cancel
            </AdminButton>
            <AdminButton type="submit" $variant="primary" disabled={isMutating}>
                {isMutating ? <LoadingSpinner size="1em" color="#FFF" thickness="2px" inline={true}/> : <FaCheckCircle />}
                {isEditMode ? 'Save Changes' : 'Create Product'}
            </AdminButton>
        </FormStickyActionBar>
      </ActualProductForm>
    </ProductFormContainer>
  );
};

export default ProductForm;