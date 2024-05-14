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
        accent: {
          "50": "#eff9ff",
          "100": "#dff2ff",
          "200": "#b8e6ff",
          "300": "#78d3ff",
          "400": "#42c2ff",
          "500": "#06a4f1",
          "600": "#0083ce",
          "700": "#0068a7",
          "800": "#02588a",
          "900": "#084972",
          "950": "#062e4b",
        },
        magic: {
          gray: "#111111",
          "gray-2": "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-hanken-grotesk)"],
        body: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
