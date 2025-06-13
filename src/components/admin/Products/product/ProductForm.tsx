import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import { useSelector } from "react-redux";
import { Types } from "mongoose"; // For creating new ObjectIds on frontend if needed (e.g. for user._id)
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaDollarSign,
  FaShoppingCart, // Used in label
  FaBalanceScale,
  FaRulerCombined,
  FaTag,
  FaBuilding, // For Vendor
  FaUserTie, // For Individual Seller
  FaInfoCircle, // For Section Titles
  FaImage, // For Image Section
  FaList, // For Variations Section
  // Add any other icons used
} from "react-icons/fa";
import { rgba } from "polished"; // If needed for inline styles directly using theme

import {
  ProductFormContainer,
  ActualProductForm,
  StickyActionBar, // This was ProductDetail.styles, ensure using your renamed styles from ProductForm.styles
  FormHeader,
  FormTitle,
  FormAlert,
  FieldHelperText,
  ImagePreviewWrapper,
  ProductImagePreview,
  // InputWithSuffix, SuffixAdornment // If using these for weight/dimensions
} from "./ProductForm.styles"; // Ensure this path and component names are correct


import AdminSelect from "../../common/AdminSelect/AdminSelect";
import AdminTextArea from "../../common/AdminTextArea/AdminTextArea";
import { AdminInput,AdminButton } from "../../Dashboard/Common/Common.styles";
import FormSectionWrapper from "../../common/FormSectionWrapper/FormSectionWrapper";
import  {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from "../../common/FormSectionWrapper/FormSectionWrapper.styles"; 


import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import ImageUploader from "../../common/ImageUploader/ImageUploader";
import ProductVariationsManager from "./ProductVariationsManager";

// Hooks and Types
import {
  useGetProductById,
  useCreateProduct,
  useUpdateProduct,
  // useDeleteProduct, // If delete button for the whole product is on this form
} from "@/hooks/admin/product/product/useProduct"; // VERIFY PATH
import { useGetPaginatedCategories } from "@/hooks/admin/product/useCategory"; // VERIFY PATH
// TODO: Import hooks for fetching Brands and Sellers/Vendors
// import { useGetActiveBrands } from '@/hooks/admin/useBrand';
// import { useGetActiveSellersOrVendors } from '@/hooks/admin/useSellerVendor';
import { FormStickyActionBar } from "../attributes/AttributeForm.styles";
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
} from "@/types/product.types"; // VERIFY PATH and .types extension
import { type ICategoryResponse } from "@/types/category"; // VERIFY PATH
import { useNotification } from "@/contexts/NotificationContext"; // VERIFY PATH
import { type RootState } from "@/store"; // VERIFY PATH
import { buildProductFormData } from "@/api/admin/product/product/productApi"; // VERIFY PATH

// Initial state for a new product
const initialProductFormState: IProductCreateFormState = {
  name: "",
  description: "",
  shortDescription: "",
  basePrice: "",
  baseSalePrice: "",
  currency: "USD",
  categoryId: "",
  brandId: "",
  tags: [],
  mainImageFiles: [],
  existingMainImageUrls: [],
  mainImagesToDelete: [],
  sellerType: "vendor",
  sellerId: "",
  status: "draft",
  visibility: "hidden",
  variations: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  defaultWeight: "",
  defaultWeightUnit: "kg",
  defaultDimensions: { length: "", width: "", height: "", unit: "cm" },
  isShippingRequired: true,
  isHazardousMaterial: false,
  isAgeRestricted: false,
  ageRestrictionMinimum: "",
  allowReviews: true,
  // inventory and stockStatus at top level are for simple products or aggregates
  inventory: "", // Or 0
  stockStatus: "out_of_stock", // Or 'in_stock' if inventory is > 0 by default
};

