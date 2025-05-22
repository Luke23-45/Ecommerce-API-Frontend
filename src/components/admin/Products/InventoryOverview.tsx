// src/components/Admin/Products/InventoryOverview.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaBoxes, FaSyncAlt, FaFileExcel, FaEdit, FaCheck, FaTimes, FaSortUp, FaSortDown, FaExclamationTriangle } from 'react-icons/fa'; 

import {
  InventoryOverviewContainer,
  OverviewHeader,
  HeaderTitle,
  InventorySearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  InventoryStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from './InventoryOverview.styles';


import { AdminButton } from '../Dashboard/Common/Common.styles';
import { useNotification } from '@/contexts/NotificationContext';
import type { Product, ProductVariation } from '@/types/product'; 


// --- Helper function to normalize/flatten products into inventory items ---
// A product might have variations, each with its own inventory.
// This function transforms the 'Product' data into a list of 'InventoryItem' objects.
interface InventoryItem {
    id: string; // Product _id + Variation _id (if exists)
    productId: string;
    productName: string;
    productImageUrl?: string;
    productSku: string; // Base product SKU
    variationId?: string;
    variationAttributes?: { name: string; value: string }[];
    variationSku?: string;
    currentStock: number;
    lowStockThreshold: number; // Inherited from product or specific to variation
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder';
    vendorName?: string;
    sellerName?: string;
    // For inline editing:
    originalStock: number; // Store original stock for comparison/revert
    isEditing: boolean; // UI state for row editing
}

const flattenProductsToInventoryItems = (products: Product[], globalLowStockThreshold: number): InventoryItem[] => {
    const inventoryItems: InventoryItem[] = [];

    products.forEach(product => {
        // If product has variations, each variation is an inventory item
        if (product.variations && product.variations.length > 0) {
            product.variations.forEach(variation => {
                const stockStatus = calculateInventoryStatus(variation.inventory, globalLowStockThreshold, variation.stockStatus);
                inventoryItems.push({
                    id: `${product._id}-${variation._id}`,
                    productId: product._id,
                    productName: product.name,
                    productImageUrl: variation.imageUrls[0] || product.mainImageUrl, // Use variation image or main product image
                    productSku: product.sku,
                    variationId: variation._id,
                    variationAttributes: variation.attributes,
                    variationSku: variation.sku,
                    currentStock: variation.inventory,
                    lowStockThreshold: globalLowStockThreshold, // Can be specific to variant if schema supports
                    stockStatus: stockStatus,
                    vendorName: product.vendorName,
                    sellerName: product.sellerName,
                    originalStock: variation.inventory,
                    isEditing: false,
                });
            });
        } else {
            // If product has no variations, the product itself is an inventory item
            const stockStatus = calculateInventoryStatus(product.inventory, globalLowStockThreshold, product.stockStatus);
            inventoryItems.push({
                id: product._id,
                productId: product._id,
                productName: product.name,
                productImageUrl: product.mainImageUrl,
                productSku: product.sku,
                currentStock: product.inventory,
                lowStockThreshold: globalLowStockThreshold,
                stockStatus: stockStatus,
                vendorName: product.vendorName,
                sellerName: product.sellerName,
                originalStock: product.inventory,
                isEditing: false,
            });
        }
    });

    return inventoryItems;
};

// Helper to determine accurate stock status for display (more granular than backend status)
const calculateInventoryStatus = (stock: number, threshold: number, backendStatus: string): 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder' => {
    if (backendStatus === 'backorder') return 'backorder';
    if (stock <= 0) return 'out_of_stock';
    if (stock <= threshold) return 'low_stock';
    return 'in_stock';
};


