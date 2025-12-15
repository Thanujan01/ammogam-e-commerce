/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        sidebar: {
          DEFAULT: 'hsl(0 0% 98%)',
          foreground: 'hsl(240 5.3% 26.1%)',
          border: 'hsl(214.3 31.8% 91.4%)',
          accent: 'hsl(210 40% 96.1%)',
          'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
        },
        primary: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)',
          foreground: 'hsl(210 40% 98%)',
        },
        primary1: {
          DEFAULT: 'hsl(38 92% 50%)',   // 🔥 amber-600
          foreground: 'hsl(0 0% 100%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
      },
    },
  },
  plugins: [],
};
