// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css", "~/assets/css/alga.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      "alga-css": {
        extract: [
          "./pages/**/*.vue",
          "./layouts/**/*.vue",
          "./components/**/*.vue",
        ],
      },
      autoprefixer: {},
    },
  },
});
