/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@navikt/ds-tailwind")],
  theme: {
    screens: {
      md: "768px",
      "-md": { max: "767px" },
      lg: "1024px",
      "-lg": { max: "1023px" },
      xl: "1280px",
      "-xl": { max: "1279px" },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
