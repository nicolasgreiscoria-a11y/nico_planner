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
        // Base surfaces
        background: "var(--bg)",
        foreground: "var(--text)",
        // Glass tokens
        "glass-surface": "var(--glass-surface)",
        "glass-border": "var(--glass-border)",
        "glass-strong": "var(--glass-strong)",
        // Brand
        accent: "var(--accent)",
        muted: "var(--muted)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "40px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-sm": "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        "glass-accent": "0 0 24px rgba(87,187,138,0.12)",
      },
      keyframes: {
        "blob-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.96)" },
        },
        "blob-drift-alt": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "40%": { transform: "translate(-25px, 20px) scale(1.04)" },
          "70%": { transform: "translate(20px, -15px) scale(0.97)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "blob-slow": "blob-drift 18s ease-in-out infinite",
        "blob-alt": "blob-drift-alt 22s ease-in-out infinite",
        "fade-in-up": "fade-in-up 200ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
