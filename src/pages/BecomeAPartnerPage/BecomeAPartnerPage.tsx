import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";

import { FaChartLine, FaShieldAlt,FaMousePointer,FaFileUpload,FaRegEye,FaRocket } from "react-icons/fa";

import {
  PageWrapper,
  SectionContainer,
  ContentLimiter,
  SectionHeadline,
  SectionSubheadline,
  PrimaryCtaButton,
  SubtleDivider,
  BenefitsGrid,
  PathwaysContainer,
  TestimonialsGrid,
  HowItWorksGrid,
  FAQSectionWrapper
} from "./BecomeAPartnerPage.styles";


import ProcessStep from '../../components/BecomeAPartnerPage/ProcessStep/ProcessStep'; // Updated import


import PathwayCard from "@/components/BecomeAPartnerPage/PathwayCard/PathwayCard";
import HeroPartnerSection from "../../components/BecomeAPartnerPage/HeroPartnerSection/HeroPartnerSection";

import BenefitPillarCard from "@/components/BecomeAPartnerPage/BenefitPillarCard/BenefitPillarCard";
import bghero from "@/assets/bgseller.png"
import Step1Image from '@/assets/1.png'; // Example path
import Step2Image from '@/assets/2.png';
import Step3Image from '@/assets/3.png';
import Step4Image from '@/assets/4.png'

import {
  FaUsers,
  FaBullhorn,
  FaTools,
  FaHandHoldingHeart,
  FaPalette,
  FaStoreAlt,
} from "react-icons/fa";
import { transparentize } from "polished";
import { getProductImage } from "@/utils/imageUtils";
import TestimonialCard from "@/components/BecomeAPartnerPage/TestimonialCard/TestimonialCard";
import ProcessComicPanel from "../../components/BecomeAPartnerPage/ProcessStep/ProcessStep";
import FAQItem from "@/components/FAQItem/FAQItem";
import GrandMarquee from "@/components/home/GrandMarquee";

const heroDataForComponent = {
  headlineMain: "Partner with",
  headlineEmphasis: "Élan",
  tagline: "Showcase Your Craftsmanship",
  description:
    "Join our curated marketplace and connect with an audience that values exceptional quality, timeless design, and unique homewares. Let's build something beautiful together.",
  heroImageUrl: 'http://localhost:5173/src/assets/bgseller.png',
  ctaText: "Explore Partnership Paths",
  ctaScrollTargetId: "pathways-section",
};
const processStepsData = [
  { icon: <FaMousePointer />, stepNumber: "01", title: "Choose Your Pathway", description: "Select if you're an Individual Artisan or an established Brand Vendor." },
  { icon: <FaFileUpload />, stepNumber: "02", title: "Submit Your Application", description: "Complete our tailored form with your unique details and brand vision." },
  { icon: <FaRegEye />, stepNumber: "03", title: "Curation & Onboarding", description: "Our team carefully reviews each application. If approved, we'll guide you through a seamless onboarding." },
  { icon: <FaRocket />, stepNumber: "04", title: "Launch & Flourish", description: "Showcase your products to the Élan audience and watch your brand grow with us!" },
];
const benefitsDataForComponent = [
  {
    icon: <FaUsers size="1.2em" />,
    title: "Curated Audience",
    description:
      "Connect with discerning customers passionate about quality design, sustainable practices, and unique, artisanal homewares.",
  },
  {
    icon: <FaBullhorn size="1.2em" />,
    title: "Brand Amplification",
    description:
      "Elevate your brand story by becoming part of a respected platform celebrated for its commitment to excellence and timeless aesthetics.",
  },
  {
    icon: <FaTools size="1.2em" />,
    title: "Empowering Tools",
    description:
      "Access intuitive seller tools, dedicated support, and valuable resources designed to help your creative business thrive and grow.",
  },
];
const benefitsData = [
  {
    icon: <FaUsers />,
    title: "Curated Audience",
    description:
      "Connect with discerning customers passionate about quality design, sustainable practices, and unique, artisanal homewares.",
  },
  {
    icon: <FaChartLine />,
    title: "Brand Amplification",
    description:
      "Elevate your brand story by becoming part of a respected platform celebrated for its commitment to excellence and timeless aesthetics.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Seller Empowerment",
    description:
      "Access intuitive tools, dedicated support, and valuable resources designed to help your creative business thrive and grow with confidence.",
  },
];
const processStepsDataComic = [
  { 
    // Pass an img tag for the visual prop
    visual: <img src={Step1Image} alt="Illustration for Choosing Your Pathway" />, 
    captionTitle: "Step 1: Discover & Choose",
    description: "Select your ideal partnership pathway – Artisan or Brand Vendor." 
  },
  { 
    visual: <img src={Step2Image} alt="Illustration for Curating and Applying" />,
    captionTitle: "Step 2: Curate & Apply",
    description: "Craft your application, showcasing your unique brand and products." 
  },
  { 
    visual: <img src={Step3Image} alt="Illustration for Élan Review Process" />,
    captionTitle: "Step 3: Élan Review",
    description: "Our curation team meticulously reviews each application for alignment with our values."
  },
  { 
    visual: <img src={Step4Image} alt="Illustration for Launching and Growing with Élan" />,
    captionTitle: "Step 4: Launch & Elevate!",
    description: "Approved? Onboard seamlessly and present your creations to the Élan audience!" 
  },
];
const pathwaysData = {
  individual: {
    title: "The Artisan Pathway",
    iconComponent: FaPalette,
    description:
      "Perfect for independent artisans, crafters, and small studios creating unique, handcrafted, or small-batch homewares. Share your personal story and connect directly with customers who cherish originality.",
    highlights: [
      "Focus: Handcrafted, Unique Design, Small-Batch.",
      "Storefront: Full control over your Élan storefront.",
      "Volume: Suited for lower volume, high individuality.",
      "Application: Streamlined and creator-focused process.",
    ],
    fees: {
      subscription: "No monthly subscription fee.",
      commission: "15% per sale + standard payment processing fees.",
      listing: "First 50 item listings are complimentary.",
    },
    cta: "Apply as an Individual Artisan",
    link: "/seller/apply",
  },
  vendor: {
    title: "The Brand Partner Pathway",
    iconComponent: FaStoreAlt,
    description:
      "Ideal for established homewares brands, design houses, or businesses with distinct product lines and operational capacity. Leverage our platform to expand your market reach.",
    highlights: [
      "Focus: Established Product Lines, Brand Identity.",
      "Integration: Inventory & order management options.",
      "Volume: Ability to handle larger order volumes.",
      "Support: Dedicated account management & co-marketing.",
    ],
  fees: {
      subscription: "Tailored plans based on catalog size & features.",
      commission:
        "Negotiable rates (typically 10-20%) based on category/volume.",
      benefits: "Access to premium placements & marketing campaigns.",
    },
    cta: "Inquire for Brand Partnership",
    link: "/vendor/apply",
  },
};

