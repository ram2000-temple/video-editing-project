"use client"

import { useEffect, useRef } from "react"

interface AudioWaveformProps {
  muted?: boolean
}

export default function AudioWaveform({ muted = false }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set line style
    ctx.lineWidth = 2
    ctx.strokeStyle = muted ? "#9ca3af" : "#2563eb"

    // Generate a fake waveform
    const generateWaveform = () => {
      const points = []
      const segments = 100
      const segmentWidth = width / segments

      for (let i = 0; i < segments; i++) {
        // Generate different amplitudes for a more realistic waveform
        let amplitude = Math.random() * 0.5
        // Make some random spikes
        if (Math.random() > 0.8) amplitude = Math.random() * 0.8
        points.push({
          x: i * segmentWidth,
          y: height / 2 + ((amplitude * height) / 2) * (Math.random() > 0.5 ? 1 : -1),
        })
      }

      return points
    }

    const waveform = generateWaveform()

    // Draw the waveform
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    for (let i = 0; i < waveform.length; i++) {
      ctx.lineTo(waveform[i].x, waveform[i].y)
    }

    ctx.stroke()

    // Draw center line
    ctx.beginPath()
    ctx.strokeStyle = muted ? "#d1d5db" : "#93c5fd"
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }, [muted])

  return <canvas ref={canvasRef} className="w-full h-16 bg-black/5 dark:bg-white/5 rounded" width={600} height={64} />
}
