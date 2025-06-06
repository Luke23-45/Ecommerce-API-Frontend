import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FaPlus,
  FaTrashAlt,
  FaCamera,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog, 
  FaTags, 
} from 'react-icons/fa';
import { useTheme, type DefaultTheme } from 'styled-components';
import { produce } from 'immer'; 

import {
  ManagerContainer,
  AttributeSelectionArea,
  SectionTitle,
  AttributePickerGroup,
  AttributeRow,
  AttributeNameLabel,
  ValuesInputContainer,
  SelectedValuesTags,
  ValueTag,
  VariationActionsBar,
  VariationsListWrapper,
  VariationsTable,
  VariationAttributeCell,
  VariationImageColumn,
  DeleteVariationButton,
  NoVariationsMessage,
  
} from './ProductVariationsManager.styles';

import { AdminInput, AdminButton } from '../../Dashboard/Common/Common.styles'; 
import AdminSelect, { type SelectOption } from '../../common/AdminSelect/AdminSelect'; 
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';

import {
  useGetPaginatedAttributes,
  useGetOptionsForAttribute, 
  attributeKeys, 
} from '@/hooks/admin/product/useAttribute'; 
import type {
  IProductVariationFormState,
  IProductAttributeOptionForm,
  StockStatusFrontend,
} from '@/types/product.types'; 
import type { IAttributeResponse, IAttributeOptionResponse } from '@/types/attribute'; 
import { useNotification } from '@/contexts/NotificationContext'; 
import { useQueryClient } from '@tanstack/react-query';


