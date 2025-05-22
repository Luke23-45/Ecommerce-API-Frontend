// src/components/Admin/Orders/OrderList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEye, FaSyncAlt, FaTruck, FaMoneyBillWave, FaSortUp, FaSortDown } from 'react-icons/fa';

import {
  OrderListContainer,
  OrderListHeader,
  HeaderTitle,
  OrderSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  OrderStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from './OrderList.styles';


import type{ Order, PaymentStatus, FulfillmentStatus } from '@/types/order';

// REMOVED: Dummy Orders data is now sourced from AdminPage.tsx

interface OrderListProps {
  ordersData: Order[]; // <--- NEW: Accept orders data via prop
  onViewOrderDetails: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ ordersData, onViewOrderDetails }) => {
  // Use `ordersData` from props as the source for the list
  const [orders, setOrders] = useState<Order[]>(ordersData); // Use useState to allow internal filtering/sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterFulfillmentStatus, setFilterFulfillmentStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Number of orders per page
  const [sortColumn, setSortColumn] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  type SortKey = '_id' | 'customerName' | 'totalAmount' | 'createdAt' | 'paymentStatus' | 'fulfillmentStatus';
  type SortDirection = 'asc' | 'desc';

  // IMPORTANT: Re-sync `orders` state if `ordersData` prop changes (e.g., if a search or mutation higher up filters)
  useEffect(() => {
      setOrders(ordersData);
  }, [ordersData]);


  // Memoized unique statuses for filter dropdowns
  const uniquePaymentStatuses: (PaymentStatus | 'all')[] = useMemo(() => {
    return ['all', 'paid', 'pending', 'refunded', 'failed', 'canceled'].sort();
  }, []);

  const uniqueFulfillmentStatuses: (FulfillmentStatus | 'all')[] = useMemo(() => {
    return ['all', 'processing', 'shipped', 'delivered', 'canceled', 'returned'].sort();
  }, []);


  // Memoized filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus;
      const matchesFulfillmentStatus = filterFulfillmentStatus === 'all' || order.fulfillmentStatus === filterFulfillmentStatus;
      
      return matchesSearch && matchesPaymentStatus && matchesFulfillmentStatus;
    });

    // Apply sorting
    if (sortColumn) {
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === 'customerName') {
                aValue = a.customer.customerName;
                bValue = b.customer.customerName;
            } else if (sortColumn === 'totalAmount') {
                aValue = a.totalAmount;
                bValue = b.totalAmount;
            } else {
                aValue = a[sortColumn as Exclude<SortKey, 'customerName' | 'totalAmount'>];
                bValue = b[sortColumn as Exclude<SortKey, 'customerName' | 'totalAmount'>];
            }

            // Type-specific comparison logic
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                if (sortColumn === 'createdAt') { // Date string comparison
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                    if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                } else { // Generic string comparison
                    if (aValue.toLowerCase() < bValue.toLowerCase()) return sortDirection === 'asc' ? -1 : 1;
                    if (aValue.toLowerCase() > bValue.toLowerCase()) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') { // Number comparison
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0; // Fallback for other types
        });
    }

    return filtered;
  }, [orders, searchTerm, filterPaymentStatus, filterFulfillmentStatus, sortColumn, sortDirection]); // Dependency `orders` updated


  // FIX: Define these pagination variables outside the useMemo
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);
  const indexOfFirstProduct = (currentPage - 1) * ordersPerPage; // Corrected: Start index for slicing
  const indexOfLastProduct = currentPage * ordersPerPage;
  const currentOrders = filteredAndSortedOrders.slice(indexOfFirstProduct, indexOfLastProduct);


  // Handlers for search, filter, and pagination changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search/filter
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>, type: 'payment' | 'fulfillment') => {
    if (type === 'payment') setFilterPaymentStatus(e.target.value as PaymentStatus | 'all');
    else setFilterFulfillmentStatus(e.target.value as FulfillmentStatus | 'all');
    setCurrentPage(1);
  }, []);

  const paginate = useCallback((pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  // Handler for sorting
  const handleSort = useCallback((column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending when changing sort column
    }
  }, [sortColumn]);

  const getSortIcon = (column: SortKey) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return null; // No icon if not sorted by this column
  };

  const handleViewDetails = (orderId: string) => {
    onViewOrderDetails(orderId); // Call parent handler to navigate to detail page
  };

  return (
    <OrderListContainer>
      <OrderListHeader>
        <HeaderTitle>All Orders ({filteredAndSortedOrders.length})</HeaderTitle>
      </OrderListHeader>

      <FilterBar>
        <OrderSearchInput
          type="text"
          placeholder="Search by Order ID or Customer Name/Email..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterPaymentStatus} onChange={(e) => handleFilterChange(e, 'payment')}>
          {uniquePaymentStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Payment Statuses' : status.replace('_', ' ')}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={filterFulfillmentStatus} onChange={(e) => handleFilterChange(e, 'fulfillment')}>
          {uniqueFulfillmentStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Fulfillment Statuses' : status.replace('_', ' ')}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')}>Order ID {getSortIcon('_id')}</th>
              <th onClick={() => handleSort('customerName')}>Customer {getSortIcon('customerName')}</th>
              <th onClick={() => handleSort('createdAt')}>Order Date {getSortIcon('createdAt')}</th>
              <th onClick={() => handleSort('totalAmount')}>Total {getSortIcon('totalAmount')}</th>
              <th onClick={() => handleSort('paymentStatus')}>Payment Status {getSortIcon('paymentStatus')}</th>
              <th onClick={() => handleSort('fulfillmentStatus')}>Fulfillment Status {getSortIcon('fulfillmentStatus')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customer.customerName}<br /><span style={{ fontSize: '0.8em', color: '#888' }}>{order.customer.customerEmail}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.currency} {order.totalAmount.toFixed(2)}</td>
                  <td><OrderStatusBadge $status={order.paymentStatus}>{order.paymentStatus.replace(/_/g, ' ')}</OrderStatusBadge></td>
                  <td><OrderStatusBadge $status={order.fulfillmentStatus}>{order.fulfillmentStatus.replace(/_/g, ' ')}</OrderStatusBadge></td>
                  <td>
                    <TableActionButton onClick={() => handleViewDetails(order._id)} aria-label="View order details">
                      <FaEye />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      <TableFooter>
        <span>Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders</span>
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
    </OrderListContainer>
  );
};

export default OrderList;