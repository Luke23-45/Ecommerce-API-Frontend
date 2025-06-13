// src/components/Admin/Products/ProductVariations/ProductVariationsManager.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  FaPlus,
  FaTrashAlt,
  FaCamera,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog,
  FaTags,
  FaInfoCircle,
  FaListUl
} from "react-icons/fa";
import { useTheme, type DefaultTheme } from "styled-components";
import { produce } from "immer";

import {
  ManagerContainer,
  AttributeSelectionArea,
  SectionTitle,
  AttributePickerGroup,
  AttributeRow,
  AttributeNameLabel,
  ValuesInputContainer,
  SelectedValuesTags,
  ValueTag, // You might not use this exact one if using a multi-select component
  VariationActionsBar,
  VariationsListWrapper,
  VariationsTable,
  VariationAttributeCell,
  VariationImageColumn,
  DeleteVariationButton,
  NoVariationsMessage,
} from "./ProductVariationsManager.styles";
import { AdminTableWrapper } from "../ProductList.styles";
import { AdminInput, AdminButton } from "../../Dashboard/Common/Common.styles";
import AdminSelect, {
  type SelectOption,
} from "../../common/AdminSelect/AdminSelect";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import {
  useGetPaginatedAttributes,
  // useGetOptionsForAttribute, // We'll call the API function directly for caching
  attributeKeys,
} from "@/hooks/admin/product/useAttribute";
import { getOptionsForAttribute as fetchOptionsForAttributeApi } from "@/api/admin/product/attribute/attributeApi"; // Import raw API function

