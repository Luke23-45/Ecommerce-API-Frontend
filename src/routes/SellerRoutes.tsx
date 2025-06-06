import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';



const SellerDashboardPage = lazy(() => import('@/pages/seller/SellerDashboardPage'));



const SellerRoutes = () => (
  <Suspense fallback={<div>Loading seller dashboard...</div>}>
    <Routes>
        <Route index element={<SellerDashboardPage />} /> 
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="products" element={<div>Seller Product Listings</div>} />
        <Route path="orders" element={<div>Seller Order Management</div>} />
    </Routes>
  </Suspense>
);

export default SellerRoutes;