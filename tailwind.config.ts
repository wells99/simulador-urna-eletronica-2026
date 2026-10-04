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
        urna: {
          bg: "#dbd5c9",
          border: "#c4bcae",
          dark: "#262626",
          screen: "#d8e2dc",
          screenBorder: "#a3b1a6",
          green: "#00a859",
          orange: "#ff6b00",
          whiteBtn: "#f4f4f4",
        },
      },
    },
  },
  plugins: [],
};
export default config;
