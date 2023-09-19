/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 'text': '#000000',
        'bgcolor': '#f7f7f7',
        // 'primary': '#0a2743',
        // 'secondary': '#f0e2de',
        // 'accent': '#124f6c',
        
        'text': '#0c0c0c',
        'background': '#f5fffa',
        'primary': '#172554',
        'secondary': '#db8f43',
        'accent': '#e67ab0',
        'card': '#ddedfd',
        'header': '#db8f43',

      }
    },
  },
  plugins: [],
}

