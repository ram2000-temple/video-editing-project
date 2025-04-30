"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scissors, Trash2 } from "lucide-react"
import Image from "next/image"

interface Segment {
  id: string
  startTime: number
  endTime: number
  thumbnail: string
}

interface TimelineSegmentProps {
  segment: Segment
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  onRemove: () => void
  onSplit: () => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export default function TimelineSegment({ segment, index, onMove, onRemove, onSplit }: TimelineSegmentProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "SEGMENT",
    item: { index, id: segment.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: "SEGMENT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the left
      const hoverClientX = (clientOffset?.x || 0) - hoverBoundingRect.left

      // Only perform the move when the mouse has crossed half of the items width
      // When dragging rightward, only move when the cursor is after 50%
      // When dragging leftward, only move when the cursor is before 50%

      // Dragging rightward
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }

      // Dragging leftward
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  const duration = segment.endTime - segment.startTime
  const width = Math.max(100, duration * 10)

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`timeline-segment relative ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ width: `${width}px` }}
    >
      <Card className="h-full p-1 cursor-move transition-shadow hover:shadow-md border-2">
        <div className="relative h-20 mb-1 overflow-hidden rounded">
          <Image
            src={segment.thumbnail || "/placeholder.svg"}
            alt={`Scene ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-2 py-0.5 text-xs font-medium">
            {Math.floor(segment.startTime / 60)}:{(segment.startTime % 60).toString().padStart(2, "0")} -{" "}
            {Math.floor(segment.endTime / 60)}:{(segment.endTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">Scene {index + 1}</span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSplit}>
              <Scissors className="h-3 w-3" />
              <span className="sr-only">Split</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
