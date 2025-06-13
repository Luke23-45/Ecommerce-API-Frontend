import React from "react";
import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import GrandMarquee from "@/components/home/GrandMarquee";
import PreHeader from "@/components/home/PreHeader";
import SecondaryNav from "@/components/home/SecondaryNav/SecondaryNav";
import { useGetCart } from "@/hooks/cart/useCart";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { data: cartData, isLoading: isCartLoading } = useGetCart();

  console.log(cartData);

  const cartItemCount = cartData?.itemCount || 0;

  const currentSearchQuery = searchParams.get("q") || "";
  const isHomePage = location.pathname === "/";

  const handleSearchFromLayout = (query: string, categoryId: string) => {
    const params = new URLSearchParams();
    if (query && query.trim()) {
      params.set("q", query.trim());
    }
    if (categoryId && categoryId !== "all") {
      params.set("categoryId", categoryId);
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const handleViewWishlist = () => {
    navigate("/wishlist");
  };

  const handleSignInRegister = () => {
    navigate("/auth/login");
  };

  return (
    <div>
      {isHomePage && <PreHeader wishlistCount={3} />}

      <GrandMarquee
        onSearch={handleSearchFromLayout}
        onViewCart={handleViewCart}
        onViewWishlist={handleViewWishlist}
        onSignInRegister={handleSignInRegister}
        cartItemCount={cartItemCount}
        isCartLoading={isCartLoading}
        initialSearchTerm={currentSearchQuery}
      />
      {isHomePage && <SecondaryNav />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
