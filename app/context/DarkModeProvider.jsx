// contexts/DarkModeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export function useDarkModeContext() {
  return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    setIsDarkMode(storedDarkMode || false);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode)); // Save to localStorage
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <body className={isDarkMode ? "theme-dark" : "theme-light"}>
        {children}
      </body>
    </DarkModeContext.Provider>
  );
}
