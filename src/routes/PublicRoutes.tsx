// import ProductDetailPage from '@/pages/ProductDetail/ProductDetailPage';
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy load public components
const HomePage = lazy(() => import("@/pages/Home/Home"));
const AuthPage = lazy(() => import("@/pages/AuthPage/AuthPage"));
import ProductDetailPage from "@/pages/ProductDetail/ProductDetailPage";
import ProductListingPage from "@/pages/ProductListingPage/ProductListingPage";
import AdminPage from "@/pages/admin/AdminPage";
import ProfilePage from "@/pages/Others/ProfilePage";
import BecomeAPartnerPage from "@/pages/BecomeAPartnerPage/BecomeAPartnerPage";

const PublicRoutes = () => (
  <Suspense fallback={<div>Loading public content...</div>}>
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<AuthPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/category" element={<ProductListingPage />} />
    </Routes>
  </Suspense>
);

export default PublicRoutes;
