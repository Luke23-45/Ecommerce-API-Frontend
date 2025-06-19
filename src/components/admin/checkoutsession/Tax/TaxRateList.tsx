import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // If page-based navigation for add/edit
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaPercentage,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

import {
  TaxRateListContainer,
  TaxRateListHeader,
  HeaderTitle,
  SearchAndFilterBar,
  TaxSearchInput,
  TaxFilterSelect,
  NoTaxRatesMessage,
  TaxRateValue,
  TaxTypeChip,
  TaxStatusBadge,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from "./TaxRateList.styles";

import { AdminButton } from "../../Dashboard/Common/Common.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";

import {
  useGetAllTaxRates,
  useDeleteTaxRate,
} from "@/hooks/admin/checkoutsession/useTaxRate";
import {
  type ITaxRateResponse,
  TaxCalculationTypeFrontend,
  TaxApplicabilityFrontend,
} from "@/types/tax.types";
import { useNotification } from "@/contexts/NotificationContext";

// Props for the component
interface TaxRateListProps {
  onAddTaxRate: () => void; // Callback to navigate to add tax rate form
  onEditTaxRate: (taxRateId: string) => void; // Callback to navigate to edit form
}

// Types for sorting
type SortableTaxRateColumn = keyof Pick<
  ITaxRateResponse,
  "name" | "country" | "state" | "rate" | "startDate" | "endDate" | "isActive"
>;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE_DEFAULT = 10;

const TaxRateList = () => {
  const { showNotification } = useNotification();
  const theme = useTheme() as DefaultTheme;

  const navigate = useNavigate();

  // --- UI State for Filters, Search, Pagination, Sorting ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterIsActive, setFilterIsActive] = useState<"all" | "yes" | "no">(
    "all"
  );
  // Client-side pagination state since getAllTaxRatesApi fetches all
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);

  const [sortConfig, setSortConfig] = useState<{
    key: SortableTaxRateColumn;
    direction: SortDirection;
  }>({
    key: "country", // Default sort
    direction: "asc",
  });

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxRateToDelete, setTaxRateToDelete] =
    useState<ITaxRateResponse | null>(null);

  // --- Data Fetching with React Query ---
  // useGetAllTaxRates currently fetches all. Filtering/sorting/pagination will be client-side for now.
  // For server-side, the hook and API would take params.
  const {
    data: allTaxRates = [], // Default to empty array. Hook returns ITaxRateResponse[] directly due to select.
    isLoading: isLoadingTaxRates,
    isError,
    error: fetchErrorData,
    isFetching,
    refetch,
  } = useGetAllTaxRates(
    undefined, // No API params yet for getAllTaxRates (can add later for server-side filtering)
    {
      // onSuccess: (data) => console.log("Fetched tax rates:", data),
      // onError: (err) => console.error("Error fetching tax rates:", err),
    }
  );

  const onAddTaxRate = () => {
    navigate("/admin/checkoutsession/tax/new");
  };

  const onEditTaxRate = (taxId: string) => {
    navigate(`/admin/checkoutsession/tax/edit/${taxId}`);
  };

  const deleteTaxRateMutation = useDeleteTaxRate({
    onSuccess: (_data, deletedTaxRateId) => {
      showNotification(
        `Tax Rate "${
          taxRateToDelete?.name || deletedTaxRateId
        }" deleted successfully!`,
        "success"
      );
      // Invalidation is handled by the hook, list will refetch (or can explicitly call refetch())
      setTaxRateToDelete(null);
      setIsDeleteModalOpen(false);
    },
    onError: (err: any, deletedTaxRateId) => {
      showNotification(
        `Failed to delete tax rate "${
          taxRateToDelete?.name || deletedTaxRateId
        }": ${err.message || "Unknown error"}`,
        "error"
      );
      setTaxRateToDelete(null);
      setIsDeleteModalOpen(false);
    },
  });

  // --- Memoized Filtered, Sorted, and Paginated Data (Client-Side) ---
  const processedTaxRates = useMemo(() => {
    let filtered = [...allTaxRates]; // Create a mutable copy

    // 1. Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (rate) =>
          rate.name.toLowerCase().includes(term) ||
          rate.country.toLowerCase().includes(term) ||
          (rate.state && rate.state.toLowerCase().includes(term)) ||
          (rate.city && rate.city.toLowerCase().includes(term)) ||
          (rate.zipCode && rate.zipCode.toLowerCase().includes(term))
      );
    }

    // 2. Filter by country
    if (filterCountry !== "all") {
      filtered = filtered.filter((rate) => rate.country === filterCountry);
    }

    // 3. Filter by isActive
    if (filterIsActive !== "all") {
      const isActiveFilter = filterIsActive === "yes";
      filtered = filtered.filter((rate) => rate.isActive === isActiveFilter);
    }

    // 4. Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key as keyof ITaxRateResponse];
        const valB = b[sortConfig.key as keyof ITaxRateResponse];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }
        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (typeof valA === "boolean" && typeof valB === "boolean") {
          return sortConfig.direction === "asc"
            ? valA === valB
              ? 0
              : valA
              ? -1
              : 1
            : valA === valB
            ? 0
            : valA
            ? 1
            : -1;
        }
        // For dates (startDate, endDate), convert to Date objects for comparison
        if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
          const dateA = new Date(valA as string);
          const dateB = new Date(valB as string);
          if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }
    return filtered;
  }, [allTaxRates, searchTerm, filterCountry, filterIsActive, sortConfig]);

  const totalFilteredItems = processedTaxRates.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage)); // Ensure at least 1 page

  // Client-side pagination slice
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return processedTaxRates.slice(firstPageIndex, lastPageIndex);
  }, [processedTaxRates, currentPage, itemsPerPage]);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // --- Handlers ---
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleFilterChange = useCallback(
    (
      e: React.ChangeEvent<HTMLSelectElement>,
      filterType: "country" | "isActive"
    ) => {
      const value = e.target.value;
      if (filterType === "country") setFilterCountry(value);
      if (filterType === "isActive")
        setFilterIsActive(value as "all" | "yes" | "no");
      setCurrentPage(1);
    },
    []
  );

  const handleSort = useCallback((column: SortableTaxRateColumn) => {
    setSortConfig((currentSortConfig) => ({
      key: column,
      direction:
        currentSortConfig.key === column &&
        currentSortConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
    // No need to reset currentPage for client-side sort, but good practice if it were server-side
  }, []);

  const handlePaginate = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  const openDeleteModal = (taxRate: ITaxRateResponse) => {
    setTaxRateToDelete(taxRate);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taxRateToDelete && taxRateToDelete._id) {
      deleteTaxRateMutation.mutate(taxRateToDelete._id);
    }
  };

  const getSortIcon = (column: SortableTaxRateColumn) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  const uniqueCountries = useMemo(() => {
    if (!allTaxRates) return [];
    const countries = new Set(allTaxRates.map((rate) => rate.country));
    return ["all", ...Array.from(countries).sort()];
  }, [allTaxRates]);

  const renderMainContent = () => {
    if (isLoadingTaxRates && allTaxRates.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            marginTop: theme.spacing(5),
          }}
        >
          <LoadingSpinner message="Loading tax rates..." />
        </div>
      );
    }
    if (isError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            color: theme.colors.adminStatusError || "red",
            marginTop: theme.spacing(5),
          }}
        >
          <FaExclamationTriangle
            size="2em"
            style={{ marginBottom: theme.spacing(2) }}
          />
          <p>
            Error loading tax rates:{" "}
            {(fetchErrorData as any)?.message || "Unknown error"}
          </p>
          <AdminButton
            $variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try Again
          </AdminButton>
        </div>
      );
    }
    if (currentTableData.length === 0 && !isFetching) {
      return (
        <NoTaxRatesMessage>
          <FaPercentage />
          <p>
            {searchTerm || filterCountry !== "all" || filterIsActive !== "all"
              ? "No tax rates found matching your criteria."
              : 'No tax rates configured yet. Click "Add New Tax Rate" to get started.'}
          </p>
        </NoTaxRatesMessage>
      );
    }

    return (
      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Name {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("country")}>
                Country {getSortIcon("country")}
              </th>
              <th onClick={() => handleSort("state")}>
                State/Province {getSortIcon("state")}
              </th>
              {/* <th>City</th> // Optional, might make table too wide */}
              <th>Zip/Post Code</th>
              <th onClick={() => handleSort("rate")}>
                Rate {getSortIcon("rate")}
              </th>
              <th>Type</th>
              <th>Applicability</th>
              <th onClick={() => handleSort("startDate")}>
                Start Date {getSortIcon("startDate")}
              </th>
              <th onClick={() => handleSort("endDate")}>
                End Date {getSortIcon("endDate")}
              </th>
              <th onClick={() => handleSort("isActive")}>
                Status {getSortIcon("isActive")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((rate) => (
              <tr key={rate.id}>
                <td>{rate.name}</td>
                <td>{rate.country}</td>
                <td>{rate.state || "-"}</td>
                {/* <td>{rate.city || '-'}</td> */}
                <td>{rate.zipCode || "-"}</td>
                <td>
                  <TaxRateValue>
                    {rate.rate}
                    {rate.calculationType ===
                    TaxCalculationTypeFrontend.PERCENTAGE
                      ? "%"
                      : ` ${rate.currencyCode || ""}`}
                  </TaxRateValue>
                </td>
                <td>
                  <TaxTypeChip $type={rate.calculationType}>
                    {rate.calculationType.replace("_", " ")}
                  </TaxTypeChip>
                </td>
                <td>{rate.applicability.replace("_", " ")}</td>
                <td>{new Date(rate.startDate).toLocaleDateString()}</td>
                <td>
                  {rate.endDate
                    ? new Date(rate.endDate).toLocaleDateString()
                    : "Ongoing"}
                </td>
                <td>
                  <TaxStatusBadge $active={rate.isActive}>
                    {rate.isActive ? "Active" : "Inactive"}
                  </TaxStatusBadge>
                </td>
                <td>
                  <TableActionButton
                    onClick={() => onEditTaxRate(rate._id)}
                    title="Edit Tax Rate"
                  >
                    <FaEdit />
                  </TableActionButton>
                  <TableActionButton
                    onClick={() => openDeleteModal(rate)}
                    title="Delete Tax Rate"
                    style={{ color: theme.colors.adminStatusError }}
                  >
                    <FaTrashAlt />
                  </TableActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>
    );
  };

  return (
    <TaxRateListContainer>
      <TaxRateListHeader>
        <HeaderTitle>Tax Rates ({totalFilteredItems})</HeaderTitle>{" "}
        {/* Show count of filtered items */}
        <AdminButton $variant="primary" onClick={onAddTaxRate}>
          <FaPlus /> Add New Tax Rate
        </AdminButton>
      </TaxRateListHeader>

      <SearchAndFilterBar>
        <TaxSearchInput
          type="text"
          placeholder="Search by name, country, zip..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoadingTaxRates && allTaxRates.length === 0}
        />
        <TaxFilterSelect
          value={filterCountry}
          onChange={(e) => handleFilterChange(e, "country")}
          disabled={isLoadingTaxRates && allTaxRates.length === 0}
        >
          <option value="all">All Countries</option>
          {uniqueCountries
            .filter((c) => c !== "all")
            .map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCode}
              </option> /* TODO: Map to country names */
            ))}
        </TaxFilterSelect>
        <TaxFilterSelect
          value={filterIsActive}
          onChange={(e) => handleFilterChange(e, "isActive")}
          disabled={isLoadingTaxRates && allTaxRates.length === 0}
        >
          <option value="all">All Statuses</option>
          <option value="yes">Active</option>
          <option value="no">Inactive</option>
        </TaxFilterSelect>
        <AdminButton
          $variant="neutral"
          onClick={() => refetch()}
          disabled={isFetching}
          style={{ minWidth: "100px" }}
        >
          {isFetching && !isLoadingTaxRates ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            <FiFilter />
          )}
          {isFetching && !isLoadingTaxRates ? "Refreshing..." : "Refresh"}
        </AdminButton>
      </SearchAndFilterBar>

      {isFetching && !isLoadingTaxRates && allTaxRates.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: theme.spacing(1.5),
            marginBottom: theme.spacing(2),
            color: theme.colors.adminTextSecondary,
            fontSize: "0.85em",
            fontStyle: "italic",
            background: rgba(theme.colors.accent1 || "#007bff", 0.05),
            borderRadius: "4px",
            border: `1px solid ${rgba(theme.colors.accent1 || "#007bff", 0.1)}`,
          }}
        >
          <FaSpinner
            style={{
              fontSize: "0.9em",
              marginRight: theme.spacing(1.5),
              verticalAlign: "middle",
            }}
            className="spinner-icon"
          />
          Updating list...
        </div>
      )}

      {renderMainContent()}

      {totalFilteredItems > 0 &&
        currentTableData.length > 0 &&
        totalPages > 1 && (
          <TableFooter>
            <span>
              Showing {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfFirstItem + itemsPerPage, totalFilteredItems)} of{" "}
              {totalFilteredItems} tax rates
            </span>
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlePaginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              {/* Basic Pagination - Can be enhanced */}
              {[...Array(totalPages).keys()].map((num) => (
                <PaginationButton
                  key={num + 1}
                  onClick={() => handlePaginate(num + 1)}
                  $active={currentPage === num + 1}
                >
                  {num + 1}
                </PaginationButton>
              ))}
              <PaginationButton
                onClick={() => handlePaginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          </TableFooter>
        )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete Tax Rate"
        message={`Are you sure you want to delete the tax rate "${
          taxRateToDelete?.name || ""
        }"? This action cannot be undone.`}
        confirmButtonText="Delete"
        isDanger={true}
        isLoading={deleteTaxRateMutation.isPending}
      />
    </TaxRateListContainer>
  );
};

export default TaxRateList;
