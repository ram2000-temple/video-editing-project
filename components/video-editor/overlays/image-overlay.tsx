"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ImagePlus, Trash2, ImageIcon, Layers, MoveVertical, MoveHorizontal } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface OverlayImage {
  id: string
  src: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  opacity: number
  borderWidth: number
  borderColor: string
}

export default function ImageOverlay() {
  const { toast } = useToast()
  const [overlayImages, setOverlayImages] = useState<OverlayImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)

    const newImage: OverlayImage = {
      id: Date.now().toString(),
      src: imageUrl,
      position: {
        x: 50,
        y: 50,
      },
      size: {
        width: 30,
        height: 30,
      },
      opacity: 100,
      borderWidth: 0,
      borderColor: "#ffffff",
    }

    setOverlayImages([...overlayImages, newImage])
    setSelectedImage(newImage.id)

    toast({
      title: "Image Added",
      description: "Your image has been added as an overlay.",
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    },
    maxFiles: 1,
  })

  const removeImage = (id: string) => {
    setOverlayImages(overlayImages.filter((img) => img.id !== id))
    if (selectedImage === id) {
      setSelectedImage(null)
    }

    toast({
      title: "Image Removed",
      description: "The overlay image has been removed.",
    })
  }

  const updateImageProperty = <K extends keyof OverlayImage>(id: string, property: K, value: OverlayImage[K]) => {
    setOverlayImages((images) => images.map((img) => (img.id === id ? { ...img, [property]: value } : img)))
  }

  const updateNestedProperty = <K extends keyof OverlayImage, N extends keyof OverlayImage[K]>(
    id: string,
    property: K,
    nestedProperty: N,
    value: OverlayImage[K][N],
  ) => {
    setOverlayImages((images) =>
      images.map((img) =>
        img.id === id
          ? {
              ...img,
              [property]: {
                ...img[property],
                [nestedProperty]: value,
              },
            }
          : img,
      ),
    )
  }

  const getSelectedImage = () => {
    return overlayImages.find((img) => img.id === selectedImage)
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Image Overlay</h3>
        </div>

        {overlayImages.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all text-center 
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add Image Overlay</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Drag & drop an image here, or click to browse. You can add logos, watermarks, or decorative elements to
                your video.
              </p>
              <div className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
                Select Image
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {overlayImages.map((image) => (
                <div
                  key={image.id}
                  className={`border rounded-lg p-2 cursor-pointer transition-all hover:border-primary
                    ${selectedImage === image.id ? "border-primary ring-2 ring-primary/20" : ""}`}
                  onClick={() => setSelectedImage(image.id)}
                >
                  <div className="aspect-video relative bg-black/5 dark:bg-white/5 rounded-md overflow-hidden mb-2">
                    <ImageIcon
                      src={image.src || "/placeholder.svg"}
                      alt="Overlay image"
                      className="absolute object-contain w-full h-full"
                      style={{ opacity: image.opacity / 100 }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs truncate font-medium">Image {overlayImages.indexOf(image) + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(image.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Remove Image</span>
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Image button */}
              <div
                {...getRootProps()}
                className="border border-dashed rounded-lg aspect-video flex flex-col items-center justify-center p-2 cursor-pointer hover:border-primary"
              >
                <input {...getInputProps()} />
                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </div>
            </div>

            {/* Image Settings */}
            {selectedImage && getSelectedImage() && (
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-medium flex items-center">
                  <Layers className="h-4 w-4 mr-1" />
                  Image Settings
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs flex items-center">
                      <MoveHorizontal className="h-3 w-3 mr-1" />
                      Horizontal Position
                    </label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.position.x]}
                        onValueChange={(values) => updateNestedProperty(selectedImage, "position", "x", values[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.position.x}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs flex items-center">
                      <MoveVertical className="h-3 w-3 mr-1" />
                      Vertical Position
                    </label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.position.y]}
                        onValueChange={(values) => updateNestedProperty(selectedImage, "position", "y", values[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.position.y}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs">Width</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.size.width]}
                        onValueChange={(values) => updateNestedProperty(selectedImage, "size", "width", values[0])}
                        min={5}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.size.width}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs">Height</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.size.height]}
                        onValueChange={(values) => updateNestedProperty(selectedImage, "size", "height", values[0])}
                        min={5}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.size.height}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs">Opacity</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.opacity]}
                        onValueChange={(values) => updateImageProperty(selectedImage, "opacity", values[0])}
                        min={10}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.opacity}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs">Border Width</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[getSelectedImage()!.borderWidth]}
                        onValueChange={(values) => updateImageProperty(selectedImage, "borderWidth", values[0])}
                        min={0}
                        max={20}
                        step={1}
                      />
                      <span className="text-xs w-8">{getSelectedImage()!.borderWidth}px</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs">Border Color</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={getSelectedImage()!.borderColor}
                        onChange={(e) => updateImageProperty(selectedImage, "borderColor", e.target.value)}
                        className="w-10 h-8 p-0"
                      />
                      <Input
                        value={getSelectedImage()!.borderColor}
                        onChange={(e) => updateImageProperty(selectedImage, "borderColor", e.target.value)}
                        className="flex-1"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
