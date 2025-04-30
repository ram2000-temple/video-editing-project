"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useMediaStore } from "@/store/media-store"
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react"

export default function Preview() {
  const videoSrc = useMediaStore((state) => state.videoSrc)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(videoElement.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("durationchange", handleDurationChange)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("durationchange", handleDurationChange)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const volumeValue = value[0]
    video.volume = volumeValue / 100
    setVolume(volumeValue)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, video.currentTime - 5)
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.duration, video.currentTime + 5)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const enterFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  // Add overlay elements for demonstration
  const overlayElements = (
    <div className="absolute inset-0 pointer-events-none">
      {/* This would render any active subtitles */}
      <div className="absolute left-0 right-0 bottom-10 text-center">
        <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-md text-2xl">
          Welcome to our video presentation
        </div>
      </div>

      {/* This would render any image overlays */}
      <div className="absolute" style={{ top: "10%", left: "10%", width: "20%", height: "20%" }}>
        <img
          src="/placeholder.svg?height=200&width=200"
          alt="Logo overlay"
          className="w-full h-full object-contain"
          style={{ opacity: 0.8 }}
        />
      </div>
    </div>
  )

  return (
    <Card className="relative">
      <div className="aspect-video bg-black relative overflow-hidden">
        <video ref={videoRef} src={videoSrc} className="w-full h-full" poster="/placeholder.svg?height=180&width=320" />

        {/* Overlay elements like subtitles and image overlays */}
        {overlayElements}

        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={0.1}
              className="z-10"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={skipBackward} className="text-white">
                  <SkipBack className="h-4 w-4" />
                  <span className="sr-only">Skip backward</span>
                </Button>

                <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                </Button>

                <Button variant="ghost" size="icon" onClick={skipForward} className="text-white">
                  <SkipForward className="h-4 w-4" />
                  <span className="sr-only">Skip forward</span>
                </Button>

                <span className="text-xs text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-white" />
                <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="w-20" />

                <Button variant="ghost" size="icon" onClick={enterFullscreen} className="text-white">
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">Fullscreen</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
