/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6445', // rgb(255, 100, 69)
          600: 'rgb(230,80,50)',// 좀 더 진한색 #E65032
        },
        secondary: {
          DEFAULT: '#A2A2A2', // rgb(162, 162, 162)
          600: 'rgb(90,90,90)', // 좀 더 진한색 #5A5A5A
        },
      },
    },
    fontFamily: {
      primary: "Noto Sans KR",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
