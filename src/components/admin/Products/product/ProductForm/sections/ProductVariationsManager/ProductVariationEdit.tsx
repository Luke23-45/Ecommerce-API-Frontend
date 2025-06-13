// src/components/Admin/Products/ProductForm/sections/ProductVariationsManager/tsx

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  FaCog,
  FaPlus,
  FaTags,
  FaListUl,
  FaTrashAlt,
  FaChevronDown,
} from "react-icons/fa";
import { produce } from "immer";

// --- Imports for styles, components, hooks, and types ---
import {
  ManagerContainer,
  AttributeSelectionArea,
  SectionTitle,
  AttributePickerGroup,
  AttributeRow,
  AttributeNameLabel,
  ValuesInputContainer,
  VariationActionsBar,
  VariationsListWrapper,
  VariationsTable,
  VariationAttributeCell,
  VariationImageColumn,
  ActionCell,
  DeleteVariationButton,
  NoVariationsMessage,
  VariationDetailRow,
  DetailCell,
  DetailsGrid,
  ExpandButton,
} from "./ProductVariationsManager.styles";
import {
  AdminButton,
  AdminInput,
} from "@/components/admin/Dashboard/Common/Common.styles";
import AdminCheckbox from "@/components/admin/common/AdminCheckbox/AdminCheckbox";
import AdminSelect from "@/components/admin/common/AdminSelect/AdminSelect";
import {
  FormLabel,
  FieldGroup,
  MultiFieldRow,
} from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles";
import ImageUploader from "@/components/admin/common/ImageUploader/ImageUploader";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { FieldHelperText } from "../common.styles";
import { useGetPaginatedAttributes } from "@/hooks/admin/product/useAttribute";
import { getOptionsForAttribute as fetchOptionsForAttributeApi } from "@/api/admin/product/attribute/attributeApi";
import type {
  IProductVariationFormState,
  IProductAttributeOptionForm,
  StockStatus,
  DimensionUnit,
  WeightUnit,
} from "@/types/product.types";
import type {
  IAttributeResponse,
  IAttributeOptionResponse,
} from "@/types/attribute";
import { type SelectOption } from "@/types/common";
import { useNotification } from "@/contexts/NotificationContext";
import { generateTemporaryId } from "@/utils/productFormUtils";

// --- ** UPDATED PROPS INTERFACE ** ---
interface ProductVariationsManagerProps {
  initialVariations: IProductVariationFormState[];
  // The callback now MUST include the tempId of the variation that was changed
  onVariationsChange: (
    updatedVariations: IProductVariationFormState[],
    changedVariationTempId?: string 
  ) => void;
  productCurrency: string;
  disabled: boolean;
}

