import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaTags,
  FaListOl,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useTheme } from "styled-components";

import {
  AttributeListContainer,
  AttributeListHeader,
  HeaderTitle,
  SearchAndFilterBar,
  AttributeSearchInput,
  AttributeFilterSelect,
  BooleanBadge,
  DisplayTypeChip,
  NoAttributesMessage,
  ManageOptionsButton,
} from "./AttributeList.styles";

import { AdminButton } from "../../Dashboard/Common/Common.styles";
import {
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from "../../Products/ProductList.styles";

import {
  useGetPaginatedAttributes,
  useDeleteAttribute,
} from "@/hooks/admin/product/useAttribute";

import {
  type IAttributeResponse,
  type IAttributeDisplayType,
  type IPaginatedData,
} from "@/types/attribute";
import { useNotification } from "@/contexts/NotificationContext";

import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { LoadingOverlay as LoadingSpinner } from "../../Application/SellerApplications/SellerApplicationList.styles";

interface AttributeListProps {
  onAddAttribute: () => void;
  onEditAttribute: (attributeId: string) => void;
  onManageOptions: (attributeId: string, attributeName: string) => void;
  onClickOption: (value: any) => void;
  isRefetch:boolean;
}

type SortableAttributeColumn =
  | keyof Pick<
      IAttributeResponse,
      "name" | "displayName" | "slug" | "displayType" | "createdAt"
    >
  | "optionsCount";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE_DEFAULT = 10;

const AttributeList: React.FC<AttributeListProps> = ({
  onAddAttribute,
  onEditAttribute,
  onManageOptions,
  onClickOption,
  isRefetch
}) => {
  const { showNotification } = useNotification();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDisplayType, setFilterDisplayType] = useState<
    IAttributeDisplayType | "all"
  >("all");
  const [filterIsFilterable, setFilterIsFilterable] = useState<
    "all" | "yes" | "no"
  >("all");
  const [filterIsRequiredForVariation, setFilterIsRequiredForVariation] =
    useState<"all" | "yes" | "no">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);

