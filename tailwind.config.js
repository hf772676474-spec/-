/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: { 50: '#f1f7f4', 100: '#deeee6', 300: '#8fc3a7', 500: '#388665', 700: '#205b46', 800: '#194937', 900: '#153f32' },
        moss: '#92a866',
        sand: '#f5f0e7',
        ink: '#20332c'
      },
      fontFamily: { sans: ['"Noto Sans SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'], serif: ['"Noto Serif SC"', 'SimSun', 'serif'] },
      boxShadow: { soft: '0 18px 50px rgba(26, 66, 52, 0.10)' }
    }
  },
  plugins: []
}

