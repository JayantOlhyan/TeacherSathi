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
        // Phase 12 Semantic Tokens
        surface: {
          DEFAULT: "#FFFFFF",
          sunken: "#F4F6F4",
          elevated: "#FFFFFF",
          muted: "#F8FAF8",
        },
        border: {
          subtle: "#E5EBE5",
          DEFAULT: "#D2E3D6",
          strong: "#A3C4AC",
        },
        // Phase 12 Classroom Mode Palette (Low-glare high-contrast for 75" Smartboards)
        classroom: {
          bg: "#0B131E",
          surface: "#131F30",
          card: "#162338",
          border: "#20334D",
          text: "#F8FAFC",
          "text-muted": "#94A3B8",
          accent: "#10B981",
          "accent-hover": "#059669",
          control: "#1E293B",
          "control-hover": "#334155",
          dock: "#080D14",
          light: {
            bg: "#F8FAFC",
            surface: "#FFFFFF",
            border: "#E2E8F0",
            text: "#0F172A",
            "text-muted": "#64748B",
            dock: "#F1F5F9",
          }
        },
      },
      borderRadius: {
        'radius-sm': "6px",
        'radius-md': "10px",
        'radius-lg': "14px",
        'radius-xl': "18px",
        'radius-2xl': "24px",
        card: "16px",
        '2xl': "20px",
        '3xl': "28px",
      },
      minHeight: {
        'touch-sm': "44px",
        'touch': "48px",
        'touch-classroom': "64px",
        'touch-classroom-lg': "72px",
      },
      minWidth: {
        'touch-sm': "44px",
        'touch': "48px",
        'touch-classroom': "64px",
        'touch-classroom-lg': "72px",
      },
      fontSize: {
        // Phase 12 Classroom Typography Scale (strictly >= 20px for 75" display at 6m-10m)
        'classroom-caption': ["1.25rem", { lineHeight: "1.6rem", fontWeight: "600" }], // 20px
        'classroom-body': ["1.75rem", { lineHeight: "2.4rem", fontWeight: "400" }],    // 28px
        'classroom-h3': ["2.125rem", { lineHeight: "2.75rem", fontWeight: "700" }],    // 34px
        'classroom-h2': ["2.75rem", { lineHeight: "3.25rem", fontWeight: "800" }],     // 44px
        'classroom-h1': ["3.75rem", { lineHeight: "4.25rem", fontWeight: "900" }],     // 60px
        'classroom-display': ["4.75rem", { lineHeight: "5.25rem", fontWeight: "900" }],// 76px
      },
      boxShadow: {
        card: "0 2px 8px rgba(15, 91, 56, 0.04), 0 8px 24px rgba(15, 91, 56, 0.06)",
        smartboard: "0 20px 50px -10px rgba(6, 46, 30, 0.25), 0 10px 20px -5px rgba(6, 46, 30, 0.15)",
        classroom: "0 8px 30px rgba(0, 0, 0, 0.4)",
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

