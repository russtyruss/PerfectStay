/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 tells Tailwind to scan all JS/JSX files in src/
  ],
  theme: {
    extend: {
      colors: {
        hotelBlue: {
          DEFAULT: "#007BFF",
          dark: "#0056b3",
          light: "#66b2ff",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
