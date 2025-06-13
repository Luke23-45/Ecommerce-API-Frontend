import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from 'styled-components';
import {
  FaEye, FaSortUp, FaSortDown, FaCheckCircle, FaTimesCircle,
  FaHourglassHalf, FaBuilding, FaUserPlus, FaSpinner
} from 'react-icons/fa';
import styled from 'styled-components'; // Keep for fallback styled components

import {
  VendorApplicationListContainer,
  VendorApplicationListHeader,
  HeaderTitle,
  VendorApplicationSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  VendorApplicationStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
  ActionButtonsGroup,
  type VendorApplicationStatusType
} from './VendorApplicationList.styles';

// Fallback Styled Components (Define these in VendorApplicationList.styles.ts for best practice)
const FallbackLoadingOverlay = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; border-radius: ${(props) => props.theme.borderRadius.medium};
  color: ${(props) => props.theme.colors.adminText};
  font-family: ${(props) => props.theme.typography.admin.fontFamily};
  .spinner-icon { font-size: 2.5rem; color: ${(props) => props.theme.colors.accent1}; margin-bottom: 1rem; animation: spin 1s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  p { margin: 0; font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase}; font-weight: ${(props) => props.theme.typography.admin.weights.medium};}
`;
const FallbackErrorMessage = styled.div`
  padding: ${(props) => props.theme.spacing(6)} ${(props) => props.theme.spacing(4)};
  margin: ${(props) => props.theme.spacing(8)} auto; max-width: 600px;
  border: 1px solid ${(props) => props.theme.colors.adminStatusError};
  background-color: ${(props) => props.theme.colors.adminErrorBg || 'rgba(255,0,0,0.05)'};
  color: ${(props) => props.theme.colors.adminStatusError};
  border-radius: ${(props) => props.theme.borderRadius.medium}; text-align: center;
  font-family: ${(props) => props.theme.typography.admin.fontFamily};
  p { margin: 0 0 ${(props) => props.theme.spacing(4)} 0; font-size: 1rem; line-height: 1.6; }
  button { margin-top: ${(props) => props.theme.spacing(3)}; }
