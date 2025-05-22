// src/components/Admin/Settings/UserManagementSection.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaUserPlus,
  FaUserEdit,
  FaTrashAlt,
  FaSearch,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa"; // Icons for user management

import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from "../common/FormSectionWrapper/FormSectionWrapper";
import { AdminButton, AdminInput } from "../Dashboard/Common/Common.styles";
import AdminSelect from "../common/AdminSelect/AdminSelect";
import {
  AdminTableWrapper,
  AdminTable,
  TableActionButton,
  CustomerStatusBadge,
  TableFooter,
  PaginationContainer,
  PaginationButton,
} from "../Customers/CustomerList.styles";

import type {
  PlatformUser,
  PlatformUserRole,
  UserStatus,
} from "@/types/settings";
import { FilterBar } from "../Marketing/MarketingList.styles";

const mockUserId = (seed: string) =>
  `USR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

const dummyPlatformUsers: PlatformUser[] = [
  {
    _id: mockUserId("sa-1"),
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@elan.com",
    role: "super_admin",
    status: "active",
    createdAt: "2022-01-01T00:00:00Z",
    lastLogin: "2023-11-20T10:00:00Z",
  },
  {
    _id: mockUserId("vs-1"),
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@vendor1.com",
    role: "vendor_staff",
    status: "active",
    createdAt: "2022-03-15T00:00:00Z",
    lastLogin: "2023-11-19T14:30:00Z",
    vendorId: "vendor1",
  },
  {
    _id: mockUserId("is-1"),
    firstName: "Emily",
    lastName: "Clark",
    email: "emily.c@seller.com",
    role: "individual_seller",
    status: "active",
    createdAt: "2022-05-01T00:00:00Z",
    lastLogin: "2023-11-18T09:00:00Z",
    sellerId: "seller1",
  },
  {
    _id: mockUserId("vs-2"),
    firstName: "David",
    lastName: "Brown",
    email: "david.b@vendor2.com",
    role: "vendor_staff",
    status: "suspended",
    createdAt: "2022-07-20T00:00:00Z",
    lastLogin: "2023-10-01T10:00:00Z",
    vendorId: "vendor2",
  },
  {
    _id: mockUserId("sa-2"),
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.w@elan.com",
    role: "super_admin",
    status: "active",
    createdAt: "2023-01-10T00:00:00Z",
    lastLogin: "2023-11-20T11:00:00Z",
  },
  {
    _id: mockUserId("vs-3"),
    firstName: "Michael",
    lastName: "Green",
    email: "michael.g@vendor1.com",
    role: "vendor_staff",
    status: "deactivated",
    createdAt: "2023-02-05T00:00:00Z",
    lastLogin: "2023-03-01T00:00:00Z",
    vendorId: "vendor1",
  },
];

type SortKey =
  | "firstName"
  | "email"
  | "role"
  | "status"
  | "createdAt"
  | "lastLogin";
type SortDirection = "asc" | "desc";

interface UserManagementSectionProps {
  usersData: PlatformUser[];
  onSaveUser: (user: PlatformUser, isNew: boolean) => void;
  onDeleteUser: (userId: string, userName: string) => void;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  usersData,
  onSaveUser,
  onDeleteUser,
}) => {
  const [users, setUsers] = useState<PlatformUser[]>(usersData); // State for the list of users
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // State for the "Add New User" form fields
  const [newUser, setNewUser] = useState<PlatformUser>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "vendor_staff",
    status: "active",
    createdAt: "",
  });

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  // Options for role and status filters/selects
  const uniqueRoles: (PlatformUserRole | "all")[] = useMemo(() => {
    return ["all", "super_admin", "vendor_staff", "individual_seller"].sort();
  }, []);

  const uniqueStatuses: (UserStatus | "all")[] = useMemo(() => {
    return ["all", "active", "suspended", "deactivated"].sort();
  }, []);

  // Memoized filtered and sorted users for the table
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortColumn];
        let bValue: any = b[sortColumn];

        if (sortColumn === "createdAt" || sortColumn === "lastLogin") {
          const dateA = aValue ? new Date(aValue).getTime() : 0;
          const dateB = bValue ? new Date(bValue).getTime() : 0;
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return filtered;
  }, [users, searchTerm, filterRole, filterStatus, sortColumn, sortDirection]);

  // Pagination logic (identical to other lists)
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;
  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = useCallback(
    (pageNumber: number) => {
      if (pageNumber > 0 && pageNumber <= totalPages)
        setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  // Table Handlers
  const handleSort = useCallback(
    (column: SortKey) => {
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn]
  );

  const getSortIcon = (column: SortKey) => {
    if (sortColumn === column)
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    return null;
  };

  const handleEditUser = (userId: string) => {
    // In a real app, this would open a modal/page to edit user.
    console.log(`Edit user: ${userId}`);
    alert(`Simulating edit for user: ${userId}`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${userId}? This cannot be undone.`
      )
    ) {
      onDeleteUser(userId, userName);
      alert(`User ${userId} deleted (demo).`);
    }
  };


  const handleNewUserChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewUser((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCreateUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !newUser.firstName ||
        !newUser.lastName ||
        !newUser.email ||
        !newUser.role
      ) {
        alert("Please fill in all required fields (Name, Email, Role).");
        return;
      }
      const userToSave: PlatformUser = {
        ...newUser,
        _id: mockUserId("new-user"), // Mock ID
        createdAt: new Date().toISOString(),
        status: newUser.status || "active", // Default to active if not set
        // Ensure email is lowercased if needed for unique IDs in backend
      };
      onSaveUser(userToSave, true); // True for new user
      alert("New user created (demo).");
      setNewUser({
        // Reset form
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "vendor_staff",
        status: "active",
        createdAt: "",
      });
    },
    [newUser, onSaveUser]
  );

  return (
    <FormSectionWrapper title="Manage Platform Users">
      {/* Add New User Form */}
      <form
        onSubmit={handleCreateUser}
        style={{
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "1px solid #EEE",
        }}
      >
        <h4 style={{ marginBottom: "15px", fontSize: "1.1rem", color: "#333" }}>
          Add New User <FaUserPlus style={{ verticalAlign: "middle" }} />
        </h4>
        <MultiFieldRow>
          <FieldGroup>
            <FormLabel htmlFor="new-first-name">First Name</FormLabel>
            <AdminInput
              type="text"
              id="new-first-name"
              name="firstName"
              value={newUser.firstName}
              onChange={handleNewUserChange}
              placeholder="First Name"
              required
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="new-last-name">Last Name</FormLabel>
            <AdminInput
              type="text"
              id="new-last-name"
              name="lastName"
              value={newUser.lastName}
              onChange={handleNewUserChange}
              placeholder="Last Name"
              required
            />
          </FieldGroup>
        </MultiFieldRow>
        <MultiFieldRow>
          <FieldGroup>
            <FormLabel htmlFor="new-email">Email</FormLabel>
            <AdminInput
              type="email"
              id="new-email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              placeholder="Email"
              required
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="new-role">Role</FormLabel>
            <AdminSelect
              id="new-role"
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              options={uniqueRoles
                .filter((role) => role !== "all")
                .map((role) => ({
                  value: role,
                  label: role.replace(/_/g, " "),
                }))}
              required
            />
          </FieldGroup>
        </MultiFieldRow>
        <AdminButton
          type="submit"
          $variant="primary"
          style={{ marginTop: "20px", width: "auto" }}
        >
          Create User
        </AdminButton>
      </form>

      <h4 style={{ marginBottom: "15px", fontSize: "1.1rem", color: "#333" }}>
        Filter Users
      </h4>
      <FilterBar style={{ marginBottom: "30px" }}>
        <AdminInput
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "280px" }}
        />
        <AdminSelect
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value as PlatformUserRole | "all")
          }
          options={uniqueRoles.map((role) => ({
            value: role,
            label: role === "all" ? "All Roles" : role.replace(/_/g, " "),
          }))}
          style={{ width: "150px" }}
        />
        <AdminSelect
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as UserStatus | "all")
          }
          options={uniqueStatuses.map((status) => ({
            value: status,
            label:
              status === "all" ? "All Statuses" : status.replace(/_/g, " "),
          }))}
          style={{ width: "150px" }}
        />
      </FilterBar>

      {/* User List Table */}
      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th onClick={() => handleSort("firstName")}>
                Name {getSortIcon("firstName")}
              </th>
              <th onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </th>
              <th onClick={() => handleSort("role")}>
                Role {getSortIcon("role")}
              </th>
              <th onClick={() => handleSort("status")}>
                Status {getSortIcon("status")}
              </th>
              <th onClick={() => handleSort("createdAt")}>
                Registered {getSortIcon("createdAt")}
              </th>
              <th onClick={() => handleSort("lastLogin")}>
                Last Login {getSortIcon("lastLogin")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role.replace(/_/g, " ")}</td>
                  <td>
                    <CustomerStatusBadge $status={user.status}>
                      {user.status.replace(/_/g, " ")}
                    </CustomerStatusBadge>
                  </td>{" "}
                  {/* Re-use badge */}
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td>
                    <TableActionButton
                      onClick={() => handleEditUser(user._id)}
                      aria-label="Edit user"
                    >
                      <FaUserEdit />
                    </TableActionButton>
                    <TableActionButton
                      onClick={() => handleDeleteUser(user._id)}
                      aria-label="Delete user"
                    >
                      <FaTrashAlt />
                    </TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#999",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>

      {/* Pagination */}
      <TableFooter>
        <span>
          Showing {indexOfFirstUser + 1} -{" "}
          {Math.min(indexOfLastUser, filteredAndSortedUsers.length)} of{" "}
          {filteredAndSortedUsers.length} users
        </span>
        <PaginationContainer>
          <PaginationButton
            className="prev-next-btn"
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
            className="prev-next-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      </TableFooter>
    </FormSectionWrapper>
  );
};

export default UserManagementSection;
