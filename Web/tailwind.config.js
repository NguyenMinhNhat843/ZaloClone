/** @type {import('tailwindcss').Config} */
export default {
  content: ["./login.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#e8f3ff', // Bạn có thể đặt tên tùy ý
      },
    },
  },
  plugins: [],
};
