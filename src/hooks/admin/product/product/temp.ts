const transformApiProductToPageData = (product: any): {
  mainProductImages: ProductImage[];
  productInfoData: ProductInfoData;
  breadcrumbItems: BreadcrumbLink[];
} => {
  const productInfoData: any = {
    id: product._id,
    name: product.name || '',
    brand: { name: "Élan Signature", link: "/brands/elan-signature" },
      shippingTeaser: "Complimentary carbon-neutral shipping.",
    shortDescription: product.shortDescription || '',
    reviewSummary: {
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
    },

        descriptionMarkdown:
      "## Product Story\nCrafted from the finest Belgian flax...",
    tags: product.tags || ["Linen", "Throw", "Organic", "Handcrafted"], 
    options: [], 
    variants: product.variations.map(v => ({
      id: v._id!,
      sku: v.sku,
      price: v.salePrice ?? v.price,
      originalPrice: v.salePrice ? v.price : undefined,
      stock: v.inventory,
      isAvailable: ['in_stock', 'backorder', 'pre_order'].includes(v.stockStatus),
      imageUrls:  [...v.imageUrls,"https://picsum.photos/seed/linenmain/800/1000","https://picsum.photos/seed/linendetail/800/1000","https://picsum.photos/seed/lifestyle001/800/1000"], 
      options: v.attributeOptions.reduce((acc, opt) => {
        acc[opt.attributeName] = opt.optionValue;
        return acc;
      }, {} as Record<string, string>),
    })),

    fullDescriptionHTML:product.description,
        specifications: {
      Scent: "Lavender & Cedarwood",
      BurnTime: "Approx. 50 hours",
      WaxType: "100% Soy Wax",
    },
  };

  const optionsMap = new Map<string, { id: string, name: string, values: Map<string, { id: string, value: string, swatch?: string }> }>();
  product.variations.forEach(variant => {
    variant.attributeOptions.forEach(attrOpt => {
      if (!optionsMap.has(attrOpt.attributeName)) { // Use Name as the key for the group
        optionsMap.set(attrOpt.attributeName, { id: attrOpt.attributeName, name: attrOpt.attributeName, values: new Map() });
      }
      const option = optionsMap.get(attrOpt.attributeName)!;
      if (!option.values.has(attrOpt.optionValue)) { // Use Value as the key for the specific option
        option.values.set(attrOpt.optionValue, { id: attrOpt.optionValue, value: attrOpt.optionValue, swatch: attrOpt.optionSwatchValue });
      }
    });
  });
  productInfoData.options = Array.from(optionsMap.values()).map(opt => ({
    ...opt,
    displayType: opt.values.values().next().value?.swatch ? 'swatch' : 'button',
    values: Array.from(opt.values.values()),
  }));

  
  console.log("Mainimages", product.imageUrls)

  const mainProductImages: ProductImage[] = product.imageUrls.map((url, index) => ({
    id: `${product._id}-main-${index}`,
    src: url,
    alt: `${product.name} - image ${index + 1}`,
    thumbnailSrc: url,
  }));

  const breadcrumbItems: BreadcrumbLink[] = [
    { label: "Home", link: "/" },
    { label: "Category", link: "/collections/category-slug" }, // Placeholder
    { label: product.name },
  ];

  return { mainProductImages, productInfoData, breadcrumbItems };
};