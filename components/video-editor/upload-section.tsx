"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { Upload, FileVideo } from "lucide-react"
import { useMediaStore } from "@/store/media-store"

export default function UploadSection() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  // Use useRef to store the store actions to avoid re-renders
  const storeActions = useRef(useMediaStore.getState())

  // Subscribe to store changes outside of render
  useCallback(() => {
    const unsubscribe = useMediaStore.subscribe((state) => {
      storeActions.current = {
        setVideoSrc: state.setVideoSrc,
        setThumbnail: state.setThumbnail,
      }
    })
    return unsubscribe
  }, [])()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)

    // Create a "fake" progress update to simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)

          // Use setTimeout to ensure this happens after render
          setTimeout(() => {
            // Create a blob URL for the video
            const videoUrl = URL.createObjectURL(file)
            storeActions.current.setVideoSrc(videoUrl)

            // Generate a mock thumbnail
            storeActions.current.setThumbnail("/placeholder.svg?height=180&width=320")

            setIsUploading(false)
            setUploadProgress(0)
          }, 0)

          return 100
        }
        return newProgress
      })
    }, 100)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
  })

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all text-center 
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drag & Drop Video File</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Drop your video file here, or click to browse. We support MP4, MOV, AVI, and WebM formats.
          </p>
          <div className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
            Select Video
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center">
            <FileVideo className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Uploading video...</span>
            <span className="ml-auto text-sm text-muted-foreground">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  )
}
