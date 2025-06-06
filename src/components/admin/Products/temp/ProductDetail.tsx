// src/components/Admin/Products/ProductDetail.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTrashAlt,
  FaTag,
  FaPalette,
  FaCube,
  FaBalanceScale,
  FaBoxOpen,
  FaRulerCombined,
  FaUserTie,
  FaBuilding,
  FaDollarSign,
  FaBarcode,
  FaShoppingCart,
  FaList,
  FaImage,
  FaExclamationTriangle,
  FaBan,
  FaPlus,
} from "react-icons/fa";

import {
  ProductDetailContainer,
  ProductDetailForm,
  StickyActionBar,
} from "./ProductDetail.styles";

import ProductVariationsManager from "./ProductVariations/ProductVariationsManager";

import { AdminInput } from "../Dashboard/Common/Common.styles";
import AdminTextArea from "../common/AdminTextArea/AdminTextArea";
import AdminSelect from "../common/AdminSelect/AdminSelect";
import { AdminButton } from "../Dashboard/Common/Common.styles";
import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from "../common/FormSectionWrapper/FormSectionWrapper";
import ImageUploader from "../common/ImageUploader/ImageUploader";

import type {
  ProductDetail,
  ProductStatusFrontend,
  StockStatusFrontend,
} from "@/types/product";

// Dummy Data for Form Dropdowns & Initial State (defined as before)
const dummyCategories = [
  { value: "living-room", label: "Living Room Furniture" },
  { value: "dining-room", label: "Dining Room" },
  { value: "bedroom", label: "Bedroom Essentials" },
  { value: "lighting", label: "Lighting" },
  { value: "decor", label: "Home Decor & Art" },
  { value: "kitchen", label: "Kitchen & Bar" },
  { value: "outdoor", label: "Outdoor Living" },
  { value: "wellness", label: "Wellness & Spa" },
  { value: "office", label: "Home Office" },
];

const dummySellers = [
  { id: "seller1", name: "Élan Interiors" },
  { id: "seller2", name: "Crafted Goods" },
  { id: "seller3", name: "Zen Decor Studio" },
];

const dummyVendors = [
  { id: "vendor1", name: "Artisan Wood Co." },
  { id: "vendor2", name: "Scandinavian Weaves" },
  { id: "vendor3", name: "Modern Spaces Inc." },
];

const mockMongoId = () =>
  "6" + Math.random().toString(36).substring(2, 26).padEnd(23, "0");

