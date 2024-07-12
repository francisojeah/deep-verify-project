/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        custom: "0px 4px 20px 0px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        custom: {
          primary:"#8b5cf6",
          success: "#8ADD21",
          danger: "#DD2121",
        },
        'medium-purple': {
          '50': '#f7f3ff',
          '100': '#efe9fe',
          '200': '#e2d6fe',
          '300': '#cbb5fd',
          '400': '#ad8bfa',
          '500': '#8b5cf6',
          '600': '#713aed',
          '700': '#5e28d9',
          '800': '#4e21b6',
          '900': '#421d95',
          '950': '#2a1065',
      },
        light: {
          background: "#FFFFFF", 
          primaryText: "#060606",
          secondaryText: "#6C757D", 
          primaryButtonBg: "#8b5cf6", 
          primaryButtonText: "#FFFFFF",
          secondaryButtonBg: "#6C757D", 
          secondaryButtonText: "#FFFFFF", 
          success: "#28A745", 
          warning: "#FFC107", 
          link: "#17A2B8", 
          border: "#E0E0E0", 
          card: "#FFFFFF", 
        },
        dark: {
          background: "#060606", 
          primaryText: "#FFFFFF", 
          secondaryText: "#B0B3B8", 
          primaryButtonBg: "#8b5cf6", 
          primaryButtonText: "#FFFFFF", 
          secondaryButtonBg: "#495057", 
          secondaryButtonText: "#FFFFFF", 
          success: "#81C784", 
          warning: "#FFA000", 
          link: "#00B8D4", 
          border: "#424242", 
          card: "#1E1E1E", 
        }
      },
    },
    screens: {
      ...defaultTheme.screens,
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