const generateTemporaryId = (): string => `temp-var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;


const parseNumericString = (value: string | number | undefined | null, defaultValue: number | null = null): number | null => {
  if (value === undefined || value === null || value === '') return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};


interface ProductVariationsManagerProps {
  initialVariations: IProductVariationFormState[];
  onVariationsChange: (updatedVariations: IProductVariationFormState[]) => void;
  productCurrency: string;
}

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
  initialVariations,
  onVariationsChange,
  productCurrency,
}) => {
  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  
  
  const [definingAttributes, setDefiningAttributes] = useState<IAttributeResponse[]>([]);
  
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string[]>>({});
  
  const [managedVariations, setManagedVariations] = useState<IProductVariationFormState[]>(initialVariations);

  
  const variationImageFileInputs = useRef<Record<string, HTMLInputElement | null>>({});


  
  const { data: allAttributesResponse, isLoading: isLoadingAllAttributes } = useGetPaginatedAttributes(
    { limit: 200, projection: "id name displayName displayType" }, 
    { staleTime: 5 * 60 * 1000 }
  );
  const allAvailableAttributes = allAttributesResponse?.data || [];

  
  const [fetchedOptionsCache, setFetchedOptionsCache] = useState<Record<string, IAttributeOptionResponse[]>>({});


  
  useEffect(() => {
    console.log("ProductVariationsManager: initialVariations prop changed or component mounted.");
    setManagedVariations(initialVariations.map(v => ({ ...v, tempId: v.tempId || v._id || generateTemporaryId() })));

    
    if (initialVariations.length > 0) {
        const newDefiningAttributes: IAttributeResponse[] = [];
        const newSelectedOptions: Record<string, string[]> = {};
        const attributeIdToDetailsMap = new Map<string, Pick<IAttributeResponse, 'id' | 'name' | 'displayName' | 'displayType'>>();

        initialVariations.forEach(variation => {
            variation.attributeOptions.forEach(attrOpt => {
                if (!attributeIdToDetailsMap.has(attrOpt.attributeId)) {
                    
                    
                    const foundAttr = allAvailableAttributes.find(a => a.id === attrOpt.attributeId);
                    if (foundAttr) {
                        attributeIdToDetailsMap.set(attrOpt.attributeId, foundAttr);
                    } else { 
                        attributeIdToDetailsMap.set(attrOpt.attributeId, {
                            id: attrOpt.attributeId,
                            name: attrOpt.attributeName, 
                            displayName: attrOpt.attributeName,
                            displayType: 'dropdown', 
                        });
                    }
                }
                if (!newSelectedOptions[attrOpt.attributeId]) {
                    newSelectedOptions[attrOpt.attributeId] = [];
                }
                if (!newSelectedOptions[attrOpt.attributeId].includes(attrOpt.optionId)) {
                    newSelectedOptions[attrOpt.attributeId].push(attrOpt.optionId);
                }
            });
        });

        attributeIdToDetailsMap.forEach(attrDetails => {
            if (!newDefiningAttributes.some(da => da.id === attrDetails.id)) {
                newDefiningAttributes.push(attrDetails as IAttributeResponse);
            }
        });

        setDefiningAttributes(newDefiningAttributes);
        setSelectedOptionsMap(newSelectedOptions);
    } else {
        
        setDefiningAttributes([]);
        setSelectedOptionsMap({});
    }
  }, [initialVariations, allAvailableAttributes]); 

  
  useEffect(() => {
    definingAttributes.forEach(attr => {
      if (!fetchedOptionsCache[attr.id] && attr.id) { 
        getOptionsForAttribute(attr.id, { lean: true }) 
          .then(response => {
            if (response.success && response.data) {
              setFetchedOptionsCache(prev => ({ ...prev, [attr.id]: response.data }));
            }
          })
          .catch(err => console.error(`Failed to fetch options for attribute ${attr.name}`, err));
      }
    });
  }, [definingAttributes, fetchedOptionsCache]);


  
  const handleDefiningAttributeToggle = (attribute: IAttributeResponse) => {
    setDefiningAttributes(prev => {
      const isAlreadySelected = prev.some(da => da.id === attribute.id);
      if (isAlreadySelected) {
        
        setSelectedOptionsMap(currentMap => {
          const newMap = {...currentMap};
          delete newMap[attribute.id];
          return newMap;
        });
        return prev.filter(da => da.id !== attribute.id);
      } else {
        return [...prev, attribute];
      }
    });
  };

  const handleOptionToggle = (attributeId: string, optionId: string) => {
    setSelectedOptionsMap(prev => {
      const currentSelectedForAttr = prev[attributeId] || [];
      const newSelectedForAttr = currentSelectedForAttr.includes(optionId)
        ? currentSelectedForAttr.filter(id => id !== optionId)
        : [...currentSelectedForAttr, optionId];
      return { ...prev, [attributeId]: newSelectedForAttr };
    });
  };


  
  const generateCartesianProduct = (arrays: IAttributeOptionResponse[][]): IProductAttributeOptionForm[][] => {
    if (!arrays || arrays.length === 0) return [[]];
    return arrays.reduce<IProductAttributeOptionForm[][]>(
      (acc, currentValArray) => {
        if (acc.length === 0) { 
          return currentValArray.map(option => [{
              attributeId: option.attributeId,
              attributeName: definingAttributes.find(a => a.id === option.attributeId)?.name || 'Unknown Attribute',
              optionId: option.id,
              optionValue: option.value,
              optionSwatchValue: option.swatchValue,
          }]);
        }
        return acc.flatMap(existingCombo =>
          currentValArray.map(option => [
            ...existingCombo,
            {
              attributeId: option.attributeId,
              attributeName: definingAttributes.find(a => a.id === option.attributeId)?.name || 'Unknown Attribute',
              optionId: option.id,
              optionValue: option.value,
              optionSwatchValue: option.swatchValue,
            }
          ])
        );
      },
      []
    );
  };

  const handleGenerateVariations = useCallback(() => {
    const arraysOfSelectedOptions: IAttributeOptionResponse[][] = definingAttributes
      .map(attr => {
        const selectedOptionIds = selectedOptionsMap[attr.id] || [];
        const attributeOptions = fetchedOptionsCache[attr.id] || [];
        return selectedOptionIds.map(optId => attributeOptions.find(opt => opt.id === optId)).filter(Boolean) as IAttributeOptionResponse[];
      })
      .filter(optionsArray => optionsArray.length > 0); 

    if (arraysOfSelectedOptions.length === 0 || arraysOfSelectedOptions.length !== definingAttributes.length) {
      showNotification("Please select at least one option for each defining attribute.", "warning");
      return;
    }

    const newAttributeCombinations = generateCartesianProduct(arraysOfSelectedOptions);

    const newVariations: IProductVariationFormState[] = newAttributeCombinations.map(combo => {
      
      const existingVariation = managedVariations.find(v =>
        v.attributeOptions.length === combo.length &&
        v.attributeOptions.every(vo => combo.some(co => co.attributeId === vo.attributeId && co.optionId === vo.optionId))
      );

      if (existingVariation) {
        return existingVariation; 
      } else {
        
        return {
          tempId: generateTemporaryId(),
          sku: '',
          price: '', 
          inventory: '',
          stockStatus: 'in_stock',
          attributeOptions: combo,
          imageFiles: [],
          existingImageUrls: [],
          imagesToDelete: [],
          isActive: true,
        };
      }
    });

    setManagedVariations(newVariations);
    onVariationsChange(newVariations); 
    showNotification(`${newVariations.length} variations generated/updated. Please review SKU, price, and inventory.`, "info");
  }, [definingAttributes, selectedOptionsMap, fetchedOptionsCache, managedVariations, onVariationsChange, showNotification]);


  const handleAddManualVariation = () => {
    const newVariation: IProductVariationFormState = {
      tempId: generateTemporaryId(),
      attributeOptions: definingAttributes.map(attr => ({ 
          attributeId: attr.id,
          attributeName: attr.name,
          optionId: '', 
          optionValue: '', 
      })),
      sku: '', price: '', inventory: '', stockStatus: 'in_stock', imageFiles: [], isActive: true,
    };
    const updated = [...managedVariations, newVariation];
    setManagedVariations(updated);
    onVariationsChange(updated);
  };

  const handleVariationFieldChange = useCallback((tempId: string, fieldName: keyof Omit<IProductVariationFormState, 'attributeOptions' | 'imageFiles' | 'existingImageUrls' | 'imagesToDelete'> | `dimensions.${keyof IDimensionsForm}`, value: any) => {
    setManagedVariations(prev =>
      produce(prev, draft => {
        const variation = draft.find(v => v.tempId === tempId);
        if (variation) {
          if (typeof fieldName === 'string' && fieldName.startsWith('dimensions.')) {
            const dimKey = fieldName.split('.')[1] as keyof IDimensionsForm;
            variation.dimensions = variation.dimensions || {};
            (variation.dimensions as any)[dimKey] = value;
          } else {
            (variation as any)[fieldName] = value;
          }
          
          if (fieldName === 'inventory') {
            const inv = parseNumericString(value);
            if (inv !== null && inv <= 0 && variation.stockStatus !== 'backorder' && variation.stockStatus !== 'pre_order') {
                variation.stockStatus = 'out_of_stock';
            } else if (inv !== null && inv > 0 && variation.stockStatus === 'out_of_stock') {
                variation.stockStatus = 'in_stock';
            }
          }
        }
      })
    );
  }, []);

  
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    console.log("ProductVariationsManager: managedVariations changed, notifying parent.", managedVariations)
    onVariationsChange(managedVariations);
  }, [managedVariations, onVariationsChange]);


  const handleVariationImageFilesChange = useCallback((tempId: string, files: File[]) => {
    setManagedVariations(prev =>
      produce(prev, draft => {
        const variation = draft.find(v => v.tempId === tempId);
        if (variation) {
          variation.imageFiles = files;
        }
      })
    );
  }, []);
  
  const handleVariationExistingImageDelete = useCallback((tempId: string, urlToDelete: string) => {
     setManagedVariations(prev =>
        produce(prev, draft => {
            const variation = draft.find(v => v.tempId === tempId);
            if (variation) {
                variation.existingImageUrls = (variation.existingImageUrls || []).filter(url => url !== urlToDelete);
                variation.imagesToDelete = [...(variation.imagesToDelete || []), urlToDelete];
            }
        })
     );
  }, []);


  const handleDeleteVariation = useCallback((tempId: string) => {
    if (window.confirm("Are you sure you want to remove this variation?")) {
      setManagedVariations(prev => prev.filter(v => v.tempId !== tempId));
    }
  }, []);


  const renderAttributeSelectors = () => (
    <AttributePickerGroup>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing(2)}}>
        <p>Select attributes that define variations (e.g., Color, Size):</p>
        {/* TODO: A proper multi-select for choosing definingAttributes from allAvailableAttributes */}
         <AdminSelect
            options={allAvailableAttributes.map(attr => ({ value: attr.id, label: attr.displayName || attr.name }))}
            onChange={(e) => {
                const selectedAttr = allAvailableAttributes.find(a => a.id === e.target.value);
                if (selectedAttr && !definingAttributes.some(da => da.id === selectedAttr.id)) {
                    handleDefiningAttributeToggle(selectedAttr);
                }
            }}
            placeholder="Add a variation attribute..."
            value="" 
            isLoading={isLoadingAllAttributes}
         />
      </div>

      {definingAttributes.map(attr => (
        <AttributeRow key={attr.id}>
          <AttributeNameLabel title={attr.name}>{attr.displayName || attr.name}</AttributeNameLabel>
          <ValuesInputContainer>
            <SelectedValuesTags>
              {(selectedOptionsMap[attr.id] || []).map(optionId => {
                const option = (fetchedOptionsCache[attr.id] || []).find(opt => opt.id === optionId);
                return option ? (
                  <ValueTag key={option.id}>
                    {option.value}
                    <button type="button" onClick={() => handleOptionToggle(attr.id, option.id)}><FaTimes /></button>
                  </ValueTag>
                ) : null;
              })}
            </SelectedValuesTags>
            <AdminSelect
              isMulti 
              placeholder={`Select or add options for ${attr.displayName || attr.name}...`}
              options={(fetchedOptionsCache[attr.id] || []).map(opt => ({ value: opt.id, label: opt.value }))}
              value={(selectedOptionsMap[attr.id] || []).map(optId => optId)}
              onChange={(selectedOpts: any) => { 
                  const newOptionIds = Array.isArray(selectedOpts) ? selectedOpts.map(opt => opt.value) : [];
                  setSelectedOptionsMap(prev => ({ ...prev, [attr.id]: newOptionIds }));
              }}
              
              
            />
             <button type="button" onClick={() => handleDefiningAttributeToggle(attr)} style={{alignSelf: 'flex-start', color: theme.colors.adminStatusError, background: 'none', border: 'none', cursor:'pointer', marginLeft: theme.spacing(1)}}>
                Remove Attribute
            </button>
          </ValuesInputContainer>
        </AttributeRow>
      ))}
    </AttributePickerGroup>
  );

  
  return (
    <ManagerContainer>
      <AttributeSelectionArea>
        <SectionTitle>1. Define Variation Attributes & Options</SectionTitle>
        {isLoadingAllAttributes ? <LoadingSpinner message="Loading attributes..." /> : renderAttributeSelectors()}
      </AttributeSelectionArea>

      <VariationActionsBar>
        <AdminButton
          type="button"
          $variant="primary"
          onClick={handleGenerateVariations}
          disabled={definingAttributes.length === 0 || !Object.values(selectedOptionsMap).some(opts => opts.length > 0)}
        >
          <FaCog /> Generate/Update Variations from Selections
        </AdminButton>
        <AdminButton type="button" $variant="secondary" onClick={handleAddManualVariation}>
          <FaPlus /> Add Custom Variation
        </AdminButton>
      </VariationActionsBar>

      <VariationsListWrapper>
        <SectionTitle>2. Manage Generated Variations</SectionTitle>
        {managedVariations.length === 0 ? (
          <NoVariationsMessage>
            {definingAttributes.length > 0 && Object.values(selectedOptionsMap).some(opts => opts.length > 0)
              ? 'Click "Generate/Update Variations" to create variants based on your selections.'
              : 'Define attributes and select options first, then generate variations.'}
          </NoVariationsMessage>
        ) : (
          <AdminTableWrapper style={{maxHeight: '500px', overflowY: 'auto'}}> {/* Scrollable table */}
            <VariationsTable>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Attributes</th>
                  <th>SKU*</th>
                  <th>Price* ({productCurrency})</th>
                  <th>Sale Price</th>
                  <th>Inventory*</th>
                  <th>Stock Status*</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {managedVariations.map((variation) => (
                  <tr key={variation.tempId}>
                    <td>
                      <VariationImageColumn>
                        {/* Simple preview, assumes first image or placeholder */}
                        <img
                            className="variation-preview-image"
                            src={(variation.existingImageUrls && variation.existingImageUrls[0]) || (variation.imageFiles && variation.imageFiles.length > 0 ? URL.createObjectURL(variation.imageFiles[0]) : 'https:
                            alt="Variation"
                            onClick={() => variationImageFileInputs.current[variation.tempId]?.click()}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            multiple 
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleVariationImageFilesChange(variation.tempId, Array.from(e.target.files));
                                }
                            }}
                            style={{display: 'none'}}
                            id={`var-img-upload-${variation.tempId}`}
                            ref={el => { variationImageFileInputs.current[variation.tempId] = el; }}
                        />
                        <label htmlFor={`var-img-upload-${variation.tempId}`} className="image-upload-trigger" title="Upload images for this variation">
                            <FaCamera />
                        </label>
                        {/* TODO: Add previews for multiple images and delete buttons for existing/newly added files */}
                      </VariationImageColumn>
                    </td>
                    <td>
                      <VariationAttributeCell>
                        {variation.attributeOptions.map(attrOpt => (
                          <span key={`${attrOpt.attributeId}-${attrOpt.optionId}`}>
                            <strong>{attrOpt.attributeName}:</strong> {attrOpt.optionValue}
                          </span>
                        ))}
                      </VariationAttributeCell>
                    </td>
                    <td>
                      <AdminInput type="text" value={variation.sku} onChange={(e) => handleVariationFieldChange(variation.tempId, 'sku', e.target.value)} placeholder="Variant SKU" />
                    </td>
                    <td>
                      <AdminInput type="text" value={variation.price} onChange={(e) => handleVariationFieldChange(variation.tempId, 'price', e.target.value)} required pattern="^\d*([.,]\d{0,2})?$" />
                    </td>
                    <td>
                      <AdminInput type="text" value={variation.salePrice || ''} onChange={(e) => handleVariationFieldChange(variation.tempId, 'salePrice', e.target.value)} pattern="^\d*([.,]\d{0,2})?$" />
                    </td>
                    <td>
                      <AdminInput type="text" value={variation.inventory} onChange={(e) => handleVariationFieldChange(variation.tempId, 'inventory', e.target.value)} required pattern="^\d*$" />
                    </td>
                    <td>
                      <AdminSelect
                        value={variation.stockStatus}
                        onChange={(e) => handleVariationFieldChange(variation.tempId, 'stockStatus', e.target.value as StockStatusFrontend)}
                        options={[ { value: 'in_stock', label: 'In Stock' }, { value: 'out_of_stock', label: 'Out of Stock' }, { value: 'backorder', label: 'Backorder' }, { value: 'pre_order', label: 'Pre-order' }]}
                        style={{minWidth: '120px'}}
                      />
                    </td>
                    <td style={{textAlign: 'center'}}>
                        <input type="checkbox" checked={variation.isActive} onChange={(e) => handleVariationFieldChange(variation.tempId, 'isActive', e.target.checked)} style={{transform: 'scale(1.2)'}} />
                    </td>
                    <td>
                      <DeleteVariationButton type="button" onClick={() => handleDeleteVariation(variation.tempId)} title="Delete this variation">
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