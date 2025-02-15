/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tabBack: 'var(--tabBack)',
      }
    },
    fontFamily: {
      primary: "Noto Sans KR",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
