/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f6ba79',
          400: '#f19443',
          500: '#ed761d',
          600: '#de5c13',
          700: '#b84412',
          800: '#933716',
          900: '#772e15',
        },
      },
    },
  },
  plugins: [],
};
