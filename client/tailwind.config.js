/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E88E5',
          'header-blue': '#1565C0',
          'soft-blue': '#BBDEFB',
          green: '#43A047',
          'light-green': '#C8E6C9',
          yellow: '#FBC02D',
          'soft-yellow': '#FFF9C4',
          red: '#E53935',
          'soft-red': '#FFCDD2',
          'card-gray': '#F5F7FA',
        },
        ink: {
          primary: '#263238',
          secondary: '#607D8B',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
