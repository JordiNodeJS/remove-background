"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  // Estado inicial fijo para evitar error de hidratación
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Sincroniza el tema real solo en el cliente
    const userTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1] as "light" | "dark" | undefined;

    if (userTheme) {
      setTheme(userTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    // Removed localStorage usage to rely solely on cookies
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Actualiza la cookie para SSR
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    // NO recargar la página, solo cambiar el tema en cliente
  };

  if (!mounted) return null;

  // Mientras no esté montado, no renderizar nada para evitar hydration mismatch
  const label = theme === "dark" ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <button
      aria-label={label}
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full
        bg-[var(--background)] dark:bg-[var(--background)]
        border-2 border-[var(--primary)] dark:border-[var(--primary)]
        shadow-lg hover:scale-110 transition-transform duration-200 group flex items-center justify-center p-0`}
      style={{ outline: "none" }}
    >
      <span className="sr-only">{label}</span>
      {theme === "light" ? (
        <FiMoon
          size={24}
          className="text-[var(--primary)] group-hover:text-[var(--primary-hover)] transition-colors"
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
