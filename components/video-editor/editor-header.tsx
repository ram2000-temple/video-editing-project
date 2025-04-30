"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function EditorHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">VideoFusion Editor</h1>
        <p className="text-muted-foreground">Create professional videos with ease</p>
      </div>
      <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  )
}
