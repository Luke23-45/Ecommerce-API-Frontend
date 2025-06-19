// src/components/Admin/Settings/Shipping/ShippingRateList.tsx

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaRoute,
  FaArrowLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  RateListContainer,
  RateListHeader,
  HeaderTitle,
  ParentZoneContext,
  RateSearchAndFilterBar,
  RateSearchInput,
  NoRatesMessage,
  RateTypeChip,
  ConditionsText,
  StatusBadge,
} from "./ShippingRateList.styles";

import { AdminButton } from "../../../Dashboard/Common/Common.styles";
import {
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
} from "../../../Products/ProductList.styles";

import {
  useGetShippingZoneById,
  useGetShippingRatesByZoneId,
  useDeleteShippingRate,
} from "@/hooks/admin/checkoutsession/useShipping";
import {
  type IShippingRateResponse,
  type IShippingRule,
} from "@/types/shipping.types";
import { useNotification } from "@/contexts/NotificationContext";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

// --- Types for Sorting ---
type SortableRateColumn = keyof Pick<
  IShippingRateResponse,
  "name" | "type" | "cost" | "isActive" | "createdAt"
>;
type SortDirection = "asc" | "desc";

// --- ENHANCEMENT: Helper component for rendering conditions cleanly ---
const RenderRateConditions: React.FC<{ rate: IShippingRateResponse }> = ({
  rate,
}) => {
  const conditions = [];

  if (rate.rules && rate.rules.length > 0) {
    const type = rate.type.replace("by_", ""); // by_price -> price
    conditions.push(`${rate.rules.length} ${type} tier(s)`);
  }

  // You can add more conditions here as your data model evolves
  // e.g., if (rate.minWeight) conditions.push(`Min Weight: ${rate.minWeight}kg`);

  if (conditions.length === 0) {
    return <>-</>;
  }

  return (
    <ConditionsText>
      {conditions.map((text, index) => (
        <span key={index}>{text}</span>
      ))}
    </ConditionsText>
  );
};

