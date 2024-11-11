/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        text: "#fff",
        'light': "#29478d",
        'primary-dark': "#0f172a",
        'primary-main': "#152447",
        'primary-light': "#233869",
      },
    },
  },
  plugins: [],
};

