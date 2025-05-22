// src/components/Admin/Marketing/MarketingList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaSortUp, FaSortDown, FaLink, FaImage } from 'react-icons/fa';

import {
  MarketingListContainer,
  MarketingListHeader,
  HeaderTitle,
  MarketingSearchInput,
  FilterBar,
  FilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  BannerStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from './MarketingList.styles';

import { AdminButton } from '../Dashboard/Common/Common.styles';
import type { PromotionBanner, BannerStatus, BannerLocation } from '@/types/marketing'; 


const mockBannerId = (seed: string) => `BNR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
const getBannerImageUrl = (seed: string, width: number = 800, height: number = 450) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}/?banner,marketing,ad`;

const dummyBanners: PromotionBanner[] = [
    {
        _id: mockBannerId('winter-sale'), name: 'Homepage Winter Sale 2023',
        imageUrl: getBannerImageUrl('winter-sale'), linkUrl: '/collections/winter-sale',
        startDate: '2023-11-01T00:00:00Z', endDate: '2023-12-31T23:59:59Z',
        status: 'active', location: 'homepage_hero', description: 'Main hero banner for winter promotions.', priority: 1,
        createdAt: '2023-10-20T10:00:00Z', updatedAt: '2023-10-20T10:00:00Z',
    },
    {
        _id: mockBannerId('new-arrivals'), name: 'New Arrivals Banner',
        imageUrl: getBannerImageUrl('new-arrivals'), linkUrl: '/new-arrivals',
        startDate: '2023-10-01T00:00:00Z', endDate: null, // Evergreen
        status: 'active', location: 'homepage_cta', description: 'CTA banner below hero for new products.', priority: 5,
        createdAt: '2023-09-25T14:00:00Z', updatedAt: '2023-09-25T14:00:00Z',
    },
    {
        _id: mockBannerId('spring-collection'), name: 'Spring Collection Preview',
        imageUrl: getBannerImageUrl('spring-collection'), linkUrl: '/collections/spring-preview',
        startDate: '2024-02-15T00:00:00Z', endDate: '2024-03-31T23:59:59Z',
        status: 'scheduled', location: 'collection_top', description: 'Upcoming banner for Spring Collection launch.', priority: 1,
        createdAt: '2023-10-01T11:00:00Z', updatedAt: '2023-10-01T11:00:00Z',
    },
    {
        _id: mockBannerId('black-friday'), name: 'Black Friday Countdown',
        imageUrl: getBannerImageUrl('black-friday'), linkUrl: '/black-friday-deals',
        startDate: '2023-11-20T00:00:00Z', endDate: '2023-11-27T23:59:59Z',
        status: 'draft', location: 'homepage_hero', description: 'Draft banner for Black Friday promotions.', priority: 0,
        createdAt: '2023-11-01T15:00:00Z', updatedAt: '2023-11-01T15:00:00Z',
    },
    {
        _id: mockBannerId('expired-offer'), name: 'Expired Summer Offer',
        imageUrl: getBannerImageUrl('summer-offer'), linkUrl: '/old-deals',
        startDate: '2023-06-01T00:00:00Z', endDate: '2023-08-31T23:59:59Z',
        status: 'expired', location: 'homepage_cta', description: 'Old summer offer, for reference.', priority: 10,
        createdAt: '2023-05-15T09:00:00Z', updatedAt: '2023-05-15T09:00:00Z',
    },
    {
        _id: mockBannerId('checkout-promo'), name: 'Checkout Free Shipping',
        imageUrl: getBannerImageUrl('checkout-promo'), linkUrl: '/checkout',
        startDate: '2023-09-01T00:00:00Z', endDate: null,
        status: 'active', location: 'checkout_banner', description: 'Persistent free shipping banner on checkout page.', priority: 1,
        createdAt: '2023-08-20T10:00:00Z', updatedAt: '2023-08-20T10:00:00Z',
    },
];

type SortKey = 'name' | 'startDate' | 'endDate' | 'status' | 'location' | 'priority';
type SortDirection = 'asc' | 'desc';

interface MarketingListProps {
  onAddBanner: () => void;
  onEditBanner: (bannerId: string) => void;
  onDeleteBanner: (bannerId: string, bannerName: string) => void; 
}

const MarketingList: React.FC<MarketingListProps> = ({ onAddBanner, onEditBanner,onDeleteBanner }) => {
  const [banners, setBanners] = useState<PromotionBanner[]>(dummyBanners); // Main state for banners
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bannersPerPage] = useState(10); 
  const [sortColumn, setSortColumn] = useState<SortKey>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');


  const uniqueStatuses: (BannerStatus | 'all')[] = useMemo(() => {
    return ['all', 'active', 'inactive', 'scheduled', 'expired', 'draft'].sort();
  }, []);

  const uniqueLocations: (BannerLocation | 'all')[] = useMemo(() => {
    return ['all', 'homepage_hero', 'homepage_cta', 'collection_top', 'product_detail_promo', 'checkout_banner', 'sidebar'].sort();
  }, []);

  // Memoized filtered and sorted banners
  const filteredAndSortedBanners = useMemo(() => {
    let filtered = banners.filter(banner => {
      const matchesSearch = banner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || banner.status === filterStatus;
      const matchesLocation = filterLocation === 'all' || banner.location === filterLocation;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });

    // Apply sorting
    if (sortColumn) {
        filtered.sort((a, b) => {
            let aValue: any = a[sortColumn];
            let bValue: any = b[sortColumn];

            // Special handling for dates (ISO string comparison)
            if (sortColumn === 'startDate' || sortColumn === 'endDate') {
                const dateA = aValue ? new Date(aValue).getTime() : 0;
                const dateB = bValue ? new Date(bValue).getTime() : 0;
                if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            }
            // Default string/number comparisons
            if (aValue === null) return sortDirection === 'asc' ? 1 : -1; // Nulls last
            if (bValue === null) return sortDirection === 'asc' ? -1 : 1;
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }

    return filtered;
  }, [banners, searchTerm, filterStatus, filterLocation, sortColumn, sortDirection]);





  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedBanners.length / bannersPerPage);
  const indexOfFirstBanner = (currentPage - 1) * bannersPerPage;
  const indexOfLastBanner = currentPage * bannersPerPage;
  const currentBanners = filteredAndSortedBanners.slice(indexOfFirstBanner, indexOfLastBanner);

  // Handlers for search, filter, and pagination
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>, type: 'status' | 'location') => {
    if (type === 'status') setFilterStatus(e.target.value as BannerStatus | 'all');
    else setFilterLocation(e.target.value as BannerLocation | 'all');
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

  const handleEdit = (bannerId: string) => {
    onEditBanner(bannerId);
  };

  const handleDelete = (bannerId: string, bannerName: string) => {
    if (window.confirm(`Are you sure you want to delete banner "${bannerId}"? This cannot be undone.`)) {
      setBanners(prev => prev.filter(b => b._id !== bannerId)); 
      onDeleteBanner(bannerId, bannerName);
      console.log(`Banner ${bannerId} deleted (demo).`);
    }
  };

  const handleAddNew = () => {
    onAddBanner();
  };

  return (
    <MarketingListContainer>
      <MarketingListHeader>
        <HeaderTitle>Promotional Banners ({filteredAndSortedBanners.length})</HeaderTitle>
        <AdminButton $variant="primary" onClick={handleAddNew}>
          <FaPlus /> Add New Banner
        </AdminButton>
      </MarketingListHeader>

      <FilterBar>
        <MarketingSearchInput
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={filterStatus} onChange={(e) => handleFilterChange(e, 'status')}>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={filterLocation} onChange={(e) => handleFilterChange(e, 'location')}>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location === 'all' ? 'All Locations' : location.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
        {/* Potentially add date range filters for scheduled/expired banners */}
      </FilterBar>

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
              <th onClick={() => handleSort('location')}>Location {getSortIcon('location')}</th>
              <th onClick={() => handleSort('startDate')}>Start Date {getSortIcon('startDate')}</th>
              <th onClick={() => handleSort('endDate')}>End Date {getSortIcon('endDate')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th onClick={() => handleSort('priority')}>Priority {getSortIcon('priority')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBanners.length > 0 ? (
              currentBanners.map(banner => (
                <tr key={banner._id}>
                  <td><img src={banner.imageUrl} alt={banner.name} /></td>
                  <td>
                      <span className="banner-name">{banner.name}</span>
                      <br/>
                      <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.8em', color: '#A46E4A'}}>
                          <FaLink style={{marginRight: '3px'}}/> Link
                      </a>
                  </td>
                  <td>{banner.location.replace(/_/g, ' ')}</td>
                  <td>{new Date(banner.startDate).toLocaleDateString()}</td>
                  <td>{banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Evergreen'}</td>
                  <td><BannerStatusBadge $status={banner.status}>{banner.status.replace(/_/g, ' ')}</BannerStatusBadge></td>
                  <td>{banner.priority || 'N/A'}</td>
                  <td>
                    <TableActionButton onClick={() => handleEdit(banner._id)} aria-label="Edit banner">
                      <FaEdit />
                    </TableActionButton>
                    <TableActionButton onClick={() => handleDelete(banner._id)} aria-label="Delete banner">
                      <FaTrashAlt />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '50px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  No banners found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      <TableFooter>
        <span>Showing {indexOfFirstBanner + 1} - {Math.min(indexOfLastBanner, filteredAndSortedBanners.length)} of {filteredAndSortedBanners.length} banners</span>
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
    </MarketingListContainer>
  );
};

export default MarketingList;