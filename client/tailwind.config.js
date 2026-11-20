/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#008ECC',         // Template signature vibrant blue
        'brand-primary-hover': '#0074A6',   // Slightly darker blue for hover
        'brand-primary-light': '#E0F2FE',   // Very soft sky tint
        'brand-primary-dark': '#0369A1',    // Deep ocean blue
        'brand-secondary': '#2563EB',       // Royal blue
        'brand-background': '#F8FAFC',      // Crisp, clean formal light slate
        'brand-surface': '#FFFFFF',         // Crisp pure white
        'brand-text-primary': '#0F172A',    // High-contrast slate-900
        'brand-text-secondary': '#475569',  // Medium slate-600
        'brand-text-muted': '#94A3B8',      // Soft slate-400
        'brand-border': '#E2E8F0',          // Slate-200 border
        'brand-error': '#EF4444',          // Red
        'brand-success': '#10B981',        // Emerald Green
        'brand-warning': '#F59E0B',        // Amber
        'brand-input-bg': '#FFFFFF',
        'brand-button-text': '#FFFFFF',
        'brand-footer': '#008ECC',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -3px rgba(0, 142, 204, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'pill': '0 2px 8px rgba(0, 142, 204, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
