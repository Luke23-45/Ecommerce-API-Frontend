// src/components/Admin/Products/ProductUpdateForm/index.tsx

import React, {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash"; // Import isEqual for accurate comparison

// --- Styles & Layout ---
import {
  ProductFormContainer,
  ActualProductForm,
  FormAlert,
} from "./ProductForm.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import FormSectionWrapper from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper";
import { FormTextarea } from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles";
// --- Sub-components ---
import ProductFormHeader from "./ProductFormHeader";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductImages from "./sections/ProductImages";
import ProductPricing from "./sections/ProductPricing";
import ProductPublishing from "./sections/ProductPublishing";
import ProductShipping from "./sections/ProductShipping";
import ProductSeo from "./sections/ProductSeo";
import ProductFormActions from "./ProductFormActions";
import ProductVariationsManager from "./sections/ProductVariationsManager/ProductVariationEdit";

// --- Hooks, Types, and Utils ---
import {
  productKeys,
  useGetProductById,
  useUpdateProduct,
  useAddProductImages,
  useRemoveProductImage,
  useUpdateVariation,
  useAddVariation,
  useRemoveVariation,
  // NOTE: useAddVariation will be added back in the next phase
  useAddVariationImages,
  useRemoveVariationImage,
} from "@/hooks/admin/product/product/useProduct";
import { useGetPaginatedCategories } from "@/hooks/admin/product/useCategory";
import {
  type IProductFormState,
  type IProductVariationFormState,
} from "@/types/product.types";
import { type ICategoryResponse } from "@/types/category";
import { type SelectOption } from "@/types/common";
import { useNotification } from "@/contexts/NotificationContext";
import type { RootState } from "@/store";
import { mapProductResponseToFormState } from "@/utils/productFormEditUtils";
import { getChangedFields } from "@/utils/objectUtils";

// --- Icons ---
import {
  FaInfoCircle,
  FaImage,
  FaDollarSign,
  FaList,
  FaRocket,
  FaTruck,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";

const ProductUpdateForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { productId } = useParams<{ productId: string }>();
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  // --- State Management ---
  const [formData, setFormData] = useState<IProductFormState | null>(null);
  const [initialFormState, setInitialFormState] =
    useState<IProductFormState | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // --- Data Fetching ---
  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
    isError: isFetchProductError,
    error: fetchProductError,
  } = useGetProductById(productId, { enabled: !!productId });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetPaginatedCategories({ limit: 1000, sort: { name: 1 } });

  // --- Memoized Data ---
  const categoryOptions = useMemo<SelectOption[]>(() => {
    if (!categoriesData?.data) return [];
    const buildHierarchicalOptions = (
      cats: ICategoryResponse[],
      parentId: string | null = null,
      depth = 0
    ): SelectOption[] => {
      return cats
        .filter((c) => (c.parentId || null) === parentId)
        .sort(
          (a, b) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
            a.name.localeCompare(b.name)
        )
        .reduce<SelectOption[]>((acc, category) => {
          acc.push({
            value: category._id,
            label: `${"— ".repeat(depth)}${category.name}`,
          });
          acc.push(...buildHierarchicalOptions(cats, category._id, depth + 1));
          return acc;
        }, []);
    };
    return [
      { value: "", label: "Select a Category*" },
      ...buildHierarchicalOptions(categoriesData.data),
    ];
  }, [categoriesData]);

  // --- Mutation Hooks ---
  const handleMutationError = useCallback(
    (error: any) => {
      console.error("Mutation Error:", error);
      const displayMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setServerError(displayMessage);
      if (error?.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      }
      showNotification(displayMessage, "error");
    },
    [showNotification]
  );

  const updateProductMutation = useUpdateProduct({
    onError: handleMutationError,
  });
  const updateVariationMutation = useUpdateVariation({
    onError: handleMutationError,
  });
  const addProductImagesMutation = useAddProductImages({
    onError: handleMutationError,
  });
  const removeProductImageMutation = useRemoveProductImage({
    onError: handleMutationError,
  });
  const addVariationImageMutation = useAddVariationImages({
    onError: handleMutationError,
  });
  const removeVariationImageMutation = useRemoveVariationImage({
    onError: handleMutationError,
  });
  const addVariationMutation = useAddVariation({
    onError: handleMutationError,
  });
  const removeVariationMutation = useRemoveVariation({
    onError: handleMutationError,
  });
  // --- Effects ---
  useEffect(() => {
    if (existingProduct) {
      const mappedState = mapProductResponseToFormState(existingProduct);
      setFormData(mappedState);
      setInitialFormState(mappedState);
    }
  }, [existingProduct]);

  // --- Callbacks ---
  const handleFieldChange = useCallback(
    (field: keyof IProductFormState, value: any) => {
      // Update the main form data
      setFormData((prev) => (prev ? { ...prev, [field]: value } : null));

      // Use the callback form of the state setter to clear the specific field error.
      // This removes the need for `fieldErrors` to be in the dependency array.
      setFieldErrors((prevErrors) => {
        // If the field we're changing doesn't even have an error, don't create a new object.
        if (!prevErrors[field]) {
          return prevErrors;
        }
        // Otherwise, create a new error object without that field's key.
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });

      // Clear any general server error.
      setServerError(null);
    },
    [] // The dependency array is now correctly empty.
  );

  const handleImagesUpdate = useCallback(
    (newFiles: File[], publicIdsToDelete: string[]) => {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              mainImageFiles: newFiles,
              mainImagesToDeletePublicIds: publicIdsToDelete,
            }
          : null
      );
    },
    []
  );
  const handleVariationsChange = useCallback(
    (updatedVariations: IProductVariationFormState[]) => {
      console.log(updatedVariations);
      setFormData((prev) =>
        prev ? { ...prev, variations: updatedVariations } : null
      );
    },
    []
  );

  // --- ** REWRITTEN AND CORRECTED SUBMISSION ORCHESTRATOR ** ---
  // const handleSubmit = async (e: FormEvent) => {
  //     e.preventDefault();
  //     setServerError(null);
  //     setFieldErrors({});

  //     if (!productId || !initialFormState || !formData) {
  //       setServerError("Form data is not ready. Please wait or refresh the page.");
  //       showNotification("Could not submit: form data is missing.", "error");
  //       return;
  //     }

  //     const allUpdatePromises: Promise<any>[] = [];

  //     // --- Task 1: Main Product Data Update ---
  //     // Compare the top-level fields, excluding variations and images which are handled separately.
  //     const { variations: initialVariations, ...initialRest } = initialFormState;
  //     const { variations: currentVariations, ...currentRest } = formData;
  //     const mainProductChanges = getChangedFields(initialRest, currentRest);

  //     if (Object.keys(mainProductChanges).length > 0) {
  //       // Clean out any lingering file-related keys from the delta object
  //       delete (mainProductChanges as any).mainImageFiles;
  //       delete (mainProductChanges as any).existingMainImageUrls;
  //       delete (mainProductChanges as any).mainImagesToDeletePublicIds;

  //       allUpdatePromises.push(
  //         updateProductMutation.mutateAsync({ productId, updateData: mainProductChanges })
  //       );
  //     }

  //     // --- Task 2: Existing Variation Data & Image Updates ---
  //     // Create a Map for efficient lookup of original variations by their real _id.
  //     const originalVariationsMap = new Map(
  //       initialFormState.variations.filter(v => v._id).map(v => [v._id, v])
  //     );

  //     formData.variations.forEach(currentVar => {
  //       // A) Handle UPDATES for existing variations
  //       if (currentVar._id) {
  //         const originalVar = originalVariationsMap.get(currentVar._id);

  //         // Check for text/data changes
  //         if (originalVar && !isEqual(originalVar, currentVar)) {
  //           const singleVariationDelta = getChangedFields(originalVar, currentVar);
  //           // Clean up client-side-only fields before sending to API
  //           delete (singleVariationDelta as any).tempId;
  //           delete (singleVariationDelta as any).existingImageUrls;
  //           delete (singleVariationDelta as any).imageFiles;
  //           delete (singleVariationDelta as any).imagesToDeletePublicIds;

  //           if (Object.keys(singleVariationDelta).length > 0) {
  //             allUpdatePromises.push(
  //               updateVariationMutation.mutateAsync({
  //                 productId,
  //                 variationId: currentVar._id,
  //                 updateData: singleVariationDelta,
  //               })
  //             );
  //           }
  //         }

  //         // Check for image changes on this existing variation
  //         if (currentVar.imagesToDeletePublicIds.length > 0) {
  //           currentVar.imagesToDeletePublicIds.forEach(imageUrl =>
  //             allUpdatePromises.push(removeVariationImageMutation.mutateAsync({ productId, variationId: currentVar._id!, imageUrl }))
  //           );
  //         }
  //         if (currentVar.imageFiles.length > 0) {
  //           allUpdatePromises.push(
  //             addVariationImageMutation.mutateAsync({ productId, variationId: currentVar._id!, images: currentVar.imageFiles })
  //           );
  //         }
  //       }
  //       // B) Handle CREATION of new variations
  //       else {
  //         // This is a new variation because it has no _id.
  //         // We will add the logic for this in the next phase.
  //         // For now, this correctly does nothing.
  //       }
  //     });

  //     // --- Task 3: Main Product Image Updates ---
  //     if (formData.mainImagesToDeletePublicIds.length > 0) {
  //       formData.mainImagesToDeletePublicIds.forEach(imageUrl =>
  //         allUpdatePromises.push(removeProductImageMutation.mutateAsync({ productId, imageUrl }))
  //       );
  //     }
  //     if (formData.mainImageFiles.length > 0) {
  //       allUpdatePromises.push(
  //         addProductImagesMutation.mutateAsync({ productId, images: formData.mainImageFiles })
  //       );
  //     }

  //     // --- Final Execution ---
  //     if (allUpdatePromises.length === 0) {
  //       showNotification("No changes were detected to save.", "info");
  //       return;
  //     }

  //     try {
  //       await Promise.all(allUpdatePromises);
  //       showNotification(`Product "${formData.name}" updated successfully!`, "success");
  //       // Invalidate the query to force a refetch of the true, updated state from the server.
  //       queryClient.invalidateQueries({ queryKey: productKeys.detailById(productId) });
  //     } catch (error) {
  //       // The individual hook's onError will have already shown a notification.
  //       console.error("One or more updates failed in the sequence.", error);
  //     }
  //   };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    if (!productId || !initialFormState || !formData) {
      setServerError("Form data is not ready.");
      return;
    }

    // --- STEP 1: Calculate ALL possible changes ---
    const allUpdatePromises: Promise<any>[] = [];

    // --- Task 1: Check for main product data changes ---
    const { variations: initialVariations, ...initialRest } = initialFormState;
    const { variations: currentVariations, ...currentRest } = formData;
    const mainProductChanges = getChangedFields(initialRest, currentRest);

    // Clean out image file data from the delta object, as they are handled separately
    delete (mainProductChanges as any).mainImageFiles;
    delete (mainProductChanges as any).existingMainImageUrls;
    delete (mainProductChanges as any).mainImagesToDeletePublicIds;

    if (Object.keys(mainProductChanges).length > 0) {
      allUpdatePromises.push(
        updateProductMutation.mutateAsync({
          productId,
          updateData: mainProductChanges,
        })
      );
    }

    // --- Task 2: Check for existing variation data changes ---
    const originalVariationsMap = new Map(
      initialFormState.variations.map((v) => [v._id, v])
    );
    formData.variations.forEach((currentVar) => {
      if (currentVar._id) {
        // Only check existing variations
        const originalVar = originalVariationsMap.get(currentVar._id);
        if (originalVar && !isEqual(originalVar, currentVar)) {
          const changedData = getChangedFields(originalVar, currentVar);
          // Clean up non-API fields
          delete (changedData as any).tempId;
          delete (changedData as any).existingImageUrls;
          delete (changedData as any).imageFiles;
          delete (changedData as any).imagesToDeletePublicIds;

          if (Object.keys(changedData).length > 0) {
            allUpdatePromises.push(
              updateVariationMutation.mutateAsync({
                productId,
                variationId: currentVar._id,
                updateData: changedData,
              })
            );
          }
        }
      }
    });

    // --- Task 3: Check for image changes ---
    const mainImagesDeleted = formData.mainImagesToDeletePublicIds.length > 0;
    const mainImagesAdded = formData.mainImageFiles.length > 0;
    const variationImagesChanged = formData.variations.some(
      (v) => v.imagesToDeletePublicIds.length > 0 || v.imageFiles.length > 0
    );

    if (mainImagesDeleted) {
      formData.mainImagesToDeletePublicIds.forEach((imageUrl) =>
        allUpdatePromises.push(
          removeProductImageMutation.mutateAsync({ productId, imageUrl })
        )
      );
    }
    if (mainImagesAdded) {
      allUpdatePromises.push(
        addProductImagesMutation.mutateAsync({
          productId,
          images: formData.mainImageFiles,
        })
      );
    }
    if (variationImagesChanged) {
      formData.variations.forEach((v) => {
        if (!v._id) return;
        if (v.imagesToDeletePublicIds.length > 0) {
          v.imagesToDeletePublicIds.forEach((imageUrl) =>
            allUpdatePromises.push(
              removeVariationImageMutation.mutateAsync({
                productId,
                variationId: v._id,
                imageUrl,
              })
            )
          );
        }
        if (v.imageFiles.length > 0) {
          allUpdatePromises.push(
            addVariationImageMutation.mutateAsync({
              productId,
              variationId: v._id,
              images: v.imageFiles,
            })
          );
        }
      });
    }

    const currentVariationIds = new Set(
      formData.variations.map((v) => v._id).filter(Boolean)
    );
    const variationsToDelete = initialFormState.variations.filter(
      (initialVar) => initialVar._id && !currentVariationIds.has(initialVar._id)
    );

    if (variationsToDelete.length > 0) {
      variationsToDelete.forEach((varToDelete) => {
        allUpdatePromises.push(
          removeVariationMutation.mutateAsync({
            productId,
            variationId: varToDelete._id!,
          })
        );
      });
    }

    const newVariationsToCreate = formData.variations.filter((v) => !v._id);

    // --- Final Execution ---
    if (allUpdatePromises.length === 0 && newVariationsToCreate.length === 0) {
      showNotification("No changes were detected to save.", "info");
      return;
    }

    try {
      // Step A: Execute all concurrent updates first
      if (allUpdatePromises.length > 0) {
        await Promise.all(allUpdatePromises);
      }

      // Step B: Execute all sequential creations second
      if (newVariationsToCreate.length > 0) {
        for (const newVar of newVariationsToCreate) {
          // The await here is crucial for sequential execution
          await addVariationMutation.mutateAsync({
            productId,
            variationData: newVar,
          });
        }
      }

      // Step C: Final success and data refetch
      showNotification(`Product updated successfully!`, "success");
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(productId),
      });
    } catch (error) {
      // The individual hook's onError will have already shown a notification.
      console.error("One or more updates failed in the sequence.", error);
    }
  };

  // --- Render Logic ---
  const isMutating =
    updateProductMutation.isPending ||
    updateVariationMutation.isPending ||
    addVariationMutation.isPending ||
    addProductImagesMutation.isPending ||
    removeProductImageMutation.isPending ||
    addVariationImageMutation.isPending ||
    removeVariationImageMutation.isPending;

  const isLoading = isLoadingProduct || isLoadingCategories;

  if (isLoading)
    return <LoadingSpinner message={"Loading product details..."} fullscreen='true' />;
  if (isFetchProductError)
    return (
      <FormAlert $type="error">
        <FaExclamationTriangle /> Error:{" "}
        {(fetchProductError as any)?.message || "Product not found."}
      </FormAlert>
    );
  if (!formData)
    return <LoadingSpinner message={"Preparing form..."} fullscreen />;

  return (
    <ProductFormContainer>
      <ProductFormHeader
        isEditMode={true}
        productName={formData.name}
        isSubmitting={isMutating}
        onBack={() => navigate("/admin/products")}
      />

      <ActualProductForm onSubmit={handleSubmit} noValidate>
        {serverError && (
          <FormAlert $type="error">
            <FaExclamationTriangle /> {serverError}
          </FormAlert>
        )}

        <FormSectionWrapper
          title="Basic Information"
          icon={<FaInfoCircle />}
          isExpanded
        >
          <ProductBasicInfo
            formData={formData}
            onFieldChange={handleFieldChange}
            onTagsChange={(tags) => handleFieldChange("tags", tags)}
            categoryOptions={categoryOptions}
            brandOptions={[]}
            errors={fieldErrors}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper title="Main Product Images" icon={<FaImage />}>
          <ProductImages
            existingImageUrls={formData.existingMainImageUrls}
            newImageFiles={formData.mainImageFiles}
            mainProductImageIndex={formData.mainProductImageIndex}
            onFieldChange={handleFieldChange}
            onUpdate={handleImagesUpdate}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper title="Pricing" icon={<FaDollarSign />}>
          <ProductPricing
            formData={formData}
            onFieldChange={handleFieldChange}
            errors={fieldErrors}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper
          title="Variations & Inventory"
          icon={<FaList />}
          isExpanded
        >
          <ProductVariationsManager
            key={`pvm-${productId}`}
            initialVariations={formData.variations}
            onVariationsChange={handleVariationsChange}
            productCurrency={formData.currency}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper title="Publishing" icon={<FaRocket />}>
          <ProductPublishing
            formData={formData}
            onFieldChange={handleFieldChange}
            sellerOptions={[]}
            errors={fieldErrors}
            disabled={isMutating}
            isAdminMode={
              user?.roles.includes("admin") ||
              user?.roles.includes("superAdmin")
            }
          />
        </FormSectionWrapper>

        <FormSectionWrapper title="Shipping & Compliance" icon={<FaTruck />}>
          <ProductShipping
            formData={formData}
            onFieldChange={handleFieldChange}
            errors={fieldErrors}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <FormSectionWrapper
          title="Search Engine Optimization (SEO)"
          icon={<FaSearch />}
        >
          <ProductSeo
            formData={formData}
            onFieldChange={handleFieldChange}
            onMetaKeywordsChange={(kw) => handleFieldChange("metaKeywords", kw)}
            errors={fieldErrors}
            disabled={isMutating}
          />
        </FormSectionWrapper>

        <ProductFormActions
          isEditMode={true}
          isSubmitting={isMutating}
          onCancel={() => navigate("/admin/products")}
        />
      </ActualProductForm>
    </ProductFormContainer>
  );
};

export default ProductUpdateForm;
