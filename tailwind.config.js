const primeui = require('tailwindcss-primeui');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,vue}",
    "./index.html",
  ],
  plugins: [
    primeui,
    typography,
  ]
}