const ShippingRateList: React.FC = () => {
  const navigate = useNavigate();
  const { zoneId } = useParams<{ zoneId: string }>();
  const { showNotification } = useNotification();
  const theme = useTheme() as DefaultTheme;

  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableRateColumn;
    direction: SortDirection;
  }>({ key: "name", direction: "asc" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rateToDelete, setRateToDelete] =
    useState<IShippingRateResponse | null>(null);

  // --- React Query Hooks ---
  // 1. Fetch Parent Shipping Zone details
  const {
    data: parentZone, // FIX: The hook returns the object directly, not wrapped in `.data`
    isLoading: isLoadingZoneDetails,
    isError: isZoneDetailsError,
    error: zoneDetailsErrorObj,
  } = useGetShippingZoneById(zoneId, { enabled: !!zoneId });

  // 2. Fetch Shipping Rates for the current zoneId
  const {
    data: ratesApiResponse,
    isLoading: isLoadingRates,
    isError: isRatesFetchError,
    error: ratesFetchErrorObj,
    isFetching: isFetchingRates,
    refetch: refetchRates,
  } = useGetShippingRatesByZoneId(zoneId, { enabled: !!zoneId });

  // FIX: The API returns a direct array, so this is correct.
  const allRatesForZone = ratesApiResponse || [];

  // --- Data Processing ---
  const processedRates = useMemo(() => {
    let filtered = [...allRatesForZone];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (rate) =>
          rate.name.toLowerCase().includes(term) ||
          (rate.description && rate.description.toLowerCase().includes(term)) ||
          rate.type.toLowerCase().includes(term)
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof IShippingRateResponse];
        const bValue = b[sortConfig.key as keyof IShippingRateResponse];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortConfig.direction === "asc"
            ? Number(bValue) - Number(aValue)
            : Number(aValue) - Number(bValue);
        }
        // Default to string comparison
        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return filtered;
  }, [allRatesForZone, searchTerm, sortConfig]);

  // --- Mutations ---
  const deleteRateMutation = useDeleteShippingRate({
    onSuccess: (_data, deletedRateId) => {
      showNotification(
        `Shipping Rate "${rateToDelete?.name || deletedRateId}" deleted.`,
        "success"
      );
      setIsDeleteModalOpen(false);
      setRateToDelete(null);
    },
    onError: (err: any, deletedRateId) => {
      showNotification(
        `Failed to delete rate "${rateToDelete?.name || deletedRateId}": ${
          err.message
        }`,
        "error"
      );
      setIsDeleteModalOpen(false);
      setRateToDelete(null);
    },
  });

  // --- Handlers ---
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    []
  );
  const handleSort = useCallback((column: SortableRateColumn) => {
    setSortConfig((cfg) => ({
      key: column,
      direction: cfg.key === column && cfg.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // ENHANCEMENT: Standardized navigation paths
  const handleAddRate = () =>
    navigate(`/admin/checkoutsession/shippingzones/shippingrate/new/${zoneId}`);
  const handleEditRate = (rateId: string) =>
    navigate(`/admin/checkoutsession/shippingzones/shippingrate/edit/${zoneId}/${rateId}`);

  const openDeleteModal = (rate: IShippingRateResponse) => {
    setRateToDelete(rate);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRate = () => {
    // FIX: Use `_id` to match the data structure from the API
    if (rateToDelete?._id) {
      deleteRateMutation.mutate(rateToDelete._id);
    } else {
      showNotification("Cannot delete rate: ID is missing.", "error");
    }
  };

  const getSortIcon = (column: SortableRateColumn) => {
    if (sortConfig.key === column)
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  // --- Render Logic ---
  // ENHANCEMENT: Simplified and clearer loading/error states
  if (isLoadingZoneDetails || isLoadingRates) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <LoadingSpinner message="Loading shipping rates..." />
      </div>
    );
  }

  if (!zoneId || isZoneDetailsError || !parentZone) {
    return (
      <RateListContainer>
        <RateListHeader>
          <HeaderTitle>Error</HeaderTitle>
        </RateListHeader>
        <NoRatesMessage>
          <FaExclamationTriangle />
          <p>
            {isZoneDetailsError
              ? (zoneDetailsErrorObj as any)?.message
              : `Shipping Zone with ID '${zoneId}' not found.`}
          </p>
          <AdminButton
            $variant="secondary"
            onClick={() =>
              navigate("/admin/checkoutsession/shippingzones/list")
            }
          >
            <FaArrowLeft /> Back to Zones
          </AdminButton>
        </NoRatesMessage>
      </RateListContainer>
    );
  }

  return (
    <RateListContainer>
      <RateListHeader>
        <div>
          <HeaderTitle>Shipping Rates</HeaderTitle>
          <ParentZoneContext>
            for Zone: <strong>{parentZone.name}</strong>
          </ParentZoneContext>
        </div>
        <div style={{ display: "flex", gap: theme.spacing(3) }}>
          <AdminButton
            $variant="secondary"
            onClick={() =>
              navigate("/admin/checkoutsession/shippingzones/list")
            }
            title="Back to All Shipping Zones"
          >
            <FaArrowLeft /> Back to Zones
          </AdminButton>
          <AdminButton $variant="primary" onClick={handleAddRate}>
            <FaPlus /> Add New Rate
          </AdminButton>
        </div>
      </RateListHeader>

      <RateSearchAndFilterBar>
        <RateSearchInput
          type="text"
          placeholder="Search rates by name or type..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <AdminButton
          $variant="neutral"
          onClick={() => refetchRates()}
          disabled={isFetchingRates}
          style={{ minWidth: "100px" }}
        >
          {isFetchingRates ? <FaSpinner className="spinner-icon" /> : "Refresh"}
        </AdminButton>
      </RateSearchAndFilterBar>

      {isRatesFetchError ? (
        <NoRatesMessage>
          <FaExclamationTriangle />
          <p>
            Could not load shipping rates:{" "}
            {(ratesFetchErrorObj as any)?.message}
          </p>
        </NoRatesMessage>
      ) : processedRates.length === 0 ? (
        <NoRatesMessage>
          <FaRoute />
          <p>
            {searchTerm
              ? "No rates found matching your search."
              : `Zone "${parentZone.name}" has no shipping rates yet.`}
          </p>
        </NoRatesMessage>
      ) : (
        <AdminTableWrapper>
          <AdminTable>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Rate Name {getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("type")}>
                  Type {getSortIcon("type")}
                </th>
                <th onClick={() => handleSort("cost")}>
                  Base Cost {getSortIcon("cost")}
                </th>
                <th>Conditions</th>
                <th>Description</th>
                <th onClick={() => handleSort("isActive")}>
                  Status {getSortIcon("isActive")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedRates.map((rate) => (
                // FIX: Use `_id` for the React key
                <tr key={rate._id}>
                  <td>{rate.name}</td>
                  <td>
                    <RateTypeChip $rateType={rate.type}>
                      {rate.type.replace(/_/g, " ")}
                    </RateTypeChip>
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(rate.cost)}
                  </td>
                  <td>
                    <RenderRateConditions rate={rate} />
                  </td>
                  <td>{rate.description || "-"}</td>
                  <td>
                    <StatusBadge $active={rate.isActive}>
                      {rate.isActive ? "Active" : "Inactive"}
                    </StatusBadge>
                  </td>
                  <td>
                    {/* FIX: Use `_id` for actions */}
                    <TableActionButton
                      onClick={() => handleEditRate(rate._id)}
                      title="Edit Rate"
                    >
                      <FaEdit />
                    </TableActionButton>
                    <TableActionButton
                      onClick={() => openDeleteModal(rate)}
                      title="Delete Rate"
                      className="delete-btn"
                    >
                      <FaTrashAlt />
                    </TableActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </AdminTableWrapper>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteRate}
        title="Confirm Delete Shipping Rate"
        message={`Are you sure you want to delete the rate "${
          rateToDelete?.name || ""
        }"? This action cannot be undone.`}
        confirmButtonText="Delete"
        isLoading={deleteRateMutation.isPending}
        isDanger={true}
      />
    </RateListContainer>
  );
};

export default ShippingRateList;
