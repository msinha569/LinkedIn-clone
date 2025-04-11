// tailwind.config.js
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        linkedin: {
          primary: "#0A66C2",      // LinkedIn blue
          secondary: "#F3F2EF",    // LinkedIn background color
          accent: "#01764A",       // A strong green for accents
          neutral: "#191919",      // Neutral dark gray for text
          "base-100": "#FFFFFF",   // Main background should be white
          info: "#5E5E5E",         // Muted gray text
          success: "#13A300",
          warning: "#EAC54F",
          error: "#D93025",
        },
      },
    ],
  },
};