const stockStatusOptions: SelectOption<StockStatus>[] = [
  { value: "in_stock", label: "In Stock" }, { value: "out_of_stock", label: "Out of Stock" }, { value: "backorder", label: "Backorder" }, { value: "pre_order", label: "Pre-order" },
];
const weightUnitOptions: SelectOption<WeightUnit>[] = [
  { value: "kg", label: "kg" }, { value: "g", label: "g" }, { value: "lb", label: "lb" }, { value: "oz", label: "oz" },
];
const dimensionUnitOptions: SelectOption<DimensionUnit>[] = [
  { value: "cm", label: "cm" }, { value: "in", label: "in" }, { value: "mm", label: "mm" },
];

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
  initialVariations,
  onVariationsChange,
  productCurrency,
  disabled,
}) => {
  const { showNotification } = useNotification();
  const [definingAttributes, setDefiningAttributes] = useState<IAttributeResponse[]>([]);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string[]>>({});
  const [fetchedOptionsCache, setFetchedOptionsCache] = useState<Record<string, IAttributeOptionResponse[]>>({});
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [expandedVariationIds, setExpandedVariationIds] = useState<Set<string>>(new Set());
  const didMountRef = useRef(false);

  const { data: allAttrsResponse, isLoading: isLoadingAllAttrs } = useGetPaginatedAttributes({ limit: 200, projection: "id _id name displayName" }, { staleTime: 10 * 60 * 1000 });
  const allAvailableAttributes = useMemo(() => allAttrsResponse?.data || [], [allAttrsResponse]);

  useEffect(() => {
    if (didMountRef.current || allAvailableAttributes.length === 0 || initialVariations.length === 0) return;
    const newDefiningAttrIds = new Set<string>();
    const newSelectedOptions: Record<string, string[]> = {};
    initialVariations.forEach((v) => {
      v.attributeOptions.forEach((ao) => {
        newDefiningAttrIds.add(ao.attributeId);
        if (!newSelectedOptions[ao.attributeId]) newSelectedOptions[ao.attributeId] = [];
        if (!newSelectedOptions[ao.attributeId].includes(ao.optionId)) {
          newSelectedOptions[ao.attributeId].push(ao.optionId);
        }
      });
    });
    const initialDefiningAttrs = allAvailableAttributes.filter((attr) => newDefiningAttrIds.has(attr._id));
    setDefiningAttributes(initialDefiningAttrs);
    setSelectedOptionsMap(newSelectedOptions);
    didMountRef.current = true;
  }, [allAvailableAttributes, initialVariations]);

  useEffect(() => {
    const fetchMissingOptions = async () => {
      const attrsToFetch = definingAttributes.filter((attr) => attr._id && !fetchedOptionsCache[attr._id]);
      if (attrsToFetch.length === 0) return;
      setIsOptionsLoading(true);
      try {
        const fetchPromises = attrsToFetch.map((attr) => fetchOptionsForAttributeApi(attr._id).then((res) => ({ attrId: attr._id, data: res.data || [], })));
        const results = await Promise.all(fetchPromises);
        setFetchedOptionsCache((prev) => produce(prev, (draft) => { results.forEach((result) => { draft[result.attrId] = result.data; }); }));
      } catch (error) {
        console.error("Failed to fetch attribute options:", error);
        showNotification("Failed to load some attribute options.", "error");
      } finally {
        setIsOptionsLoading(false);
      }
    };
    fetchMissingOptions();
  }, [definingAttributes, fetchedOptionsCache, showNotification]);

  const handleDefiningAttributeSelect = useCallback((attributeId: string) => { const attribute = allAvailableAttributes.find((attr) => attr._id === attributeId); if (attribute && !definingAttributes.some((da) => da._id === attributeId)) { setDefiningAttributes((prev) => [...prev, attribute]); } }, [allAvailableAttributes, definingAttributes]);
  const handleDefiningAttributeRemove = useCallback((attributeId: string) => { setDefiningAttributes((prev) => prev.filter((da) => da._id !== attributeId)); setSelectedOptionsMap((prev) => produce(prev, (draft) => { delete draft[attributeId]; })); }, []);
  const handleOptionSelectionChange = useCallback((attributeId: string, selected: SelectOption[]) => { const optionIds = selected.map((s) => s.value); setSelectedOptionsMap((prev) => ({ ...prev, [attributeId]: optionIds })); }, []);
  const getNewVariationTemplate = useCallback((combo: IProductAttributeOptionForm[] = []): IProductVariationFormState => ({ tempId: generateTemporaryId(), sku: "", price: "", salePrice: "", inventory: "0", stockStatus: "in_stock", attributeOptions: combo, imageFiles: [], existingImageUrls: [], imagesToDeletePublicIds: [], mainVariationImageIndex: "0", weight: "", weightUnit: "kg", dimensions: { length: "", width: "", height: "", unit: "cm" }, barcode: "", costPrice: "", lowStockThreshold: "", isActive: true }), []);
  const generateCartesianProduct = useCallback((arrays: IProductAttributeOptionForm[][]): IProductAttributeOptionForm[][] => { if (!arrays || arrays.length === 0 || arrays.some((arr) => arr.length === 0)) return []; return arrays.reduce<IProductAttributeOptionForm[][]>((acc, current) => acc.flatMap((combo) => current.map((opt) => [...combo, opt])), [[]]); }, []);
  const handleGenerateVariations = useCallback(() => {
    const arraysOfSelectedOptionForms = definingAttributes.map((attr) => { const options = fetchedOptionsCache[attr._id] || []; const selectedIds = selectedOptionsMap[attr._id] || []; return selectedIds.map((optId) => { const optDetails = options.find((o) => o._id === optId); if (!optDetails) return null; return { attributeId: attr._id, attributeName: attr.name, optionId: optDetails._id, optionValue: optDetails.value, optionSwatchValue: optDetails.swatchValue, }; }).filter(Boolean) as IProductAttributeOptionForm[]; });
    if (arraysOfSelectedOptionForms.some((arr) => arr.length === 0)) { showNotification("Please select options for all chosen attributes before generating.", "warning"); return; }
    const newCombinations = generateCartesianProduct(arraysOfSelectedOptionForms);
    if (newCombinations.length === 0) { showNotification("No variations could be generated. Please select at least one option for each attribute.", "info"); onVariationsChange([]); return; }
    const newVariations = newCombinations.map((combo) => { const signature = combo.map((opt) => opt.optionId).sort().join("-"); const existingVariation = initialVariations.find((v) => v.attributeOptions.map((opt) => opt.optionId).sort().join("-") === signature); return existingVariation || getNewVariationTemplate(combo); });
    onVariationsChange(newVariations);
    showNotification(`Generated ${newVariations.length} variations. Please review details.`, "info");
  }, [definingAttributes, fetchedOptionsCache, generateCartesianProduct, getNewVariationTemplate, initialVariations, onVariationsChange, selectedOptionsMap, showNotification]);
  
  // --- ** CORRECTED CALLBACKS ** ---
  const handleAddManualVariation = useCallback(() => {
    const newVariation = getNewVariationTemplate();
    onVariationsChange([...initialVariations, newVariation], newVariation.tempId);
  }, [initialVariations, onVariationsChange, getNewVariationTemplate]);

  const handleVariationChange = useCallback((tempId: string, field: string, value: any) => {
    const newVariations = produce(initialVariations, (draft) => {
      const variation = draft.find((v) => v.tempId === tempId);
      if (variation) {
        if (field.startsWith("dimensions.")) {
          const dimKey = field.split(".")[1] as keyof NonNullable<IProductVariationFormState["dimensions"]>;
          variation.dimensions = variation.dimensions || { unit: "cm" };
          (variation.dimensions as any)[dimKey] = value;
        } else {
          (variation as any)[field] = value;
        }
      }
    });
    onVariationsChange(newVariations, tempId);
  }, [initialVariations, onVariationsChange]);

  const handleVariationImageUpdate = useCallback((tempId: string, newFiles: File[], deletedPublicIds: string[]) => {
    const newVariations = produce(initialVariations, (draft) => {
      const variation = draft.find((v) => v.tempId === tempId);
      if (variation) {
        variation.imageFiles = newFiles;
        variation.imagesToDeletePublicIds = deletedPublicIds;
      }
    });
    onVariationsChange(newVariations, tempId);
  }, [initialVariations, onVariationsChange]);

  const handleDeleteVariation = useCallback((tempId: string) => {
    const newVariations = initialVariations.filter((v) => v.tempId !== tempId);
    onVariationsChange(newVariations); // No specific ID needed for a deletion, as it affects the whole array
  }, [initialVariations, onVariationsChange]);

  const toggleExpandVariation = useCallback((tempId: string) => { setExpandedVariationIds((prev) => produce(prev, (draft) => { if (draft.has(tempId)) draft.delete(tempId); else draft.add(tempId); })); }, []);

  return (
    <ManagerContainer>
      <AttributeSelectionArea>
        <SectionTitle><FaTags /> 1. Define Variation Attributes</SectionTitle>
        <AttributePickerGroup>
          {definingAttributes.map((attr) => (
            <AttributeRow key={attr._id}>
              <AttributeNameLabel>{attr.displayName}</AttributeNameLabel>
              <ValuesInputContainer>
                <AdminSelect isMulti placeholder={`Select options for ${attr.displayName}...`} options={(fetchedOptionsCache[attr._id] || []).map((o) => ({ value: o._id, label: o.value }))} value={(selectedOptionsMap[attr._id] || []).map((optId) => ({ value: optId, label: fetchedOptionsCache[attr._id]?.find((o) => o._id === optId)?.value || "Loading..." }))} onChange={(selected: any) => handleOptionSelectionChange(attr._id, selected)} isLoading={isOptionsLoading && !fetchedOptionsCache[attr._id]} disabled={disabled} />
              </ValuesInputContainer>
              <AdminButton type="button" $variant="dangerGhost" onClick={() => handleDefiningAttributeRemove(attr._id)} disabled={disabled}><FaTrashAlt /></AdminButton>
            </AttributeRow>
          ))}
          <AdminSelect placeholder="Add another attribute..." value="" options={allAvailableAttributes.filter((a) => !definingAttributes.some((da) => da._id === a._id)).map((a) => ({ value: a._id, label: a.displayName }))} onChange={(e) => handleDefiningAttributeSelect(e.target.value)} isLoading={isLoadingAllAttrs} disabled={disabled} />
        </AttributePickerGroup>
      </AttributeSelectionArea>
      <VariationActionsBar>
        <AdminButton type="button" $variant="primary" onClick={handleGenerateVariations} disabled={disabled || definingAttributes.length === 0}><FaCog /> Generate Variations</AdminButton>
        <AdminButton type="button" $variant="secondaryOutline" onClick={handleAddManualVariation} disabled={disabled}><FaPlus /> Add Manual Row</AdminButton>
      </VariationActionsBar>
      <VariationsListWrapper>
        <SectionTitle><FaListUl /> Manage Variation Details ({initialVariations.length})</SectionTitle>
        {initialVariations.length === 0 ? (
          <NoVariationsMessage>Define attributes and click "Generate", or add a manual row.</NoVariationsMessage>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <VariationsTable>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}></th>
                  <th>Images</th>
                  <th>Attributes</th>
                  <th>SKU</th>
                  <th>Price*</th>
                  <th>Sale Price</th>
                  <th>Inventory*</th>
                  <th>Active</th>
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {initialVariations.map((v) => (
                  <React.Fragment key={v.tempId}>
                    <tr>
                      <td><ExpandButton type="button" isExpanded={expandedVariationIds.has(v.tempId)} onClick={() => toggleExpandVariation(v.tempId)}><FaChevronDown /></ExpandButton></td>
                      <td style={{ verticalAlign: "top" }}><VariationImageColumn><ImageUploader instanceId={`var-img-${v.tempId}`} initialImageUrls={v.existingImageUrls} onImagesUpdate={(files, ids) => handleVariationImageUpdate(v.tempId, files, ids)} maxFiles={5} isMini disabled={disabled} primaryImageIndex={parseInt(v.mainVariationImageIndex || '0', 10)} /></VariationImageColumn></td>
                      <td><VariationAttributeCell>{v.attributeOptions.map((ao) => (<div key={ao.optionId}><strong>{ao.attributeName}:</strong>{" "}{ao.optionValue}</div>))}</VariationAttributeCell></td>
                      <td><AdminInput type="text" value={v.sku || ""} onChange={(e) => handleVariationChange(v.tempId, "sku", e.target.value)} disabled={disabled} placeholder="SKU-123" /></td>
                      <td><AdminInput type="text" inputMode="decimal" value={v.price || ""} onChange={(e) => handleVariationChange(v.tempId, "price", e.target.value)} disabled={disabled} placeholder={productCurrency} /></td>
                      <td><AdminInput type="text" inputMode="decimal" value={v.salePrice || ""} onChange={(e) => handleVariationChange(v.tempId, "salePrice", e.target.value)} disabled={disabled} /></td>
                      <td><AdminInput type="text" inputMode="numeric" value={v.inventory || ""} onChange={(e) => handleVariationChange(v.tempId, "inventory", e.target.value)} disabled={disabled} placeholder="0" /></td>
                      <ActionCell><AdminCheckbox id={`is-active-${v.tempId}`} label="" checked={!!v.isActive} onChange={(e) => handleVariationChange(v.tempId, "isActive", e.target.checked)} disabled={disabled} /></ActionCell>
                      <ActionCell><DeleteVariationButton type="button" onClick={() => handleDeleteVariation(v.tempId)} disabled={disabled}><FaTrashAlt /></DeleteVariationButton></ActionCell>
                    </tr>
                    {expandedVariationIds.has(v.tempId) && (
                      <VariationDetailRow>
                        <DetailCell colSpan={9}>
                          <DetailsGrid>
                            <FieldGroup><FormLabel>Stock Status</FormLabel><AdminSelect options={stockStatusOptions} value={v.stockStatus} onChange={(e) => handleVariationChange(v.tempId, "stockStatus", e.target.value)} disabled={disabled} /></FieldGroup>
                            <FieldGroup><FormLabel>Barcode (GTIN, UPC, etc)</FormLabel><AdminInput type="text" value={v.barcode || ""} onChange={(e) => handleVariationChange(v.tempId, "barcode", e.target.value)} disabled={disabled} /></FieldGroup>
                            <FieldGroup><FormLabel>Weight</FormLabel><MultiFieldRow><AdminInput type="text" inputMode="decimal" value={v.weight || ""} onChange={(e) => handleVariationChange(v.tempId, "weight", e.target.value)} disabled={disabled} /><AdminSelect options={weightUnitOptions} value={v.weightUnit} onChange={(e) => handleVariationChange(v.tempId, "weightUnit", e.target.value)} disabled={disabled} /></MultiFieldRow></FieldGroup>
                            <FieldGroup><FormLabel>Dimensions (L×W×H)</FormLabel><MultiFieldRow><AdminInput type="text" inputMode="decimal" placeholder="L" value={v.dimensions?.length || ""} onChange={(e) => handleVariationChange(v.tempId, "dimensions.length", e.target.value)} disabled={disabled} /><AdminInput type="text" inputMode="decimal" placeholder="W" value={v.dimensions?.width || ""} onChange={(e) => handleVariationChange(v.tempId, "dimensions.width", e.target.value)} disabled={disabled} /><AdminInput type="text" inputMode="decimal" placeholder="H" value={v.dimensions?.height || ""} onChange={(e) => handleVariationChange(v.tempId, "dimensions.height", e.target.value)} disabled={disabled} /><AdminSelect options={dimensionUnitOptions} value={v.dimensions?.unit} onChange={(e) => handleVariationChange(v.tempId, "dimensions.unit", e.target.value)} disabled={disabled} /></MultiFieldRow></FieldGroup>
                            <FieldGroup><FormLabel>Cost Price</FormLabel><AdminInput type="text" inputMode="decimal" value={v.costPrice || ""} onChange={(e) => handleVariationChange(v.tempId, "costPrice", e.target.value)} disabled={disabled} /><FieldHelperText>For internal profit calculation.</FieldHelperText></FieldGroup>
                            <FieldGroup><FormLabel>Low Stock Threshold</FormLabel><AdminInput type="text" inputMode="numeric" value={v.lowStockThreshold || ""} onChange={(e) => handleVariationChange(v.tempId, "lowStockThreshold", e.target.value)} disabled={disabled} /></FieldGroup>
                            <FieldGroup><FormLabel>Main Image Index</FormLabel><AdminInput type="text" inputMode="numeric" value={v.mainVariationImageIndex || "0"} onChange={(e) => handleVariationChange(v.tempId, "mainVariationImageIndex", e.target.value)} disabled={disabled} /><FieldHelperText>Index (from 0) of main image in the list.</FieldHelperText></FieldGroup>
                          </DetailsGrid>
                        </DetailCell>
                      </VariationDetailRow>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </VariationsTable>
          </div>
        )}
      </VariationsListWrapper>
    </ManagerContainer>
  );
};

export default ProductVariationsManager;