`;
// --- End Fallbacks ---

// Assuming AdminButton is correctly imported from a shared location
import { AdminButton } from '../../Dashboard/Common/Common.styles';

// Types
import type { IVendorProfile, PaginatedVendorApplicationsResponse } from '@/types/vendor'; // Ensure this matches your API response structure
// Hook
import { useFilterVendorApplication } from '@/hooks/admin/application/useVendor'; // Ensure path is correct
import { useNavigate } from 'react-router-dom';

// Define SortKey and SortDirection locally
type SortKey = 'companyName' | 'createdAt' | 'status' | 'estimatedMonthlySales' | 'legalEntityType' | 'contactPersonFirstName' | 'userId';
type SortDirection = 'asc' | 'desc';
// Ensure ApplicationAction includes all actions your onApplicationAction handler might receive
type ApplicationAction = 'approve' | 'reject' | 'suspend' | 'activate' | 'deactivate' | 'close';

interface VendorApplicationListProps {
  onViewDetails: (applicationId: string) => void;
  onApplicationAction: (
    applicationId: string,
    applicationType: 'vendor', // Specific to this list
    action: ApplicationAction,
    applicantName: string // Company Name for vendors
  ) => void;
  onAddNewApplication?: () => void;
}

const ITEMS_PER_PAGE_DEFAULT = 10;

const VendorApplicationList: React.FC<VendorApplicationListProps> = ({
  onAddNewApplication,
}) => {
  const theme = useTheme();

  // UI State for Filters, Sort, Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | VendorApplicationStatusType>('all');
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const navigate = useNavigate();

  const onViewDetails = (applicationId:any) =>{
    navigate(`/admin/applications/sellers/${applicationId}`);
  }
  const onApplicationAction = (appId: string, appType: 'seller' | 'vendor', action: 'approve' | 'reject' | 'suspend', appName: string) => {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    showConfirmModal(
      `Confirm ${actionText}: ${appName}`,
      `Are you sure you want to ${action} the ${appType} application for "${appName}" (ID: ${appId})?`,
      () => { 
        console.log(`CONFIRMED ${action.toUpperCase()} for ${appType} application ID: ${appId}`); 
        // TODO: Update the actual data array here to reflect the status change
        showNotification(`${appName} application has been ${action}d.`, 'success'); 
      },
      `${actionText} Application`,
      action === 'reject' || action === 'suspend' ? 'danger' : 'primary'
    );
  };
  // Construct API Query Parameters Object based on API documentation
  const apiQueryParameters = useMemo(() => {
    const queryParams: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: itemsPerPage,
      // lean: true, // Add if your vendor API controller uses 'lean' from query
    };

    const filterObj: Record<string, any> = {};
    if (filterStatus !== 'all') {
      filterObj.status = filterStatus;
    }
    if (searchTerm.trim() !== '') {
      filterObj.$or = [
        { companyName: { $regex: searchTerm.trim(), $options: 'i' } },
        { contactPersonFirstName: { $regex: searchTerm.trim(), $options: 'i' } },
        { contactPersonLastName: { $regex: searchTerm.trim(), $options: 'i' } },
        { contactPersonEmail: { $regex: searchTerm.trim(), $options: 'i' } },
        // Ensure 'userId' is a string field in your VendorProfile schema suitable for regex search
        { userId: { $regex: searchTerm.trim(), $options: 'i' } },
      ];
    }
    if (Object.keys(filterObj).length > 0) {
      queryParams.filter = JSON.stringify(filterObj);
    }

    if (sortConfig.key) {
      const sortObj: Record<string, 1 | -1> = {
        [sortConfig.key]: sortConfig.direction === 'asc' ? 1 : -1,
      };
      queryParams.sort = JSON.stringify(sortObj);
    }
    // Example projection:
    // queryParams.projection = JSON.stringify({ _id: 1, companyName: 1, userId: 1, contactPersonFirstName: 1, contactPersonLastName: 1, contactPersonEmail: 1, legalEntityType:1, createdAt:1, estimatedMonthlySales:1, status:1 });

    return queryParams;
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, sortConfig]);

  // Data Fetching with React Query
  const {
    data: apiResponse, // Should be PaginatedVendorApplicationsResponse | undefined
    error: fetchError,
    isError,
    isLoading,    // True for initial fetch or hard refetch if no data
    isFetching,   // True for any fetch, including background refetches
    refetch,      // Function to manually trigger a refetch
  } = useFilterVendorApplication(
    apiQueryParameters, // Pass the constructed query parameters object
    {
      keepPreviousData: true,
      // If your useFilterVendorApplication hook returns the full ApiResponse,
      // and you need the .data part (PaginatedVendorApplicationsResponse),
      // make sure the hook's select function handles this.
      // e.g. in the hook: select: (responseWrapper) => responseWrapper.data,
      // For now, assuming `apiResponse` IS PaginatedVendorApplicationsResponse | undefined
    }
  );

  const applicationsToDisplay = useMemo(() => apiResponse?.applications || [], [apiResponse]);
  const paginationInfo = useMemo(() => apiResponse?.pagination, [apiResponse]);
  const totalApiItems = useMemo(() => paginationInfo?.totalItems || 0, [paginationInfo]);
  const totalApiPages = useMemo(() => paginationInfo?.totalPages || 0, [paginationInfo]);

  // Status options for the filter dropdown (ensure VendorApplicationStatusType includes these)
  const applicationStatusOptions: { value: 'all' | VendorApplicationStatusType, label: string }[] = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved (Inactive)' }, // Vendor specific states
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Made Inactive' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'closed', label: 'Closed' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ], []);


  // Event Handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as 'all' | VendorApplicationStatusType);
    setCurrentPage(1);
  }, []);

  const handlePaginate = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= (totalApiPages || 1)) {
      setCurrentPage(pageNumber);
    }
  }, [totalApiPages]);

  const handleSort = useCallback((column: SortKey) => {
    setSortConfig(currentSortConfig => {
      const newDirection =
        currentSortConfig.key === column && currentSortConfig.direction === 'asc' ? 'desc' : 'asc';
      return { key: column, direction: newDirection };
    });
    setCurrentPage(1);
  }, []);

  const getSortIcon = (column: SortKey) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSortDown style={{ opacity: 0.3 }} />;
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) { return "Invalid Date"; }
  };


  // --- Loading and Error States ---
  if (isLoading && !apiResponse) { // Full page loader for initial load
    return (
      <VendorApplicationListContainer>
        <FallbackLoadingOverlay>
          <FaSpinner className="spinner-icon" />
          <p>Loading Vendor Applications...</p>
        </FallbackLoadingOverlay>
      </VendorApplicationListContainer>
    );
  }
  if (isError && fetchError) {
    return (
      <VendorApplicationListContainer>
        <FallbackErrorMessage>
          <p>Failed to load vendor applications: {fetchError.message}</p>
          <AdminButton $variant="secondary" onClick={() => refetch()}>Try Again</AdminButton>
        </FallbackErrorMessage>
      </VendorApplicationListContainer>
    );
  }

  // --- Main Render ---
  return (
    <VendorApplicationListContainer>
      <VendorApplicationListHeader>
        <HeaderTitle>Vendor Applications ({totalApiItems})</HeaderTitle>
        {onAddNewApplication && (
          <AdminButton $variant="primary" onClick={onAddNewApplication}>
            <FaUserPlus style={{ marginRight: theme.spacing(2) }} /> Add New Vendor
          </AdminButton>
        )}
      </VendorApplicationListHeader>

      <FilterBar>
        <VendorApplicationSearchInput
          type="text"
          placeholder="Search Company, Contact, Email, User ID..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterStatus} onChange={handleFilterChange}>
          {applicationStatusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      {isFetching && applicationsToDisplay.length > 0 && (
         <div style={{ textAlign: 'center', padding: theme.spacing(2), color: theme.colors.adminTextSecondary, fontSize: '0.9em', background: `rgba(100,100,100, 0.1)`, borderRadius: theme.borderRadius.small, margin: `${theme.spacing(2)} 0` }}>
            <FaSpinner className="spinner-icon" style={{fontSize: '1em', marginRight: theme.spacing(2), verticalAlign: 'middle', animation: 'spin 1s linear infinite'}} />
            Updating list...
         </div>
      )}

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('companyName')}><FaBuilding style={{marginRight: '5px'}}/>Company {getSortIcon('companyName')}</th>
              <th onClick={() => handleSort('contactPersonFirstName')}>Contact {getSortIcon('contactPersonFirstName')}</th>
              <th onClick={() => handleSort('legalEntityType')}>Type {getSortIcon('legalEntityType')}</th>
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
                    <span className="company-name">{app.companyName}</span><br />
                    <small style={{ color: theme.colors.adminTextSecondary }}>
                      User ID: {typeof app.userId === 'string' ? app.userId : (app.userId as any)?._id || 'N/A'}
                    </small>
                  </td>
                  <td>{app.contactPersonFirstName} {app.contactPersonLastName}<br/><small style={{color: theme.colors.adminTextSecondary}}>{app.contactPersonEmail}</small></td>
                  <td>{app.legalEntityType?.toUpperCase() || 'N/A'}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>${app.estimatedMonthlySales?.toLocaleString() || 'N/A'}</td>
                  <td>
                    <VendorApplicationStatusBadge $status={app.status as VendorApplicationStatusType}>
                      {/* Display a more friendly label if available, otherwise capitalize status */}
                      {applicationStatusOptions.find(opt => opt.value === app.status)?.label || app.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </VendorApplicationStatusBadge>
                  </td>
                  <td>
                    <ActionButtonsGroup>
                      <TableActionButton onClick={() => onViewDetails(app._id)} title="View Details"><FaEye /></TableActionButton>
                      {app.status === 'pending' && (
                        <>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'approve', app.companyName)} title="Approve" style={{ color: theme.colors.adminStatusSuccess }}><FaCheckCircle /></TableActionButton>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'reject', app.companyName)} title="Reject" style={{ color: theme.colors.adminStatusError }}><FaTimesCircle /></TableActionButton>
                        </>
                      )}
                      {app.status === 'approved' && (
                        <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'activate', app.companyName)} title="Activate Profile" style={{ color: theme.colors.adminStatusSuccess }}><FaCheckCircle /> Activate</TableActionButton>
                      )}
                      {app.status === 'active' && (
                        <>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'suspend', app.companyName)} title="Suspend Vendor" style={{ color: theme.colors.adminStatusWarning }}><FaHourglassHalf /></TableActionButton>
                          <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'deactivate', app.companyName)} title="Deactivate Vendor" style={{ color: theme.colors.adminStatusError }}><FaTimesCircle /> </TableActionButton>
                        </>
                      )}
                      {app.status === 'suspended' && (
                         <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'activate', app.companyName)} title="Re-activate Vendor" style={{ color: theme.colors.adminStatusSuccess }}><FaCheckCircle /> Re-activate</TableActionButton>
                      )}
                       {(app.status === 'rejected' || app.status === 'withdrawn' || app.status === 'inactive') && (
                         <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'approve', app.companyName)} title="Re-evaluate/Approve" style={{ color: theme.colors.adminStatusInfo }}><FaCheckCircle /></TableActionButton>
                       )}
                       {(app.status !== 'closed' && (app.status === 'suspended' || app.status === 'rejected' || app.status === 'inactive' || app.status === 'withdrawn')) && (
                           <TableActionButton onClick={() => onApplicationAction(app._id, 'vendor', 'close', app.companyName)} title="Close Account" style={{ color: theme.colors.adminTextSecondary }}><FaTimesCircle /></TableActionButton>
                        )}
                    </ActionButtonsGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: theme.colors.adminTextSecondary }}>
                  {(isLoading && !apiResponse) || isFetching ? 'Loading applications...' : 'No vendor applications match your criteria.'}
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      {totalApiPages > 0 && applicationsToDisplay.length > 0 && (
        <TableFooter>
          <span>Page {paginationInfo?.currentPage || 1} of {totalApiPages}. Total: {totalApiItems}</span>
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
    </VendorApplicationListContainer>
  );
};

export default VendorApplicationList;