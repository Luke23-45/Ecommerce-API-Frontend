import { ThemeProvider } from "styled-components";
import PreHeader from "@/components/home/PreHeader";
import GrandMarquee from "@/components/home/GrandMarquee";
import SpotlightBanner from "@/components/home/SpotlightBanner";
import HeroPanorama from "@/components/home/HeroPanorama";
import CategoryExplorer from "@/components/home/CategoryExplorer/CategoryExplorer";
import GlobalStyles from "@/components/home/styles/GlobalStyles";
import { theme } from "@/components/home/styles/Theme";
import { useState } from "react";
import SecondaryNav from "@/components/home/SecondaryNav/SecondaryNav";
import CuratedFindsSection from "@/components/home/CuratedFindsSection/CuratedFindsSection";
import DailyDealsCarousel from "@/components/home/DailyDealsCarousel/DailyDealsCarousel";
function Home() {
  const [cartItemCount, setCartItemCount] = useState(3); 
  const handleFeSearch = (query: string, category: string) => {
    console.log(`FE Search for "${query}" in "${category}"`);
    alert(`FE Search for "${query}" in "${category}"`);
  };
  const handleViewCart = () => {
    console.log("FE View Cart");
    alert("Viewing cart!");
  };
  const handleViewWishlist = () => {
    console.log("FE View Wishlist");
    alert("Viewing wishlist!");
  };
  const handleSignInRegister = () => {
    console.log("FE Sign In / Register");
    alert("Sign in / Register");
  };
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* <PreHeader wishlistCount={3} />
      <GrandMarquee
        onSearch={handleFeSearch}
        onViewCart={handleViewCart}
        onViewWishlist={handleViewWishlist}
        onSignInRegister={handleSignInRegister}
        cartItemCount={cartItemCount}
      />
      <SecondaryNav /> */}
      <SpotlightBanner />
      <HeroPanorama />
      <CuratedFindsSection />
       <DailyDealsCarousel /> 
      {/* <FeatureGridsSection /> */}
      {/* <FeaturedCategories />
      <ProductCarousel />
      <BrandEthos />
      <LookbookCollections /> */}
      <CategoryExplorer />
      {/* Remainder of the homepage sections will go here */}
      <div
        style={{
          height: "200vh",
          padding: "50px",
          background: theme.colors.lightGray,
          color: theme.colors.textDark,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: theme.typography.heading.fontFamily,
            fontSize: theme.typography.heading.sizes.h2,
          }}
        >
          More Sections Coming Soon!
        </h2>
        <p
          style={{
            marginTop: "20px",
            fontFamily: theme.typography.body.fontFamily,
          }}
        >
          Scroll down to see the next section placeholder. This helps test the
          sticky header.
        </p>
      </div>
    </ThemeProvider>
  );
}

export default Home;
