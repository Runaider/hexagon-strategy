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
        // "inner-bottom-shadow":
        //   "box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        "background-primary": "#a59192",
        "background-secondary": "#dfc89d",
        "text-primary": "#3f3937",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        ".shadow-filter": {
          filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))",
        },
        ".shadow-filter-flat": {
          filter: "drop-shadow(4px 4px 1px rgba(0, 0, 0, 0.3))",
        },
        ".shadow-border": {
          filter: "drop-shadow(0px 0px 0.7px rgba(0, 0, 0, 1))",
        },
        ".clipped-corner-medium": {
          clipPath:
            "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
        },
        ".clipped-corner-small": {
          clipPath:
            "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
        },

        ".inner-bottom-shadow": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20px",
            "box-shadow": "inset 0 -10px 10px 0px rgba(165, 145, 146, 1)",
            "z-index": 10,
            pointerEvents: "none",
          },
        },
        ".inner-top-shadow": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "20px",
            "box-shadow": "inset 0 10px 10px 0px rgba(165, 145, 146, 1)",
            "z-index": 10,
            pointerEvents: "none",
          },
        },
        ".custom-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3f3937",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#3f3937",
          },
          "&::-webkit-scrollbar-corner": {
            background: "transparent",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
