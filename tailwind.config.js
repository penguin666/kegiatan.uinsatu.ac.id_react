/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./resources/**/*.jsx', './resources/**/*.blade.php'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      boxShadow:{
        myShadow1: "4.1px -5px 0 0  rgb(241 245 249)",
        myShadow2: "-4.1px -5px 0 0  rgb(241 245 249)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

