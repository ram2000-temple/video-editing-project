"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Scissors, Plus, ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react"
import TimelineSegment from "./timeline-segment"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useToast } from "@/components/ui/use-toast"

// Mock type for a video segment
interface Segment {
  id: string
  startTime: number
  endTime: number
  thumbnail: string
}

export default function Timeline() {
  const { toast } = useToast()
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: "1",
      startTime: 0,
      endTime: 15,
      thumbnail: "/placeholder.svg?height=80&width=180",
    },
    {
      id: "2",
      startTime: 15,
      endTime: 30,
      thumbnail: "/placeholder.svg?height=80&width=180",
    },
  ])
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(50)

  const moveSegment = (dragIndex: number, hoverIndex: number) => {
    const newSegments = [...segments]
    const dragSegment = newSegments[dragIndex]
    newSegments.splice(dragIndex, 1)
    newSegments.splice(hoverIndex, 0, dragSegment)
    setSegments(newSegments)

    toast({
      title: "Segment Moved",
      description: `Segment moved to position ${hoverIndex + 1}`,
    })
  }

  const addSegment = () => {
    const lastSegment = segments[segments.length - 1]
    const newStartTime = lastSegment ? lastSegment.endTime : 0

    setSegments([
      ...segments,
      {
        id: Date.now().toString(),
        startTime: newStartTime,
        endTime: newStartTime + 15,
        thumbnail: "/placeholder.svg?height=80&width=180",
      },
    ])

    toast({
      title: "Segment Added",
      description: "New segment has been added to timeline",
    })
  }

  const removeSegment = (id: string) => {
    if (segments.length <= 1) {
      toast({
        title: "Cannot Remove Segment",
        description: "You need at least one segment in the timeline",
        variant: "destructive",
      })
      return
    }

    setSegments(segments.filter((segment) => segment.id !== id))

    toast({
      title: "Segment Removed",
      description: "Segment has been removed from timeline",
    })
  }

  const splitSegment = (id: string) => {
    const segmentIndex = segments.findIndex((segment) => segment.id === id)
    if (segmentIndex === -1) return

    const segment = segments[segmentIndex]
    const midPoint = (segment.startTime + segment.endTime) / 2

    const newSegments = [...segments]
    newSegments.splice(
      segmentIndex,
      1,
      {
        id: segment.id,
        startTime: segment.startTime,
        endTime: midPoint,
        thumbnail: segment.thumbnail,
      },
      {
        id: Date.now().toString(),
        startTime: midPoint,
        endTime: segment.endTime,
        thumbnail: "/placeholder.svg?height=80&width=180",
      },
    )

    setSegments(newSegments)

    toast({
      title: "Segment Split",
      description: "Segment has been split into two parts",
    })
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back 5 seconds</span>
            </Button>
            <span className="text-sm font-medium">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentTime(currentTime + 5)}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Forward 5 seconds</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={addSegment}>
            <Plus className="h-4 w-4 mr-1" />
            Add Scene
          </Button>
          <Button variant="outline" size="sm" onClick={() => splitSegment(segments[0].id)}>
            <Scissors className="h-4 w-4 mr-1" />
            Split
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Zoom</span>
            <Slider
              className="w-32"
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <DndProvider backend={HTML5Backend}>
            <div className="timeline-segments flex space-x-1" style={{ minWidth: `${zoom * 10}px` }}>
              {segments.map((segment, index) => (
                <TimelineSegment
                  key={segment.id}
                  segment={segment}
                  index={index}
                  onMove={moveSegment}
                  onRemove={() => removeSegment(segment.id)}
                  onSplit={() => splitSegment(segment.id)}
                />
              ))}
            </div>
          </DndProvider>
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-primary"
            style={{ width: `${(currentTime / (segments[segments.length - 1]?.endTime || 30)) * 100}%` }}
          />
        </div>

        <Slider
          value={[currentTime]}
          onValueChange={(values) => setCurrentTime(values[0])}
          max={segments[segments.length - 1]?.endTime || 30}
          step={0.1}
        />
      </div>
    </Card>
  )
}
