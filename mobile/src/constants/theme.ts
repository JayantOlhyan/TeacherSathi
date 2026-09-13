export const Colors = {
  primary: {
    dark: '#062E1E',
    main: '#0F5B38',
    light: '#15803D',
    soft: '#E8F5E9',
    accent: '#22C55E',
  },
  secondary: {
    amber: '#F59E0B',
    amberLight: '#FEF3C7',
    blue: '#2563EB',
    blueLight: '#DBEAFE',
  },
  status: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  heading2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  heading3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
  button: { fontSize: 15, fontWeight: '600' as const },
};

export const Layout = {
  minTouchTarget: 48,
  screenPadding: 16,
  cardElevation: 2,
};

export const theme = {
  colors: {
    primary: {
      900: Colors.primary.dark,
      800: Colors.primary.main,
      700: Colors.primary.main,
      600: Colors.primary.light,
      500: Colors.primary.accent,
      100: Colors.primary.soft,
    },
    accent: {
      700: Colors.secondary.amber,
      500: Colors.secondary.amber,
      400: Colors.secondary.amber,
    },
    status: {
      success: Colors.status.success,
      warning: Colors.status.warning,
      error: Colors.status.danger,
      info: Colors.status.info,
    },
    surface: {
      background: Colors.neutral.background,
      card: Colors.neutral.card,
      border: Colors.neutral.border,
    },
    neutral: {
      50: '#FFFFFF',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  radii: {
    sm: BorderRadius.sm,
    md: BorderRadius.md,
    lg: BorderRadius.lg,
    full: BorderRadius.full,
  },
  typography: {
    fontFamilies: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
    },
  },
  accessibility: {
    minTouchTarget: Layout.minTouchTarget,
  },
};

