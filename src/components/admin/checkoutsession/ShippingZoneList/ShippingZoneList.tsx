// src/components/Admin/Settings/Shipping/ShippingZoneList.tsx

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import { rgba } from "polished";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaMapMarkedAlt,
  FaRoute,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  ZoneListContainer,
  ZoneListHeader,
  HeaderTitle,
  SearchAndFilterBar,
  ZoneSearchInput,
  ZoneFilterSelect,
  StatusBadge,
  CountryCountPill,
  NoZonesMessage,
  ManageRatesButton,
} from "./ShippingZoneList.styles";

import {
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from "../../Products/ProductList.styles";

import { AdminButton } from "../../Dashboard/Common/Common.styles";

import {
  useGetAllShippingZones,
  useDeleteShippingZone,
} from "@/hooks/admin/checkoutsession/useShipping";
import { type IShippingZoneResponse } from "@/types/shipping.types";
import { useNotification } from "@/contexts/NotificationContext";

import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import LoadingSpinner from "../../../common/LoadingSpinner/LoadingSpinner";

interface ShippingZoneListProps {
  onAddZone: () => void;
  onEditZone: (zoneId: string, zoneName: string) => void;
  onManageRates: (zoneId: string, zoneName: string) => void;
}

type SortableZoneColumn =
  | keyof Pick<
      IShippingZoneResponse,
      "name" | "description" | "isActive" | "createdAt"
    >
  | "countryCount";
type SortDirection = "asc" | "desc";

const ShippingZoneList: React.FC<ShippingZoneListProps> = ({
  onManageRates: onManageRatesProp, // Renaming to avoid conflict with local function if any
}) => {
  const { showNotification } = useNotification();
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterIsActive, setFilterIsActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableZoneColumn;
    direction: SortDirection;
  }>({
    key: "name",
    direction: "asc",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] =
    useState<IShippingZoneResponse | null>(null);

  const {
    data: zonesApiResponse,
    isLoading: isLoadingZones,
    isError,
    error: fetchErrorData,
    isFetching,
    refetch,
  } = useGetAllShippingZones();

  // Navigation handlers passed via props or defined locally
  const onAddZone = () => {
    navigate("/admin/checkoutsession/shippingzones/new");
  };

  const onEditZone = (zoneId: string) => {
    navigate(`/admin/checkoutsession/shippingzones/edit/${zoneId}`);
  };

  const onManageRates = (zoneId: string, zoneName: string) => {
    navigate(`/admin/checkoutsession/shippingzones/shippingrates/${zoneId}`, {
      state: { zoneName },
    });
  };

  // FIX #1: The API returns a direct array, not an object with a .data property.
  const allZones = zonesApiResponse || [];

  const processedZones = useMemo(() => {
    let filtered = [...allZones];

    if (filterIsActive !== "all") {
      filtered = filtered.filter(
        (zone) => zone.isActive === (filterIsActive === "active")
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (zone) =>
          zone.name.toLowerCase().includes(term) ||
          (zone.description && zone.description.toLowerCase().includes(term)) ||
          zone.countries.some((country) => country.toLowerCase().includes(term))
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof IShippingZoneResponse];
        let bValue: any = b[sortConfig.key as keyof IShippingZoneResponse];

        if (sortConfig.key === "countryCount") {
          aValue = a.countries.length;
          bValue = b.countries.length;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortConfig.direction === "asc"
            ? Number(bValue) - Number(aValue)
            : Number(aValue) - Number(bValue);
        }
        if (
          new Date(aValue).toString() !== "Invalid Date" &&
          new Date(bValue).toString() !== "Invalid Date"
        ) {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [allZones, searchTerm, filterIsActive, sortConfig]);

  const deleteZoneMutation = useDeleteShippingZone({
    onSuccess: (_data, deletedZoneId) => {
      showNotification(
        `Shipping Zone "${
          zoneToDelete?.name || deletedZoneId
        }" deleted successfully!`,
        "success"
      );
      setZoneToDelete(null);
      setIsDeleteModalOpen(false);
      refetch();
    },
    onError: (err: any, deletedZoneId) => {
      showNotification(
        `Failed to delete zone "${zoneToDelete?.name || deletedZoneId}": ${
          err.message || "Unknown error"
        }`,
        "error"
      );
      setZoneToDelete(null);
      setIsDeleteModalOpen(false);
    },
  });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterIsActive(e.target.value as "all" | "active" | "inactive");
    },
    []
  );

  const handleSort = useCallback((column: SortableZoneColumn) => {
    setSortConfig((currentSortConfig) => ({
      key: column,
      direction:
        currentSortConfig.key === column &&
        currentSortConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const openDeleteModal = (zone: IShippingZoneResponse) => {
    setZoneToDelete(zone);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteZone = () => {
    // FIX #2: Use _id for the mutation
    if (zoneToDelete && zoneToDelete._id) {
      deleteZoneMutation.mutate(zoneToDelete._id);
    } else {
      showNotification("Cannot delete zone: ID is missing.", "error");
    }
  };

  const getSortIcon = (column: SortableZoneColumn) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort style={{ opacity: 0.3 }} />;
  };

  const renderMainContent = () => {
    if (isLoadingZones) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <LoadingSpinner message="Loading shipping zones..." />
        </div>
      );
    }
    if (isError) {
      return (
        <NoZonesMessage>
          <FaExclamationTriangle />
          <p>
            Error loading shipping zones:{" "}
            {(fetchErrorData as any)?.message || "Unknown error"}
          </p>
          <AdminButton
            $variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try Again
          </AdminButton>
        </NoZonesMessage>
      );
    }
    if (allZones.length === 0) {
      return (
        <NoZonesMessage>
          <FaMapMarkedAlt />
          <p>
            No shipping zones configured yet. Click "Add New Zone" to get
            started.
          </p>
        </NoZonesMessage>
      );
    }
    if (processedZones.length === 0) {
      return (
        <NoZonesMessage>
          <FaMapMarkedAlt />
          <p>No shipping zones found matching your criteria.</p>
        </NoZonesMessage>
      );
    }

    return (
      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Zone Name {getSortIcon("name")}
              </th>
              <th>Description</th>
              <th onClick={() => handleSort("isActive")}>
                Status {getSortIcon("isActive")}
              </th>
              <th>Countries</th>
              <th onClick={() => handleSort("createdAt")}>
                Created At {getSortIcon("createdAt")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedZones.map((zone) => (
              // FIX #2: Use _id for the React key
              <tr key={zone._id}>
                <td>{zone.name}</td>
                <td
                  title={zone.description}
                  style={{
                    maxWidth: "250px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {zone.description || "-"}
                </td>
                <td>
                  <StatusBadge $active={zone.isActive}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </StatusBadge>
                </td>
                <td>
                  <CountryCountPill title={zone.countries.join(", ")}>
                    {zone.countries.length}{" "}
                    {zone.countries.length === 1 ? "Country" : "Countries"}
                  </CountryCountPill>
                </td>
                <td>{new Date(zone.createdAt).toLocaleDateString()}</td>
                <td>
                  {/* FIX #2: Use _id for navigation and actions */}
                  <ManageRatesButton
                    onClick={() => onManageRates(zone._id, zone.name)}
                    title="Manage Shipping Rates"
                  >
                    <FaRoute /> Rates
                  </ManageRatesButton>
                  <TableActionButton
                    onClick={() => onEditZone(zone._id)}
                    title="Edit Zone"
                  >
                    <FaEdit />
                  </TableActionButton>
                  <TableActionButton
                    onClick={() => openDeleteModal(zone)}
                    title="Delete Zone"
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
    );
  };

  return (
    <ZoneListContainer>
      <ZoneListHeader>
        <HeaderTitle>Shipping Zones ({processedZones.length})</HeaderTitle>
        <AdminButton $variant="primary" onClick={onAddZone}>
          <FaPlus /> Add New Zone
        </AdminButton>
      </ZoneListHeader>

      <SearchAndFilterBar>
        <ZoneSearchInput
          type="text"
          placeholder="Search by zone name, country code..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoadingZones && allZones.length === 0}
        />
        <ZoneFilterSelect
          value={filterIsActive}
          onChange={handleFilterChange}
          disabled={isLoadingZones && allZones.length === 0}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </ZoneFilterSelect>
        <AdminButton
          $variant="neutral"
          onClick={() => refetch()}
          disabled={isLoadingZones || isFetching}
          style={{ minWidth: "100px" }}
        >
          {isFetching ? <FaSpinner className="spinner-icon" /> : "Refresh"}
        </AdminButton>
      </SearchAndFilterBar>

      {renderMainContent()}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteZone}
        title="Confirm Delete Shipping Zone"
        message={`Are you sure you want to delete the shipping zone "${
          zoneToDelete?.name || ""
        }"? This may also affect associated shipping rates. This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isDanger={true}
        isLoading={deleteZoneMutation.isPending}
      />
    </ZoneListContainer>
  );
};

export default ShippingZoneList;
