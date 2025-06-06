import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/admin/Layout/Layout'; // The admin layout wrapper

// Lazy load admin-specific components
const Dashboard = lazy(() => import('@/components/admin/Dashboard/Dashboard'));
// Add other admin components here
// const AdminUsers = lazy(() => import('@/components/admin/Users/AdminUsers'));

const AdminRoutes = () => (
  <Suspense fallback={<div>Loading admin dashboard...</div>}>
    <Routes>
      {/* AdminLayout acts as a wrapper for all admin-specific content */}
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} /> {/* /admin */}
        <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
        <Route path="users" element={<div>Admin User Management</div>} /> {/* /admin/users */}
        <Route path="products" element={<div>Admin Product Management</div>} />
        <Route path="orders" element={<div>Admin Order Management</div>} />
        <Route path="applications/seller/:id" element={<ViewSellerApplication />} />
        <Route path="applications/vendor/:id" element={<ViewVendorApplication />} />
        <Route path="applications/sellers" element={<div>All Seller Applications</div>} />
        <Route path="applications/vendors" element={<div>All Vendor Applications</div>} />
        {/* Add more admin routes here */}
      </Route>
    </Routes>
  </Suspense>
);

export default AdminRoutes;