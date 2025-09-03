/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",        // ważne, żeby Tailwind wiedział, gdzie szuka klas
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
