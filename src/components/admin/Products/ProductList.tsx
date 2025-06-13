// src/components/Admin/Products/ProductList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaExclamationTriangle, FaSortUp, FaSortDown } from 'react-icons/fa';

import {
  ProductListContainer,
  ProductListHeader,
  HeaderTitle,
  ProductSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  ProductStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from './ProductList.styles';


import { AdminButton } from '../Dashboard/Common/Common.styles';

import { type Product, type ProductStatusFrontend, type StockStatusFrontend } from '../../../types/product'; 

import { useNotification } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';



const getProductImage = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}/?product,home,interior`;


const dummyProducts: Product[] = [
    { _id: 'p001', name: 'Élan Solid Oak Console', sku: 'ELOAK001', category: 'Living Room', price: 580, currency: 'USD', inventory: 15, stockStatus: 'in_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('consoledesk', 100, 100), vendorName: 'Artisan Wood Co.', createdAt: '2023-01-15T10:00:00Z' },
    { _id: 'p002', name: 'Ceramic Glaze Vase Set', sku: 'ELVASE002', category: 'Decor', price: 95, currency: 'USD', inventory: 0, stockStatus: 'out_of_stock', status: 'active', sellerType: 'individual_seller', mainImageUrl: getProductImage('vaseset', 100, 100), sellerName: 'Studio Potter', createdAt: '2023-02-20T11:30:00Z' },
    { _id: 'p003', name: 'Nordic Wool Rug - Azure', sku: 'ELRUG003', category: 'Living Room', price: 320, currency: 'USD', inventory: 5, stockStatus: 'in_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('woolrug', 100, 100), vendorName: 'Scandinavian Weaves', createdAt: '2023-03-01T14:00:00Z', salePrice: 280 },
    { _id: 'p004', name: 'Smart LED Floor Lamp with Dimmer', sku: 'ELLAMP004', category: 'Lighting', price: 180, currency: 'USD', inventory: 10, stockStatus: 'in_stock', status: 'pending_review', sellerType: 'vendor', mainImageUrl: getProductImage('ledlamp', 100, 100), vendorName: 'Bright Home', createdAt: '2023-03-10T09:15:00Z' },
    { _id: 'p005', name: 'Handcrafted Organic Ceramic Bowl', sku: 'ELBOWL005', category: 'Kitchen', price: 45, currency: 'USD', inventory: 30, stockStatus: 'in_stock', status: 'draft', sellerType: 'individual_seller', mainImageUrl: getProductImage('ceramicbowl', 100, 100), sellerName: 'Pottery Studio', createdAt: '2023-03-25T16:45:00Z' },
    { _id: 'p006', name: 'Velvet Dining Chairs (Set of 2)', sku: 'ELDIN006', category: 'Dining Room', price: 300, currency: 'USD', inventory: 8, stockStatus: 'in_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('diningchair', 100, 100), vendorName: 'Comfort Living', createdAt: '2023-04-01T11:00:00Z' },
    { _id: 'p007', name: 'Outdoor Bistro Set with Cushions', sku: 'ELOUT007', category: 'Outdoor', price: 450, currency: 'USD', inventory: 0, stockStatus: 'out_of_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('bistroset', 100, 100), vendorName: 'Garden Styles', createdAt: '2023-04-10T13:00:00Z' },
    { _id: 'p008', name: 'Eco-Friendly Bamboo Storage Baskets', sku: 'ELSTO008', category: 'Storage', price: 70, currency: 'USD', inventory: 25, stockStatus: 'in_stock', status: 'active', sellerType: 'individual_seller', mainImageUrl: getProductImage('bamboobaskets', 100, 100), sellerName: 'Eco Home Accents', createdAt: '2023-04-15T09:00:00Z', salePrice: 60 },
    { _id: 'p009', name: 'Modular Sectional Sofa with Ottoman', sku: 'ELSFA009', category: 'Living Room', price: 1800, currency: 'USD', inventory: 2, stockStatus: 'in_stock', status: 'pending_review', sellerType: 'vendor', mainImageUrl: getProductImage('sectionalsofa', 100, 100), vendorName: 'Modern Spaces', createdAt: '2023-04-20T17:00:00Z' },
    { _id: 'p010', name: 'Weighted Anti-Anxiety Blanket Luxe', sku: 'ELWEL010', category: 'Wellness', price: 140, currency: 'USD', inventory: 10, stockStatus: 'backorder', status: 'active', sellerType: 'individual_seller', mainImageUrl: getProductImage('weightedblanket', 100, 100), sellerName: 'Comfort Goods', createdAt: '2023-04-25T10:00:00Z' },
    { _id: 'p011', name: 'Mid-Century Modern Sideboard', sku: 'ELMOD011', category: 'Living Room', price: 750, currency: 'USD', inventory: 7, stockStatus: 'in_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('sideboard', 100, 100), vendorName: 'Heritage Furnishings', createdAt: '2023-05-01T08:00:00Z' },
    { _id: 'p012', name: 'Ceramic Pour-Over Coffee Set', sku: 'ELCOF012', category: 'Kitchen', price: 85, currency: 'USD', inventory: 12, stockStatus: 'in_stock', status: 'active', sellerType: 'individual_seller', mainImageUrl: getProductImage('coffeeset', 100, 100), sellerName: 'Brew Master Crafts', createdAt: '2023-05-05T10:00:00Z' },
    { _id: 'p013', name: 'Ergonomic Office Chair', sku: 'ELOFC013', category: 'Office', price: 420, currency: 'USD', inventory: 3, stockStatus: 'in_stock', status: 'active', sellerType: 'vendor', mainImageUrl: getProductImage('officechair', 100, 100), vendorName: 'Productive Spaces', createdAt: '2023-05-10T15:00:00Z', salePrice: 380 },
    { _id: 'p014', name: 'Japanese Style Rice Paper Lamp', sku: 'ELLMP014', category: 'Lighting', price: 110, currency: 'USD', inventory: 0, stockStatus: 'out_of_stock', status: 'archived', sellerType: 'individual_seller', mainImageUrl: getProductImage('ricepaperlamp', 100, 100), sellerName: 'Zen Lights', createdAt: '2023-05-15T12:00:00Z' },
    { _id: 'p015', name: 'Hand-Tufted Cotton Bath Mat', sku: 'ELBTH015', category: 'Bathroom', price: 35, currency: 'USD', inventory: 40, stockStatus: 'in_stock', status: 'active', sellerType: 'individual_seller', mainImageUrl: getProductImage('bathmat', 100, 100), sellerName: 'Soft Textiles', createdAt: '2023-05-20T10:00:00Z' },
];

type SortKey = 'name' | 'sku' | 'category' | 'price' | 'inventory' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface ProductListProps {
  onAddProduct: () => void;
  onEditProduct: (id: string) => void;
  handleDeleteProduct:(productId: string, productName: string)=>void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddProduct, onEditProduct, handleDeleteProduct }) => {
  const [products, setProducts] = useState<Product[]>(dummyProducts); // Using internal state to simulate deletion
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { showNotification } = useNotification(); // <--- NEW: Access showNotification hook

  // Memoized unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ['all', ...Array.from(categories).sort()];
  }, [products]);

  // Memoized unique statuses for filter dropdown
  const uniqueStatuses: ProductStatusFrontend[] = useMemo(() => {
    const statusesInUse = new Set<ProductStatusFrontend>(products.map(p => p.status));
    const allPossibleStatuses: ProductStatusFrontend[] = [
      'all', 'active', 'draft', 'pending_review', 'out_of_stock', 'archived', 'rejected', 'inactive'
    ];
    const finalStatuses = new Set<ProductStatusFrontend>(allPossibleStatuses.concat(Array.from(statusesInUse)));
    return ['all', ...Array.from(finalStatuses).filter(s => s !== 'all').sort()] as ProductStatusFrontend[];
  }, [products]);

  // Memoized filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortColumn) {
        filtered.sort((a, b) => {
            let aValue: any = a[sortColumn];
            let bValue: any = b[sortColumn];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                if (sortColumn === 'createdAt') {
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                    if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                } else {
                    if (aValue.toLowerCase() < bValue.toLowerCase()) return sortDirection === 'asc' ? -1 : 1;
                    if (aValue.toLowerCase() > bValue.toLowerCase()) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }

    return filtered;
  }, [products, searchTerm, filterCategory, filterStatus, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const indexOfFirstProduct = (currentPage - 1) * productsPerPage;
  const indexOfLastProduct = currentPage * productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handlers for search, filter, and pagination
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>, type: 'category' | 'status') => {
    if (type === 'category') setFilterCategory(e.target.value);
    else setFilterStatus(e.target.value);
    setCurrentPage(1);
  }, []);

  const paginate = useCallback((pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  const handleSort = useCallback((column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const getSortIcon = (column: SortKey) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  const handleEdit = (productId: string) => {
    onEditProduct(productId);
  };

  const handleDelete = (productId: string, productName: string) => { // Added productName for notification
    if (window.confirm(`Are you sure you want to delete product "${productName}" (ID: ${productId})? This action cannot be undone.`)) {
      // In a real app: send API request to delete.
      // If successful:

      setProducts(prevProducts => prevProducts.filter(p => p._id !== productId)); // Update local state for demo
      showNotification(`Product "${productName}" deleted successfully!`, "success"); // <--- NEW: Show success notification
      handleDeleteProduct(productId, productName);
      // If API fails:
      // showNotification(`Failed to delete product "${productName}".`, "error");
    } else {
        showNotification(`Deletion of "${productName}" cancelled.`, "info"); // <--- NEW: Show info notification
    }
  };

  const handleAddNew = () => {
    onAddProduct();
    showNotification("Navigating to new product creation form.", "info"); // <--- NEW: Show info notification
  };

  return (
    <ProductListContainer>
      <ProductListHeader>
        <HeaderTitle>All Products ({filteredAndSortedProducts.length})</HeaderTitle>
        <AdminButton $variant="primary" onClick={ () => navigate("/admin/products/new")}>
          <FaPlus /> Add New Product
        </AdminButton>
      </ProductListHeader>

      <FilterBar>
        <ProductSearchInput
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterCategory} onChange={(e) => handleFilterChange(e, 'category')}>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={filterStatus} onChange={(e) => handleFilterChange(e, 'status')}>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Product {getSortIcon('name')}</th>
              <th onClick={() => handleSort('sku')}>SKU {getSortIcon('sku')}</th>
              <th onClick={() => handleSort('category')}>Category {getSortIcon('category')}</th>
              <th onClick={() => handleSort('price')}>Price {getSortIcon('price')}</th>
              <th onClick={() => handleSort('inventory')}>Stock {getSortIcon('inventory')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th>Type</th>
              <th onClick={() => handleSort('createdAt')}>Created At {getSortIcon('createdAt')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <img src={product.mainImageUrl} alt={product.name} />
                    {product.name}
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>
                    {product.currency} {product.price.toFixed(2)}
                    {product.salePrice && product.salePrice < product.price ?
                        <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: '5px' }}>({product.salePrice.toFixed(2)})</span>
                        : ''}
                  </td>
                  <td>
                    {product.inventory === 0 && product.stockStatus !== 'backorder' ?
                      <span style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}>
                        <FaExclamationTriangle style={{ marginRight: '5px' }} /> Out of Stock
                      </span>
                      : product.inventory}
                  </td>
                  <td><ProductStatusBadge $status={product.status}>{product.status.replace(/_/g, ' ')}</ProductStatusBadge></td>
                  <td>
                    {product.sellerType === 'vendor' ? product.vendorName || 'Vendor' : product.sellerName || 'Individual Seller'}
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <TableActionButton onClick={() => handleEdit(product._id)} aria-label="Edit product">
                      <FaEdit />
                    </TableActionButton>
                    {/* Pass product.name to handleDelete for a better notification message */}
                    <TableActionButton onClick={() => handleDelete(product._id, product.name)} aria-label="Delete product">
                      <FaTrashAlt />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '50px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      <TableFooter>
        <span>Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products</span>
        <PaginationContainer>
          <PaginationButton className="prev-next-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</PaginationButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationButton key={i + 1} onClick={() => paginate(i + 1)} $active={currentPage === i + 1}>
              {i + 1}
            </PaginationButton>
          ))}
          <PaginationButton className="prev-next-btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</PaginationButton>
        </PaginationContainer>
      </TableFooter>
    </ProductListContainer>
  );
};

export default ProductList;