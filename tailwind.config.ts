import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'liq-dark': '#0a0a0a',
        'liq-card': '#1a1a1a',
        'liq-accent': '#c9a227',
        'liq-gray': '#888888',
      },
    },
  },
  plugins: [],
};

export default config;
