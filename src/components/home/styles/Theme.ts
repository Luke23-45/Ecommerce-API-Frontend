import { type DefaultTheme } from "styled-components";

const fontFamilies = {
  heading: "'Playfair Display', serif",
  body: "'Inter', sans-serif",
  admin: "'Inter', sans-serif",
  code: "'Fira Code', monospace",
};

export const theme: DefaultTheme = {
  colors: {
    primaryNeutral: "#F8F5F2",
    accent1: "#A46E4A",
    accent1Hover: "#8C5D3E",
    accent1Active: "#734B32",
    accent1Subtle: "#FDF8F5",

    accent2: "#8DA382",
    accent2Hover: "#799170",
    accent2Active: "#657E5D",
    accent2Subtle: "#E9EFE6",

    accent1Vibrant: "#C87343",
    accent2Vibrant: "#A2C098",

    textDark: "#302D2A",
    textLight: "#FFFFFF",
    textMedium: "#5A5653",
    textMuted: "#888480",
    textDisabled: "#A9A9A7",
    textLink: "#9C643C",
    textLinkHover: "#7E5130",

    backgroundLight: "#FFFFFF",
    backgroundSubtle: "#FDFBF8",

    lightGray: "#F3F4F6",
    mediumGray: "#D1D5DB",
    darkGray: "#6B7280",

    error: "#EF4444",
    errorSubtleBg: "#FEE2E2",
    success: "#10B981",
    successSubtleBg: "#D1FAE5",
    warning: "#F59E0B",
    warningSubtleBg: "#FFFBEB",
    info: "#3B82F6",
    infoSubtleBg: "#EFF6FF",

    adminPrimaryBg: "#F9FAFB",
    adminSecondaryBg: "#FFFFFF",

    adminSurface: "#FFFFFF",
    adminBorder: "#E5E7EB",
    adminBorderInteractive: "#D1D5DB",

    adminText: "#1F2937",
    adminTextSecondary: "#6B7280",
    adminTextMuted: "#9CA3AF",
    adminTextDisabled: "#D1D5DB",

    adminAccent: "#A46E4A",
    adminAccentHover: "#8C5D3E",
    adminAccentActive: "#734B32",
    adminAccentSubtleBg: "#FEFBF8",

    dataVisGreen: "#34D399",
    dataVisOrange: "#F97316",
    dataVisYellow: "#FBBF24",
    dataVisBlue: "#60A5FA",
    dataVisPurple: "#A78BFA",
    dataVisPink: "#F472B6",

    adminStatusSuccess: "#10B981",
    adminStatusError: "#EF4444",
    adminStatusWarning: "#F59E0B",
    adminStatusInfo: "#3B82F6",

    gradients: {
      accent1ToVibrant: `linear-gradient(135deg, #A46E4A 0%, #C87343 100%)`,
      accent2ToVibrant: `linear-gradient(135deg, #8DA382 0%, #A2C098 100%)`,
      adminPrimaryAction: `linear-gradient(135deg, #A46E4A 0%, #BF8B69 100%)`,
      neutralSubtleWash: `linear-gradient(180deg, rgba(249,250,251,0) 0%, rgba(249,250,251,0.7) 100%)`,
    },
  },

  typography: {
    fonts: fontFamilies,
    lineHeights: {
      condensed: 1.2,
      tight: 1.35,
      base: 1.6,
      relaxed: 1.8,
    },
    letterSpacings: {
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0em",
      wide: "0.02em",
      wider: "0.04em",
    },

    heading: {
      fontFamily: fontFamilies.heading,
      fontWeight: 700,
      lineHeight: "tight",
      letterSpacing: "tight",
      sizes: {
        display: "clamp(3rem, 7vw, 5.2rem)",
        h1: "clamp(2.6rem, 6vw, 4.5rem)",
        h2: "clamp(2.1rem, 5vw, 3.6rem)",
        h3: "clamp(1.7rem, 4vw, 2.8rem)",
        h4: "clamp(1.4rem, 3.5vw, 2.1rem)",
        h5: "clamp(1.15rem, 3vw, 1.7rem)",
        h6: "clamp(1rem, 2.5vw, 1.4rem)",
      },
      weights: { regular: 400, bold: 700, extraBold: 800 },
    },
    body: {
      fontFamily: fontFamilies.body,
      fontWeight: 400,
      lineHeight: "base",
      letterSpacing: "normal",
      sizes: {
        xlarge: "1.2rem",
        large: "1.1rem",
        medium: "1rem",
        base: "1rem",
        small: "0.9rem",
        xsmall: "0.8rem",
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
      },
    },
    utility: {
      fontFamily: fontFamilies.body,
      button: { fontWeight: 500, letterSpacing: "wide", fontSize: "0.95rem" },
      label: {
        fontWeight: 600,
        fontSize: "0.85rem",
        letterSpacing: "tight",
        textTransform: "uppercase",
      },
      caption: {
        fontFamily: fontFamilies.body,
        fontSize: "0.8rem",
        lineHeight: "tight",
        colorToken: "textMuted",
      },
    },

    admin: {
      fontFamily: fontFamilies.admin,
      lineHeight: "base",
      letterSpacing: "normal",
      sizes: {
        pageTitle: "1.75rem",
        moduleTitle: "1.375rem",
        sectionHeader: "1.125rem",
        subHeader: "1rem",
        metricValue: "2.5rem",
        bodyLarge: "0.9375rem",
        bodyBase: "0.875rem",
        dataCell: "0.875rem",
        formLabel: "0.8125rem",
        smallText: "0.8125rem",
        xsmallText: "0.75rem",
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
      },
    },
  },

  breakpoints: {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "1920px",
    desktopL: "2560px",
  },

  spacing: (value: number) => `${value * 0.25}rem`,

  maxWidth: "1700px",
  containerPadding: "clamp(1.5rem, 4vw, 2.5rem)",

  borderRadius: {
    none: "0px",
    small: "6px",
    medium: "12px",
    large: "16px",
    xlarge: "24px",
    pill: "9999px",
    circle: "50%",
  },
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    interactive: "0 3px 6px rgba(0, 0, 0, 0.07)",
    focusRing: `0 0 0 3px ${"#A46E4A"}4D`,
    inset: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)",
  },
  transitions: {
    short: "0.1s ease-out",
    base: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    medium: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    long: "0.45s cubic-bezier(0.4, 0, 0.2, 1)",
    entrance: "0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  zIndex: {
    base: 1,
    belowContent: -1,
    content: 10,
    overlayDim: 50,
    dropdown: 1000,
    stickyNav: 800,
    megaMenu: 850,
    modalBackdrop: 1100,
    adminSidebar: 950,
    modalContent: 1200,
    adminHeader: 1050,
    notificationToast: 2000,
    tooltip: 3000,
    devTools: 9999,
  },
};

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primaryNeutral: string;
      accent1: string;
      accent1Hover: string;
      accent1Active: string;
      accent1Subtle: string;
      accent2: string;
      accent2Hover: string;
      accent2Active: string;
      accent2Subtle: string;
      accent1Vibrant: string;
      accent2Vibrant: string;
      textDark: string;
      textLight: string;
      textMedium: string;
      textMuted: string;
      textDisabled: string;
      textLink: string;
      textLinkHover: string;
      backgroundLight: string;
      backgroundSubtle: string;
      lightGray: string;
      mediumGray: string;
      darkGray: string;
      error: string;
      errorSubtleBg: string;
      success: string;
      successSubtleBg: string;
      warning: string;
      warningSubtleBg: string;
      info: string;
      infoSubtleBg: string;
      adminPrimaryBg: string;
      adminSecondaryBg: string;
      adminSurface: string;
      adminBorder: string;
      adminBorderInteractive: string;
      adminText: string;
      adminTextSecondary: string;
      adminTextMuted: string;
      adminTextDisabled: string;
      adminAccent: string;
      adminAccentHover: string;
      adminAccentActive: string;
      adminAccentSubtleBg: string;
      dataVisGreen: string;
      dataVisOrange: string;
      dataVisYellow: string;
      dataVisBlue: string;
      dataVisPurple: string;
      dataVisPink: string;
      adminStatusSuccess: string;
      adminStatusError: string;
      adminStatusWarning: string;
      adminStatusInfo: string;
      gradients?: { [key: string]: string; adminPrimaryAction?: string };
    };
    typography: {
      fonts: { heading: string; body: string; admin: string; code?: string };
      lineHeights: {
        condensed: number;
        tight: number;
        base: number;
        relaxed: number;
      };
      letterSpacings: {
        tighter: string;
        tight: string;
        normal: string;
        wide: string;
        wider: string;
      };
      heading: {
        fontFamily: string;
        fontWeight: number;
        lineHeight: any;
        letterSpacing: any;
        sizes: { [key: string]: string };
        weights: { [key: string]: number };
      };
      body: {
        fontFamily: string;
        fontWeight: number;
        lineHeight: any;
        letterSpacing: any;
        sizes: { [key: string]: string };
        weights: { [key: string]: number };
      };
      utility: { fontFamily: string; button: any; label: any; caption: any };
      admin: {
        fontFamily: string;
        lineHeight: any;
        letterSpacing: any;
        sizes: { [key: string]: string; metricValue: string };
        weights: { [key: string]: number; extraBold?: number };
      };
    };
    breakpoints: { [key: string]: string };
    spacing: (value: number) => string;
    maxWidth: string;
    containerPadding: string;
    borderRadius: {
      none: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
      pill: string;
      circle: string;
    };
    shadows: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      interactive: string;
      focusRing: string;
      inset: string;
    };
    transitions: {
      short: string;
      base: string;
      medium: string;
      long: string;
      entrance: string;
    };
    zIndex: {
      base: number;
      belowContent: number;
      content: number;
      overlayDim: number;
      dropdown: number;
      stickyNav: number;
      megaMenu: number;
      modalBackdrop: number;
      adminSidebar: number;
      modalContent: number;
      adminHeader: number;
      notificationToast: number;
      tooltip: number;
      devTools: number;
    };
  }
}
