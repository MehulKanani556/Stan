import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': "320px",
      'sm': "425px",
      'md600': "601px",
      'md': "768px",
      'lg': "1024px",
      'xl': "1280px",
      "2xl": "1440px",  
      "3xl": "1650px",
      "4xl": "1920px",
      "5xl": "2560px",
    },
    extend: {
      colors: {
        primary: {
          light: "#fff",
          dark: "#141414",
        },
        secondary: {
          light: "#141414",
          dark: "#fff",
        },
      },
    },
    container: {
      center: true, // Center the container by default
      screens: {
        sm: '420px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1800px',
      },
    },
  },
  plugins: [daisyui],
}

