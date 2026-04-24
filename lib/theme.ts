export const colors = {
  background: "#EEF2F6",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#D8E1EA",
  textPrimary: "#122230",
  textMuted: "#546579",
  textInverse: "#FFFFFF",
  textInverseMuted: "rgba(255,255,255,0.82)",
  accent: "#0F766E",
} as const;

export const spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;
