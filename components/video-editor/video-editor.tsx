"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import UploadSection from "./upload-section"
import Timeline from "./timeline/timeline"
import AudioManager from "./audio/audio-manager"
import SubtitleEditor from "./subtitles/subtitle-editor"
import ImageOverlay from "./overlays/image-overlay"
import Preview from "./preview/preview"
import EditorHeader from "./editor-header"
import { useMediaStore } from "@/store/media-store"
import { Loader2 } from "lucide-react"

export default function VideoEditor() {
  const { toast } = useToast()
  const [isRendering, setIsRendering] = useState(false)
  const videoSrc = useMediaStore((state) => state.videoSrc)
  const hasVideo = !!videoSrc

  const handleRender = () => {
    if (!hasVideo) {
      toast({
        title: "No video to render",
        description: "Please upload a video first",
        variant: "destructive",
      })
      return
    }

    setIsRendering(true)
    toast({
      title: "Rendering Started",
      description: "Your video is being processed...",
    })

    // Simulate rendering process
    setTimeout(() => {
      setIsRendering(false)
      toast({
        title: "Rendering Complete",
        description: "Your video has been successfully rendered.",
      })
    }, 3000)
  }

  const handleExport = () => {
    toast({
      title: "Exporting Video",
      description: "Your video is being prepared for download...",
    })

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your video is ready to download.",
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-4">
      <EditorHeader />

      <div className="my-6">
        <Card>
          <CardContent className="p-6">
            {!hasVideo ? (
              <UploadSection />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <Preview />
                </div>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Render Controls</h3>
                      <div className="flex space-x-2">
                        <Button onClick={handleRender} disabled={isRendering || !hasVideo} className="w-full">
                          {isRendering ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Rendering...
                            </>
                          ) : (
                            "Render Video"
                          )}
                        </Button>
                        <Button onClick={handleExport} disabled={!hasVideo} variant="outline" className="w-full">
                          Export
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {hasVideo && (
        <div className="space-y-6">
          <Tabs defaultValue="timeline">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <Timeline />
            </TabsContent>
            <TabsContent value="audio">
              <AudioManager />
            </TabsContent>
            <TabsContent value="subtitles">
              <SubtitleEditor />
            </TabsContent>
            <TabsContent value="overlays">
              <ImageOverlay />
            </TabsContent>
          </Tabs>
        </div>
      )}
      <Toaster />
    </div>
  )
}
