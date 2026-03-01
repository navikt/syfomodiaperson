module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    "postcss-preset-env": {
      features: {
        "is-pseudo-class": false,
        "logical-properties-and-values": false,
      },
    },
  },
};
