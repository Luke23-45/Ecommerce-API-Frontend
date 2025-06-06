


export interface AdminProductListTheme {
  colors: {
    red:string;
    primaryNeutral: string;
    primaryAccentText: string;
    primaryBackground: string;
    surface: string;
    border: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textLink: string;
    success: string;
    error: string;
    warning: string;

    sidebarBg: string;
    sidebarAccent: string;
    sidebarText: string;
    sidebarTextActive: string;
    headerBg: string;
    tableHeaderBg: string;
  };
  spacing: (value: number) => string;
  typography: {
    fontFamily: string;
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
    tableHeader: string;
    button: string;
    weights: {
      light: number;
      regular: number;
      medium: number;
      semiBold: number;
      bold: number;
    };
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    pill: string;
  };
  shadows: {
    subtle: string;
    small: string;
    medium: string;
  };
  breakpoints: {
    mobileS: string;
    mobileM: string;
    mobileL: string;
    tablet: string;
    laptop: string;
    desktop: string;
  };
  zIndex: {
    dropdown: number;
    modal: number;
    tooltip: number;
  };

  
}

export const adminProductListTheme:AdminProductListTheme = {
  colors: {
    red:"#000",
    primaryNeutral: '#FF7F50',
    primaryAccentText: '#FFFFFF',
    primaryBackground: '#F4F6F8',
    surface: '#FFFFFF',
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textLink: '#FF7F50',
    success: '#28A745',
    error: '#DC3545',
    warning: '#FFC107',

    sidebarBg: '#FFFFFF',
    sidebarAccent: '#FF7F50',
    sidebarText: '#495057',
    sidebarTextActive: '#FF7F50',
    headerBg: '#FFFFFF',
    tableHeaderBg: '#F8F9FA',
  },
  spacing: (value: number) => `${value * 4}px`,
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    h1: '2rem',
    h2: '1.5rem',
    h3: '1.25rem',
    body: '0.9rem',
    small: '0.8rem',
    tableHeader: '0.85rem',
    button: '0.9rem',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    pill: '50px',
  },
  shadows: {
    subtle: '0 1px 3px rgba(0,0,0,0.03)',
    small: '0 2px 6px rgba(0,0,0,0.05)',
    medium: '0 4px 12px rgba(0,0,0,0.07)',
  },
  breakpoints: {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1440px",
  },
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1100,
  },
} as const;