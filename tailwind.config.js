/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-inner": "inset 0px 0px 0px 2px rgba(0, 0, 0, 0.25)",
        "custom-flat": "4px 4px 2px 0px rgba(0, 0, 0, 0.2)",
        "custom-inner-highlight":
          "inset 1px 1px 1px rgba(255, 255, 255, 0.6), inset -1px -1px 1px rgba(0, 0, 0, 0.2);",
        "custom-inner-highlight-hover":
          "inset 2px 2px 3px rgba(255, 255, 255, 0.8), inset -2px -2px 3px rgba(0, 0, 0, 0.3);",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        ".clipped-corner-medium": {
          clipPath:
            "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
        },
        ".clipped-corner-small": {
          clipPath:
            "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
