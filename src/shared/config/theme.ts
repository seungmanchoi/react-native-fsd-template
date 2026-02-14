export const Colors = {
  background: {
    primary: '#0a0a0a',
    secondary: '#141414',
    tertiary: '#1a1a1a',
  },

  primary: {
    DEFAULT: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0284c7',
    gradient: ['#0ea5e9', '#6366f1'],
  },

  accent: {
    gold: '#fbbf24',
    lightGold: '#fcd34d',
    darkGold: '#f59e0b',
  },

  text: {
    primary: '#f5f5f5',
    secondary: '#a1a1a1',
    tertiary: '#737373',
    muted: '#525252',
  },

  surface: {
    card: 'rgba(26, 26, 26, 0.8)',
    cardHover: 'rgba(38, 38, 38, 0.9)',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  gradients: {
    primary: ['#0ea5e9', '#6366f1'],
    gold: ['#fbbf24', '#f59e0b'],
    success: ['#10b981', '#059669'],
  },
};

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const GlassmorphismStyle = {
  backgroundColor: 'rgba(26, 26, 26, 0.7)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',
  ...Shadows.md,
};