interface ProductFormProps {
  // Props passed from AdminPage.tsx for navigation control after save/cancel
  onSaveSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSaveSuccess,
  onCancel,
}) => {
  const navigate = useNavigate(); // For internal navigation if needed, though parent handles main nav
  const { productId } = useParams<{ productId?: string }>();
  const isEditMode = !!productId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<IProductCreateFormState>(
    initialProductFormState
  );
  const [serverError, setServerError] = useState<string | null>(null); // For general API errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // For specific field validation errors

  // Options for Select dropdowns
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<SelectOption[]>([
    { value: "", label: "Select Brand (Loading...)" },
  ]);
  const [sellerOrVendorOptions, setSellerOrVendorOptions] = useState<
    SelectOption[]
  >([{ value: "", label: "Select Seller/Vendor (Loading...)" }]);

  // --- DATA FETCHING ---
  const {
    data: existingProductData, // This is IProductResponse
    isLoading: isLoadingProduct,
    isError: isFetchProductError,
    error: fetchProductErrorData, // Renamed to avoid conflict
  } = useGetProductById(
    productId,
    undefined,
    false, // lean: false. If your populate logic is on virtuals, you need Mongoose docs.
    { enabled: isEditMode && !!productId }
  );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetPaginatedCategories(
      {
        limit: 1000,
        sort: JSON.stringify({ name: 1 }),
        projection: "id name _id level parentId sortOrder",
      },
      { staleTime: 5 * 60 * 1000 }
    );

  // TODO: const { data: brandsData, isLoading: isLoadingBrands } = useGetActiveBrands();
  // TODO: const { data: sellersVendorsData, isLoading: isLoadingSellersVendors } = useGetActiveSellersOrVendors(formData.sellerType);
  // (The sellers/vendors fetch might depend on formData.sellerType)

  // --- MUTATIONS ---
  const createProductMutation = useCreateProduct({
    onSuccess: (response) => {
      showNotification(
        `Product "${response.data.name}" created successfully!`,
        "success"
      );
      onSaveSuccess();
    },
    onError: (error: any) => {
      const message = error.message || "Failed to create product.";
      setServerError(message);
      if (error.data?.errors && typeof error.data.errors === "object")
        setFieldErrors(error.data.errors);
      else if (error.errors && typeof error.errors === "object")
        setFieldErrors(error.errors); // Some APIs might put errors directly
      showNotification(`Error: ${message}`, "error");
    },
  });

  const updateProductMutation = useUpdateProduct({
    onSuccess: (response) => {
      showNotification(
        `Product "${response.data.name}" updated successfully!`,
        "success"
      );
      onSaveSuccess();
    },
    onError: (error: any) => {
      const message = error.message || "Failed to update product.";
      setServerError(message);
      if (error.data?.errors && typeof error.data.errors === "object")
        setFieldErrors(error.data.errors);
      else if (error.errors && typeof error.errors === "object")
        setFieldErrors(error.errors);
      showNotification(`Error: ${message}`, "error");
    },
  });

  // --- EFFECTS ---
  // Populate form with existing product data in edit mode
  useEffect(() => {
    if (isEditMode && existingProductData) {
      console.log(
        "Populating form with existingProductData:",
        existingProductData
      );
      setFormData({
        id: existingProductData.id || (existingProductData as any)._id, // Ensure id is prioritized
        name: existingProductData.name || "",
        description: existingProductData.description || "",
        shortDescription: existingProductData.shortDescription || "",
        basePrice: existingProductData.basePrice?.toString() || "",
        baseSalePrice: existingProductData.baseSalePrice?.toString() || "",
        currency: existingProductData.currency || "USD",
        categoryId: existingProductData.categoryId || "",
        brandId: existingProductData.brandId || "",
        tags: existingProductData.tags || [],
        mainImageFiles: [], // Edit mode starts with no *new* files
        existingMainImageUrls: existingProductData.imageUrls || [],
        mainImagesToDelete: [],
        sellerType: existingProductData.sellerType || "vendor",
        sellerId: existingProductData.sellerId || "",
        status: existingProductData.status || "draft",
        visibility: existingProductData.visibility || "hidden",
        variations: (existingProductData.variations || []).map(
          (v): IProductVariationFormState => {
            const varId = v.id || (v as any)._id;
            if (!varId)
              console.error("Variation missing ID during form population:", v);
            return {
              tempId: varId || generateTemporaryId(), // Use existing variation DB ID as tempId
              _id: varId, // Also store db id if present
              sku: v.sku || "",
              price: v.price?.toString() || "",
              salePrice: v.salePrice?.toString() || "",
              inventory: v.inventory?.toString() || "",
              stockStatus: v.stockStatus || "out_of_stock",
              attributeOptions: (v.attributeOptions || []).map((ao) => ({
                attributeId: ao.attributeId as string,
                attributeName: ao.attributeName,
                optionId: ao.optionId as string,
                optionValue: ao.optionValue,
                optionSwatchValue: ao.optionSwatchValue,
              })),
              imageFiles: [],
              existingImageUrls: v.imageUrls || [],
              imagesToDelete: [],
              weight: v.weight?.toString() || "",
              weightUnit: v.weightUnit || "kg",
              dimensions: {
                length: v.dimensions?.length?.toString() || "",
                width: v.dimensions?.width?.toString() || "",
                height: v.dimensions?.height?.toString() || "",
                unit: v.dimensions?.unit || "cm",
              },
              barcode: v.barcode || "",
              costPrice: v.costPrice?.toString() || "",
              lowStockThreshold: v.lowStockThreshold?.toString() || "",
              isActive: v.isActive === undefined ? true : v.isActive,
            };
          }
        ),
        metaTitle: existingProductData.metaTitle || "",
        metaDescription: existingProductData.metaDescription || "",
        metaKeywords: existingProductData.metaKeywords || [],
        defaultWeight: existingProductData.defaultWeight?.toString() || "",
        defaultWeightUnit: existingProductData.defaultWeightUnit || "kg",
        defaultDimensions: {
          length:
            existingProductData.defaultDimensions?.length?.toString() || "",
          width: existingProductData.defaultDimensions?.width?.toString() || "",
          height:
            existingProductData.defaultDimensions?.height?.toString() || "",
          unit: existingProductData.defaultDimensions?.unit || "cm",
        },
        isShippingRequired:
          existingProductData.isShippingRequired === undefined
            ? true
            : existingProductData.isShippingRequired,
        isHazardousMaterial: existingProductData.isHazardousMaterial || false,
        isAgeRestricted: existingProductData.isAgeRestricted || false,
        ageRestrictionMinimum:
          existingProductData.ageRestrictionMinimum?.toString() || "",
        allowReviews:
          existingProductData.allowReviews === undefined
            ? true
            : existingProductData.allowReviews,
        inventory: existingProductData.inventory?.toString() || "", // Assuming top-level inventory exists on IProductResponse
        stockStatus: existingProductData.stockStatus || "out_of_stock", // Assuming top-level stockStatus
      });
    } else if (!isEditMode) {
      setFormData(initialProductFormState); // Reset for create mode
    }
  }, [isEditMode, existingProductData]);

  // Populate category dropdown options
  useEffect(() => {
    if (categoriesData?.data) {
      const buildHierarchicalOptions = (
        cats: ICategoryResponse[],
        parentId: string | null = null,
        depth = 0
      ): SelectOption[] => {
        return cats
          .filter((c) => c.parentId === parentId)
          .sort(
            (a, b) =>
              (a.sortOrder || 0) - (b.sortOrder || 0) ||
              a.name.localeCompare(b.name)
          )
          .reduce((acc, category) => {
            const id = category.id || ((category as any)._id as string); // Ensure consistent ID
            if (!id) return acc;
            acc.push({
              value: id,
              label: `${"— ".repeat(depth)}${category.name}`,
            });
            const children = buildHierarchicalOptions(cats, id, depth + 1);
            acc.push(...children);
            return acc;
          }, [] as SelectOption[]);
      };
      const options = buildHierarchicalOptions(
        categoriesData.data.map((c) => ({
          ...c,
          id: c.id || ((c as any)._id as string),
        }))
      );
      setCategoryOptions([
        { value: "", label: "Select a Category*" },
        ...options,
      ]);
    }
  }, [categoriesData]);

  // TODO: useEffects to populate brandOptions and sellerOrVendorOptions when their data is fetched.

  // --- INPUT HANDLERS ---
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === "checkbox";
      const checkedValue = isCheckbox
        ? (e.target as HTMLInputElement).checked
        : undefined;
      const finalValue = isCheckbox ? checkedValue : value;

      setFormData((prev) => {
        if (name.startsWith("defaultDimensions.")) {
          const dimProp = name.split(".")[1] as keyof IDimensionsForm;
          const currentDims = prev.defaultDimensions || { unit: "cm" }; // Ensure unit default
          return {
            ...prev,
            defaultDimensions: { ...currentDims, [dimProp]: finalValue },
          };
        }
        return { ...prev, [name]: finalValue };
      });
      if (fieldErrors[name])
        setFieldErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
      setServerError(null);
    },
    [fieldErrors]
  ); // Include fieldErrors to ensure its latest state is used

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const tagsArray = e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, tags: tagsArray }));
    },
    []
  );

  const handleMetaKeywordsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keywordsArray = e.target.value
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, metaKeywords: keywordsArray }));
    },
    []
  );

  const handleMainImagesUpdate = useCallback(
    (
      newFiles: File[],
      currentImageUrlsAfterDelete: string[],
      deletedImagePublicIds: string[]
    ) => {
      setFormData((prev) => ({
        ...prev,
        mainImageFiles: newFiles,
        existingMainImageUrls: currentImageUrlsAfterDelete,
        mainImagesToDelete: deletedImagePublicIds, // Assuming ImageUploader returns public_ids for deletion
      }));
    },
    []
  );

  const handleVariationsChange = useCallback(
    (updatedVariations: IProductVariationFormState[]) => {
      setFormData((prev) => ({ ...prev, variations: updatedVariations }));
      // Update aggregate inventory and stock status if needed
      const totalInventory = updatedVariations.reduce(
        (sum, v) => sum + (parseInt(v.inventory) || 0),
        0
      );
      let newStockStatus: StockStatusFrontend =
        totalInventory > 0 ? "in_stock" : "out_of_stock";
      if (updatedVariations.some((v) => v.stockStatus === "backorder"))
        newStockStatus = "backorder";
      // Add more sophisticated logic for stockStatus if needed
      setFormData((prev) => ({
        ...prev,
        inventory: totalInventory.toString(), // Store aggregate
        stockStatus: newStockStatus,
      }));
    },
    []
  );

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});
    let currentFieldErrorsLocal: Record<string, string> = {}; // Local var for synchronous checks

    if (!formData.name.trim())
      currentFieldErrorsLocal.name = "Product Name is required.";
    if (!formData.categoryId)
      currentFieldErrorsLocal.categoryId = "Category is required.";
    if (!formData.currency)
      currentFieldErrorsLocal.currency = "Currency is required.";
    const basePriceNum = parseInt(formData.basePrice);
    if (basePriceNum === null || basePriceNum < 0)
      currentFieldErrorsLocal.basePrice =
        "Valid Base Price is required (must be 0 or greater).";

    if (formData.variations.length === 0) {
      showNotification(
        "Product must have at least one variation defined.",
        "warning"
      );
      // Or, if simple products are allowed (no variations), adjust this logic
      return;
    }
    // Validate each variation
    formData.variations.forEach((v, index) => {
      if (!v.sku?.trim())
        currentFieldErrorsLocal[`variation_${v.tempId || index}_sku`] =
          `SKU is required for Variation ${index + 1}.`;
      const varPriceNum = parseInt(v.price);
      if (varPriceNum === null || varPriceNum < 0)
        currentFieldErrorsLocal[`variation_${v.tempId || index}_price`] =
          `Valid Price is required for Variation ${index + 1}.`;
      const varInvNum = parseInt(v.inventory);
      if (varInvNum === null || varInvNum < 0)
        currentFieldErrorsLocal[`variation_${v.tempId || index}_inventory`] =
          `Valid Inventory is required for Variation ${index + 1}.`;
    });

    if (Object.keys(currentFieldErrorsLocal).length > 0) {
      setFieldErrors(currentFieldErrorsLocal);
      showNotification("Please correct the form errors.", "warning");
      return;
    }

    if (!user?._id) {
      setServerError("User authentication error. Cannot save product.");
      showNotification(
        "Authentication error. Please ensure you are logged in.",
        "error"
      );
      return;
    }

    // Construct FormData using the helper from productApi.ts
    // buildProductFormData takes IProductCreateFormState and returns FormData
    const productApiFormData = buildProductFormData(formData); // This helper needs to be robust

    if (isEditMode && productId) {
      console.log("Submitting UPDATE with FormData for productId:", productId);
      // If backend expects 'id' or '_id' in FormData for update (usually not, it's in URL)
      // productApiFormData.append('id', productId);
      updateProductMutation.mutate({ productId, formData: productApiFormData });
    } else {
      console.log("Submitting CREATE with FormData");
      createProductMutation.mutate(productApiFormData);
    }
  };

  const isMutating =
    createProductMutation.isPending || updateProductMutation.isPending;
  const isLoadingPage =
    (isEditMode && isLoadingProduct) ||
    isLoadingCategories; /* || isLoadingBrands || isLoadingSellers */

  // --- RENDER LOGIC ---
  if (isLoadingPage && !existingProductData && isEditMode) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <LoadingSpinner
          message={
            isEditMode
              ? "Loading product details..."
              : "Loading form resources..."
          }
        />
      </div>
    );
  }
  if (isFetchProductError && isEditMode) {
    return (
      <ProductFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle style={{ marginRight: theme.spacing(2) }} />{" "}
          Error loading product for editing:{" "}
          {(fetchProductErrorData as any)?.message || "Details not found."}
        </FormAlert>
        <AdminButton $variant="secondary" onClick={onCancel}>
          <FaArrowLeft /> Back to List
        </AdminButton>
      </ProductFormContainer>
    );
  }

  const sellerOptions = ["seller","vendor"]

  return (
    <ProductFormContainer>
      <FormHeader>
        <FormTitle>
          {isEditMode
            ? `Edit Product: ${formData.name || "Loading..."}`
            : "Create New Product"}
        </FormTitle>
        <AdminButton
          $variant="secondary"
          onClick={onCancel}
          disabled={isMutating}
        >
          <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }} /> Back to
          List
        </AdminButton>
      </FormHeader>

      {serverError && (
        <FormAlert $type="error">
          <FaExclamationTriangle style={{ marginRight: theme.spacing(1) }} />{" "}
          {serverError}
        </FormAlert>
      )}

      <ActualProductForm onSubmit={handleSubmit}>
        {/* SECTION 1: Basic Information */}
        <FormSectionWrapper title="Basic Information" icon={<FaInfoCircle />}>
          <FieldGroup>
            <FormLabel htmlFor="name">Product Name*</FormLabel>
            <AdminInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isMutating}
            />
            {fieldErrors.name && (
              <FieldHelperText style={{ color: theme.colors.adminStatusError }}>
                {fieldErrors.name}
              </FieldHelperText>
            )}
          </FieldGroup>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="description">Full Description</FormLabel>
            <AdminTextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Provide a detailed and engaging description..."
              disabled={isMutating}
            />
          </FieldGroup>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="shortDescription">Short Summary</FormLabel>
            <AdminTextArea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              placeholder="A brief summary for product cards and listings..."
              disabled={isMutating}
            />
          </FieldGroup>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="categoryId">Category*</FormLabel>
              <AdminSelect
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categoryOptions}
                required
                disabled={isMutating || isLoadingCategories}
                isLoading={isLoadingCategories}
              />
              {fieldErrors.categoryId && (
                <FieldHelperText
                  style={{ color: theme.colors.adminStatusError }}
                >
                  {fieldErrors.categoryId}
                </FieldHelperText>
              )}
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="brandId">Brand</FormLabel>
              <AdminSelect
                id="brandId"
                name="brandId"
                value={formData.brandId || ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Brand" },
                  ...brandOptions,
                ]}
                disabled={isMutating /* || isLoadingBrands */}
                isLoading={false /* TODO: isLoadingBrands */}
              />
              <FieldHelperText>
                Optional. Create brands in a separate section.
              </FieldHelperText>
            </FieldGroup>
          </MultiFieldRow>
          <FieldGroup>
            <FormLabel htmlFor="tags">
              Tags (<FaTag /> comma-separated)
            </FormLabel>
            <AdminInput
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="e.g., modern, eco-friendly, sale"
              disabled={isMutating}
            />
            <FieldHelperText>
              Helps with product discovery and filtering.
            </FieldHelperText>
          </FieldGroup>
        </FormSectionWrapper>

        {/* SECTION 2: Main Product Images */}
        <FormSectionWrapper title="Main Product Images" icon={<FaImage />}>
          <ImageUploader
            key={`main-images-${formData.id || "newProduct"}`}
            instanceId={`main_product_images_${formData.id || "new"}`}
            initialImageUrls={formData.existingMainImageUrls}
            onImagesUpdate={handleMainImagesUpdate}
            maxFiles={10} // Example: Adjust as needed
            label="Upload or drag main product images (first image uploaded will be primary by default)"
          />
        </FormSectionWrapper>

        {/* SECTION 3: Pricing */}
        <FormSectionWrapper
          title="Base Pricing Details"
          icon={<FaDollarSign />}
        >
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="basePrice">Base Price*</FormLabel>
              <AdminInput
                type="text"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                pattern="^\d*([.,]\d{0,2})?$"
                placeholder="0.00"
                disabled={isMutating}
              />
              {fieldErrors.basePrice && (
                <FieldHelperText
                  style={{ color: theme.colors.adminStatusError }}
                >
                  {fieldErrors.basePrice}
                </FieldHelperText>
              )}
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="baseSalePrice">Base Sale Price</FormLabel>
              <AdminInput
                type="text"
                id="baseSalePrice"
                name="baseSalePrice"
                value={formData.baseSalePrice || ""}
                onChange={handleChange}
                pattern="^\d*([.,]\d{0,2})?$"
                placeholder="0.00 (Optional)"
                disabled={isMutating}
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="currency">Currency*</FormLabel>
              <AdminSelect
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                options={[
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "EUR", label: "EUR - Euro" },
                  { value: "GBP", label: "GBP - Pound Sterling" },
                ]}
                required
                disabled={isMutating}
              />
            </FieldGroup>
          </MultiFieldRow>
          <FieldHelperText>
            This price is a default. Variations can have their own prices if
            defined.
          </FieldHelperText>
        </FormSectionWrapper>

        {/* SECTION 4: Product Variations & Inventory */}
        <FormSectionWrapper
          title="Product Variations, SKU & Inventory"
          icon={<FaList />}
        >
          <ProductVariationsManager
            key={`variations-manager-${formData.id || "newProduct"}`}
            initialVariations={formData.variations}
            onVariationsChange={handleVariationsChange}
            productCurrency={formData.currency}
          />
          <FieldHelperText style={{ marginTop: theme.spacing(3) }}>
            Define attributes (like Color, Size) and their options to generate
            unique product variations. Each variation can have its own SKU,
            price, inventory, and images.
          </FieldHelperText>
        </FormSectionWrapper>

        {/* SECTION 5: Publishing & Seller */}
        <FormSectionWrapper title="Publishing & Seller Details">
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="status">Product Status*</FormLabel>
              <AdminSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isMutating}
                options={[
                  { value: "draft", label: "Draft (Hidden, Work in Progress)" },
                  { value: "pending_review", label: "Pending Review" },
                  { value: "active", label: "Active (Live on Store)" },
                  { value: "archived", label: "Archived (Not Sold Anymore)" },
                ]}
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="visibility">Storefront Visibility*</FormLabel>
              <AdminSelect
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                required
                disabled={isMutating}
                options={[
                  {
                    value: "public",
                    label: "Public (Visible in Search & Categories)",
                  },
                  {
                    value: "hidden",
                    label: "Hidden (Accessible by Direct Link Only)",
                  },
                ]}
              />
            </FieldGroup>
          </MultiFieldRow>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="sellerType">
                Listed By (Seller Type)*
              </FormLabel>
              <AdminSelect
                id="sellerType"
                name="sellerType"
                value={formData.sellerType}
                onChange={handleChange}
                required
                disabled={isMutating}
                options={[
                  { value: "vendor", label: "Vendor/Store Account" },
                  { value: "individual_seller", label: "Individual Seller" },
                ]}
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="sellerId">Seller/Vendor Account*</FormLabel>
              <AdminSelect
                id="sellerId"
                name="sellerId"
                value={formData.sellerId}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Seller/Vendor" },
                  ...sellerOptions,
                ]}
                required
                disabled={isMutating /* || isLoadingSellers */}
                isLoading={false /* TODO */}
              />
              {fieldErrors.sellerId && (
                <FieldHelperText
                  style={{ color: theme.colors.adminStatusError }}
                >
                  {fieldErrors.sellerId}
                </FieldHelperText>
              )}
            </FieldGroup>
          </MultiFieldRow>
        </FormSectionWrapper>

        {/* SECTION 6: Shipping & Compliance */}
        <FormSectionWrapper title="Shipping & Compliance">
          <FieldGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <input
                type="checkbox"
                id="isShippingRequired"
                name="isShippingRequired"
                checked={formData.isShippingRequired}
                onChange={handleChange}
                disabled={isMutating}
                style={{ transform: "scale(1.3)" }}
              />
              <FormLabel
                htmlFor="isShippingRequired"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                }}
              >
                This product requires shipping
              </FormLabel>
            </div>
          </FieldGroup>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="defaultWeight">
                Default Weight (<FaBalanceScale />)
              </FormLabel>
              <AdminInput
                type="text"
                id="defaultWeight"
                name="defaultWeight"
                value={formData.defaultWeight}
                onChange={handleChange}
                placeholder="e.g., 2.5"
                disabled={isMutating}
                pattern="^\d*([.,]\d{0,3})?$"
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="defaultWeightUnit">Weight Unit</FormLabel>
              <AdminSelect
                id="defaultWeightUnit"
                name="defaultWeightUnit"
                value={formData.defaultWeightUnit}
                onChange={handleChange}
                options={[
                  { value: "kg", label: "kg" },
                  { value: "g", label: "g" },
                  { value: "lb", label: "lb" },
                  { value: "oz", label: "oz" },
                ]}
                disabled={isMutating}
                style={{ minWidth: "100px" }}
              />
            </FieldGroup>
          </MultiFieldRow>
          <FieldGroup>
            <FormLabel>
              Default Dimensions (<FaRulerCombined />)
            </FormLabel>
            <MultiFieldRow>
              <AdminInput
                type="text"
                name="defaultDimensions.length"
                placeholder="L"
                value={formData.defaultDimensions.length}
                onChange={handleChange}
                pattern="^\d*([.,]\d{0,2})?$"
              />
              <AdminInput
                type="text"
                name="defaultDimensions.width"
                placeholder="W"
                value={formData.defaultDimensions.width}
                onChange={handleChange}
                pattern="^\d*([.,]\d{0,2})?$"
              />
              <AdminInput
                type="text"
                name="defaultDimensions.height"
                placeholder="H"
                value={formData.defaultDimensions.height}
                onChange={handleChange}
                pattern="^\d*([.,]\d{0,2})?$"
              />
              <AdminSelect
                name="defaultDimensions.unit"
                value={formData.defaultDimensions.unit}
                onChange={handleChange}
                options={[
                  { value: "cm", label: "cm" },
                  { value: "in", label: "in" },
                  { value: "mm", label: "mm" },
                ]}
                style={{ minWidth: "80px" }}
              />
            </MultiFieldRow>
          </FieldGroup>
          <FieldGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <input
                type="checkbox"
                id="isHazardousMaterial"
                name="isHazardousMaterial"
                checked={formData.isHazardousMaterial}
                onChange={handleChange}
                disabled={isMutating}
                style={{ transform: "scale(1.3)" }}
              />
              <FormLabel
                htmlFor="isHazardousMaterial"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                }}
              >
                Hazardous Material{" "}
                <FaExclamationTriangle
                  style={{ color: theme.colors.adminStatusWarning || "orange" }}
                />
              </FormLabel>
            </div>
          </FieldGroup>
          <FieldGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <input
                type="checkbox"
                id="isAgeRestricted"
                name="isAgeRestricted"
                checked={formData.isAgeRestricted}
                onChange={handleChange}
                disabled={isMutating}
                style={{ transform: "scale(1.3)" }}
              />
              <FormLabel
                htmlFor="isAgeRestricted"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                }}
              >
                Age Restricted <FaBan />
              </FormLabel>
            </div>
            {formData.isAgeRestricted && (
              <FieldGroup
                style={{
                  paddingLeft: theme.spacing(6),
                  marginTop: theme.spacing(1),
                }}
              >
                <FormLabel htmlFor="ageRestrictionMinimum">
                  Minimum Age
                </FormLabel>
                <AdminInput
                  type="text"
                  id="ageRestrictionMinimum"
                  name="ageRestrictionMinimum"
                  value={formData.ageRestrictionMinimum || ""}
                  onChange={handleChange}
                  pattern="^\d*$"
                  placeholder="e.g., 18"
                  disabled={isMutating}
                  style={{ maxWidth: "100px" }}
                />
              </FieldGroup>
            )}
          </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper title="Search Engine Optimization (SEO)">
          <FieldGroup>
            <FormLabel htmlFor="metaTitle">Meta Title</FormLabel>
            <AdminInput
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Page title for search engines (max 60-70 chars)"
              disabled={isMutating}
            />
            <FieldHelperText>
              Example: "Buy Premium Nordic Wool Rugs Online | YourStoreName"
            </FieldHelperText>
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="metaDescription">Meta Description</FormLabel>
            <AdminTextArea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Short description for search results (max 155-160 chars)"
              disabled={isMutating}
            />
            <FieldHelperText>
              Example: "Discover high-quality, hand-knitted Nordic wool rugs.
              Sustainable materials, unique designs. Shop now for free
              shipping!"
            </FieldHelperText>
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="metaKeywords">
              Meta Keywords (comma-separated)
            </FormLabel>
            <AdminInput
              type="text"
              id="metaKeywords"
              name="metaKeywords"
              value={formData.metaKeywords.join(", ")}
              onChange={handleMetaKeywordsChange}
              placeholder="e.g., wool rug, nordic design, living room decor"
              disabled={isMutating}
            />
            <FieldHelperText>
              While less impactful now, some systems might use these.
            </FieldHelperText>
          </FieldGroup>
        </FormSectionWrapper>

        <FormStickyActionBar>
          <AdminButton
            type="button"
            $variant="secondary"
            onClick={onCancel}
            disabled={isMutating}
          >
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton type="submit" $variant="primary" disabled={isMutating}>
            {isMutating ? (
              <LoadingSpinner
                size="1.1em"
                color="#FFF"
                thickness="2px"
                inline={true}
                style={{ marginRight: theme.spacing(1.5) }}
              />
            ) : (
              <FaCheckCircle style={{ marginRight: theme.spacing(1.5) }} />
            )}
            {isEditMode ? "Save Changes" : "Create Product"}
          </AdminButton>
        </FormStickyActionBar>
      </ActualProductForm>
    </ProductFormContainer>
  );
};

export default ProductForm;
