import React from "react";
import {
  FeaturedCategoriesSection,
  SectionHeadline,
  CategoryGrid,
  CategoryCard,
  CardImageWrapper,
  CardOverlay,
  CardContent,
  CardTitle,
  CardDescription,
  CardCtaButton,
  ImageBackgroundGlow, // The glow effect
  ImageLightOverlay,    // For light bleed effect
} from "./FeaturedCategories.styles";

// Helper for high-quality dummy images. Prioritize clean, natural light, elegant compositions.
// In a real application, these would be high-res, professional photographs matching brand aesthetic.
const getHighQualityImage = (
  keyword: string,
  width: number,
  height: number
) => `https://picsum.photos/seed/${keyword.replace(/\s/g, "")}/${width}/${height}`;

interface CategoryData {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  gridArea: string; // Crucial for explicit grid placement
}

const stunningCategories: CategoryData[] = [
  {
    id: "1",
    title: "Mastering Living Spaces",
    description: "Curated collections that blend modern elegance with ultimate comfort. Redefine your sanctuary.",
    image: getHighQualityImage("living-room-design-minimal", 1400, 900),
    link: "#living-spaces",
    gridArea: "hero-card",
  },
  {
    id: "2",
    title: "The Art of Dining",
    description: "Exquisite dining sets and artisanal serveware to craft unforgettable culinary experiences.",
    image: getHighQualityImage("elegant-dining-room-tableware", 800, 1000),
    link: "#dining-art",
    gridArea: "dining-card",
  },
  {
    id: "3",
    title: "Serene Retreats",
    description: "Indulge in tranquility with premium bedding, plush textiles, and serene decor elements.",
    image: getHighQualityImage("calm-minimalist-bedroom-lighting", 800, 1000),
    link: "#bedroom-retreats",
    gridArea: "bedroom-card",
  },
  {
    id: "4",
    title: "Curated Sculptural Forms",
    description: "Elevate your interiors with unique handcrafted sculptures, evocative ceramics, and captivating wall art.",
    image: getHighQualityImage("abstract-home-decor-art-vase", 800, 1000),
    link: "#art-forms",
    gridArea: "art-card",
  },
  {
    id: "5",
    title: "Seamless Outdoor Living",
    description: "Extend your aesthetic outdoors with durable, stylish furniture and captivating garden accents that blend with nature.",
    image: getHighQualityImage("modern-outdoor-patio-garden", 800, 1000),
    link: "#outdoor-harmony",
    gridArea: "outdoor-card",
  },
];

const FeaturedCategories: React.FC = () => {
  // Optional: For mouse-tracking light bleed effect on ImageLightOverlay
  const handleCardMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleCardMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    // Reset to center or a default position if desired
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  };

  return (
    <FeaturedCategoriesSection className="content-max-width">
      <SectionHeadline>
        Discover Our Exquisite Collections
      </SectionHeadline>
      <CategoryGrid>
        {stunningCategories.map((category) => (
          <CategoryCard
            key={category.id}
            data-grid-area={category.gridArea} // Pass gridArea as data attribute
            role="link"
            aria-label={`Explore ${category.title} collection`}
            onClick={() => (window.location.href = category.link)}
            onMouseMove={handleCardMouseMove} // For dynamic light bleed
            onMouseLeave={handleCardMouseLeave} // Reset light bleed
          >
            <ImageBackgroundGlow /> {/* Subtle background glow */}
            <CardImageWrapper>
              <img src={category.image} alt={category.title} loading="lazy" />
              <ImageLightOverlay /> {/* Subtle light bleed from image on hover */}
            </CardImageWrapper>
            <CardOverlay /> {/* Dark gradient overlay for text readability */}
            <CardContent>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
              <CardCtaButton href={category.link} tabIndex={-1}>
                View Collection
              </CardCtaButton>
            </CardContent>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </FeaturedCategoriesSection>
  );
};

export default FeaturedCategories;