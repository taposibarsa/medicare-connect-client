'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@heroui/react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Hydration mismatch ফিক্স করার জন্য
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-[#111827]">
      <Button
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        className={`transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30' 
            : 'text-slate-500 hover:text-[#5e17eb] dark:text-slate-400 dark:hover:text-white'
        }`}
        onPress={() => setTheme('light')}
        aria-label="Light Mode"
      >
        <Sun size={16} />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        className={`transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30' 
            : 'text-slate-500 hover:text-[#5e17eb] dark:text-slate-400 dark:hover:text-white'
        }`}
        onPress={() => setTheme('dark')}
        aria-label="Dark Mode"
      >
        <Moon size={16} />
      </Button>
    </div>
  );
}