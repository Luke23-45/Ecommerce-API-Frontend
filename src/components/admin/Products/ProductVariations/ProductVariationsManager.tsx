// src/components/Admin/Products/ProductVariations/ProductVariationsManager.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { FaPlus, FaTrashAlt, FaCamera, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

import {
  ManagerContainer,
  AttributeControls,
  AttributeList,
  AttributeTag,
  NewAttributeInput,
  AttributeButton,
  VariationsTable,
  VariationImageColumn,
  DeleteVariationButton,
  NoVariationsMessage,
} from './ProductVariationsManager.styles';


import { type ProductVariation, type StockStatusFrontend } from '../../../../types/product'; 
import { AdminInput } from '../../Dashboard/Common/Common.styles';
import AdminSelect from '../../common/AdminSelect/AdminSelect';
import { AdminButton } from '../../Dashboard/Common/Common.styles';

const generateTemporaryId = () => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// A function to combine attribute arrays
function generateCombinations(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]];
  const firstArray = arrays[0];
  const restArrays = arrays.slice(1);

  const restCombinations = generateCombinations(restArrays);

  const result: string[][] = [];
  for (const item of firstArray) {
    for (const combination of restCombinations) {
      result.push([item, ...combination]);
    }
  }
  return result;
}

// Function to safely check if a value is numeric
const isNumeric = (str: string) => !isNaN(parseFloat(str)) && isFinite(Number(str));

