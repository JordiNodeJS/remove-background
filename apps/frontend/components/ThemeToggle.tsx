"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  // Estado inicial fijo para evitar error de hidratación
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Sincroniza el tema real solo en el cliente
    const userTheme = window.localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (userTheme) setTheme(userTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      setTheme("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Mientras no esté montado, renderiza el valor por defecto (sin cambiar el texto)
  const label = theme === "dark" ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <button
      aria-label={label}
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-900 shadow-lg hover:scale-110 transition-transform duration-200 group flex items-center justify-center p-0"
      style={{ outline: "none" }}
    >
      <span className="sr-only">{label}</span>
      {theme === "light" ? (
        <FiMoon
          size={24}
          className="text-blue-500 group-hover:text-blue-700 transition-colors"
        />
      ) : (
        <FiSun
          size={24}
          className="text-yellow-300 group-hover:text-yellow-400 transition-colors"
        />
      )}
    </button>
  );
}
