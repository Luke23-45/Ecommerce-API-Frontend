import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaListUl,
  FaArrowLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
} from "react-icons/fa";
import { useTheme } from "styled-components";

import {
  OptionListContainer,
  OptionListHeader,
  HeaderTitle,
  ParentAttributeName,
  OptionSearchAndFilterBar,
  OptionSearchInput,
  NoOptionsMessage,
} from "./AttributeOptionList.styles";
import { SwatchPreview } from "./AttributeOptionList.styles";

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
  useGetAttributeById,
  useGetPaginatedAttributeOptions,
  useDeleteAttributeOption,
} from "@/hooks/admin/product/useAttribute";
import {
  type IAttributeOptionResponse,
  type IPaginatedData,
  type IAttributeResponse,
} from "@/types/attribute";
import { useNotification } from "@/contexts/NotificationContext";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { LoadingOverlay as LoadingSpinner } from "../../Application/SellerApplications/SellerApplicationList.styles";
type SortableOptionColumn = keyof Pick<
  IAttributeOptionResponse,
  "value" | "displayName" | "slug" | "createdAt"
>;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;
interface AttributeOptionListProps {
  attributeId: string;
  onEditAttributeOption: (attributeId: string) => void;
}

const AttributeOptionList: React.FC<AttributeOptionListProps> = ({
  attributId,
  onClickBackList,
  onEditAttributeOption,
}) => {

  const navigate = useNavigate();

  const attributeId = attributId;
  const { showNotification } = useNotification();
  const theme = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortableOptionColumn>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] =
    useState<IAttributeOptionResponse | null>(null);

  const { data: parentAttribute, isLoading: isLoadingParentAttr,refetch } =
    useGetAttributeById(attributeId, "name displayType", {
      enabled: !!attributeId,
    });

  const queryParams = useMemo(() => {
    const filter: Record<string, any> = { attributeId };
    if (searchTerm) {
      filter.$or = [
        { value: { $regex: searchTerm, $options: "i" } },
        { displayName: { $regex: searchTerm, $options: "i" } },
        { slug: { $regex: searchTerm, $options: "i" } },
      ];
    }
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      filter,
      sort: { [sortColumn]: sortDirection === "asc" ? 1 : -1 } as Record<
        string,
        1 | -1
      >,
    };
  }, [attributeId, searchTerm, currentPage, sortColumn, sortDirection]);

  console.log(queryParams,"00000000000")

  const {
    data: paginatedOptionsData,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
    error: optionsFetchError,
    isFetching: isFetchingOptions,
    refetch: refetchOptions,
  } = useGetPaginatedAttributeOptions(queryParams, {
    enabled: !!attributeId,
    keepPreviousData: true,
  });

  const options = paginatedOptionsData?.data || [];
  const totalOptions = paginatedOptionsData?.totalCount || 0;
  const totalPages =
    paginatedOptionsData?.pagination?.totalPages ||
    Math.ceil(totalOptions / ITEMS_PER_PAGE);

  const deleteOptionMutation = useDeleteAttributeOption({
    onSuccess: () => {
      showNotification(
        `Option "${optionToDelete?.value}" deleted successfully!`,
        "success"
      );

      setIsDeleteModalOpen(false);
      setOptionToDelete(null);
    },
    onError: (err: any) => {
      showNotification(
        `Failed to delete option: ${err.message || "Unknown error"}`,
        "error"
      );
      setIsDeleteModalOpen(false);
      setOptionToDelete(null);
    },
  });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleSort = useCallback(
    (column: SortableOptionColumn) => {
      setSortDirection((prevDir) =>
        sortColumn === column && prevDir === "asc" ? "desc" : "asc"
      );
      setSortColumn(column);
      setCurrentPage(1);
    },
    [sortColumn]
  );

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleAddOption = () => {
    if (attributeId) {
      navigate(`/admin/attributes/${attributeId}/options/new`);
    }
  };

  const handleEditOption = (optionId: string) => {
    if (attributeId) {
      navigate(`/admin/attributes/${attributeId}/options/${optionId}/edit`);
    }
  };

  const openDeleteModal = (option: IAttributeOptionResponse) => {
    setOptionToDelete(option);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOption = () => {
    if (optionToDelete) {
      deleteOptionMutation.mutate(optionToDelete.id);
    }
  };

  const getSortIcon = (column: SortableOptionColumn) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  useEffect(()=>{
      if (refetch) {
      refetch();
    }
  },[attributeId,refetch])

  const isLoading =
    isLoadingParentAttr || (isLoadingOptions && options.length === 0);

  if (isLoading) {
    return (
      <OptionListContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <LoadingSpinner message="Loading attribute options..." />
        </div>
      </OptionListContainer>
    );
  }

  if (isOptionsError) {
    return (
      <OptionListContainer>
        <OptionListHeader>
          <HeaderTitle>Manage Options</HeaderTitle>
          <AdminButton $variant="secondary" onClick={onClickBackList}>
            <FaArrowLeft /> Back to Attributes
          </AdminButton>
        </OptionListHeader>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "inherit",
            color: theme.colors.adminStatusError,
          }}
        >
          <p>
            Error loading options:{" "}
            {(optionsFetchError as any)?.message || "Unknown error"}
          </p>
          <AdminButton $variant="neutral" onClick={() => refetchOptions()}>
            Try Again
          </AdminButton>
        </div>
      </OptionListContainer>
    );
  }
  if (!parentAttribute && !isLoadingParentAttr) {
    return (
      <OptionListContainer>
        <OptionListHeader>
          <HeaderTitle>Error</HeaderTitle>
          <AdminButton $variant="secondary" onClick={onClickBackList}>
            <FaArrowLeft /> Back to Attributes
          </AdminButton>
        </OptionListHeader>
        <NoOptionsMessage>
          <p>
            Parent attribute not found. Please return to the attributes list.
          </p>
        </NoOptionsMessage>
      </OptionListContainer>
    );
  }

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <OptionListContainer>
      <OptionListHeader>
        <div>
          <HeaderTitle>
            Options for:{" "}
            <ParentAttributeName>
              {parentAttribute?.name || "Attribute"}
            </ParentAttributeName>
          </HeaderTitle>
          <small style={{ color: theme.colors.adminTextSecondary }}>
            (ID: {attributeId})
            {parentAttribute &&
              ` - Display Type: ${parentAttribute.displayType}`}
          </small>
        </div>
        <div style={{ display: "flex", gap: theme.spacing(3) }}>
          <AdminButton
            $variant="secondary"
            onClick={onClickBackList}
            title="Back to Attributes List"
          >
            <FaArrowLeft /> Back to Attributes
          </AdminButton>
          <AdminButton $variant="primary" onClick={handleAddOption}>
            <FaPlus /> Add New Option
          </AdminButton>
        </div>
      </OptionListHeader>

      <OptionSearchAndFilterBar>
        <OptionSearchInput
          type="text"
          placeholder="Search options by value, display name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* Add filters for options if needed in future, e.g., by creation date range */}
        <AdminButton
          $variant="neutral"
          onClick={() => refetchOptions()}
          disabled={isFetchingOptions}
          style={{ minWidth: "100px" }}
        >
          {isFetchingOptions ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            "Refresh"
          )}
        </AdminButton>
      </OptionSearchAndFilterBar>

      {isFetchingOptions && options.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: theme.spacing(1),
            color: theme.colors.adminTextSecondary,
            fontSize: "0.85em",
            fontStyle: "italic",
          }}
        >
          <FaSpinner
            style={{
              fontSize: "0.9em",
              marginRight: theme.spacing(1.5),
              verticalAlign: "middle",
            }}
          />
          Updating list...
        </div>
      )}

      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort("value")}>
                Value {getSortIcon("value")}
              </th>
              <th onClick={() => handleSort("displayName")}>
                Display Name {getSortIcon("displayName")}
              </th>
              <th onClick={() => handleSort("slug")}>
                Slug {getSortIcon("slug")}
              </th>
              {parentAttribute?.displayType === "swatch" && (
                <th>Swatch Preview</th>
              )}
              <th onClick={() => handleSort("createdAt")}>
                Created At {getSortIcon("createdAt")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.length > 0 ? (
              options.map((option) => (
                <tr key={option.id}>
                  <td>{option.value}</td>
                  <td>{option.displayName || "-"}</td>
                  <td>{option.slug}</td>
                  {parentAttribute?.displayType === "swatch" && (
                    <td>
                      {option.swatchValue ? (
                        <SwatchPreview
                          $color={
                            option.swatchValue.startsWith("#")
                              ? option.swatchValue
                              : undefined
                          }
                          $imageUrl={
                            !option.swatchValue.startsWith("#")
                              ? option.swatchValue
                              : undefined
                          }
                          title={option.swatchValue}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  )}
                  <td>{new Date(option.createdAt).toLocaleDateString()}</td>
                  <td>
                    <TableActionButton
                      onClick={() => onEditAttributeOption(option.id)}
                      title="Edit Option"
                    >
                      <FaEdit />
                    </TableActionButton>
                    <TableActionButton
                      onClick={() => openDeleteModal(option)}
                      title="Delete Option"
                    >
                      <FaTrashAlt />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={parentAttribute?.displayType === "swatch" ? 6 : 5}>
                  <NoOptionsMessage>
                    <FaListUl />
                    <p>
                      {searchTerm
                        ? "No options found matching your search."
                        : "This attribute has no options yet. Add one!"}
                    </p>
                  </NoOptionsMessage>
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      {totalOptions > 0 && options.length > 0 && (
        <TableFooter>
          <span>
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfFirstItem + ITEMS_PER_PAGE, totalOptions)} of{" "}
            {totalOptions} options
          </span>
          <PaginationContainer>
            <PaginationButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationButton
                key={i + 1}
                onClick={() => paginate(i + 1)}
                $active={currentPage === i + 1}
              >
                {i + 1}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => paginate(currentPage + 1)}
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
        onConfirm={confirmDeleteOption}
        title="Confirm Delete Option"
        message={`Are you sure you want to delete the option "${optionToDelete?.value || ""}"? This cannot be undone.`}
        confirmButtonText="Delete"
        isLoading={deleteOptionMutation.isPending}
        isDanger={true}
      />
    </OptionListContainer>
  );
};

export default AttributeOptionList;
