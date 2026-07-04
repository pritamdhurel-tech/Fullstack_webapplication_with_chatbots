/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080B12',
          2: '#0D1120',
          3: '#111827',
        },
        accent: {
          DEFAULT: '#6C63FF',
          teal: '#00D4AA',
          red: '#FF6B6B',
        },
        surface: 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      borderRadius: {
        card: '14px',
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        pulse2: 'pulse2 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulse2: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
    },
  },
  plugins: [],
}
