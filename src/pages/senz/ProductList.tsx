// src/components/Admin/ProductList/ProductList.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, type DefaultTheme } from 'styled-components'; // Import ThemeProvider
import {
  FaSearch,
  FaPlus,
  FaUpload,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner, // For loading state
  FaBoxOpen,  // For empty state
} from 'react-icons/fa';

import {
  ProductListGlobalStyle, // Optional global styles
  ProductPageContainer,
  PageHeader,
  ContentHeader,
  TitleActionsRow,
  TitleGroup,
  ActionsGroup,
  ProductActionButton,
  SearchContainer,
  SearchInput,
  TableContainer,
  StyledTable,
  ProductImageCell,
  StatusToggleContainer,
  TableActionsCell,
  PaginationContainer,
  MessageContainer,
} from './ProductList.styles';
import { adminProductListTheme } from './theme';
import { useNavigate } from 'react-router-dom';
// Define a type for our mock product data
interface Product {
  id: string;
  name: string;
  image: string; // URL to the image
  category: string;
  variants: number;
  sellingPrice: string; // e.g., "₹500 - ₹1500"
  status: boolean; // true for active, false for inactive
}

// Mock Product Data
const mockProducts: Product[] = [
  { id: '1', name: 'Oils', image: 'https://via.placeholder.com/40x40.png?text=Oil', category: 'Ghee & Oil', variants: 2, sellingPrice: '₹500 - ₹1500', status: true },
  { id: '2', name: 'Wheat', image: 'https://via.placeholder.com/40x40.png?text=Wheat', category: 'Flour & Grains', variants: 3, sellingPrice: '₹600 - ₹1200', status: true },
  { id: '3', name: 'Ladies dresses', image: 'https://via.placeholder.com/40x40.png?text=Dress', category: 'Ladies\' Wear', variants: 2, sellingPrice: '₹1200 - ₹3000', status: false },
  { id: '4', name: 'Men\'s dresses', image: 'https://via.placeholder.com/40x40.png?text=MD', category: 'Men\' Wear', variants: 4, sellingPrice: '₹1500 - ₹4000', status: true },
  { id: '5', name: 'Honey', image: 'https://via.placeholder.com/40x40.png?text=Honey', category: 'Spreads & Condiment', variants: 2, sellingPrice: '₹300 - ₹700', status: false },
  { id: '6', name: 'Manure', image: 'https://via.placeholder.com/40x40.png?text=Manure', category: 'Plants & Garden Supp...', variants: 2, sellingPrice: '₹200 - ₹500', status: true },
  { id: '7', name: 'Salt', image: 'https://via.placeholder.com/40x40.png?text=Salt', category: 'Masala / Spices', variants: 1, sellingPrice: '₹50 - ₹100', status: true },
  // Add more products to test pagination
  { id: '8', name: 'Premium Tea', image: 'https://via.placeholder.com/40x40.png?text=Tea', category: 'Beverages', variants: 5, sellingPrice: '₹400 - ₹900', status: true },
  { id: '9', name: 'Artisanal Coffee', image: 'https://via.placeholder.com/40x40.png?text=Coffee', category: 'Beverages', variants: 3, sellingPrice: '₹700 - ₹1800', status: false },
  { id: '10', name: 'Handmade Soap', image: 'https://via.placeholder.com/40x40.png?text=Soap', category: 'Bath & Body', variants: 6, sellingPrice: '₹150 - ₹450', status: true },
  { id: '11', name: 'Scented Candles', image: 'https://via.placeholder.com/40x40.png?text=Candle', category: 'Home Fragrance', variants: 4, sellingPrice: '₹350 - ₹1200', status: true },
];

const ITEMS_PER_PAGE = 7; // Number of items per page, as in the image

const ProductList: React.FC = () => {
  const theme = adminProductListTheme; // Use the defined theme
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // For demo purposes

  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);


  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleStatusToggle = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, status: !p.status } : p
      )
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max direct page numbers shown (e.g., 1, 2, 3, ..., 10 or 1, ..., 8, 9, 10)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) { // Show all pages if not too many
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page
      if (currentPage > halfPagesToShow + 2) {
        pageNumbers.push('...');
      }

      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage <= halfPagesToShow + 1) {
        endPage = Math.min(totalPages - 1, maxPagesToShow);
      }
      if (currentPage >= totalPages - halfPagesToShow) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - halfPagesToShow -1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages); // Always show last page
    }
    return pageNumbers;
  };


  return (
    <ThemeProvider theme={theme}>
      <ProductListGlobalStyle /> {/* Apply global styles if defined */}
      <ProductPageContainer>
        {/* This PageHeader would typically be part of a layout, but shown here for completeness */}
        <PageHeader>
          <div className="breadcrumbs">
            <a href="/admin">Home</a> / <span>Product</span>
          </div>
          <h1 className="page-title">Product</h1>
        </PageHeader>

        <ContentHeader>
          <TitleActionsRow>
            <TitleGroup>
              <h2>Manage Your Products</h2>
              <p>Add, edit or delete products to keep your catalog updated.</p>
            </TitleGroup>
            <ActionsGroup>
              <ProductActionButton $variant="secondary">
                <FaUpload /> Bulk Import
              </ProductActionButton>
              <ProductActionButton $variant="primary" onClick={ () => navigate("/admin/products/new")}>
                <FaPlus /> Add New Product
              </ProductActionButton>
            </ActionsGroup>
          </TitleActionsRow>
          <SearchContainer>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </ContentHeader>

        {isLoading ? (
          <MessageContainer>
            <FaSpinner className="fa-spin" />
            <p>Loading products...</p>
          </MessageContainer>
        ) : paginatedProducts.length === 0 ? (
           <MessageContainer>
            <FaBoxOpen />
            <p>{searchTerm ? "No products found matching your search." : "No products available."}</p>
          </MessageContainer>
        ) : (
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Variants</th>
                  <th>Selling Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td><ProductImageCell src={product.image} alt={product.name} /></td>
                    <td>{product.category}</td>
                    <td>{product.variants}</td>
                    <td>{product.sellingPrice}</td>
                    <td>
                      <StatusToggleContainer>
                        <input
                          type="checkbox"
                          checked={product.status}
                          onChange={() => handleStatusToggle(product.id)}
                        />
                        <span className="slider"></span>
                      </StatusToggleContainer>
                    </td>
                    <td>
                      <TableActionsCell>
                        <button title="View"><FaEye /></button>
                        <button title="Edit"><FaEdit /></button>
                        <button title="Delete" className="delete"><FaTrashAlt /></button>
                      </TableActionsCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
        )}

        {totalPages > 1 && !isLoading && paginatedProducts.length > 0 && (
          <PaginationContainer>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <FaChevronLeft />
            </button>
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="ellipsis">{page}</span>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <FaChevronRight />
            </button>
          </PaginationContainer>
        )}
      </ProductPageContainer>
    </ThemeProvider>
  );
};

export default ProductList;