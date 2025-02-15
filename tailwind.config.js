/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6445",
        secondary: "#A2A2A2",
      }
    },
    fontFamily: {
      primary: "Noto Sans KR",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
