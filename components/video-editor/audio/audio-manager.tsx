"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Plus, Music, Mic, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AudioWaveform from "./audio-waveform"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AudioTrack {
  id: string
  name: string
  type: "main" | "music" | "voiceover"
  volume: number
  muted: boolean
}

export default function AudioManager() {
  const { toast } = useToast()
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    { id: "1", name: "Original Audio", type: "main", volume: 80, muted: false },
  ])
  const [newTrackName, setNewTrackName] = useState("")
  const [newTrackType, setNewTrackType] = useState<"music" | "voiceover">("music")

  const toggleMute = (id: string) => {
    setAudioTracks((tracks) => tracks.map((track) => (track.id === id ? { ...track, muted: !track.muted } : track)))

    const track = audioTracks.find((t) => t.id === id)
    if (track) {
      toast({
        title: track.muted ? "Track Unmuted" : "Track Muted",
        description: `${track.name} has been ${track.muted ? "unmuted" : "muted"}.`,
      })
    }
  }

  const changeVolume = (id: string, value: number) => {
    setAudioTracks((tracks) => tracks.map((track) => (track.id === id ? { ...track, volume: value } : track)))
  }

  const addAudioTrack = () => {
    if (!newTrackName.trim()) {
      toast({
        title: "Track Name Required",
        description: "Please enter a name for your audio track.",
        variant: "destructive",
      })
      return
    }

    const newTrack: AudioTrack = {
      id: Date.now().toString(),
      name: newTrackName,
      type: newTrackType,
      volume: 80,
      muted: false,
    }

    setAudioTracks([...audioTracks, newTrack])
    setNewTrackName("")

    toast({
      title: "Audio Track Added",
      description: `${newTrack.name} has been added to your project.`,
    })
  }

  const removeAudioTrack = (id: string) => {
    const track = audioTracks.find((t) => t.id === id)
    if (track?.type === "main") {
      toast({
        title: "Cannot Remove Main Audio",
        description: "The original audio track cannot be removed.",
        variant: "destructive",
      })
      return
    }

    setAudioTracks((tracks) => tracks.filter((track) => track.id !== id))

    toast({
      title: "Audio Track Removed",
      description: "The audio track has been removed from your project.",
    })
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Audio Manager</h3>
        </div>

        {/* Audio Tracks */}
        <div className="space-y-4">
          {audioTracks.map((track) => (
            <div key={track.id} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {track.type === "main" ? (
                    <Mic className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : track.type === "music" ? (
                    <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <Mic className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="font-medium">{track.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleMute(track.id)}>
                    {track.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <span className="sr-only">{track.muted ? "Unmute" : "Mute"}</span>
                  </Button>
                  {track.type !== "main" && (
                    <Button variant="ghost" size="icon" onClick={() => removeAudioTrack(track.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Track</span>
                    </Button>
                  )}
                </div>
              </div>

              <AudioWaveform muted={track.muted} />

              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[track.volume]}
                  onValueChange={(values) => changeVolume(track.id, values[0])}
                  max={100}
                  step={1}
                  disabled={track.muted}
                />
                <span className="text-sm w-8 text-right">{track.volume}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Track */}
        <div className="border rounded-lg p-3 space-y-3">
          <h4 className="text-sm font-medium">Add Audio Track</h4>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Track name"
              value={newTrackName}
              onChange={(e) => setNewTrackName(e.target.value)}
              className="flex-1"
            />
            <Select value={newTrackType} onValueChange={(value: "music" | "voiceover") => setNewTrackType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Track type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">Background Music</SelectItem>
                <SelectItem value="voiceover">Voiceover</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addAudioTrack}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
