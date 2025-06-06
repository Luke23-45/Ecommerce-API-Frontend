// src/components/admin/Application/SellerApplications/SellerApplicationList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { FaEye, FaSortUp, FaSortDown, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUserPlus, FaSpinner } from 'react-icons/fa';

import {
  SellerApplicationListContainer,
  SellerApplicationListHeader,
  HeaderTitle,
  ApplicationSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  ApplicationStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
  ActionButtonsGroup,
  LoadingOverlay,
  ErrorMessage,
} from './SellerApplicationList.styles';

import { AdminButton } from '../../Dashboard/Common/Common.styles'; // Assuming this path is correct relative to this file

import type { IIndividualSellerProfile, PaginatedSellerApplicationsResponse } from '@/types/seller';
// It's crucial that useFilterIndividualSellerApplication hook expects its first argument
// to be an object of query parameters that it will then use to construct the URL.
import { useFilterIndividualSellerApplication } from '@/hooks/admin/application/useSeller'; // Adjust path as needed

type SortableFields = 'sellerName' | 'createdAt' | 'status' | 'estimatedMonthlySales' | 'legalFirstName' | 'userId';
type SortDirection = 'asc' | 'desc';
type ApplicationAction = 'approve' | 'reject' | 'suspend'; // From your previous versions

interface SellerApplicationListProps {
  onViewDetails: (applicationId: string) => void;
  onApplicationAction: (
    applicationId: string,
    applicationType: 'seller' | 'vendor',
    action: ApplicationAction,
    applicantName: string
  ) => void;
  onAddNewApplication?: () => void;
}

const ITEMS_PER_PAGE_DEFAULT = 10; // Default for the UI if API has its own default

