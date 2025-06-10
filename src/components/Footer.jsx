import React from "react";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <footer
      className={`w-full py-4 mt-8 border-t text-center text-sm transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-400"
          : "bg-white border-gray-200 text-gray-600"
      }`}
    >
      <span>
        &copy; {new Date().getFullYear()} Mastery.ai. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer; 