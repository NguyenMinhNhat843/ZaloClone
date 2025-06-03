import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./login.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#e8f3ff',
      },
      typography: {
        DEFAULT: {
          css: {
            strong: {
              fontWeight: '700',
              color: 'inherit',
            },
            em: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'transparent',
            }
          },
        },
      },
    },
  },
  plugins: [typography],
};
