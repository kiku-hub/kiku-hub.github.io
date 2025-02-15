/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('images/herobg.png')",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.rotate-x-12': {
          'transform': 'rotateX(12deg)',
        },
        '.clip-path-pyramid-top': {
          'clip-path': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        },
        '.clip-path-pyramid-middle': {
          'clip-path': 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
        },
        '.clip-path-pyramid-bottom': {
          'clip-path': 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
        },
      });
    },
  ],
};
