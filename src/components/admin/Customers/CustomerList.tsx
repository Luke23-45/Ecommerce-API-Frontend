// src/components/Admin/Customers/CustomerList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEye, FaSortUp, FaSortDown, FaUserPlus, FaUserSlash, FaLock } from 'react-icons/fa';

import {
  CustomerListContainer,
  CustomerListHeader,
  HeaderTitle,
  CustomerSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  CustomerStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from './CustomerList.styles';



import type { Customer, CustomerAccountStatus } from '@/types/customer';

// REMOVED: Dummy Customers data is now sourced from AdminPage.tsx
// REMOVED: mockCustomerId and getAvatarUrl are also now in AdminPage.tsx

type SortKey = 'firstName' | 'email' | 'registrationDate' | 'totalOrders' | 'totalSpent' | 'accountStatus';
type SortDirection = 'asc' | 'desc';

const mockId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
const getGenericImage = (
  seed: string,
  width: number = 800,
  height: number = 450,
  tags: string = ""
) =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, "-")}/${width}/${height}/?${tags}`;


interface CustomerListProps {
  customersData: Customer[]; 
  onViewCustomerDetails: (customerId: string) => void;
  onDeleteCustomer: (customerId: string, customerName: string) => void;
  // onAddNewCustomer?: () => void;
}


const customersData : Customer[] = [
  {
    _id: mockId("CUST"),
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "+1-555-101-1111",
    avatarUrl: getGenericImage("alice-j", 150, 150),
    registrationDate: "2022-01-10T09:00:00Z",
    lastLoginDate: "2023-10-25T14:30:00Z",
    totalOrders: 5,
    totalSpent: 750.5,
    accountStatus: "active",
    addresses: [
      {
        street: "123 Maple Ave",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA",
        type: "shipping",
        isDefault: true,
      },
      {
        street: "456 Oak Dr",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA",
        type: "billing",
      },
    ],
  },
  {
    _id: mockId("CUST"),
    firstName: "Bob",
    lastName: "Williams",
    email: "bob@example.com",
    phone: "+1-555-202-2222",
    avatarUrl: getGenericImage("bob-w", 150, 150),
    registrationDate: "2022-03-01T11:30:00Z",
    lastLoginDate: "2023-09-20T10:00:00Z",
    totalOrders: 1,
    totalSpent: 280.0,
    accountStatus: "active",
    addresses: [
      {
        street: "45 Oak Lane",
        city: "Greenville",
        state: "SC",
        zipCode: "29601",
        country: "USA",
        type: "shipping",
        isDefault: true,
      },
    ],
  },
  {
    _id: mockId("CUST"),
    firstName: "Carol",
    lastName: "Davis",
    email: "carol@example.com",
    phone: "+1-555-303-3333",
    avatarUrl: getGenericImage("carol-d", 150, 150),
    registrationDate: "2023-01-05T08:00:00Z",
    lastLoginDate: "2023-10-15T09:00:00Z",
    totalOrders: 2,
    totalSpent: 180.0,
    accountStatus: "pending_verification",
  },
];

const CustomerList: React.FC<CustomerListProps> = ({ onViewCustomerDetails }) => {
  // Use `customersData` from props as the initial source for the list
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccountStatus, setFilterAccountStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortKey>('registrationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // IMPORTANT: Re-sync `customers` state if `customersData` prop changes
  // This ensures filters/sorts work on the latest data provided by parent
  useEffect(() => {
      setCustomers(customersData);
  }, [customersData]);


  // Memoized unique statuses for filter dropdown
  const uniqueAccountStatuses: (CustomerAccountStatus | 'all')[] = useMemo(() => {
    return ['all', 'active', 'suspended', 'blocked', 'pending_verification'].sort();
  }, []);

  // Memoized filtered and sorted customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`;
      const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (customer.phone && customer.phone.includes(searchTerm)); // Search phone if exists
      const matchesAccountStatus = filterAccountStatus === 'all' || customer.accountStatus === filterAccountStatus;
      
      return matchesSearch && matchesAccountStatus;
    });

    // Apply sorting
    if (sortColumn) {
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === 'firstName') {
                aValue = a.firstName.toLowerCase();
                bValue = b.firstName.toLowerCase();
            } else if (sortColumn === 'email') {
                aValue = a.email.toLowerCase();
                bValue = b.email.toLowerCase();
            } else if (sortColumn === 'totalOrders' || sortColumn === 'totalSpent') {
                aValue = a[sortColumn];
                bValue = b[sortColumn];
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue; // Numeric sort
            } else if (sortColumn === 'registrationDate') { // Date string comparison
                const dateA = new Date(a.registrationDate);
                const dateB = new Date(b.registrationDate);
                return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            } else if (sortColumn === 'accountStatus') {
                 aValue = a.accountStatus.toLowerCase();
                 bValue = b.accountStatus.toLowerCase();
            } else { // Fallback for direct property string comparison
                aValue = (a[sortColumn as Exclude<SortKey, 'totalOrders' | 'totalSpent' | 'registrationDate' | 'accountStatus'>] as string).toLowerCase();
                bValue = (b[sortColumn as Exclude<SortKey, 'totalOrders' | 'totalSpent' | 'registrationDate' | 'accountStatus'>] as string).toLowerCase();
            }
            
            // Default string comparison for others
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return filtered;
  }, [customers, searchTerm, filterAccountStatus, sortColumn, sortDirection]); // `customers` state is a dependency


  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / customersPerPage);
  const indexOfFirstCustomer = (currentPage - 1) * customersPerPage;
  const indexOfLastCustomer = currentPage * customersPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Handlers for search, filter, and pagination changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAccountStatus(e.target.value as CustomerAccountStatus | 'all');
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
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const getSortIcon = (column: SortKey) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  const handleViewDetails = (customerId: string) => {
    onViewCustomerDetails(customerId); // Call parent handler to navigate
  };

  return (
    <CustomerListContainer>
      <CustomerListHeader>
        <HeaderTitle>All Customers ({filteredAndSortedCustomers.length})</HeaderTitle>
        {/* Potentially add "Add New Customer" button here */}
        {/* <AdminButton $variant="primary" onClick={onAddNewCustomer}>
          <FaUserPlus /> Add New Customer
        </AdminButton> */}
      </CustomerListHeader>

      <FilterBar>
        <CustomerSearchInput
          type="text"
          placeholder="Search by Name, Email, or Phone..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterAccountStatus} onChange={handleFilterChange}>
          {uniqueAccountStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Account Statuses' : status.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')}>Customer Name {getSortIcon('firstName')}</th>
              <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('phone')}>Phone</th>
              <th onClick={() => handleSort('totalOrders')}>Orders {getSortIcon('totalOrders')}</th>
              <th onClick={() => handleSort('totalSpent')}>Spent {getSortIcon('totalSpent')}</th>
              <th onClick={() => handleSort('registrationDate')}>Registered {getSortIcon('registrationDate')}</th>
              <th onClick={() => handleSort('accountStatus')}>Status {getSortIcon('accountStatus')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <img src={customer.avatarUrl || `https://i.pravatar.cc/150?u=${customer._id}`} alt={`${customer.firstName} ${customer.lastName}`} />
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{customer.totalOrders}</td>
                  <td>${customer.totalSpent.toFixed(2)}</td>
                  <td>{new Date(customer.registrationDate).toLocaleDateString()}</td>
                  <td><CustomerStatusBadge $status={customer.accountStatus}>{customer.accountStatus.replace(/_/g, ' ')}</CustomerStatusBadge></td>
                  <td>
                    <TableActionButton onClick={() => handleViewDetails(customer._id)} aria-label="View customer details">
                      <FaEye />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '50px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  No customers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      <TableFooter>
        <span>Showing {indexOfFirstCustomer + 1} - {Math.min(indexOfLastCustomer, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} customers</span>
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
    </CustomerListContainer>
  );
};

export default CustomerList;