const testimonialsData: TestimonialData[] = [
  {
    id: 'testimonial1',
    quote: "Joining Élan gave my handcrafted ceramics a platform and an audience I couldn't have reached on my own. The support and community have been fantastic for my small studio's growth!",
    authorName: "Anya Sharma",
    authorRoleOrBrand: "Founder, Clay & Hue Ceramics",
    imageUrl: "https://picsum.photos/seed/anya-sharma/100/100?face,woman,artisan",
  },
  {
    id: 'testimonial2',
    quote: "Élan Homewares truly understands brand integrity and the value of curated presentation. They've helped us connect with customers who deeply appreciate our sustainable design philosophy.",
    authorName: "Marcus Thorne",
    authorRoleOrBrand: "CEO, Modern Living Co.",
    imageUrl: "https://picsum.photos/seed/marcus-thorne/100/100?face,man,ceo",
  },
  {
    id: 'testimonial3',
    quote: "The platform tools are intuitive, and the Élan team provides exceptional support. It's a partnership that feels genuinely collaborative and focused on mutual success.",
    authorName: "Isabelle Moreau",
    authorRoleOrBrand: "Lead Designer, Studio Bloom Textiles",
    imageUrl: "https://picsum.photos/seed/isabelle-moreau/100/100?face,woman,designer",
  },
];
const faqData: FAQData[] = [
  {
    id: 'faq1',
    question: "What are the fees or commission rates for selling on Élan Homewares?",
    answer: "Our partnership terms vary. For Individual Artisans, we offer a competitive commission rate of 15% per sale plus standard payment processing fees, with no monthly subscription and your first 50 listings free. For Brand Vendors, we develop tailored plans that typically include a negotiable commission structure (10-20%) and potential access to premium features based on catalog size and volume."
  },
  {
    id: 'faq2',
    question: "What kind of products are you looking for?",
    answer: "Élan Homewares champions high-quality, uniquely designed, and thoughtfully crafted items. We seek products that resonate with an appreciation for sustainable practices, artisanal skill, and timeless aesthetics across all home categories – from furniture and lighting to decor and textiles."
  },
  {
    id: 'faq3',
    question: "How long does the application process typically take?",
    answer: "We strive to review applications promptly. For Individual Artisans, the process can take 1-2 weeks. For Brand Vendors, due to the more comprehensive review and potential for custom terms, it may take 2-4 weeks. We'll keep you informed throughout!"
  },
  {
    id: 'faq4',
    question: "What kind of support do you offer sellers and vendors?",
    answer: "We're committed to your success! All partners receive access to our intuitive seller portal, comprehensive guides, and responsive support. Brand Vendors may also receive dedicated account management and co-marketing opportunities to further amplify their presence."
  },
];

