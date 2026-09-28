import type { Config } from "tailwindcss";
import { colors } from "./src/styles/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.background,
        secondary: colors.accent,
        card: colors.card,
        muted: colors.muted,
      },
    },
  },
  plugins: [],
};
export default config;
