/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./desktop/src/**/*.{js,ts,jsx,tsx}", // 👈 CRITICAL FOR ELECTRON
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
