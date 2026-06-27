/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // v2.1 "Premium Elevation" — emerald accent on ink / white / mint.
        // `brand` repointed from gold to emerald so all existing brand-* usages reskin.
        brand: {
          DEFAULT: "#14CE96", // Emerald accent
          50: "#E4F7EF",      // mint
          100: "#C5F0DF",
          200: "#94E6C6",
          300: "#5FE3BC",
          400: "#2FD9A8",
          500: "#14CE96",
          600: "#0FB082",
          700: "#0C8A66",
          800: "#0A6B50",
          900: "#08503C",
        },
        emerald: {
          DEFAULT: "#14CE96",
          top: "#34E0AC",   // button highlight
          light: "#5FE3BC",
          dark: "#0DB082",
          deep: "#0A6B52",
          tint: "#128C68",
        },
        // Ink scale (replaces old navy/slate darks) — exact mockup darks.
        // 950/850 kept so hardcoded slate-950/850 usages shift to ink.
        ink: {
          DEFAULT: "#0E1726", // primary dark surface
          deep: "#0C1017",    // body / deepest bg
          soft: "#11161F",
          green: "#0C2A22",   // emerald-tinted deep
          muted: "#5B6470",
        },
        mint: {
          DEFAULT: "#E4F7EF",
          soft: "#F2FCF8",
        },
        slate: {
          850: "#0E1726", // ink primary (was navy surface)
          950: "#0C1017", // ink deepest (was deep navy background)
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],     // Manrope (body)
        body: ["var(--font-body)", "system-ui", "sans-serif"],      // Manrope
        display: ["var(--font-display)", "system-ui", "sans-serif"],// Sora (display)
        heading: ["var(--font-display)", "system-ui", "sans-serif"],// alias → Sora
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(.65,0,.35,1)",
      },
      backgroundImage: {
        // Emerald CTA gradient + auth/hero ink gradient (from mockup)
        "emerald-btn": "linear-gradient(180deg,#34E0AC,#14CE96)",
        "auth-ink": "linear-gradient(150deg,#0C2A22 0%,#0C1017 72%)",
      },
      boxShadow: {
        // Long-throw, ink/emerald-tinted premium shadows
        premium: "0 18px 40px -28px rgba(14,23,38,.45)",
        "premium-lg": "0 30px 60px -28px rgba(14,23,38,.5)",
        "premium-xl": "0 44px 100px -34px rgba(0,0,0,.55)",
        emerald: "0 18px 40px -16px rgba(20,206,150,.45)",
        "focus-emerald": "0 0 0 3px rgba(20,206,150,.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // v2.1 motion primitives — translateY-only reveals, opacity stays 1
        reveal: {
          from: { transform: "translateY(24px)" },
          to: { transform: "translateY(0)" },
        },
        // continuous gentle float (X+Y drift) for hero photos
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(6px, -10px)" },
        },
        // horizontal marquee ticker (Landing)
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        reveal: "reveal .7s cubic-bezier(.65,0,.35,1) both",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};