// Props for InventoryOverview (accepts all products data)
interface InventoryOverviewProps {
    allProductsData: Product[]; // Passed from AdminPage.tsx
    globalLowStockThreshold?: number; // e.g., from GeneralSettings, default 10
    // onAdjustStock?: (productId: string, variationId: string | undefined, newStock: number) => void;
    // onBulkImport?: () => void;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({ allProductsData, globalLowStockThreshold = 10 }) => {
  // All products data is transformed into flattened inventory items here.
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    () => flattenProductsToInventoryItems(allProductsData, globalLowStockThreshold)
  );

  // Sync state if productsData changes from parent
  useEffect(() => {
    setInventoryItems(flattenProductsToInventoryItems(allProductsData, globalLowStockThreshold));
  }, [allProductsData, globalLowStockThreshold]);


  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortKey>('productName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { showNotification } = useNotification(); // For notifications

  type SortKey = 'productName' | 'productSku' | 'variationSku' | 'currentStock' | 'stockStatus' | 'vendorName' | 'sellerName';
  type SortDirection = 'asc' | 'desc';


  // Memoized unique categories (for filter dropdown)
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allProductsData.map(p => p.category));
    return ['all', ...Array.from(categories).sort()];
  }, [allProductsData]);

  // Memoized unique stock statuses for filter dropdown
  const uniqueStockStatuses: ('all' | InventoryItem['stockStatus'])[] = useMemo(() => {
    return ['all', 'in_stock', 'low_stock', 'out_of_stock', 'backorder'].sort();
  }, []);


  // Memoized filtered and sorted inventory items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = inventoryItems.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.variationSku && item.variationSku.toLowerCase().includes(searchTerm.toLowerCase()));
      // Category filter needs to look at the original product for category info.
      // This is less efficient than passing category info into InventoryItem or pre-filtering.
      const productForCategory = allProductsData.find(p => p._id === item.productId);
      const matchesCategory = filterCategory === 'all' || (productForCategory && productForCategory.category === filterCategory);
      
      const matchesStockStatus = filterStockStatus === 'all' || item.stockStatus === filterStockStatus;
      
      return matchesSearch && matchesCategory && matchesStockStatus;
    });

    // Apply sorting
    if (sortColumn) {
        filtered.sort((a, b) => {
            let aValue: any = a[sortColumn];
            let bValue: any = b[sortColumn];

            // Specific handling for SKU or Variation SKU comparison (if they exist)
            if (sortColumn === 'productSku' && (!aValue || !bValue)) { // Fallback if sku is for variation only
                aValue = a.productSku; bValue = b.productSku;
                if(a.variationSku) aValue = a.variationSku;
                if(b.variationSku) bValue = b.variationSku;
            }
            if (sortColumn === 'variationSku' && (!aValue || !bValue)) {
                aValue = a.variationSku || a.productSku; bValue = b.variationSku || b.productSku;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') { // Numeric comparison for stock
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            // For status: compare directly
            if (sortColumn === 'stockStatus') {
                 // Define a custom order for status
                 const statusOrder = ['out_of_stock', 'low_stock', 'backorder', 'in_stock'];
                 const orderA = statusOrder.indexOf(aValue);
                 const orderB = statusOrder.indexOf(bValue);
                 return sortDirection === 'asc' ? orderA - orderB : orderB - orderA;
            }
            return 0;
        });
    }

    return filtered;
  }, [inventoryItems, searchTerm, filterCategory, filterStockStatus, sortColumn, sortDirection, allProductsData]);


  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers for filters and pagination
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>, type: 'category' | 'stockStatus') => {
    if (type === 'category') setFilterCategory(e.target.value);
    else setFilterStockStatus(e.target.value as InventoryItem['stockStatus'] | 'all');
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

  // --- Inline Editing Handlers ---
  const handleEditStock = useCallback((itemId: string) => {
      setInventoryItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isEditing: true } : item
      ));
  }, []);

  const handleStockInputChange = useCallback((itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      setInventoryItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, currentStock: parseInt(e.target.value) || 0 } : item
      ));
  }, []);

  const handleSaveStock = useCallback((itemId: string) => {
      const itemToSave = inventoryItems.find(item => item.id === itemId);
      if (itemToSave) {
          console.log(`Saving new stock for ${itemToSave.productName} (${itemToSave.variationSku || itemToSave.productSku}): ${itemToSave.currentStock}`);
          // In real app, call API to save
          // On success, update isEditing to false
          setInventoryItems(prev => prev.map(item => 
              item.id === itemId ? { ...item, isEditing: false, originalStock: item.currentStock } : item // Save new stock as original too
          ));
          showNotification(`Stock for ${itemToSave.productName} updated to ${itemToSave.currentStock}!`, 'success');
      }
  }, [inventoryItems, showNotification]);

  const handleCancelEditStock = useCallback((itemId: string) => {
      setInventoryItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isEditing: false, currentStock: item.originalStock } : item // Revert to original
      ));
      showNotification('Stock adjustment cancelled.', 'info');
  }, [showNotification]);


  return (
    <InventoryOverviewContainer>
      <OverviewHeader>
        <HeaderTitle>Product Inventory ({filteredAndSortedItems.length})</HeaderTitle>
        <AdminButton $variant="primary" onClick={() => showNotification("Performing global stock sync (demo)...", "info", 3000)}>
          <FaSyncAlt /> Sync Stock
        </AdminButton>
      </OverviewHeader>

      <FilterBar>
        <InventorySearchInput
          type="text"
          placeholder="Search by Product Name or SKU..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterCategory} onChange={(e) => handleFilterChange(e, 'category')}>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={filterStockStatus} onChange={(e) => handleFilterChange(e, 'stockStatus')}>
          {uniqueStockStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Stock Statuses' : status.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th>Product/Variant</th>
              <th onClick={() => handleSort('productSku')}>SKU {getSortIcon('productSku')}</th>
              <th>Attributes</th>
              <th onClick={() => handleSort('currentStock')}>Stock {getSortIcon('currentStock')}</th>
              <th onClick={() => handleSort('stockStatus')}>Status {getSortIcon('stockStatus')}</th>
              <th>Vendor/Seller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.productImageUrl && <img src={item.productImageUrl} alt={item.productName} />}
                    {item.productName}
                  </td>
                  <td>{item.variationSku || item.productSku}</td>
                  <td>
                    {item.variationAttributes && item.variationAttributes.length > 0 ? (
                      item.variationAttributes.map(attr => `${attr.name}: ${attr.value}`).join('; ')
                    ) : 'N/A'}
                  </td>
                  <td>
                    {item.isEditing ? (
                        <input
                            type="number"
                            value={item.currentStock}
                            onChange={(e) => handleStockInputChange(item.id, e)}
                            min="0"
                            style={{width: '60px'}}
                        />
                    ) : (
                        <span>{item.currentStock}</span>
                    )}
                  </td>
                  <td><InventoryStatusBadge $status={item.stockStatus}>{item.stockStatus.replace(/_/g, ' ')}</InventoryStatusBadge></td>
                  <td>{item.vendorName || item.sellerName || 'N/A'}</td>
                  <td>
                    {item.isEditing ? (
                      <>
                        <TableActionButton onClick={() => handleSaveStock(item.id)} title="Save changes"><FaCheck /></TableActionButton>
                        <TableActionButton onClick={() => handleCancelEditStock(item.id)} title="Cancel edit"><FaTimes /></TableActionButton>
                      </>
                    ) : (
                      <TableActionButton onClick={() => handleEditStock(item.id)} title="Edit stock">
                        <FaEdit />
                      </TableActionButton>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  No inventory items found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      <TableFooter>
        <span>Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAndSortedItems.length)} of {filteredAndSortedItems.length} items</span>
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
    </InventoryOverviewContainer>
  );
};

export default InventoryOverview;