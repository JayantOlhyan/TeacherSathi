import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0F5B38",
        accent: "#15803D",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        brand: {
          DEFAULT: "#0F5B38",
          dark: "#062E1E",
          forest: "#062E1E",
          deep: "#083220",
          light: "#15803D",
          surface: "#EBF3ED",
          border: "#D2E3D6",
          50: "#F2F8F4",
          100: "#E2F1E6",
          200: "#D2E3D6",
          300: "#96C7A0",
          400: "#5EAA6D",
          500: "#0F5B38",
          600: "#0C4B2E",
          700: "#093B24",
          800: "#062E1E",
          900: "#041F14",
          950: "#02120B",
        },
        cta: {
          DEFAULT: "#0F5B38",
          hover: "#0C4B2E",
        },
        warm: {
          bg: "#F6F4EE",
          sunken: "#EEECE4",
          surface: "#FFFFFF",
          card: "#F4F6F2",
          DEFAULT: "#1E382B",
          gold: "#E1A140",
          yellow: "#FBBF24",
        },
        ink: {
          DEFAULT: "#0A2A1A",
          2: "#183827",
          3: "#3D5849",
          4: "#6B8576",
        },
        cream: "#F6F4EE",
        "dark-bg": "#062E1E",
        "dark-card": "#083220",
        "dark-surface": "#052417",
      },
      borderRadius: {
        card: "16px",
        '2xl': "20px",
        '3xl': "28px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(15, 91, 56, 0.04), 0 8px 24px rgba(15, 91, 56, 0.06)",
        smartboard: "0 20px 50px -10px rgba(6, 46, 30, 0.25), 0 10px 20px -5px rgba(6, 46, 30, 0.15)",
        elevated: "0 12px 36px -8px rgba(14, 42, 30, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "var(--font-mukta)", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        floatSlow: 'floatSlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;

