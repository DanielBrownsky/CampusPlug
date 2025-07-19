import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // install with: npm i lucide-react

const ToggleTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isDarkPref =
      localStorage.theme === "dark" ||
      (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkPref);
    root.classList.toggle("dark", isDarkPref);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 bg-white dark:bg-gray-900 text-black dark:text-white rounded-full shadow border border-gray-300 dark:border-gray-700 transition hover:opacity-90"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ToggleTheme;