interface ProductVariationsManagerProps {
  productVariations: ProductVariation[]; // Initial and current variations passed from parent
  onVariationsChange: (updatedVariations: ProductVariation[]) => void; // Callback to update parent
}

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
  productVariations: initialProductVariations, // Renamed to clearly indicate this is the prop value
  onVariationsChange,
}) => {
  // State for managing editable attributes (e.g., { 'Color': ['Red', 'Blue'] })
  const [attributes, setAttributes] = useState<{[key: string]: string[]}>({});
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');

  // State for the variations being *managed and edited internally* in this component's UI
  // This state is independent of 'initialProductVariations' prop for editing purposes
  const [managedVariations, setManagedVariations] = useState<ProductVariation[]>([]);

  // Ref to hold file input elements for variation images dynamically
  const variationFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // --- EFFECT: Hydrate internal state from initialProductVariations prop ---
  // Runs when component mounts or initialProductVariations prop changes (e.g., when editing a different product)
  useEffect(() => {
    // 1. Hydrate attributes from initial variations
    const hydratedAttributes: {[key: string]: string[]} = {};
    initialProductVariations.forEach(variation => {
      variation.attributes?.forEach(attr => {
        if (!hydratedAttributes[attr.name]) {
          hydratedAttributes[attr.name] = [];
        }
        if (!hydratedAttributes[attr.name].includes(attr.value)) {
          hydratedAttributes[attr.name].push(attr.value);
        }
      });
    });
    // Ensure lists are sorted for consistency
    Object.keys(hydratedAttributes).forEach(key => hydratedAttributes[key].sort());
    setAttributes(hydratedAttributes);

    // 2. Hydrate internal 'managedVariations' directly from the prop
    // This is the source of truth for the variations this component manages internally
    setManagedVariations(initialProductVariations);
  }, [initialProductVariations]);


  // --- Attribute Management Handlers ---
  const handleAddAttributeValue = useCallback(() => {
    if (newAttributeName.trim() && newAttributeValue.trim()) {
      setAttributes(prevAttrs => {
        const updatedAttrs = { ...prevAttrs };
        const trimmedName = newAttributeName.trim();
        const trimmedValue = newAttributeValue.trim();

        if (!updatedAttrs[trimmedName]) {
          updatedAttrs[trimmedName] = [];
        }
        if (!updatedAttrs[trimmedName].includes(trimmedValue)) {
          updatedAttrs[trimmedName] = [...updatedAttrs[trimmedName], trimmedValue].sort();
        }
        return updatedAttrs;
      });
      setNewAttributeValue(''); // Clear value input after adding
    }
  }, [newAttributeName, newAttributeValue]);

  const handleDeleteAttributeValue = useCallback((attrName: string, valueToDelete: string) => {
    setAttributes(prevAttrs => {
      const updatedAttrs = { ...prevAttrs };
      updatedAttrs[attrName] = updatedAttrs[attrName].filter(val => val !== valueToDelete);
      if (updatedAttrs[attrName].length === 0) {
        delete updatedAttrs[attrName]; // Remove attribute name if no values left
      }
      return updatedAttrs;
    });
  }, []);

  // --- VARIATION GENERATION LOGIC (NO STATE UPDATE HERE) ---
  // This memoizes the *combination generation*, but it doesn't immediately update `managedVariations`
  const potentialNewCombinations = useMemo(() => {
    const attributeNames = Object.keys(attributes);
    const attributeValuesArrays = attributeNames.map(name => attributes[name]);

    if (attributeNames.length === 0 || attributeValuesArrays.some(arr => arr.length === 0)) {
        return []; // No combinations if no attributes or any attribute has no values
    }
    
    return generateCombinations(attributeValuesArrays);
  }, [attributes]);


  // --- EXPLICITLY GENERATE BUTTON CLICK HANDLER ---
  const handleGenerateVariationsClick = useCallback(() => {
    const generated: ProductVariation[] = potentialNewCombinations.map(combination => {
      const attrs = combination.map((val, i) => ({
        name: Object.keys(attributes)[i], // Get attribute name based on its position in object keys
        value: val,
      }));

      // Find if this exact combination already exists in our `managedVariations`
      const existingVariation = managedVariations.find(v => {
        // Create unique string representation for combination for reliable comparison
        const vCombo = v.attributes.map(a => `${a.name}:${a.value}`).sort().join('|');
        const newCombo = attrs.map(a => `${a.name}:${a.value}`).sort().join('|');
        return vCombo === newCombo;
      });

      return existingVariation ? existingVariation : { // If existing, preserve its data
        _id: generateTemporaryId(), // Assign a temporary ID if new
        sku: '',
        price: 0,
        inventory: 0,
        attributes: attrs,
        imageUrls: [],
        stockStatus: 'out_of_stock',
      };
    });

    // Remove any variations from `managedVariations` that no longer have a matching combo from attributes
    // This cleans up deleted attribute values from existing variations.
    const finalManaged = generated.filter(v => {
        const vCombo = v.attributes.map(a => `${a.name}:${a.value}`).sort().join('|');
        return potentialNewCombinations.some(newAttrs => {
            const newCombo = newAttrs.map(a => `${a.name}:${a.value}`).sort().join('|');
            return vCombo === newCombo;
        });
    });

    // Push the updated variations up to the parent component after explicit generation
    onVariationsChange(finalManaged);
    // Update internal state
    setManagedVariations(finalManaged);

  }, [potentialNewCombinations, managedVariations, attributes, onVariationsChange]);

  // Determine if combinations can be generated/applied (must have at least one attribute name with values)
  const canGenerate = useMemo(() => {
    const attributeNames = Object.keys(attributes);
    return attributeNames.length > 0 && attributeNames.every(name => attributes[name].length > 0);
  }, [attributes]);


  // --- Individual Variation Editing Handlers ---
  // This updates local state and propagates to parent for individual changes
  const handleVariationFieldChange = useCallback((id: string, field: keyof ProductVariation | string, value: any) => {
    setManagedVariations(prevVariations => {
        const updatedVariations = prevVariations.map(v => {
            if (v._id === id) {
                const updatedV = { ...v };
                if (typeof field === 'string' && field.includes('.')) { // For nested props like dimensions.length
                    const [parent, child] = field.split('.');
                    if (parent === 'dimensions') {
                        // Ensure dimensions object exists before updating nested property
                        updatedV.dimensions = { ...updatedV.dimensions, [child]: parseFloat(value) || 0 };
                    }
                } else if (['price', 'salePrice', 'inventory', 'weight'].includes(field as string)) {
                    // Correctly handle empty strings for numeric fields
                    updatedV[field as keyof ProductVariation] = value === '' ? null : (isNumeric(value) ? parseFloat(value) : value);
                } else {
                    updatedV[field as keyof ProductVariation] = value;
                }
                return updatedV;
            }
            return v;
        });
        // Push the updated variations up to the parent component immediately after change
        onVariationsChange(updatedVariations);
        return updatedVariations; // Update internal state too
    });
  }, [onVariationsChange]);

  // Image Upload handler for individual variations
  const handleVariationImageUpload = useCallback((variationId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newImageUrl = URL.createObjectURL(file); // Create object URL for preview

      setManagedVariations(prevVariations => {
        const updatedVariations = prevVariations.map(v => {
            if (v._id === variationId) {
                // In real app, you'd send file to server and get URL back. For now, use object URL.
                return { ...v, imageUrls: [newImageUrl] }; // Replace all images with new one for simplicity
            }
            return v;
        });
        onVariationsChange(updatedVariations); // Propagate up
        return updatedVariations;
      });
      // Important: revokeObjectURL(old_object_url) if replacing. This is complex for array.
    }
  }, [onVariationsChange]);

  const handleVariationImageDelete = useCallback((variationId: string, urlToDelete: string) => {
    setManagedVariations(prevVariations => {
        const updatedVariations = prevVariations.map(v => {
            if (v._id === variationId) {
                return {
                    ...v,
                    imageUrls: v.imageUrls.filter(url => url !== urlToDelete)
                };
            }
            return v;
        });
        onVariationsChange(updatedVariations); // Propagate delete to parent
        URL.revokeObjectURL(urlToDelete); // Clean up object URL if newly created during session
        return updatedVariations;
    });
  }, [onVariationsChange]);


  const handleDeleteVariation = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this variation? This cannot be undone.')) {
        setManagedVariations(prevVariations => {
            const updatedVariations = prevVariations.filter(v => v._id !== id);
            onVariationsChange(updatedVariations); // Propagate delete to parent
            // Clean up object URLs for any images specific to the deleted variation (if they were new)
            const deletedVariation = prevVariations.find(v => v._id === id);
            deletedVariation?.imageUrls.forEach(url => {
                if (url.startsWith('blob:')) URL.revokeObjectURL(url); // Revoke only blob URLs
            });
            return updatedVariations;
        });
    }
  }, [onVariationsChange]);


  return (
    <ManagerContainer>
      <AttributeControls>
        <h4>1. Define Attributes and Values</h4>
        <AttributeList>
          {Object.entries(attributes).map(([name, values]) => (
            <React.Fragment key={name}>
              {values.map(value => (
                <AttributeTag key={`${name}-${value}`}>
                  {name}: {value} <button type="button" onClick={() => handleDeleteAttributeValue(name, value)}><FaTimes /></button>
                </AttributeTag>
              ))}
            </React.Fragment>
          ))}
        </AttributeList>
        <NewAttributeInput>
          <AdminInput
            type="text"
            placeholder="Attribute Name (e.g., Color)"
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
            style={{ flex: '0.4' }} // Reconfirm styles like width/flex based on context
          />
          <AdminInput
            type="text"
            placeholder="Value (e.g., Red)"
            value={newAttributeValue}
            onChange={(e) => setNewAttributeValue(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddAttributeValue(); }}
            style={{ flex: '0.6' }}
          />
          <AttributeButton type="button" onClick={handleAddAttributeValue} style={{ whiteSpace: 'nowrap' }}>
            <FaPlus /> Add
          </AttributeButton>
        </NewAttributeInput>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>
          * Define all unique combinations of attributes for your product (e.g., Color: Red, Blue; Size: Small, Large).
        </p>
        <AttributeButton type="button" onClick={handleGenerateVariationsClick} disabled={!canGenerate} $variant="primary"> {/* $variant primary for more visual weight */}
            <FaCheckCircle /> Generate Variations
        </AttributeButton>
      </AttributeControls>

      {/* Conditional rendering for variations table/message */}
      {managedVariations.length === 0 && potentialNewCombinations.length > 0 && canGenerate ? (
          <NoVariationsMessage>
              Click "Generate Variations" to create variants from your defined attributes.
          </NoVariationsMessage>
      ) : managedVariations.length === 0 && !canGenerate ? (
          <NoVariationsMessage>
              Start by defining product attributes (e.g., Color: Red, Blue) to create variations.
          </NoVariationsMessage>
      ) : (
        <VariationsTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Attributes</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Sale Price</th>
              <th>Inventory</th>
              <th>Status</th> {/* Changed 'Stock' to 'Inventory' for consistency */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managedVariations.map((variation) => (
              <tr key={variation._id}>
                <td>
                  <VariationImageColumn>
                      <img src={variation.imageUrls[0] || 'https://via.placeholder.com/40x40?text=No%20Img'} alt="Variation" />
                      {/* Using a label/hidden input for clickable file upload trigger */}
                      <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVariationImageUpload(variation._id!, e)}
                          style={{display: 'none'}}
                          id={`variation-image-upload-${variation._id}`} // Unique ID for label
                          ref={el => { // Attach ref for direct element access if needed, though ID+Label works
                              if (el) variationFileInputs.current[variation._id!] = el;
                          }}
                      />
                      <label htmlFor={`variation-image-upload-${variation._id}`} className="image-upload-trigger">
                          <FaCamera />
                      </label>
                      {/* Display deletion button only if an image exists */}
                      {variation.imageUrls.length > 0 && (
                          <button type="button" onClick={() => handleVariationImageDelete(variation._id!, variation.imageUrls[0])} style={{ background: 'none', border: 'none', color: '#FF4500', marginLeft: '5px', cursor: 'pointer' }}>
                              <FaTrashAlt />
                          </button>
                      )}
                  </VariationImageColumn>
                </td>
                <td>
                  {variation.attributes.map(attr => (
                    <span key={`${variation._id}-${attr.name}-${attr.value}`} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                      <strong>{attr.name}:</strong> {attr.value}
                    </span>
                  ))}
                </td>
                <td>
                  <AdminInput
                    type="text"
                    name="sku"
                    value={variation.sku}
                    onChange={(e) => handleVariationFieldChange(variation._id!, 'sku', e.target.value)}
                  />
                </td>
                <td>
                  <AdminInput
                    type="number"
                    name="price"
                    value={variation.price}
                    onChange={(e) => handleVariationFieldChange(variation._id!, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </td>
                <td>
                  <AdminInput
                    type="number"
                    name="salePrice"
                    value={variation.salePrice || ''} // Handle null/undefined for salePrice
                    onChange={(e) => handleVariationFieldChange(variation._id!, 'salePrice', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </td>
                <td>
                  <AdminInput
                    type="number"
                    name="inventory"
                    value={variation.inventory}
                    onChange={(e) => handleVariationFieldChange(variation._id!, 'inventory', e.target.value)}
                    min="0"
                  />
                  {/* Stock status indicator based on inventory */}
                  {variation.inventory === 0 && variation.stockStatus === 'out_of_stock' && (
                     <FaExclamationTriangle style={{ color: 'red', marginLeft: '5px', verticalAlign: 'middle' }} title="Out of Stock"/>
                  )}
                </td>
                <td>
                  <AdminSelect
                    name="stockStatus"
                    value={variation.stockStatus}
                    onChange={(e) => handleVariationFieldChange(variation._id!, 'stockStatus', e.target.value as StockStatusFrontend)}
                    options={[
                        { value: 'in_stock', label: 'In Stock' },
                        { value: 'out_of_stock', label: 'Out of Stock' },
                        { value: 'backorder', label: 'Backorder' },
                    ]}
                    style={{width: '100px'}} // Small width for select in table
                  />
                </td>
                <td>
                  <DeleteVariationButton type="button" onClick={() => handleDeleteVariation(variation._id!)} aria-label="Delete variation">
                    <FaTrashAlt />
                  </DeleteVariationButton>
                </td>
              </tr>
            ))}
          </tbody>
        </VariationsTable>
      )}
    </ManagerContainer>
  );
};

export default ProductVariationsManager;