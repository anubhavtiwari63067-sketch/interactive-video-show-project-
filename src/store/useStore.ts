import { create } from "zustand";

export type GestureType = "NONE" | "OPEN_PALM" | "FIST" | "PINCH" | "PEACE" | "THUMBS_UP";
export type ShapeType = "HEART" | "FLOWER" | "SATURN" | "FIREWORK" | "STAR_BLAST" | "SPHERE";

interface AppState {
  // Hand Tracking State
  handPosition: { x: number; y: number; z: number };
  handActive: boolean;
  gesture: GestureType;
  pinchDistance: number;
  
  // Particle System State
  currentShape: ShapeType;
  particleColor: string;
  expansionFactor: number;
  
  // Audio State
  isMuted: boolean;
  volume: number;
  
  // Action Setters
  setHandPosition: (pos: { x: number; y: number; z: number }) => void;
  setHandActive: (active: boolean) => void;
  setGesture: (gesture: GestureType) => void;
  setPinchDistance: (dist: number) => void;
  setShape: (shape: ShapeType) => void;
  setColor: (color: string) => void;
  toggleShape: () => void;
  setIsMuted: (muted: boolean) => void;
  setVolume: (val: number) => void;
}

const SHAPES: ShapeType[] = ["HEART", "FLOWER", "SATURN", "FIREWORK", "STAR_BLAST", "SPHERE"];

export const useStore = create<AppState>((set, get) => ({
  handPosition: { x: 0, y: 0, z: 0 },
  handActive: false,
  gesture: "NONE",
  pinchDistance: 0,
  currentShape: "SPHERE",
  particleColor: "#00eeff",
  expansionFactor: 1,
  isMuted: false,
  volume: 0.5,

  setHandPosition: (pos) => set({ handPosition: pos }),
  setHandActive: (active) => set({ handActive: active }),
  setGesture: (gesture) => set({ gesture }),
  setPinchDistance: (dist) => set({ pinchDistance: dist }),
  setShape: (shape) => set({ currentShape: shape }),
  setColor: (color) => set({ particleColor: color }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setVolume: (volume) => set({ volume }),
  
  toggleShape: () => {
    const currentIndex = SHAPES.indexOf(get().currentShape);
    const nextIndex = (currentIndex + 1) % SHAPES.length;
    set({ currentShape: SHAPES[nextIndex] });
  },
}));
