import { ThemeProvider } from "styled-components";
 import PreHeader from "@/components/home/PreHeader";
import GrandMarquee from "@/components/home/GrandMarquee";
import SpotlightBanner from "@/components/home/SpotlightBanner";
import HeroPanorama from "@/components/home/HeroPanorama";
import FeaturedCategories from "@/components/home/featureCategory/FeaturedCategories";
import ProductCarousel from "@/components/home/ProductCarousel/ProductCarousel";
import BrandEthos from "@/components/home/BrandEthos/BrandEthos";
import LookbookCollections from "@/components/home/LookbookCollections/LookbookCollections";
import CategoryExplorer from "@/components/home/CategoryExplorer/CategoryExplorer";
import GlobalStyles from "@/components/home/styles/GlobalStyles";
import { theme } from "@/components/home/styles/Theme";
function Home() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PreHeader wishlistCount={3} />
      <GrandMarquee />
      <SpotlightBanner />
      <HeroPanorama />
      <FeaturedCategories />
      <ProductCarousel />
      <BrandEthos />
      <LookbookCollections />
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
