import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check localStorage for saved theme preference, default to 'light'
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem("darkTheme");
    return saved ? JSON.parse(saved) : false;
  });

  // When theme changes, save to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));

    // Apply dark mode class to the root html element
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
