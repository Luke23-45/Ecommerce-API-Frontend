import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
// import VendorLayout from '@/components/vendor/Layout/Layout'; 

// Lazy load vendor-specific components
const VendorDashboardPage = lazy(() => import('@/pages/vendor/VendorDashboardPage'));
const ViewVendorApplication = lazy(() => import('@/components/vendor/ViewVendorApplication'));

const VendorRoutes = () => (
  <Suspense fallback={<div>Loading vendor dashboard...</div>}>
    <Routes>

      {/* <Route element={<VendorLayout />}> */}
        <Route index element={<VendorDashboardPage />} /> {/* /vendor/dashboard */}
        <Route path="dashboard" element={<VendorDashboardPage />} />
        <Route path="applications/view/:id" element={<ViewVendorApplication />} />
        <Route path="products" element={<div>Vendor Product Submissions</div>} />
        <Route path="analytics" element={<div>Vendor Sales Analytics</div>} />
        {/* Add more vendor routes here */}
      {/* </Route> */}
    </Routes>
  </Suspense>
);

export default VendorRoutes;