const SellerApplicationList: React.FC<SellerApplicationListProps> = ({
  onViewDetails,
  onApplicationAction,
  onAddNewApplication,
}) => {
  const theme = useTheme();

  // --- UI State for Filters, Sort, Pagination ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | IIndividualSellerProfile['status']>('all');
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed for API
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT); // For API limit

  const [sortConfig, setSortConfig] = useState<{ key: SortableFields; direction: SortDirection }>({
    key: 'createdAt', // Default sort field
    direction: 'desc',  // Default sort direction
  });

  // --- Construct API Query Parameters Object ---
  // This object will be passed to the React Query hook.
  // The hook's queryFn is responsible for taking this object and forming the URL string.
  const apiQueryParameters = useMemo(() => {
    const queryParams: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: itemsPerPage,
      lean: true, // As per API documentation
    };

    // Filter object construction
    const filterObj: Record<string, any> = {};
    if (filterStatus !== 'all') {
      filterObj.status = filterStatus;
    }
    if (searchTerm.trim() !== '') {
      // Using $or for multi-field search with regex, as per API example
      filterObj.$or = [
        { sellerName: { $regex: searchTerm.trim(), $options: 'i' } },
        { legalFirstName: { $regex: searchTerm.trim(), $options: 'i' } },
        { legalLastName: { $regex: searchTerm.trim(), $options: 'i' } },
        { userId: { $regex: searchTerm.trim(), $options: 'i' } }, // Assuming userId is a string field in DB
        // Add other fields to search here if your backend supports them in $or
      ];
    }
    // Add more specific filters here based on your UI, e.g., date ranges
    // if (dateFilter.startDate) {
    //   filterObj.createdAt = { ...filterObj.createdAt, $gte: dateFilter.startDate };
    // }

    if (Object.keys(filterObj).length > 0) {
      queryParams.filter = JSON.stringify(filterObj);
    }

    // Sort object construction
    if (sortConfig.key) {
      const sortObj: Record<string, 1 | -1> = {
        [sortConfig.key]: sortConfig.direction === 'asc' ? 1 : -1,
      };
      queryParams.sort = JSON.stringify(sortObj);
    }

    // Projection (optional - if you want to select specific fields)
    // For example, to fetch only necessary fields for the list view:
    // queryParams.projection = JSON.stringify({
    //   _id: 1,
    //   sellerName: 1,
    //   userId: 1, // Or if userId is an object, then 'userId._id' if needed for display
    //   legalFirstName: 1,
    //   legalLastName: 1,
    //   createdAt: 1,
    //   estimatedMonthlySales: 1,
    //   status: 1
    // });

    // console.log("Constructed API Query Parameters for Hook:", queryParams);
    return queryParams;
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, sortConfig]);


  // --- Data Fetching with React Query using the constructed parameters ---
  const {
    data: apiResponse, // This should be the PaginatedSellerApplicationsResponse from your type
    error: fetchError,
    isError,
    isLoading,    // True for initial fetch or hard refetch if no data
    isFetching,   // True for any fetch, including background refetches
    refetch,      // Function to manually trigger a refetch
  } = useFilterIndividualSellerApplication(
    apiQueryParameters, // <<<< Pass the constructed query parameters object
    {
      keepPreviousData: true, // Recommended for pagination to avoid UI jumps
      // The `select` function (if any) inside your useFilterIndividualSellerApplication hook
      // should process the raw ApiResponse to return the PaginatedSellerApplicationsResponse.
      // If the hook directly returns ApiResponse<PaginatedSellerApplicationsResponse>,
      // and you need PaginatedSellerApplicationsResponse directly:
      // select: (response) => response.data,
    }
  );

  // Memoized values from the API response
  const applicationsToDisplay = useMemo(() => apiResponse?.applications || [], [apiResponse]);
  const paginationInfo = useMemo(() => apiResponse?.pagination, [apiResponse]);
  const totalApiItems = useMemo(() => paginationInfo?.totalItems || 0, [paginationInfo]);
  const totalApiPages = useMemo(() => paginationInfo?.totalPages || 0, [paginationInfo]);


  // Status options for the filter dropdown
  const applicationStatusOptions: { value: 'all' | IIndividualSellerProfile['status'], label: string }[] = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ], []);

  // --- Event Handlers ---
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as 'all' | IIndividualSellerProfile['status']);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePaginate = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalApiPages) {
      setCurrentPage(pageNumber);
    }
  }, [totalApiPages]);

  const handleSort = useCallback((column: SortableFields) => {
    setSortConfig(currentSortConfig => {
      const newDirection =
        currentSortConfig.key === column && currentSortConfig.direction === 'asc' ? 'desc' : 'asc';
      return { key: column, direction: newDirection };
    });
    setCurrentPage(1); // Reset to first page on sort change
  }, []);

  const getSortIcon = (column: SortableFields) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSortDown style={{ opacity: 0.3 }} />; // Default for non-active sort columns
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // --- Render Logic for Loading and Error States ---
  if (isLoading && !apiResponse) { // Show full page loader only on initial load without data
    return (
      <SellerApplicationListContainer>
        <LoadingOverlay>
          <FaSpinner className="spinner-icon" />
          <p>Loading Seller Applications...</p>
        </LoadingOverlay>
      </SellerApplicationListContainer>
    );
  }

  if (isError && fetchError) {
    return (
      <SellerApplicationListContainer>
        <ErrorMessage>
          <p>Failed to load applications: {fetchError.message}</p>
          <AdminButton $variant="secondary" onClick={() => refetch()}>Try Again</AdminButton>
        </ErrorMessage>
      </SellerApplicationListContainer>
    );
  }

  // --- Main Render ---
  return (
    <SellerApplicationListContainer>
      <SellerApplicationListHeader>
        <HeaderTitle>Seller Applications ({totalApiItems})</HeaderTitle>
        {onAddNewApplication && (
          <AdminButton $variant="primary" onClick={onAddNewApplication}>
            <FaUserPlus style={{ marginRight: theme.spacing(2) }} /> Add New Application
          </AdminButton>
        )}
      </SellerApplicationListHeader>

      <FilterBar>
        <ApplicationSearchInput
          type="text"
          placeholder="Search by Name, Legal Name, User ID..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterStatus} onChange={handleFilterChange}>
          {applicationStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>
        {/* Example Refresh button: <AdminButton $variant="neutral" onClick={() => refetch()} disabled={isFetching}>Refresh</AdminButton> */}
      </FilterBar>

      {/* Subtle loading indicator for background fetches (e.g., pagination, sort, filter changes when data already exists) */}
      {isFetching && applicationsToDisplay.length > 0 && (
         <div style={{ textAlign: 'center', padding: theme.spacing(2), color: theme.colors.adminTextSecondary, fontSize: '0.9em' }}>
            <FaSpinner className="spinner-icon" style={{fontSize: '1em', marginRight: theme.spacing(2), verticalAlign: 'middle'}} />
            Loading...
         </div>
      )}

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('sellerName')}>Seller Name {getSortIcon('sellerName')}</th>
              <th onClick={() => handleSort('legalFirstName')}>Legal Name {getSortIcon('legalFirstName')}</th>
              <th onClick={() => handleSort('createdAt')}>Submitted {getSortIcon('createdAt')}</th>
              <th onClick={() => handleSort('estimatedMonthlySales')}>Est. Sales {getSortIcon('estimatedMonthlySales')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsToDisplay.length > 0 ? (
              applicationsToDisplay.map(app => (
                <tr key={app._id}>
                  <td>
                    <span className="seller-name">{app.sellerName}</span>
                    <br />
                    <small style={{ color: theme.colors.adminTextSecondary }}>
                      {/* Assuming userId is a direct string. If it's an object: app.userId._id or similar */}
                      User ID: {typeof app.userId === 'string' ? app.userId : (app.userId as any)?.['_id'] || 'N/A'}
                    </small>
                  </td>
                  <td>{app.legalFirstName} {app.legalLastName}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>${app.estimatedMonthlySales?.toLocaleString() || 'N/A'}</td>
                  <td><ApplicationStatusBadge $status={app.status}>{app.status}</ApplicationStatusBadge></td>
                  <td>
                    <ActionButtonsGroup>
                      <TableActionButton onClick={() => onViewDetails(app._id)} title="View Application Details"><FaEye /></TableActionButton>
                      {app.status === 'pending' && (
                        <>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'seller', 'approve', app.sellerName)} title="Approve Application" style={{ color: theme.colors.adminStatusSuccess }}><FaCheckCircle /></TableActionButton>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'seller', 'reject', app.sellerName)} title="Reject Application" style={{ color: theme.colors.adminStatusError }}><FaTimesCircle /></TableActionButton>
                        </>
                      )}
                      {(app.status === 'approved' || app.status === 'active') && (
                        <TableActionButton onClick={() => onApplicationAction(app._id, 'seller', 'suspend', app.sellerName)} title="Suspend Application" style={{ color: theme.colors.adminStatusWarning }}><FaHourglassHalf /></TableActionButton>
                      )}
                      {(app.status === 'withdrawn' || app.status === 'suspended' || app.status === 'rejected') && (
                         <TableActionButton onClick={() => onApplicationAction(app._id, 'seller', 'approve', app.sellerName)} title="Re-evaluate / Approve" style={{ color: theme.colors.adminStatusInfo }}><FaCheckCircle /></TableActionButton>
                      )}
                    </ActionButtonsGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '50px', color: theme.colors.adminTextSecondary }}>
                  {(isLoading && !apiResponse) || isFetching ? 'Loading applications...' : 'No seller applications found matching your criteria.'}
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      {totalApiPages > 0 && applicationsToDisplay.length > 0 && (
        <TableFooter>
          <span>Page {paginationInfo?.currentPage || 1} of {totalApiPages}. Total: {totalApiItems} applications.</span>
          <PaginationContainer>
            <PaginationButton onClick={() => handlePaginate((paginationInfo?.currentPage || 1) - 1)} disabled={(paginationInfo?.currentPage || 1) === 1}>Previous</PaginationButton>
            {[...Array(totalApiPages).keys()].map(num => (
              <PaginationButton key={num + 1} onClick={() => handlePaginate(num + 1)} $active={(paginationInfo?.currentPage || 1) === num + 1}>
                {num + 1}
              </PaginationButton>
            ))}
            <PaginationButton onClick={() => handlePaginate((paginationInfo?.currentPage || 1) + 1)} disabled={(paginationInfo?.currentPage || 1) === totalApiPages || totalApiPages === 0}>Next</PaginationButton>
          </PaginationContainer>
        </TableFooter>
      )}
    </SellerApplicationListContainer>
  );
};

export default SellerApplicationList;