// Initial/Example Product Detail State (for editing existing product)
const initialProductDetail: ProductDetail = {
  _id: mockMongoId(), // Simulate existing product ID
  name: "Nordic Wool Rug", // Simplified name as variations handle details
  sku: "ELRUGBASE", // Base SKU for main product
  description:
    "A luxurious hand-knitted wool rug from our Nordic collection. Perfect for adding warmth and texture to any living space or bedroom.",
  shortDescription:
    "Hand-knitted, pure wool rug. Soft, durable, and sustainable.",
  price: 320.0, // Base price, will be overridden by variations if they exist
  currency: "USD",
  categoryId: dummyCategories[0].value,
  categoryName: dummyCategories[0].label,
  brand: "Élan Homewares",
  manufacturer: "Nordic Weavers Co.",

  inventory: 5, // Aggregate or irrelevant if variations present (set to 0 for variant-only)
  weight: 8.5,
  dimensions: { length: 200, width: 140, height: 1, unit: "cm" },
  stockStatus: "in_stock", // Overall stock status

  imageUrls: [
    // Main product images
    "https://picsum.photos/seed/rug-main/600/600?home,interior,rug",
    "https://picsum.photos/seed/rug-overview-2/600/600?rug,overview",
    "https://picsum.photos/seed/rug-context-3/600/600?rug,lifestyle",
  ],

  sellerType: "vendor",
  vendorId: dummyVendors[1].id,
  vendorName: dummyVendors[1].name,

  status: "active",
  visibility: "public",
  variations: [
    // Example of diverse variations
    {
      _id: mockMongoId(),
      sku: "ELRUG-CH-200X140",
      price: 320,
      inventory: 5,
      attributes: [
        { name: "Color", value: "Charcoal" },
        { name: "Size", value: "200x140cm" },
      ],
      imageUrls: [
        "https://picsum.photos/seed/rug-charcoal-small/600/600?rug,charcoal",
      ],
      stockStatus: "in_stock",
    },
    {
      _id: mockMongoId(),
      sku: "ELRUG-CH-240X160",
      price: 450,
      inventory: 2,
      attributes: [
        { name: "Color", value: "Charcoal" },
        { name: "Size", value: "240x160cm" },
      ],
      imageUrls: [
        "https://picsum.photos/seed/rug-charcoal-large/600/600?rug,charcoal-large",
      ],
      stockStatus: "in_stock",
      salePrice: 400,
    },
    {
      _id: mockMongoId(),
      sku: "ELRUG-NV-200X140",
      price: 320,
      inventory: 0,
      attributes: [
        { name: "Color", value: "Navy" },
        { name: "Size", value: "200x140cm" },
      ],
      imageUrls: ["https://picsum.photos/seed/rug-navy-small/600/600?rug,navy"],
      stockStatus: "out_of_stock",
    },
    {
      _id: mockMongoId(),
      sku: "ELRUG-NV-240X160",
      price: 450,
      inventory: 1,
      attributes: [
        { name: "Color", value: "Navy" },
        { name: "Size", value: "240x160cm" },
      ],
      imageUrls: [
        "https://picsum.photos/seed/rug-navy-large/600/600?rug,navy-large",
      ],
      stockStatus: "in_stock",
    },
    {
      _id: mockMongoId(),
      sku: "ELRUG-BE-200X140",
      price: 320,
      inventory: 7,
      attributes: [
        { name: "Color", value: "Beige" },
        { name: "Size", value: "200x140cm" },
      ],
      imageUrls: [
        "https://picsum.photos/seed/rug-beige-small/600/600?rug,beige",
      ],
      stockStatus: "in_stock",
    },
  ],
  hazardousMaterial: false,
  ageRestricted: false,
  createdBy: mockMongoId(),
  updatedBy: mockMongoId(),
  createdAt: "2023-03-01T14:00:00Z",
  updatedAt: new Date().toISOString(),
};

interface ProductDetailProps {
  productId?: string | null;
  onSave?: (product: ProductDetail, isNew: boolean) => void;
  onDelete: (productId: string, productName: string) => void; 
  onCancel?: () => void;
}

