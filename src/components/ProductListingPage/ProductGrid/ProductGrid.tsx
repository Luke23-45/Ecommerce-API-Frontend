// src/components/ProductListing/ProductGrid.tsx
import React from 'react';
import {type Product } from '@/data/mockData';
import * as S from './ProductGrid.styles';
import ProductCard from '../ProductCard/ProductCard';
import {type JSX } from 'react';

interface ProductGridProps {
  products: Product[];
  columnsInCurrentView: number; 
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, columnsInCurrentView }) => {
  if (!products || products.length === 0) {
    return <S.NoProductsMessage>There are no products matching your criteria.</S.NoProductsMessage>;
  }

  // Safety check for columnsInCurrentView, should be at least 1
  const safeColumns = Math.max(1, columnsInCurrentView);

  const gridItems: JSX.Element[] = [];
  products.forEach((product, index) => {
    gridItems.push(<ProductCard key={product.id} product={product} />);

    // Condition to add a divider:
    // 1. It's the end of a "conceptual row" (index + 1 is a multiple of safeColumns)
    // 2. It's NOT the very last item in the entire products list
    const isEndOfRow = (index + 1) % safeColumns === 0;
    const isNotLastItemInList = index < products.length - 1;

    if (isEndOfRow && isNotLastItemInList) {
      // Use a unique key for the divider, e.g., based on the product it follows
      gridItems.push(<S.RowDivider key={`divider-${product.id}`} />);
    }
  });

  return (
    <S.GridContainer>
      {gridItems}
    </S.GridContainer>
  );
};

export default ProductGrid;