const ITEMS_PER_ROW_DESKTOP = 4;
const ITEMS_PER_DESKTOP_ROW = 4; // How many panels before arrow is hidden (if on same line)

const BecomeAPartnerPage: React.FC = () => {
    const [currentProcessStepForDemo, setCurrentProcessStepForDemo] = useState(processStepsData[2].title);
  const navigate = useNavigate();
  const theme = useTheme() as DefaultTheme;
    const [openFAQItemId, setOpenFAQItemId] = useState<string | null>(null); // Track currently open FAQ item
  const handleNavigation = (path: string) => {
    navigate(path);
  };
    const getGridColumns = useCallback(() => {
    if (typeof window === 'undefined') return ITEMS_PER_DESKTOP_ROW; // Default for SSR
    if (window.innerWidth >= parseInt(theme.breakpoints.laptopL?.replace('px','') || '1440')) return ITEMS_PER_DESKTOP_ROW;
    if (window.innerWidth >= parseInt(theme.breakpoints.tablet?.replace('px','') || '768')) return 2; // Example: 2 cols on tablet
    return 1; // Stacked on mobile
  }, [theme.breakpoints]);

  const [gridColumnCount, setGridColumnCount] = useState(getGridColumns());

  useEffect(() => {
    const handleResize = () => setGridColumnCount(getGridColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getGridColumns]);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset =
        parseFloat(theme.dimensions?.headerHeight || "0") +
        parseFloat(theme.dimensions?.secondaryNavHeight || "0") +
        20;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };



  const handleToggleFAQItem = (itemId: string) => {
    setOpenFAQItemId(prevId => (prevId === itemId ? null : itemId)); // Toggle: open if closed, close if open
  };

  return (

    <>
    
  <GrandMarquee />
    <PageWrapper>
  
      <HeroPartnerSection
        headlineMain={heroDataForComponent.headlineMain}
        headlineEmphasis={heroDataForComponent.headlineEmphasis}
        tagline={heroDataForComponent.tagline}
        description={heroDataForComponent.description}
        ctaText={heroDataForComponent.ctaText}
        onCtaClick={() =>
          handleScrollToSection(heroDataForComponent.ctaScrollTargetId)
        }
        backgroundImageUrl={heroDataForComponent.heroImageUrl}
      />

      {/* --- WHY PARTNER WITH ÉLAN? (BENEFITS SECTION - Using BenefitCard component) --- */}
      <SectionContainer
        $bgColor="primaryNeutral"
        $topPadding={12}
        $bottomPadding={12}
      >
        <ContentLimiter>
          <SectionHeadline $textAlign="center">
            The Élan AdvTestimonialsGridantage
          </SectionHeadline>
          <SectionSubheadline
            $textAlign="center"
            style={{ marginBottom: theme.spacing(10) }}
          >
            Join a platform dedicated to quality, design, and the success of its
            partners.
          </SectionSubheadline>

          <BenefitsGrid>
            {benefitsData.map((benefit, index) => (
              <BenefitPillarCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                $animationDelay={`${index * 0.15 + 0.1}s`}
              />
            ))}
          </BenefitsGrid>
        </ContentLimiter>
      </SectionContainer>

      <SubtleDivider />
      <SectionContainer
        $bgColor="backgroundLight"
        $topPadding={12}
        $bottomPadding={12}
        id="pathways-section"
      >
        <ContentLimiter>
          <SectionHeadline $textAlign="center">Find Your Fit</SectionHeadline>
          <SectionSubheadline
            $textAlign="center"
            style={{ marginBottom: theme.spacing(10) }}
          >
            Élan offers distinct partnership avenues tailored to your unique
            scale and creative approach.
          </SectionSubheadline>

          <PathwaysContainer>
            <PathwayCard
              pathway={pathwaysData.individual}
              animationDelay="0.1s"
              // isFeatured // Optionally make one pathway "featured" for different styling
            />
            <PathwayCard
              pathway={pathwaysData.vendor}
              isFeatured={true} // Example: Make vendor pathway slightly more prominent
              animationDelay="0.25s"
            />
          </PathwaysContainer>
        </ContentLimiter>
      </SectionContainer>
      <SubtleDivider />

      <SectionContainer $bgColor="primaryNeutral" /* Subtle off-white background */ $topPadding={12} $bottomPadding={12}>
        <ContentLimiter>
          <SectionHeadline $textAlign="center" $isAccented>Voices of Élan</SectionHeadline>
          <SectionSubheadline $textAlign="center" style={{ marginBottom: theme.spacing(10) }}>
            Hear from the talented artisans and innovative brands thriving within our curated community.
          </SectionSubheadline>

          <TestimonialsGrid>
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                animationDelay={`${index * 0.15 + 0.1}s`} // Stagger card entrance
              />
            ))}
          </TestimonialsGrid>
        </ContentLimiter>
      </SectionContainer>

      {/* --- Final CTA Section --- */}

      <SubtleDivider />
  <SectionContainer $bgColor="primaryNeutral" $topPadding={12} $bottomPadding={12}>
        <ContentLimiter>
          <SectionHeadline $textAlign="center">Your Journey to Élan</SectionHeadline>
          <SectionSubheadline $textAlign="center" style={{ marginBottom: theme.spacing(12) }}>
            Joining our collective is a straightforward and rewarding experience.
          </SectionSubheadline>

          <HowItWorksGrid>
            {processStepsDataComic.map((step, index) => {
              // Show arrow if it's not the last item in its visual row AND not the very last item
              const isLastInConceptualRow = (index + 1) % gridColumnCount === 0;
              const isOverallLastItem = index === processStepsDataComic.length - 1;
              const showArrow = !isLastInConceptualRow && !isOverallLastItem;

              return (
                <ProcessComicPanel
                  key={step.captionTitle}
                  visual={step.visual}
                  captionTitle={step.captionTitle}
                  description={step.description}
                  animationDelay={`${index * 0.12 + 0.1}s`}
                  hasNextStepInRow={gridColumnCount > 1 ? showArrow : false} // Only show arrows if grid is horizontal
                />
              );
            })}
          </HowItWorksGrid>
        </ContentLimiter>
      </SectionContainer>
      <SubtleDivider />
       <SectionContainer $bgColor="backgroundLight" $topPadding={12} $bottomPadding={12}>
        <ContentLimiter>
          <SectionHeadline $textAlign="center">Frequently Asked Questions</SectionHeadline>
          <SectionSubheadline $textAlign="center" style={{ marginBottom: theme.spacing(10) }}>
            Find quick answers to common queries about partnering with Élan Homewares.
          </SectionSubheadline>

          <FAQSectionWrapper>
            {faqData.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openFAQItemId === item.id}
                onToggle={() => handleToggleFAQItem(item.id)}
              />
            ))}
          </FAQSectionWrapper>
        </ContentLimiter>
      </SectionContainer>
      <SubtleDivider />
            <SectionContainer
        $bgColor="textDark"
        $textColor="textLight"
        $topPadding={12}
        $bottomPadding={15}
      >
        <ContentLimiter style={{ textAlign: "center" }}>
          <SectionHeadline
            $textAlign="center"
            style={{
              color: theme.colors.textLight,
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {" "}
            {/* Text color override for dark BG */}
            Ready to Showcase Your Excellence?
          </SectionHeadline>
          <SectionSubheadline
            $textAlign="center"
            style={{
              maxWidth: "650px",
              color: transparentize(0.15, theme.colors.textLight),
            }}
          >
            Begin your Élan journey today and share your passion with a
            community that appreciates true craftsmanship and design.
          </SectionSubheadline>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: theme.spacing(4),
              flexWrap: "wrap",
            }}
          >
            <PrimaryCtaButton
              onClick={() => handleNavigation(pathwaysData.individual.link)}
            >
              {pathwaysData.individual.cta}
            </PrimaryCtaButton>
            {/* For dark background, outline button needs different colors */}
            <PrimaryCtaButton
              onClick={() => handleNavigation(pathwaysData.vendor.link)}
              style={{
                backgroundColor: "transparent",
                borderColor: theme.colors.textLight,
                color: theme.colors.textLight,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = transparentize(
                  0.9,
                  theme.colors.textLight
                );
                e.currentTarget.style.color = theme.colors.textLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme.colors.textLight;
              }}
            >
              {pathwaysData.vendor.cta}
            </PrimaryCtaButton>
          </div>
        </ContentLimiter>
      </SectionContainer>
    </PageWrapper>
      </>
  );
};

export default BecomeAPartnerPage;
