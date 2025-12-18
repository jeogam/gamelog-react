/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- É ISSO QUE FAZ A MÁGICA NA V4
  },
};

export default config;