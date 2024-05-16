/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
  ],
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
          success: "#8ADD21",
          danger: "#DD2121",
          primary: {
            1: "#1179FF",
            2: "#134493",
            3: "#ACBCCA",
          },
          secondary: {
            1: "#B5D2CB",
            2: "#CDE1DC",
            3: "#E6F0ED",
          },
          accent: {
            1: "#40E0BA",
            2: "#7FEAD1",
            3: "#BFF4E8",
          },
        },
      },
    },
    screens: {
      ...defaultTheme.screens,
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
