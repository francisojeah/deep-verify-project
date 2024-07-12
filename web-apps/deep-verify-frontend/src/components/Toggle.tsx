import React, { useEffect, useState } from "react";

const Toggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("hs_theme") !== "light";
  });

  useEffect(() => {
    const html = document.querySelector("html")!;
    if (isDarkMode) {
      localStorage.setItem("hs_theme", "dark");
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      localStorage.setItem("hs_theme", "light");
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      const html = document.querySelector("html")!;
      if (newMode) {
        localStorage.setItem("hs_theme", "dark");
        html.classList.remove("light");
        html.classList.add("dark");
      } else {
        localStorage.setItem("hs_theme", "light");
        html.classList.remove("dark");
        html.classList.add("light");
      }
      return newMode;
    });
  };

  return (
    <button
        type="button"
        onClick={toggleDarkMode} className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-full p-0.5">
      <div
        className={`group flex items-center font-medium ${
          !isDarkMode ? "bg-[#F1F1F1] text-[#171717] " : "dark:bg-transparent dark:text-[#9B9B9B]"
        }  rounded-full p-1.5`}
      >
        <svg
          className="flex-shrink-0 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      </div>
      <div
        className={`group flex items-center font-medium ${
          isDarkMode ? "dark:bg-[#262626] dark:text-[#E6E6E6]" : "text-[#737373]"
        } rounded-full p-1.5`}
      >
        <svg
          className="flex-shrink-0 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </div>
    </button>
  );
};

export default Toggle;
