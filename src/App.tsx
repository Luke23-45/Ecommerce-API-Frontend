import React, { lazy, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { type RootState, type AppDispatch } from "@/store";
import { initializeAuth } from "@/store/thunks/authThunks";

import "./App.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { NotificationProvider } from "./contexts/NotificationContext";

import AuthenticatedRoutes from "@/routes/AuthenticatedInedexRoutes";
import { ThemeProvider } from "styled-components";
import { theme } from "./components/home/styles/Theme";
import GlobalStyles from "./components/home/styles/GlobalStyles";

const HomePage = lazy(() => import("@/pages/Home/Home"));
const AuthPage = lazy(() => import("@/pages/AuthPage/AuthPage"));
import ProductDetailPage from "@/pages/ProductDetail/ProductDetailPage";
import ProductDetailInfo from "@/pages/ProductDetail/ProductInformation";
import ProductListingPage from "@/pages/ProductListingPage/ProductListingPage";
import AdminPage from "@/pages/admin/AdminPage";
import BecomeAPartnerPage from "./pages/BecomeAPartnerPage/BecomeAPartnerPage";
import AdminPage_ from "@/pages/admin/index";
import SenzPage from "./pages/senz/SenzPage";
import { adminProductListTheme } from "./pages/senz/theme";
import AdminRouterComponent from "./pages/admin/AdminRouter";
import CartPage from "./pages/CartPage/CartPage";
import Layout from "./components/layout/navlayout";
import SearchResultsPage from "./pages/ProductListingPage/SearchResultsPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutReviewPage from "./pages/CheckoutReviewPage";
import { setCartCount } from "./store/slices/cartSlice";
import { useGetCart } from "./hooks/cart/useCart";

const AppLoadingScreen = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontSize: "1.5em",
      backgroundColor: "#f0f2f5",
      color: "#333",
      flexDirection: "column",
      gap: "20px",
    }}
  >
    <p>Loading application resources...</p>
    <div
      style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <style>
      {`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `}
    </style>
  </div>
);

function App() {
  const dispatch: AppDispatch = useDispatch();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const performAuthCheck = async () => {
      console.log(
        "App initialized. Dispatching initial authentication check..."
      );
      await dispatch(initializeAuth());
      console.log("Initial authentication check completed.");
      setIsAuthCheckComplete(true);
    };

    performAuthCheck();
  }, [dispatch]);
  const {
    data: cartData,
    isLoading: isCartLoadingFromHook,
    refetch,
  } = useGetCart();

  useEffect(() => {
    if (cartData && cartData.itemCount) {
      const countFromApi = cartData.itemCount ?? 0;
      console.log("App.tsx: Setting cart count from API:", countFromApi);
      dispatch(setCartCount(countFromApi));
    } else {
    }
  }, [cartData, dispatch]);

  useEffect(() => {
    console.log("App.tsx: Triggering initial cart refetch.");
    refetch();
  }, [refetch]);
  if (!isAuthCheckComplete) {
    return <AppLoadingScreen />;
  }



  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <NotificationProvider>
        <Router>
          <main
            className="app-container"
            style={{
              width: "100vw",
              scrollbarWidth: "none",
              padding: "0 0px",
              minHeight: "calc(100vh - 140px)",
            }}
          >
            <Routes>
              {/* <Route path="/admin" element={<AdminPage_ />} /> */}
              <Route path="/admin/*" element={<AdminRouterComponent />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkoutsummery" element={<CheckoutReviewPage />} />
              <Route path="/" element={<Layout />}>
                {/* The Home page will render at "/" */}
                <Route index element={<HomePage />} />

                {/* The ProductListingPage will render at "/products"
                It will receive the search query from the URL via useSearchParams
            */}
                {/* <Route path="search" element={<ProductListingPage />} /> */}

                <Route path="search" element={<SearchResultsPage />} />
                <Route path="category" element={<ProductListingPage />} />
                <Route
                  path="/productid/:productId"
                  element={<ProductDetailInfo />}
                />
                <Route path="/cart" element={<CartPage />} />
              </Route>
              <Route path="/auth/*" element={<AuthPage />} />
              <Route
                path="/product/:productId"
                element={<ProductDetailPage />}
              />
              <Route path="/becomeseller" element={<BecomeAPartnerPage />} />

              {/* Protected Routes (require authentication) */}
              <Route
                element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
              >
                {/* The AuthenticatedRoutes component handles all further protected/role-based routing */}
                <Route path="/*" element={<AuthenticatedRoutes />} />
              </Route>
              {/* Fallback for unknown routes (should be outside all specific route groups) */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </main>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
