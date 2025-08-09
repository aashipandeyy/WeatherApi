/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      colors: {
        d1: 'var(--colorD1)',
        d2: 'var(--colorD2)',
        l1: 'var(--colorL1)',
        l2: 'var(--colorL2)',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(160deg, #112d4e 0%, #3f72af 100%)',
      },
    },
  },
  plugins: [],
}