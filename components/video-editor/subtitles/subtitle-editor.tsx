"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Type } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Subtitle {
  id: string
  text: string
  startTime: number
  endTime: number
  styles: {
    font: string
    size: number
    color: string
    position: "top" | "middle" | "bottom"
  }
}

export default function SubtitleEditor() {
  const { toast } = useToast()
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    {
      id: "1",
      text: "Welcome to our video presentation",
      startTime: 0,
      endTime: 5,
      styles: {
        font: "Inter",
        size: 24,
        color: "#ffffff",
        position: "bottom",
      },
    },
  ])

  const addSubtitle = () => {
    const lastSubtitle = subtitles[subtitles.length - 1]
    const newStartTime = lastSubtitle ? lastSubtitle.endTime : 0

    const newSubtitle: Subtitle = {
      id: Date.now().toString(),
      text: "New subtitle text",
      startTime: newStartTime,
      endTime: newStartTime + 5,
      styles: {
        font: "Inter",
        size: 24,
        color: "#ffffff",
        position: "bottom",
      },
    }

    setSubtitles([...subtitles, newSubtitle])

    toast({
      title: "Subtitle Added",
      description: "A new subtitle has been added to your project.",
    })
  }

  const removeSubtitle = (id: string) => {
    setSubtitles(subtitles.filter((subtitle) => subtitle.id !== id))

    toast({
      title: "Subtitle Removed",
      description: "The subtitle has been removed from your project.",
    })
  }

  const updateSubtitle = (id: string, updates: Partial<Subtitle>) => {
    setSubtitles(subtitles.map((subtitle) => (subtitle.id === id ? { ...subtitle, ...updates } : subtitle)))
  }

  const updateSubtitleStyle = (id: string, styleUpdates: Partial<Subtitle["styles"]>) => {
    setSubtitles(
      subtitles.map((subtitle) =>
        subtitle.id === id
          ? {
              ...subtitle,
              styles: {
                ...subtitle.styles,
                ...styleUpdates,
              },
            }
          : subtitle,
      ),
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subtitle Editor</h3>
          <Button onClick={addSubtitle}>
            <Plus className="h-4 w-4 mr-1" />
            Add Subtitle
          </Button>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {subtitles.map((subtitle, index) => (
            <AccordionItem value={subtitle.id} key={subtitle.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Subtitle {index + 1}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(subtitle.startTime / 60)}:{(subtitle.startTime % 60).toString().padStart(2, "0")} -
                    {Math.floor(subtitle.endTime / 60)}:{(subtitle.endTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text</label>
                  <Textarea
                    value={subtitle.text}
                    onChange={(e) => updateSubtitle(subtitle.id, { text: e.target.value })}
                    placeholder="Enter subtitle text"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time (seconds)</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[subtitle.startTime]}
                        onValueChange={(values) => {
                          const newStart = values[0]
                          if (newStart < subtitle.endTime) {
                            updateSubtitle(subtitle.id, { startTime: newStart })
                          }
                        }}
                        max={subtitle.endTime - 0.1}
                        step={0.1}
                      />
                      <span className="text-sm w-12">{subtitle.startTime.toFixed(1)}s</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time (seconds)</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[subtitle.endTime]}
                        onValueChange={(values) => {
                          const newEnd = values[0]
                          if (newEnd > subtitle.startTime) {
                            updateSubtitle(subtitle.id, { endTime: newEnd })
                          }
                        }}
                        min={subtitle.startTime + 0.1}
                        max={30}
                        step={0.1}
                      />
                      <span className="text-sm w-12">{subtitle.endTime.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <h4 className="text-sm font-medium mb-3">Style Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs">Font Family</label>
                      <Select
                        value={subtitle.styles.font}
                        onValueChange={(value) => updateSubtitleStyle(subtitle.id, { font: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Comic Sans MS">Comic Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs">Font Size</label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[subtitle.styles.size]}
                          onValueChange={(values) => updateSubtitleStyle(subtitle.id, { size: values[0] })}
                          min={12}
                          max={72}
                          step={1}
                        />
                        <span className="text-sm w-8">{subtitle.styles.size}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs">Color</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={subtitle.styles.color}
                          onChange={(e) => updateSubtitleStyle(subtitle.id, { color: e.target.value })}
                          className="w-10 h-8 p-0"
                        />
                        <Input
                          value={subtitle.styles.color}
                          onChange={(e) => updateSubtitleStyle(subtitle.id, { color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs">Position</label>
                      <Select
                        value={subtitle.styles.position}
                        onValueChange={(value: "top" | "middle" | "bottom") =>
                          updateSubtitleStyle(subtitle.id, { position: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => removeSubtitle(subtitle.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Subtitle
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  )
}