const ProductDetail_: React.FC<ProductDetailProps> = ({
  productId,
  onSave,
  onDelete,
  onCancel,
}) => {
  const isNewProduct = productId === undefined || productId === null;
  const [product, setProduct] = useState<ProductDetail>(
    isNewProduct
      ? {
          name: "",
          sku: "",
          price: 0,
          currency: "USD",
          categoryId: dummyCategories[0].value,
          inventory: 0,
          stockStatus: "out_of_stock",
          imageUrls: [],
          sellerType: "vendor",
          status: "draft",
          visibility: "hidden",
          variations: [],
        }
      : initialProductDetail
  );

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Handler for all non-nested product fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Handle nested dimension fields (special case)
    if (name.startsWith("dimensions.")) {
      const dimProp = name.split(".")[1] as keyof ProductDimensions;
      setProduct((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimProp]: parseFloat(value) || 0, // Convert to number
        },
      }));
      return;
    }

    if (type === "checkbox") {
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (
      name === "price" ||
      name === "salePrice" ||
      name === "inventory" ||
      name === "ageRestrictionMinimum" ||
      name === "weight"
    ) {
      setProduct((prev) => ({ ...prev, [name]: parseFloat(value) || 0 })); // Convert to number
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }

    // Special handling for categoryId to also store categoryName for display
    if (name === "categoryId") {
      const selectedCategory = dummyCategories.find(
        (cat) => cat.value === value
      );
      setProduct((prev) => ({
        ...prev,
        categoryName: selectedCategory ? selectedCategory.label : "",
      }));
    }
  };

  // Handler for image uploader (newly selected files)
  const handleNewImagesChange = useCallback((files: File[]) => {
    setNewImageFiles(files);
  }, []);

  // Handler for deleting an EXISTING image URL
  const handleExistingImageUrlDelete = useCallback((urlToDelete: string) => {
    setProduct((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToDelete),
    }));
  }, []);

  // --- NEW: Handler for product variations data changes ---
  const handleVariationsChange = useCallback(
    (updatedVariations: ProductVariation[]) => {
      setProduct((prev) => ({
        ...prev,
        variations: updatedVariations,
      }));
      // Logic to update overall inventory/stockStatus based on variations (optional)
      const totalInventory = updatedVariations.reduce(
        (sum, v) => sum + v.inventory,
        0
      );
      const hasOutOfStock = updatedVariations.some(
        (v) => v.stockStatus === "out_of_stock" && v.inventory === 0
      );
      const hasBackorder = updatedVariations.some(
        (v) => v.stockStatus === "backorder"
      );
      let overallStockStatus: StockStatusFrontend = "in_stock";
      if (totalInventory === 0 && !hasBackorder)
        overallStockStatus = "out_of_stock";
      if (hasBackorder) overallStockStatus = "backorder";
      if (hasOutOfStock && totalInventory > 0) overallStockStatus = "in_stock"; // Can be in stock if some variations are, but others are not
      setProduct((prev) => ({
        ...prev,
        inventory: totalInventory, // Aggregate inventory
        stockStatus: overallStockStatus,
      }));
    },
    []
  );

  // --- Form Actions ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Product:", product);
    console.log("New Images to Upload:", newImageFiles);
    // In a real app: Handle image uploads, data submission, etc.
    onSave?.(product, isNewProduct);
    // Dummy success message. Realistically, handle API response.
    alert(
      `Product ${isNewProduct ? "created" : "updated"}! (Check console for data)`
    );
    onCancel?.(); 
  };

  const handleDeleteProduct = () => {
    if (
      product._id &&
      window.confirm(
        `Are you sure you want to delete "${product.name}"? This cannot be undone.`
      )
    ) {
      onDelete?.(product._id);
      alert("Product deleted! (Check console)");
      onCancel?.();
    } else if (!isNewProduct) {
      alert("Product ID not found for deletion, or this is a new product.");
    }
  };

  return (
    <ProductDetailContainer>
      <AdminButton
        $variant="secondary"
        onClick={onCancel}
        style={{ marginBottom: "20px", alignSelf: "flex-start" }}
      >
        <FaArrowLeft /> Back to Product List
      </AdminButton>

      <ProductDetailForm onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <FormSectionWrapper title="Basic Information">
          <FieldGroup>
            <FormLabel htmlFor="name">Product Name</FormLabel>
            <AdminInput
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="sku">SKU (Stock Keeping Unit)</FormLabel>
            <AdminInput
              type="text"
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              required
            />
          </FieldGroup>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="description">Description</FormLabel>
            <AdminTextArea
              id="description"
              name="description"
              value={product.description || ""}
              onChange={handleChange}
              placeholder="Detailed product description..."
            />
          </FieldGroup>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
            <AdminTextArea
              id="shortDescription"
              name="shortDescription"
              value={product.shortDescription || ""}
              onChange={handleChange}
              placeholder="Brief summary for product cards/listings..."
              rows={3}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="categoryId">Category</FormLabel>
            <AdminSelect
              id="categoryId"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              options={dummyCategories}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="brand">Brand</FormLabel>
            <AdminInput
              type="text"
              id="brand"
              name="brand"
              value={product.brand || ""}
              onChange={handleChange}
              placeholder="e.g., Élan Homewares"
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="manufacturer">Manufacturer</FormLabel>
            <AdminInput
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={product.manufacturer || ""}
              onChange={handleChange}
              placeholder="Name of manufacturer"
            />
          </FieldGroup>
        </FormSectionWrapper>

        {/* Section 2: Pricing & Inventory (Now applies to base product or overall if variations are primary) */}
        <FormSectionWrapper title="Base Pricing & Global Inventory">
          <p
            style={{ color: "#666", fontSize: "0.95rem", marginBottom: "15px" }}
          >
            Note: If variations are used, specific pricing and inventory for
            each variant are managed in the 'Product Variations' section.
          </p>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="price">
                Base Price (<FaDollarSign />)
              </FormLabel>
              <AdminInput
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="salePrice">
                Base Sale Price (<FaDollarSign />)
              </FormLabel>
              <AdminInput
                type="number"
                id="salePrice"
                name="salePrice"
                value={product.salePrice || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="currency">Currency</FormLabel>
              <AdminSelect
                id="currency"
                name="currency"
                value={product.currency}
                onChange={handleChange}
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                ]}
              />
            </FieldGroup>
          </MultiFieldRow>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="inventory">
                Overall Inventory (<FaShoppingCart />)
              </FormLabel>
              <AdminInput
                type="number"
                id="inventory"
                name="inventory"
                value={product.inventory}
                onChange={handleChange}
                min="0"
                required
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="stockStatus">Overall Stock Status</FormLabel>
              <AdminSelect
                id="stockStatus"
                name="stockStatus"
                value={product.stockStatus}
                onChange={handleChange}
                options={[
                  { value: "in_stock", label: "In Stock" },
                  { value: "out_of_stock", label: "Out of Stock" },
                  { value: "backorder", label: "Backorder" },
                ]}
              />
            </FieldGroup>
          </MultiFieldRow>
          <MultiFieldRow>
            {" "}
            {/* Weight and Dimensions */}
            <FieldGroup>
              <FormLabel htmlFor="weight">
                Weight (kg) (<FaBalanceScale />)
              </FormLabel>
              <AdminInput
                type="number"
                id="weight"
                name="weight"
                value={product.weight || ""}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </FieldGroup>
            <MultiFieldRow>
              <FieldGroup>
                <FormLabel>
                  Dimensions (cm) (<FaRulerCombined />)
                </FormLabel>
                <MultiFieldRow style={{ gap: "10px" }}>
                  <AdminInput
                    type="number"
                    name="dimensions.length"
                    placeholder="Length"
                    value={product.dimensions?.length || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                  <AdminInput
                    type="number"
                    name="dimensions.width"
                    placeholder="Width"
                    value={product.dimensions?.width || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                  <AdminInput
                    type="number"
                    name="dimensions.height"
                    placeholder="Height"
                    value={product.dimensions?.height || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </MultiFieldRow>
              </FieldGroup>
            </MultiFieldRow>
          </MultiFieldRow>
        </FormSectionWrapper>

        {/* Section 3: Product Imagery */}
        <FormSectionWrapper title="Product Imagery">
          <FieldGroup $fullWidth>
            <ImageUploader
              initialImageUrls={product.imageUrls}
              onImagesChange={handleNewImagesChange}
              onImageUrlsDelete={handleExistingImageUrlDelete}
              maxFiles={10}
            />
          </FieldGroup>
        </FormSectionWrapper>

        {/* Section 4: Variations - Now integrating the ProductVariationsManager */}
        <FormSectionWrapper
          title="Product Variations (e.g., Color, Size)"
          actions={
            <AdminButton
              type="button"
              $variant="primary"
              onClick={() =>
                console.log("Generate combinations or add custom var")
              }
            >
              <FaPlus /> Generate/Add Variation
            </AdminButton>
          }
        >
          <ProductVariationsManager
            productVariations={product.variations}
            onVariationsChange={handleVariationsChange}
          />
        </FormSectionWrapper>

        {/* Section 5: Seller/Vendor & Publishing */}
        <FormSectionWrapper title="Seller & Publishing">
          <FieldGroup>
            <FormLabel htmlFor="sellerType">Listing Type</FormLabel>
            <AdminSelect
              id="sellerType"
              name="sellerType"
              value={product.sellerType}
              onChange={handleChange}
              options={[
                { value: "vendor", label: "Vendor" },
                { value: "individual_seller", label: "Individual Seller" },
              ]}
            />
          </FieldGroup>
          {product.sellerType === "vendor" && (
            <FieldGroup>
              <FormLabel htmlFor="vendorId">
                Vendor Name (<FaBuilding />)
              </FormLabel>
              <AdminSelect
                id="vendorId"
                name="vendorId"
                value={product.vendorId || ""}
                onChange={handleChange}
                options={dummyVendors.map((v) => ({
                  value: v.id,
                  label: v.name,
                }))}
              />
            </FieldGroup>
          )}
          {product.sellerType === "individual_seller" && (
            <FieldGroup>
              <FormLabel htmlFor="individualSellerId">
                Seller Name (<FaUserTie />)
              </FormLabel>
              <AdminSelect
                id="individualSellerId"
                name="individualSellerId"
                value={product.individualSellerId || ""}
                onChange={handleChange}
                options={dummySellers.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <FormLabel htmlFor="status">Product Status</FormLabel>
            <AdminSelect
              id="status"
              name="status"
              value={product.status}
              onChange={handleChange}
              options={[
                { value: "draft", label: "Draft" },
                { value: "pending_review", label: "Pending Review" },
                { value: "active", label: "Active" },
                { value: "out_of_stock", label: "Out of Stock" },
                { value: "archived", label: "Archived" },
                { value: "rejected", label: "Rejected" },
              ]}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="visibility">Visibility</FormLabel>
            <AdminSelect
              id="visibility"
              name="visibility"
              value={product.visibility}
              onChange={handleChange}
              options={[
                { value: "public", label: "Public" },
                { value: "hidden", label: "Hidden" },
              ]}
            />
          </FieldGroup>
        </FormSectionWrapper>

        {/* Section 6: Additional Attributes (Tags, Material, Color, Size) */}
        <FormSectionWrapper title="Additional Attributes (Tags, Material, Color, Size)">
          <FieldGroup>
            <FormLabel htmlFor="tags">
              Tags (comma separated) <FaTag />
            </FormLabel>
            <AdminInput
              type="text"
              id="tags"
              name="tags"
              value={product.tags?.join(", ") || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                }))
              }
              placeholder="e.g., modern, nordic, wood"
            />
          </FieldGroup>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="material">
                Material (<FaCube />)
              </FormLabel>
              <AdminInput
                type="text"
                id="material"
                name="material"
                value={product.material || ""}
                onChange={handleChange}
                placeholder="e.g., Oak, Wool, Ceramic"
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="color">
                Color (<FaPalette />)
              </FormLabel>
              <AdminInput
                type="text"
                id="color"
                name="color"
                value={product.color || ""}
                onChange={handleChange}
                placeholder="e.g., Charcoal, White, Sage Green"
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="size">
                Size (<FaList />)
              </FormLabel>{" "}
              {/* Changed icon from FaRulerCombined */}
              <AdminInput
                type="text"
                id="size"
                name="size"
                value={product.size || ""}
                onChange={handleChange}
                placeholder="e.g., Large, One Size"
              />
            </FieldGroup>
          </MultiFieldRow>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="hazardousMaterial">
              Hazardous Material{" "}
              <FaExclamationTriangle style={{ color: "orange" }} />
            </FormLabel>
            <input
              type="checkbox"
              id="hazardousMaterial"
              name="hazardousMaterial"
              checked={product.hazardousMaterial || false}
              onChange={handleChange}
              style={{ alignSelf: "flex-start", transform: "scale(1.2)" }}
            />
          </FieldGroup>
          <FieldGroup $fullWidth>
            <FormLabel htmlFor="ageRestricted">
              Age Restricted (<FaBan />)
            </FormLabel>
            <MultiFieldRow style={{ alignItems: "center", gap: "20px" }}>
              <input
                type="checkbox"
                id="ageRestricted"
                name="ageRestricted"
                checked={product.ageRestricted || false}
                onChange={handleChange}
                style={{ transform: "scale(1.2)" }}
              />
              {product.ageRestricted && (
                <FieldGroup style={{ flex: "unset" }}>
                  <FormLabel
                    htmlFor="ageRestrictionMinimum"
                    style={{ marginTop: "0" }}
                  >
                    Min. Age
                  </FormLabel>
                  <AdminInput
                    type="number"
                    id="ageRestrictionMinimum"
                    name="ageRestrictionMinimum"
                    value={product.ageRestrictionMinimum || ""}
                    onChange={handleChange}
                    min="0"
                    style={{ width: "80px" }}
                  />
                </FieldGroup>
              )}
            </MultiFieldRow>
          </FieldGroup>
        </FormSectionWrapper>
      </ProductDetailForm>

      {/* Sticky Action Bar */}
      <StickyActionBar>
        {!isNewProduct && (
          <AdminButton $variant="danger" onClick={handleDeleteProduct}>
            <FaTrashAlt /> Delete Product
          </AdminButton>
        )}
        <AdminButton $variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton $variant="primary" onClick={handleSubmit}>
          <FaCheckCircle /> {isNewProduct ? "Create Product" : "Save Changes"}
        </AdminButton>
      </StickyActionBar>
    </ProductDetailContainer>
  );
};

export default ProductDetail_;
