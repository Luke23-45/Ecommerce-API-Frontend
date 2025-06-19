import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaTags,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPercentage,
  FaDollarSign,
  FaShippingFast,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { rgba } from "polished";

import {
  DiscountListContainer,
  DiscountListHeader,
  HeaderTitle,
  SearchAndFilterBar,
  DiscountSearchInput,
  DiscountFilterSelect,
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  DiscountStatusBadge,
  InfoChip,
  TableFooter,
  PaginationContainer,
  PaginationButton,
  NoDiscountsMessage,
} from "./DiscountList.styles";

import { AdminButton } from "../../Dashboard/Common/Common.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import {
  useGetPaginatedDiscounts,
  useDeleteDiscount,
} from "@/hooks/admin/checkoutsession/useDiscount";
import {
  type IDiscountResponse,
  type IDiscountListApiParams,
  DiscountType,
  DiscountApplicability,
} from "@/types/discount.interfaces";
import { useNotification } from "@/contexts/NotificationContext";


type SortableDiscountColumn = keyof Pick<
  IDiscountResponse,
  | "code"
  | "name"
  | "type"
  | "value"
  | "startDate"
  | "endDate"
  | "isActive"
  | "usageCount"
>;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE_DEFAULT = 10;

const DiscountList = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const theme = useTheme() as DefaultTheme;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | DiscountType>("all");
  const [filterApplicability, setFilterApplicability] = useState<
    "all" | DiscountApplicability
  >("all");
  const [filterIsActive, setFilterIsActive] = useState<
    "all" | "true" | "false"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableDiscountColumn;
    direction: SortDirection;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] =
    useState<IDiscountResponse | null>(null);

  const apiQueryParameters: IDiscountListApiParams = useMemo(() => {
    const filterObject: Record<string, any> = {};
    if (searchTerm.trim()) {
      filterObject.$or = [
        { code: { $regex: searchTerm.trim(), $options: "i" } },
        { name: { $regex: searchTerm.trim(), $options: "i" } },
      ];
    }
    if (filterType !== "all") filterObject.type = filterType;
    if (filterApplicability !== "all")
      filterObject.applicability = filterApplicability;
    if (filterIsActive !== "all")
      filterObject.isActive = filterIsActive === "true";

    const params: IDiscountListApiParams = {
      page: currentPage,
      limit: itemsPerPage,
      lean: true,
    };
    if (Object.keys(filterObject).length > 0) {
      params.filter = JSON.stringify(filterObject);
    }
    if (sortConfig.key) {
      const sortObj: Record<string, 1 | -1> = {
        [sortConfig.key]: sortConfig.direction === "asc" ? 1 : -1,
      };
      params.sort = JSON.stringify(sortObj);
    }

    return params;
  }, [
    searchTerm,
    filterType,
    filterApplicability,
    filterIsActive,
    currentPage,
    itemsPerPage,
    sortConfig,
  ]);

  const {
    data: paginatedDiscountsResponse,
    isLoading: isInitialLoading,
    isError,
    error: fetchErrorData,
    isFetching,
    refetch,
  } = useGetPaginatedDiscounts(apiQueryParameters, { keepPreviousData: true });
  // console.log("paginatedDiscountsResponse",paginatedDiscountsResponse.data.data)
  const discounts = paginatedDiscountsResponse?.data?.data || [];
  const paginationInfo = paginatedDiscountsResponse?.pagination;
  const totalDiscounts = paginationInfo?.totalItems || 0;
  const totalPages =
    paginationInfo?.totalPages ||
    (totalDiscounts > 0 ? Math.ceil(totalDiscounts / itemsPerPage) : 0);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const onAddDiscount = () => {
    navigate("/admin/checkoutsession/discount/new", { replace: true });
  };

  const deleteDiscountMutation = useDeleteDiscount({
    onSuccess: (_data, deletedDiscountId) => {
      showNotification(
        `Discount "${
          discountToDelete?.name || discountToDelete?.code || deletedDiscountId
        }" deleted successfully!`,
        "success"
      );
      setIsDeleteModalOpen(false);
      setDiscountToDelete(null);
      refetch()
    },
    onError: (err: any, deletedDiscountId) => {
      showNotification(
        `Failed to delete discount "${
          discountToDelete?.name || discountToDelete?.code || deletedDiscountId
        }": ${err.message || "Unknown error"}`,
        "error"
      );
      setIsDeleteModalOpen(false);
      setDiscountToDelete(null);
    },
  });

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
      filterField: "type" | "applicability" | "isActive"
    ) => {
      const value = e.target.value;
      if (filterField === "type") setFilterType(value as "all" | DiscountType);
      if (filterField === "applicability")
        setFilterApplicability(value as "all" | DiscountApplicability);
      if (filterField === "isActive")
        setFilterIsActive(value as "all" | "true" | "false");
      setCurrentPage(1);
    },
    []
  );

  const handleSort = useCallback((column: SortableDiscountColumn) => {
    setSortConfig((currentSortConfig) => ({
      key: column,
      direction:
        currentSortConfig.key === column &&
        currentSortConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const handlePaginate = useCallback(
    (pageNumber: number) => {
      if (
        pageNumber >= 1 &&
        pageNumber <= totalPages &&
        pageNumber !== currentPage
      ) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages, currentPage]
  );

  const openDeleteModal = (discount: IDiscountResponse) => {

    console.log("discountdiscount", discount)
    setDiscountToDelete(discount);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDiscount = () => {

    console.log(" discountToDelete.id", discountToDelete._id)
    if (discountToDelete && discountToDelete._id) {
      deleteDiscountMutation.mutate(discountToDelete._id);
    }
  };

  const getSortIcon = (column: SortableDiscountColumn) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  const formatDiscountValue = (
    value: number,
    type: DiscountType,
    currency?: string
  ) => {
    if (type === DiscountType.PERCENTAGE) return `${value}%`;
    if (type === DiscountType.FIXED_AMOUNT)
      return `${currency || "$"}${value.toFixed(2)}`;
    if (type === DiscountType.FREE_SHIPPING) return "Free Shipping";
    if (type === DiscountType.BUY_X_GET_Y)
      return `Rule Based (Value: ${value})`;
    return value.toString();
  };

  const onEditDiscount = (discountId: string) => {
    navigate(`/admin/checkoutsession/discount/edit/${discountId}`);
  };

  const renderMainContent = () => {
    if (isInitialLoading && discounts.length === 0) {
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
          <LoadingSpinner message="Loading discounts..." />
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
            Error loading discounts:{" "}
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
    if (discounts.length === 0 && !isFetching) {
      return (
        <NoDiscountsMessage>
          <FaTags /> 
          <p>
            {searchTerm ||
            filterType !== "all" ||
            filterApplicability !== "all" ||
            filterIsActive !== "all"
              ? "No discounts found matching your criteria."
              : 'No discounts created yet. Click "Create New Discount" to get started.'}
          </p>
        </NoDiscountsMessage>
      );
    }

    return (
      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort("code")}>
                Code {getSortIcon("code")}
              </th>
              <th onClick={() => handleSort("name")}>
                Name {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("type")}>
                Type {getSortIcon("type")}
              </th>
              <th onClick={() => handleSort("value")}>
                Value {getSortIcon("value")}
              </th>
              <th>Applicability</th>
              <th>Usage</th>
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
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td>
                  <strong>{discount.code}</strong>
                </td>
                <td>{discount.name}</td>
                <td>
                  <InfoChip>{discount.type.replace("_", " ")}</InfoChip>
                </td>
                <td>
                  {formatDiscountValue(discount.value, discount.type, "USD")}
                </td>{" "}
                {/* Assuming USD, pass from product/settings context */}
                <td>
                  <InfoChip>
                    {discount.applicability.replace("_", " ")}
                  </InfoChip>
                </td>
                <td>
                  {discount.usageCount} /{" "}
                  {discount.usageLimit === null ||
                  discount.usageLimit === undefined ||
                  discount.usageLimit === 0
                    ? "∞"
                    : discount.usageLimit}
                </td>
                <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                <td>
                  {discount.endDate
                    ? new Date(discount.endDate).toLocaleDateString()
                    : "No End"}
                </td>
                <td>
                  <DiscountStatusBadge $isActive={discount.isActive}>
                    {discount.isActive ? "Active" : "Inactive"}
                  </DiscountStatusBadge>
                </td>
                <td>
                  <TableActionButton
                    onClick={() => onEditDiscount(discount._id)}
                    title={`Edit ${discount.name}`}
                  >
                    <FaEdit />
                  </TableActionButton>
                  <TableActionButton
                    onClick={() => openDeleteModal(discount)}
                    title={`Delete ${discount.name}`}
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
    <DiscountListContainer>
      <DiscountListHeader>
        <HeaderTitle>Discount Management ({totalDiscounts})</HeaderTitle>
        <AdminButton $variant="primary" onClick={onAddDiscount}>
          <FaPlus /> Create New Discount
        </AdminButton>
      </DiscountListHeader>

      <SearchAndFilterBar>
        <DiscountSearchInput
          type="text"
          placeholder="Search by code or name..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isInitialLoading && discounts.length === 0}
        />
        <DiscountFilterSelect
          value={filterType}
          onChange={(e) => handleFilterChange(e, "type")}
          disabled={isInitialLoading && discounts.length === 0}
        >
          <option value="all">All Types</option>
          {Object.values(DiscountType).map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </DiscountFilterSelect>
        <DiscountFilterSelect
          value={filterApplicability}
          onChange={(e) => handleFilterChange(e, "applicability")}
          disabled={isInitialLoading && discounts.length === 0}
        >
          <option value="all">All Applicabilities</option>
          {Object.values(DiscountApplicability).map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </DiscountFilterSelect>
        <DiscountFilterSelect
          value={filterIsActive}
          onChange={(e) => handleFilterChange(e, "isActive")}
          disabled={isInitialLoading && discounts.length === 0}
        >
          <option value="all">All Statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </DiscountFilterSelect>
        {/* You could add a refresh button if needed:
        <AdminButton $variant="neutral" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <FaSpinner className="spinner-icon" /> : <FiFilter />}
          {isFetching ? 'Refreshing...' : 'Refresh List'}
        </AdminButton>
        */}
      </SearchAndFilterBar>

      {isFetching && !isInitialLoading && discounts.length > 0 && (
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
          Updating discount list...
        </div>
      )}

      {renderMainContent()}

      {totalDiscounts > 0 && discounts.length > 0 && (
        <TableFooter>
          <span>
            Showing {discounts.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
            {Math.min(indexOfFirstItem + itemsPerPage, totalDiscounts)} of{" "}
            {totalDiscounts} discounts
          </span>
          <PaginationContainer>
            <PaginationButton
              onClick={() => handlePaginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            {/* Implement robust pagination UI here */}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationButton
                key={i + 1}
                onClick={() => handlePaginate(i + 1)}
                $active={currentPage === i + 1}
              >
                {i + 1}
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
        onConfirm={confirmDeleteDiscount}
        title="Confirm Delete Discount"
        message={`Are you sure you want to delete the discount "${
          discountToDelete?.code || discountToDelete?.name || ""
        }"? This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isDanger={true}

        isLoading={deleteDiscountMutation.isPending}
      />
    </DiscountListContainer>
  );
};

export default DiscountList;
