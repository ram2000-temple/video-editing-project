import VideoEditor from "@/components/video-editor/video-editor"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="video-editor-theme">
      <div className="min-h-screen bg-background">
        <VideoEditor />
      </div>
    </ThemeProvider>
  )
}