import type {
  IProductVariationFormState,
  IProductAttributeOptionForm,
  StockStatusFrontend,
  IDimensionsForm,
  WeightUnitFrontend,
} from "@/types/product.types";
import type {
  IAttributeResponse,
  IAttributeOptionResponse,
} from "@/types/attribute";
import { useNotification } from "@/contexts/NotificationContext";
import { useQueryClient } from "@tanstack/react-query";
import { FieldHelperText } from "./ProductForm.styles";
const generateTemporaryId = (): string =>
  `temp-var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
const parseNumericString = (
  value: string | number | undefined | null,
  defaultValue: number | null = null
): number | null => {
  if (value === undefined || value === null || value === "")
    return defaultValue;
  const num = Number(String(value).replace(",", ".")); // Handle comma as decimal separator
  return isNaN(num) ? defaultValue : num;
};

interface ProductVariationsManagerProps {
  initialVariations?: IProductVariationFormState[];
  onVariationsChange: (updatedVariations: IProductVariationFormState[]) => void;
  productCurrency: string;
}

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
  initialVariations = [],
  onVariationsChange,
  productCurrency,
}) => {
  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [definingAttributes, setDefiningAttributes] = useState<
    IAttributeResponse[]
  >([]);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<
    Record<string, string[]>
  >({}); // { attrId: [optId1, optId2] }
  const [managedVariations, setManagedVariations] = useState<
    IProductVariationFormState[]
  >([]);
  const [fetchedOptionsCache, setFetchedOptionsCache] = useState<
    Record<string, IAttributeOptionResponse[]>
  >({});
  const [isFetchingSomeOptions, setIsFetchingSomeOptions] = useState(false);

  const variationImageFileInputs = useRef<
    Record<string, HTMLInputElement | null>
  >({});
  const isInitialMount = useRef(true); // To prevent onVariationsChange on first prop sync

  const { data: allAttributesResponse, isLoading: isLoadingAllAttributes } =
    useGetPaginatedAttributes(
      { limit: 200, projection: "id name displayName displayType" }, // Fetch relevant fields
      { staleTime: 10 * 60 * 1000 } // Attributes don't change super often
    );
  const allAvailableAttributes = useMemo(
    () => allAttributesResponse?.data || [],
    [allAttributesResponse]
  );

  // Effect 1: Initialize/Reset internal state when initialVariations prop changes
  useEffect(() => {
    console.log(
      "PVM: Initializing from initialVariations prop",
      initialVariations
    );
    const variationsToProcess = Array.isArray(initialVariations)
      ? initialVariations
      : [];

    const newManaged = variationsToProcess.map((v) => ({
      ...v,
      tempId: v.tempId || v.id || (v as any)._id || generateTemporaryId(), // Ensure tempId for UI keying
      attributeOptions: Array.isArray(v.attributeOptions)
        ? v.attributeOptions
        : [],
      imageFiles: Array.isArray(v.imageFiles) ? v.imageFiles : [],
      existingImageUrls: Array.isArray(v.existingImageUrls)
        ? v.existingImageUrls
        : [],
      imagesToDelete: Array.isArray(v.imagesToDelete) ? v.imagesToDelete : [],
      isActive: v.isActive === undefined ? true : v.isActive, // Default isActive to true
    }));
    setManagedVariations(newManaged);

    // Pre-populate definingAttributes and selectedOptionsMap from initial variations
    const newDefiningAttributesFromVars: IAttributeResponse[] = [];
    const newSelectedOptionsFromVars: Record<string, string[]> = {};
    const attributeIdToDetailsMap = new Map<string, IAttributeResponse>();

    variationsToProcess.forEach((variation) => {
      (variation.attributeOptions || []).forEach((attrOpt) => {
        if (!attrOpt || !attrOpt.attributeId || !attrOpt.optionId) return;

        if (!attributeIdToDetailsMap.has(attrOpt.attributeId)) {
          const foundAttr = allAvailableAttributes.find(
            (a) =>
              a.id === attrOpt.attributeId ||
              (a as any)._id === attrOpt.attributeId
          );
          if (foundAttr) {
            attributeIdToDetailsMap.set(attrOpt.attributeId, foundAttr);
          } else if (attrOpt.attributeName) {
            // Fallback using denormalized names if full attribute not loaded yet
            attributeIdToDetailsMap.set(attrOpt.attributeId, {
              id: attrOpt.attributeId,
              name: attrOpt.attributeName,
              displayName: attrOpt.attributeName,
              displayType: "dropdown", // Unknown, so default
              slug: '', // Approximate slug
              createdAt: new Date().toISOString(), // Placeholder
              updatedAt: new Date().toISOString(), // Placeholder
            });
          }
        }

        if (!newSelectedOptionsFromVars[attrOpt.attributeId]) {
          newSelectedOptionsFromVars[attrOpt.attributeId] = [];
        }
        if (
          !newSelectedOptionsFromVars[attrOpt.attributeId].includes(
            attrOpt.optionId
          )
        ) {
          newSelectedOptionsFromVars[attrOpt.attributeId].push(
            attrOpt.optionId
          );
        }
      });
    });

    attributeIdToDetailsMap.forEach((attrDetails) => {
      if (
        !newDefiningAttributesFromVars.some((da) => da.id === attrDetails.id)
      ) {
        newDefiningAttributesFromVars.push(attrDetails);
      }
    });

    setDefiningAttributes(newDefiningAttributesFromVars);
    setSelectedOptionsMap(newSelectedOptionsFromVars);
    isInitialMount.current = true; // Reset flag for prop change
  }, [initialVariations, allAvailableAttributes]); // Rerun if underlying full attribute list changes

  // Effect 2: Fetch options for newly added defining attributes
  useEffect(() => {
    let didFetch = false;
    definingAttributes.forEach((attr) => {
      if (attr.id && !fetchedOptionsCache[attr.id]) {
        setIsFetchingSomeOptions(true);
        didFetch = true;
        console.log(
          `PVM: Fetching options for attribute ${attr.name} (ID: ${attr.id})`
        );
        fetchOptionsForAttributeApi(attr.id, { lean: true }) // Call the API function directly
          .then((response) => {
            if (response.success && response.data) {
              setFetchedOptionsCache((prev) => ({
                ...prev,
                [attr.id]: response.data,
              }));
              console.log(
                `PVM: Successfully fetched options for ${attr.name}`,
                response.data
              );
            } else {
              console.error(
                `PVM: Failed to fetch options for ${attr.name}:`,
                response.message
              );
              showNotification(
                `Could not load options for ${attr.name}: ${response.message}`,
                "error"
              );
            }
          })
          .catch((err) => {
            console.error(
              `PVM: API error fetching options for ${attr.name}`,
              err
            );
            showNotification(
              `API error fetching options for ${attr.name}`,
              "error"
            );
          })
          .finally(() => {
            // This finally might be too soon if multiple fetches are happening
            // A more robust way would be Promise.all or count pending fetches
          });
      }
    });
    if (didFetch) {
      // A better way to handle aggregate loading state
      Promise.allSettled(
        definingAttributes
          .filter((attr) => attr.id && !fetchedOptionsCache[attr.id])
          .map((attr) => fetchOptionsForAttributeApi(attr.id, { lean: true }))
      ).finally(() => {
        setIsFetchingSomeOptions(false);
      });
    }
  }, [definingAttributes, fetchedOptionsCache, showNotification]); // Dependencies

  // Effect 3: Propagate changes in managedVariations up to parent (ProductForm)
  // This ensures parent has the latest list from PVM's internal actions
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // After first render (initial prop sync), subsequent changes are from user actions
      return;
    }
    console.log(
      "PVM: Internal managedVariations updated, calling onVariationsChange.",
      managedVariations
    );
    onVariationsChange(managedVariations);
  }, [managedVariations, onVariationsChange]);

  const handleDefiningAttributeToggle = useCallback(
    (attribute: IAttributeResponse) => {
      setDefiningAttributes((prev) => {
        const isSelected = prev.some((da) => da.id === attribute.id);
        if (isSelected) {
          setSelectedOptionsMap((currentMap) => {
            const newMap = { ...currentMap };
            delete newMap[attribute.id];
            return newMap;
          });
          return prev.filter((da) => da.id !== attribute.id);
        } else {
          return [...prev, attribute].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
      });
    },
    []
  );

  const handleOptionToggleForAttribute = useCallback(
    (attributeId: string, optionIds: string[]) => {
      setSelectedOptionsMap((prev) => ({
        ...prev,
        [attributeId]: optionIds,
      }));
    },
    []
  );

  const generateCartesianProduct = useCallback(
    (
      arraysOfSelectedOptionObjects: IAttributeOptionForm[][]
    ): IProductAttributeOptionForm[][] => {
      if (
        !arraysOfSelectedOptionObjects ||
        arraysOfSelectedOptionObjects.length === 0
      )
        return [[]];

      return arraysOfSelectedOptionObjects.reduce<
        IProductAttributeOptionForm[][]
      >((accCombos, currentAttributeOptions) => {
        if (accCombos.length === 0) {
          // First attribute
          return currentAttributeOptions.map((opt) => [opt]);
        }
        return accCombos.flatMap((existingCombo) =>
          currentAttributeOptions.map((currentOption) => [
            ...existingCombo,
            currentOption,
          ])
        );
      }, []);
    },
    []
  );

  const handleGenerateVariations = useCallback(() => {
    if (definingAttributes.length === 0) {
      showNotification(
        "Please select at least one attribute to define variations.",
        "warning"
      );
      return;
    }

    const arraysOfSelectedOptionForms: IProductAttributeOptionForm[][] =
      definingAttributes
        .map((attr) => {
          const selectedOptionIdsForThisAttr =
            selectedOptionsMap[attr.id] || [];
          if (selectedOptionIdsForThisAttr.length === 0) {
            // If an attribute is selected for defining variations but no options are chosen for it,
            // we cannot generate.
            throw new Error(
              `No options selected for attribute: ${attr.displayName || attr.name}`
            );
          }
          const attributeFullOptions = fetchedOptionsCache[attr.id] || [];
          return selectedOptionIdsForThisAttr.map((optId) => {
            const optionDetail = attributeFullOptions.find(
              (opt) => opt.id === optId
            );
            if (!optionDetail)
              throw new Error(
                `Option detail not found for ID ${optId} in attribute ${attr.name}`
              ); // Should not happen
            return {
              attributeId: attr.id,
              attributeName: attr.name, // Use non-display name for internal consistency
              optionId: optionDetail.id,
              optionValue: optionDetail.value,
              optionSwatchValue: optionDetail.swatchValue,
            };
          });
        })
        .filter((arr) => arr.length > 0); // Ensure we only process attributes with actual selected options

    if (arraysOfSelectedOptionForms.length !== definingAttributes.length) {
      showNotification(
        "Please select options for all chosen defining attributes.",
        "warning"
      );
      return;
    }

    const newCombinationsAttributes = generateCartesianProduct(
      arraysOfSelectedOptionForms
    );
    console.log(
      "PVM: Generated attribute combinations:",
      newCombinationsAttributes
    );

    const newGeneratedVariations: IProductVariationFormState[] =
      newCombinationsAttributes.map((comboAttrs) => {
        const existingVariation = managedVariations.find(
          (v) =>
            v.attributeOptions.length === comboAttrs.length &&
            v.attributeOptions.every((existingOpt) =>
              comboAttrs.some(
                (newOpt) =>
                  newOpt.attributeId === existingOpt.attributeId &&
                  newOpt.optionId === existingOpt.optionId
              )
            ) &&
            comboAttrs.every((newOpt) =>
              v.attributeOptions.some(
                (existingOpt) =>
                  newOpt.attributeId === existingOpt.attributeId &&
                  newOpt.optionId === existingOpt.optionId
              )
            )
        );

        if (existingVariation) {
          return existingVariation;
        } else {
          return {
            tempId: generateTemporaryId(),
            sku: "",
            price: "",
            inventory: "",
            stockStatus: "in_stock",
            attributeOptions: comboAttrs,
            imageFiles: [],
            existingImageUrls: [],
            imagesToDelete: [],
            isActive: true,
          };
        }
      });

    // Filter out old managed variations that no longer match any generated combination
    const finalVariations = newGeneratedVariations.filter((generatedVar) => {
      // Also need to include manually added variations that might not match defining attributes perfectly.
      // For now, if a variation doesn't match a new combo, it's removed.
      // This means generating effectively REPLACES non-matching variations.
      // Or, merge: keep all existing, add new. User then deletes unwanted. Let's go with "replace if combo matches, add if new, remove if combo no longer valid"
      return newCombinationsAttributes.some(
        (comboAttrs) =>
          generatedVar.attributeOptions.length === comboAttrs.length &&
          generatedVar.attributeOptions.every((existingOpt) =>
            comboAttrs.some(
              (newOpt) =>
                newOpt.attributeId === existingOpt.attributeId &&
                newOpt.optionId === existingOpt.optionId
            )
          )
      );
    });
    // If we want to add newly generated ones to existing managed ones without removing non-matching ones:
    // const currentVariationSignatures = new Set(managedVariations.map(v => v.attributeOptions.map(ao => `${ao.attributeId}-${ao.optionId}`).sort().join('|')));
    // newGeneratedVariations.forEach(genVar => {
    //   const genVarSignature = genVar.attributeOptions.map(ao => `${ao.attributeId}-${ao.optionId}`).sort().join('|');
    //   if (!currentVariationSignatures.has(genVarSignature)) {
    //     finalVariations.push(genVar);
    //   }
    // });

    setManagedVariations(finalVariations);
    // onVariationsChange will be called by the useEffect watching managedVariations
    showNotification(
      `${finalVariations.length} variations configured. Review details.`,
      "info"
    );
  }, [
    definingAttributes,
    selectedOptionsMap,
    fetchedOptionsCache,
    managedVariations,
    generateCartesianProduct,
    showNotification,
  ]);

  const handleAddManualVariation = useCallback(() => {
    const newVariation: IProductVariationFormState = {
      tempId: generateTemporaryId(),
      attributeOptions: [], // User will define these if they are adding manually outside defined attributes
      sku: "",
      price: "",
      inventory: "",
      stockStatus: "in_stock",
      imageFiles: [],
      existingImageUrls: [],
      imagesToDelete: [],
      isActive: true,
    };
    setManagedVariations((prev) => [...prev, newVariation]);
  }, []);

  const handleVariationFieldChange = useCallback(
    (tempId: string, fieldName: string, value: any) => {
      setManagedVariations((prev) =>
        produce(prev, (draft) => {
          const variation = draft.find((v) => v.tempId === tempId);
          if (variation) {
            if (fieldName.startsWith("dimensions.")) {
              const dimKey = fieldName.split(".")[1] as keyof IDimensionsForm;
              variation.dimensions = variation.dimensions || { unit: "cm" }; // Ensure dimensions exists
              (variation.dimensions as any)[dimKey] = value;
            } else {
              (variation as any)[fieldName] = value;
            }
            if (fieldName === "inventory") {
              const inv = parseNumericString(value);
              if (
                inv !== null &&
                inv <= 0 &&
                variation.stockStatus !== "backorder" &&
                variation.stockStatus !== "pre_order"
              ) {
                variation.stockStatus = "out_of_stock";
              } else if (
                inv !== null &&
                inv > 0 &&
                variation.stockStatus === "out_of_stock"
              ) {
                variation.stockStatus = "in_stock";
              }
            }
          }
        })
      );
    },
    []
  );

  const handleVariationImageFilesChange = useCallback(
    (tempId: string, files: File[]) => {
      setManagedVariations((prev) =>
        produce(prev, (draft) => {
          const variation = draft.find((v) => v.tempId === tempId);
          if (variation) {
            variation.imageFiles = files; // Replace current new files
            // If you want to append: variation.imageFiles = [...(variation.imageFiles || []), ...files];
          }
        })
      );
    },
    []
  );

  const handleVariationExistingImageDelete = useCallback(
    (tempId: string, urlToDelete: string) => {
      setManagedVariations((prev) =>
        produce(prev, (draft) => {
          const variation = draft.find((v) => v.tempId === tempId);
          if (variation) {
            variation.existingImageUrls = (
              variation.existingImageUrls || []
            ).filter((url) => url !== urlToDelete);
            variation.imagesToDelete = [
              ...(variation.imagesToDelete || []),
              urlToDelete,
            ];
          }
        })
      );
    },
    []
  );

  const handleDeleteVariation = useCallback((tempId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this variation specification?"
      )
    ) {
      setManagedVariations((prev) => prev.filter((v) => v.tempId !== tempId));
    }
  }, []);

  // --- UI for selecting defining attributes ---
  const renderAttributeSelectors = () => {
    if (isLoadingAllAttributes && allAvailableAttributes.length === 0) {
      return <LoadingSpinner message="Loading available attributes..." />;
    }
    if (allAvailableAttributes.length === 0) {
      return (
        <p>
          No attributes found. Please create attributes first in the Attributes
          section.
        </p>
      );
    }

    return (
      <AttributePickerGroup>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing(2),
          }}
        >
          <p
            style={{
              margin: 0,
              color: theme.colors.adminTextSecondary,
              fontSize: "0.9em",
            }}
          >
            Select attributes that define product variations (e.g., Color,
            Size):
          </p>
          <AdminSelect
            options={allAvailableAttributes
              .filter(
                (availAttr) =>
                  !definingAttributes.some(
                    (defAttr) => defAttr.id === availAttr.id
                  )
              )
              .map((attr) => ({
                value: attr.id,
                label: attr.displayName || attr.name,
              }))}
            onChange={(e) => {
              const selectedAttr = allAvailableAttributes.find(
                (a) => a.id === e.target.value
              );
              if (selectedAttr) handleDefiningAttributeToggle(selectedAttr);
            }}
            value="" // Reset after selection
            placeholder="Add Attribute for Variations..."
            disabled={isLoadingAllAttributes}
            style={{ minWidth: "250px" }}
          />
        </div>

        {definingAttributes.length === 0 && (
          <p
            style={{
              fontSize: "0.85em",
              color: theme.colors.adminTextMuted,
              textAlign: "center",
            }}
          >
            No attributes selected for variations yet.
          </p>
        )}

        {definingAttributes.map((attr) => {
          const optionsForThisAttribute = fetchedOptionsCache[attr.id] || [];
          const currentSelectedOptionIds = selectedOptionsMap[attr.id] || [];
          return (
            <AttributeRow key={attr.id}>
              <AttributeNameLabel title={attr.name}>
                {attr.displayName || attr.name}
              </AttributeNameLabel>
              <ValuesInputContainer>
                {/* Using AdminSelect as a multi-select for options */}
                <AdminSelect
                  isMulti // CRITICAL: Your AdminSelect component must support this prop and behavior
                  placeholder={`Select options for ${attr.displayName || attr.name}...`}
                  options={optionsForThisAttribute.map((opt) => ({
                    value: opt.id,
                    label: opt.value,
                  }))}
                  value={currentSelectedOptionIds.map((optId) => {
                    // Map IDs back to SelectOption objects
                    const optDetail = optionsForThisAttribute.find(
                      (o) => o.id === optId
                    );
                    return { value: optId, label: optDetail?.value || optId };
                  })}
                  onChange={(selectedReactSelectOptions: any) => {
                    // Type 'any' if AdminSelect uses react-select directly
                    const newOptionIds = Array.isArray(
                      selectedReactSelectOptions
                    )
                      ? selectedReactSelectOptions.map((opt: any) => opt.value)
                      : []; // Assuming selectedReactSelectOptions is {value, label}[]
                    handleOptionToggleForAttribute(attr.id, newOptionIds);
                  }}
                  isLoading={
                    isFetchingSomeOptions && !fetchedOptionsCache[attr.id]
                  } // Show loading while options for this attribute are being fetched
                  // You might need a custom component if AdminSelect is not a full-featured multi-select tag input
                />
                <FieldHelperText>
                  Select one or more values for this attribute.
                </FieldHelperText>
              </ValuesInputContainer>
              <AdminButton
                type="button"
                $variant="dangerGhost"
                onClick={() => handleDefiningAttributeToggle(attr)}
                style={{ padding: theme.spacing(1.5) }}
              >
                <FaTimes />
              </AdminButton>
            </AttributeRow>
          );
        })}
      </AttributePickerGroup>
    );
  };

  return (
    <ManagerContainer>
      <AttributeSelectionArea>
        <SectionTitle>
          <FaTags style={{ marginRight: theme.spacing(2) }} />
          1. Define Variation Attributes & Options
        </SectionTitle>
        {renderAttributeSelectors()}
      </AttributeSelectionArea>

      <VariationActionsBar>
        <AdminButton
          type="button"
          $variant="primary"
          onClick={handleGenerateVariations}
          disabled={
            definingAttributes.length === 0 ||
            !Object.values(selectedOptionsMap).some(
              (opts) => opts.length > 0
            ) ||
            isLoadingAllAttributes ||
            isFetchingSomeOptions
          }
        >
          <FaCog style={{ marginRight: theme.spacing(1.5) }} />
          Generate / Update Variations List
        </AdminButton>
        <AdminButton
          type="button"
          $variant="secondaryOutline"
          onClick={handleAddManualVariation}
        >
          <FaPlus style={{ marginRight: theme.spacing(1.5) }} /> Add Custom
          Variation Row
        </AdminButton>
      </VariationActionsBar>

      <VariationsListWrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SectionTitle>
            <FaListUl style={{ marginRight: theme.spacing(2) }} />
            2. Manage Generated Variations ({managedVariations.length})
          </SectionTitle>
          {managedVariations.length > 0 && (
            <FieldHelperText>
              SKU, Price, and Inventory are required for each variation.
            </FieldHelperText>
          )}
        </div>

        {managedVariations.length === 0 ? (
          <NoVariationsMessage>
            {definingAttributes.length > 0 &&
            Object.values(selectedOptionsMap || {}).some(
              (opts = []) => opts.length > 0
            )
              ? 'Click "Generate / Update Variations List" above to create variants based on your selections.'
              : "First, select attributes and their options above to define possible variations."}
          </NoVariationsMessage>
        ) : (
          <AdminTableWrapper style={{ maxHeight: "600px", overflowY: "auto" }}>
            <VariationsTable>
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Image</th>
                  <th>Attributes</th>
                  <th style={{ minWidth: "150px" }}>SKU*</th>
                  <th style={{ minWidth: "100px" }}>
                    Price* ({productCurrency})
                  </th>
                  <th style={{ minWidth: "100px" }}>Sale Price</th>
                  <th style={{ minWidth: "90px" }}>Inventory*</th>
                  <th style={{ minWidth: "150px" }}>Stock Status*</th>
                  <th style={{ width: "70px" }}>Active</th>
                  <th style={{ width: "60px" }}>Del</th>
                </tr>
              </thead>
              <tbody>
                {managedVariations.map((variation) => (
                  <tr key={variation.tempId}>
                    <td>
                      <VariationImageColumn>
                        <img
                          className="variation-preview-image"
                          src={
                            (variation.imageFiles &&
                              variation.imageFiles.length > 0 &&
                              URL.createObjectURL(variation.imageFiles[0])) ||
                            (variation.existingImageUrls &&
                              variation.existingImageUrls[0]) ||
                            "https://via.placeholder.com/48x48?text=NoImg"
                          }
                          alt="Variation"
                          onClick={() =>
                            variationImageFileInputs.current[
                              variation.tempId
                            ]?.click()
                          }
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files)
                              handleVariationImageFilesChange(
                                variation.tempId,
                                Array.from(e.target.files).slice(0, 1)
                              ); // Handle one file for now
                            e.target.value = "";
                          }}
                          style={{ display: "none" }}
                          id={`var-img-upload-${variation.tempId}`}
                          ref={(el) => {
                            variationImageFileInputs.current[variation.tempId] =
                              el;
                          }}
                        />
                        <label
                          htmlFor={`var-img-upload-${variation.tempId}`}
                          className="image-upload-trigger"
                          title="Upload image"
                        >
                          <FaCamera />
                        </label>
                        {((variation.existingImageUrls &&
                          variation.existingImageUrls[0]) ||
                          (variation.imageFiles &&
                            variation.imageFiles[0])) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                variation.existingImageUrls &&
                                variation.existingImageUrls[0]
                              ) {
                                handleVariationExistingImageDelete(
                                  variation.tempId,
                                  variation.existingImageUrls[0]
                                );
                              } else if (
                                variation.imageFiles &&
                                variation.imageFiles[0]
                              ) {
                                handleVariationImageFilesChange(
                                  variation.tempId,
                                  []
                                ); // Clear new files
                              }
                            }}
                            title="Remove image"
                            style={{
                              color: theme.colors.adminStatusError,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: theme.spacing(0.5),
                              marginLeft: theme.spacing(1),
                            }}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </VariationImageColumn>
                    </td>
                    <td>
                      <VariationAttributeCell>
                        {(variation.attributeOptions || []).map((attrOpt) => (
                          <span
                            key={`${attrOpt.attributeId}-${attrOpt.optionId}`}
                          >
                            <strong>{attrOpt.attributeName}:</strong>{" "}
                            {attrOpt.optionValue}
                          </span>
                        ))}
                      </VariationAttributeCell>
                    </td>
                    <td>
                      <AdminInput
                        type="text"
                        value={variation.sku || ""}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "sku",
                            e.target.value
                          )
                        }
                        placeholder="Variant SKU"
                      />
                    </td>
                    <td>
                      <AdminInput
                        type="text"
                        value={variation.price || ""}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "price",
                            e.target.value
                          )
                        }
                        required
                        pattern="^\d*([.,]\d{0,2})?$"
                      />
                    </td>
                    <td>
                      <AdminInput
                        type="text"
                        value={variation.salePrice || ""}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "salePrice",
                            e.target.value
                          )
                        }
                        pattern="^\d*([.,]\d{0,2})?$"
                      />
                    </td>
                    <td>
                      <AdminInput
                        type="text"
                        value={variation.inventory || ""}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "inventory",
                            e.target.value
                          )
                        }
                        required
                        pattern="^\d*$"
                      />
                    </td>
                    <td>
                      <AdminSelect
                        value={variation.stockStatus}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "stockStatus",
                            e.target.value as StockStatusFrontend
                          )
                        }
                        options={[
                          { value: "in_stock", label: "In Stock" },
                          { value: "out_of_stock", label: "Out of Stock" },
                          { value: "backorder", label: "Backorder" },
                          { value: "pre_order", label: "Pre-order" },
                        ]}
                        style={{ minWidth: "130px" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={variation.isActive}
                        onChange={(e) =>
                          handleVariationFieldChange(
                            variation.tempId,
                            "isActive",
                            e.target.checked
                          )
                        }
                        style={{ transform: "scale(1.3)" }}
                        title={
                          variation.isActive
                            ? "Deactivate this variation"
                            : "Activate this variation"
                        }
                      />
                    </td>
                    <td>
                      <DeleteVariationButton
                        type="button"
                        onClick={() => handleDeleteVariation(variation.tempId)}
                        title="Delete this variation"
                      >
                        <FaTrashAlt />
                      </DeleteVariationButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </VariationsTable>
          </AdminTableWrapper>
        )}
      </VariationsListWrapper>
    </ManagerContainer>
  );
};

export default ProductVariationsManager;
