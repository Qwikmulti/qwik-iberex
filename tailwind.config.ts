import type { Config } from "tailwindcss";


const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#d6e8de",
        forest: {
          50: "#f0f5f2",
          100: "#d6e8de",
          200: "#aed1be",
          300: "#7db49a",
          400: "#4e9478",
          500: "#2d7359",
          600: "#1f5a44",
          700: "#174332",
          800: "#112e24",
          900: "#0b1e17",
          950: "#060f0c",
        },
        cream: {
          50: "#fafaf7",
          100: "#f5f4f0",
          200: "#ede9e1",
          300: "#ddd8cc",
          400: "#c8c0b0",
          500: "#afa490",
          600: "#918577",
          700: "#726a60",
          800: "#544e49",
          900: "#383430",
        },
        ink: {
          50: "#f4f4f2",
          100: "#e2e2de",
          200: "#c5c5be",
          300: "#a3a39a",
          400: "#7e7e76",
          500: "#606058",
          600: "#4a4a43",
          700: "#35352f",
          800: "#22221d",
          900: "#131310",
          950: "#080807",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        noise: "url('/noise.svg')",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in-right": "slideInRight 0.5s ease forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
