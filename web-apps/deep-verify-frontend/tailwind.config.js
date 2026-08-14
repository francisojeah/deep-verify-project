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
        // Inter carries the interface, where most type sits at 13-14px.
        // Montserrat is display only - it is too wide and too low in x-height
        // to stay legible at UI sizes.
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Montserrat", ...defaultTheme.fontFamily.sans],
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
        // Square by design. Every size collapses to zero so nothing can
        // reintroduce a corner; `circle` stays for elements that are round
        // shapes rather than rounded rectangles - the spinner and status dot.
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
        circle: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 15 20 / 0.04)",
        custom: "0 1px 2px rgb(16 15 20 / 0.06)",
        none: "none",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
