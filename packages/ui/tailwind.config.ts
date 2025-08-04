import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/ui/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx}",
    "../../apps/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;