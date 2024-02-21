/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      radix: {
        mintDefault: "#25d0ab",
        mintLighter: "#95f3d9"
      },
      base: {
        black: "#100F0F",
        950: "#1C1B1A",
        900: "#282726",
        850: "#343331",
        800: "#403E3C",
        700: "#AC3B61",
        600: "#6F6E69",
        500: "#878580",
        300: "#B7B5AC",
        200: "#CECDC3",
        150: "#DAD8CE",
        100: "#E6E4D9",
        50: "#F2F0E5",
        paper: "#FFFCF0",
      },
      red: {
        DEFAULT: "#AF3029",
        light: "#D14D41",
      },
      orange: {
        DEFAULT: "#BC5215",
        light: "#DA702C",
      },
      yellow: {
        DEFAULT: "#AD8301",
        light: "#D0A215",
      },
      green: {
        DEFAULT: "#66800B",
        light: "#879A39",
      },
      cyan: {
        DEFAULT: "#24837B",
        light: "#3AA99F",
      },
      blue: {
        DEFAULT: "#205EA6",
        light: "#4385BE",
      },
      purple: {
        DEFAULT: "#5E409D",
        light: "#8B7EC8",
      },
      magenta: {
        DEFAULT: "#A02F6F",
        light: "#CE5D97",
      },
    },
  },
  plugins: [],
};
