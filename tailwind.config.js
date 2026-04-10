/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1E40AF",
          light: "#3B82F6",
          dark: "#1E3A8A",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          alt: "#F1F5F9",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        error: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        text: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
        border: "#E2E8F0",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
