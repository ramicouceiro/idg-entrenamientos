/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'bg-root': "url('/img/pucara-bg.png')"
      },colors: {
        'custom-green': '#22C550',
      },
    },
  },
  plugins: [],
}