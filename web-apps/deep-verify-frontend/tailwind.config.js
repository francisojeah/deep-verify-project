/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const flowbite = require("flowbite-react/tailwind");

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
        },
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        foreground: token("foreground"),
        "muted-foreground": token("muted-foreground"),
        brand: {
          DEFAULT: token("brand"),
          hover: token("brand-hover"),
          subtle: token("brand-subtle"),
        },
        success: {
          DEFAULT: token("success"),
          subtle: token("success-subtle"),
        },
        danger: {
          DEFAULT: token("danger"),
          subtle: token("danger-subtle"),
        },
        ring: token("ring"),
      },
      borderRadius: {
        // One scale: controls use lg, cards use xl. Nothing else.
        lg: "0.625rem",
        xl: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 15 20 / 0.04), 0 8px 24px -12px rgb(16 15 20 / 0.12)",
        custom: "0px 4px 20px 0px rgba(0, 0, 0, 0.25)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
