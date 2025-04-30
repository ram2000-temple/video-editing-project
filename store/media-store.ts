import { create } from "zustand"

interface MediaStore {
  videoSrc: string | null
  thumbnail: string | null
  setVideoSrc: (src: string) => void
  setThumbnail: (src: string) => void
}

export const useMediaStore = create<MediaStore>((set) => ({
  videoSrc: null,
  thumbnail: null,
  setVideoSrc: (src: string) => set({ videoSrc: src }),
  setThumbnail: (src: string) => set({ thumbnail: src }),
}))
