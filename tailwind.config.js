/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      primary: "Noto Sans KR",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