const [onOptionSelected, setOnOptionSelected] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableAttributeColumn;
    direction: SortDirection;
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] =
    useState<IAttributeResponse | null>(null);
  const [isRefetchState, setIsRefetchState] = useState(false);

  const apiQueryParameters = useMemo(() => {
    const queryParamsForApi: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: itemsPerPage,
      lean: true,
    };
    const filterObject: Record<string, any> = {};
    if (filterDisplayType !== "all")
      filterObject.displayType = filterDisplayType;
    if (filterIsFilterable !== "all")
      filterObject.isFilterable = filterIsFilterable === "yes";
    if (filterIsRequiredForVariation !== "all")
      filterObject.isRequiredForVariation =
        filterIsRequiredForVariation === "yes";
    if (searchTerm.trim() !== "") {
      filterObject.$or = [
        { name: { $regex: searchTerm.trim(), $options: "i" } },
        { displayName: { $regex: searchTerm.trim(), $options: "i" } },
        { slug: { $regex: searchTerm.trim(), $options: "i" } },
      ];
    }
    if (Object.keys(filterObject).length > 0)
      queryParamsForApi.filter = JSON.stringify(filterObject);

    if (sortConfig.key) {
      const sortObj: Record<string, 1 | -1> = {
        [sortConfig.key]: sortConfig.direction === "asc" ? 1 : -1,
      };
      queryParamsForApi.sort = JSON.stringify(sortObj);
    }
    return queryParamsForApi;
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    filterDisplayType,
    filterIsFilterable,
    filterIsRequiredForVariation,
    sortConfig,
  ]);

  const {
    data: paginatedResponse,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetPaginatedAttributes(apiQueryParameters as any, {
    keepPreviousData: true,
  });

  const attributes = paginatedResponse?.data || [];
  const paginationInfo = paginatedResponse?.pagination;
  const totalAttributes = paginationInfo?.totalItems || 0;
  const totalPages =
    paginationInfo?.totalPages ||
    (totalAttributes > 0 ? Math.ceil(totalAttributes / itemsPerPage) : 0);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const deleteAttributeMutation = useDeleteAttribute({
    onSuccess: (_data, deletedAttributeId) => {
      showNotification(
        `Attribute "${attributeToDelete?.name || deletedAttributeId}" deleted successfully!`,
        "success"
      );
      setAttributeToDelete(null);
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        refetch();
      }, 200);
    },
    onError: (err: any, deletedAttributeId) => {
      showNotification(
        `Failed to delete attribute "${attributeToDelete?.name || deletedAttributeId}": ${err.message || "Unknown error"}`,
        "error"
      );
      setAttributeToDelete(null);
      setIsDeleteModalOpen(false);
    },
  });


  const handleClickOption = useCallback(() => {
    const result = onOptionSelected;
    onClickOption(result);
  }, [onOptionSelected]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, filterType: string) => {
      const value = e.target.value;
      if (filterType === "displayType")
        setFilterDisplayType(value as IAttributeDisplayType | "all");
      if (filterType === "isFilterable")
        setFilterIsFilterable(value as "all" | "yes" | "no");
      if (filterType === "isRequiredForVariation")
        setFilterIsRequiredForVariation(value as "all" | "yes" | "no");
      setCurrentPage(1);
    },
    []
  );

  const handleSort = useCallback((column: SortableAttributeColumn) => {
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
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  const openDeleteModal = (attribute: IAttributeResponse) => {
    setAttributeToDelete(attribute);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAttribute = () => {
    if (attributeToDelete && attributeToDelete._id) {
      deleteAttributeMutation.mutate(attributeToDelete._id);
    } else {
      console.error(
        "Attempted to delete attribute without a valid _id:",
        attributeToDelete
      );
      showNotification("Cannot delete attribute: ID is missing.", "error");
      setIsDeleteModalOpen(false);
      setAttributeToDelete(null);
    }
  };

  useEffect(() => {
    if (isRefetch) {
      console.log('Refetching data...');
      refetch();
      setIsRefetchState(false); 
    }
  }, [isRefetch, refetch]); 

  const handleTriggerRefetch = () => {
    setIsRefetchState(true);
  };
  const getSortIcon = (column: SortableAttributeColumn) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  const renderMainContent = () => {
    if (isLoading && attributes.length === 0) {
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
          <LoadingSpinner message="Loading attributes..." />
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
            color: theme.colors.adminStatusError,
            marginTop: theme.spacing(5),
          }}
        >
          <p>Error loading attributes: {error?.message || "Unknown error"}</p>
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
    if (attributes.length === 0 && !isFetching) {
      return (
        <NoAttributesMessage>
          <FaTags />
          <p>
            {searchTerm ||
            filterDisplayType !== "all" ||
            filterIsFilterable !== "all" ||
            filterIsRequiredForVariation !== "all"
              ? "No attributes found matching your criteria. Try adjusting your filters."
              : 'No attributes created yet. Click "Add New Attribute" to get started.'}
          </p>
        </NoAttributesMessage>
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
              <th onClick={() => handleSort("displayName")}>
                Display Name {getSortIcon("displayName")}
              </th>
              <th onClick={() => handleSort("slug")}>
                Slug {getSortIcon("slug")}
              </th>
              <th onClick={() => handleSort("displayType")}>
                Display Type {getSortIcon("displayType")}
              </th>
              <th>Options Count</th>
              <th>Filterable</th>
              <th>For Variation</th>
              <th onClick={() => handleSort("createdAt")}>
                Created At {getSortIcon("createdAt")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr._id}>
                <td>{attr.name}</td>
                <td>{attr.displayName || "-"}</td>
                <td>{attr.slug}</td>
                <td>
                  <DisplayTypeChip>{attr.displayType}</DisplayTypeChip>
                </td>
                <td>{(attr as any).optionsCount || 0}</td>
                <td>
                  <BooleanBadge $active={!!attr.isFilterable}>
                    {attr.isFilterable ? "Yes" : "No"}
                  </BooleanBadge>
                </td>
                <td>
                  <BooleanBadge $active={!!attr.isRequiredForVariation}>
                    {attr.isRequiredForVariation ? "Yes" : "No"}
                  </BooleanBadge>
                </td>
                <td>{new Date(attr.createdAt).toLocaleDateString()}</td>
                <td>
                  <ManageOptionsButton
                    onClick={() =>
                      attr._id && onManageOptions(attr._id, attr.name)
                    }
                    title="Manage Options"
                    disabled={!attr._id}
                  >
                    <FaListOl /> Options
                  </ManageOptionsButton>
                  <TableActionButton
                    onClick={() => {
                      if (attr._id) {
                        onEditAttribute(attr._id);
                      } else {
                        console.error(
                          "Attempted to edit attribute with undefined _id:",
                          attr
                        );
                        showNotification(
                          "Cannot edit attribute: ID is missing.",
                          "error"
                        );
                      }
                    }}
                    title="Edit Attribute"
                    disabled={!attr._id}
                  >
                    <FaEdit />
                  </TableActionButton>
                  <TableActionButton
                    onClick={() => openDeleteModal(attr)}
                    title="Delete Attribute"
                    disabled={!attr._id}
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
    <AttributeListContainer>
      <AttributeListHeader>
        <HeaderTitle>Product Attributes ({totalAttributes})</HeaderTitle>
        <AdminButton $variant="primary" onClick={onAddAttribute}>
          <FaPlus /> Add New Attribute
        </AdminButton>
      </AttributeListHeader>

      <SearchAndFilterBar>
        <AttributeSearchInput
          type="text"
          placeholder="Search by name, display name, slug..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <AttributeFilterSelect
          value={filterDisplayType}
          onChange={(e) => handleFilterChange(e, "displayType")}
        >
          <option value="all">All Display Types</option>
          <option value="dropdown">Dropdown</option>
          <option value="swatch">Swatch</option>
          <option value="radio">Radio</option>
          <option value="text">Text</option>
        </AttributeFilterSelect>
        <AttributeFilterSelect
          value={filterIsFilterable}
          onChange={(e) => handleFilterChange(e, "isFilterable")}
        >
          <option value="all">All Filterable</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </AttributeFilterSelect>
        <AttributeFilterSelect
          value={filterIsRequiredForVariation}
          onChange={(e) => handleFilterChange(e, "isRequiredForVariation")}
        >
          <option value="all">All Variation Requirement</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </AttributeFilterSelect>
        <AdminButton
          $variant="neutral"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          style={{ minWidth: "120px" }}
        >
          {(isFetching && attributes.length > 0) ||
          (isLoading && attributes.length === 0) ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            <FiFilter />
          )}
          {(isFetching && attributes.length > 0) ||
          (isLoading && attributes.length === 0)
            ? "Applying..."
            : "Apply Filters"}
        </AdminButton>
      </SearchAndFilterBar>

      {isFetching && attributes.length > 0 && !isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: theme.spacing(1.5),
            marginBottom: theme.spacing(2),
            color: theme.colors.adminTextSecondary,
            fontSize: "0.85em",
            fontStyle: "italic",
            backgroundColor:
              theme.colors.adminInfoBg || "rgba(0, 123, 255, 0.05)",
            border: `1px solid ${theme.colors.adminInfoBorder || "rgba(0, 123, 255, 0.2)"}`,
            borderRadius: "4px",
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

      {totalAttributes > 0 && attributes.length > 0 && (
        <TableFooter>
          <span>
            Showing {attributes.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
            {Math.min(indexOfFirstItem + itemsPerPage, totalAttributes)} of{" "}
            {totalAttributes} attributes
          </span>
          <PaginationContainer>
            <PaginationButton
              className="prev-next-btn"
              onClick={() => handlePaginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumToShow = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                if (currentPage + 2 <= totalPages) {
                  pageNumToShow = currentPage - 2 + i;
                } else {
                  pageNumToShow = totalPages - 4 + i;
                }
              }
              if (pageNumToShow > totalPages) return null;

              return (
                <PaginationButton
                  key={pageNumToShow}
                  onClick={() => handlePaginate(pageNumToShow)}
                  $active={currentPage === pageNumToShow}
                >
                  {pageNumToShow}
                </PaginationButton>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && <span>...</span>}
            {totalPages > 5 && currentPage < totalPages - 1 && (
              <PaginationButton
                key={totalPages}
                onClick={() => handlePaginate(totalPages)}
                $active={currentPage === totalPages}
              >
                {totalPages}
              </PaginationButton>
            )}
            <PaginationButton
              className="prev-next-btn"
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
        onConfirm={confirmDeleteAttribute}
        title="Confirm Delete Attribute"
        message={`Are you sure you want to delete the attribute "${attributeToDelete?.name || ""}"? This will also delete all its associated options and cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isDanger={true}
        isLoading={deleteAttributeMutation.isPending}
      />
    </AttributeListContainer>
  );
};

export default AttributeList;
