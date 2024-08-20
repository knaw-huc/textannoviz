import typography from "@tailwindcss/typography";
import reactAria from "tailwindcss-react-aria-components/src/index";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        public: ["Public Sans", "sans-serif"],
      },
      colors: {
        annotation: {
          per100: "#f8f2d2",
          per500: "#D9BC22",
          loc100: "#d2f2fd",
          loc500: "#21BCF5",
          com100: "#e3d4d4",
          com500: "#762929",
          hoe100: "#d6efe3",
          hoe500: "#33AE75",
          org100: "#F0ECF7",
          org500: "#9D7FC6",
        },
      },
      entityColor: {
        location: "hsl(20, 67%, 97%)",
        person: "hsl(120, 67%, 90%)",
        institution: "hsl(160, 67%, 80%)",
      },
      dropShadow: {
        top: "15px 15px 15px rgba(0, 0, 0, 0.75)",
      },
    },
  },
  darkMode: "class",
  plugins: [typography(), reactAria()],
};
