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
        'turqoise': '#60DCCC',
        'greenish': '#AED48F',
        'mid': '#D8D67C',
        'nude': '#F5C090',
        'orangy': '#F9926A',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        button_bg: 'var(--button-bg)',
        'border-color': 'var(--border-color)',
      },
    },
  },
  plugins: [],
};
export default config;
