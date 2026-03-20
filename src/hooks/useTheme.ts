import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(persist((set, get: any) => ({
    theme: "system",
    getTheme: () => get().theme,
    setTheme: (theme: string) => {
        switch (theme) {
            case "light":
                document.documentElement.classList.remove("dark")
                set({ theme: "light" })
                break
            case "system":
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.classList.add("dark")
                    set({ theme: "dark" })
                } else {
                    document.documentElement.classList.remove("dark")
                    set({ theme: "light" })
                }
                break
            case "dark":
                document.documentElement.classList.add("dark")
                set({ theme: "dark" })
                break
        }
    },
}), { name: "theme" }))


export const useTheme = () => useThemeStore((state) => state)