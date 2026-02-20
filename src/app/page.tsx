"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the Scene component to avoid SSR issues with Three.js
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });
const WebcamFeed = dynamic(() => import("@/components/dom/WebcamFeed"), { ssr: false });
const UIOverlay = dynamic(() => import("@/components/dom/UIOverlay"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white">Loading Scene...</div>}>
          <Scene />
        </Suspense>
      </div>

      {/* Webcam Feed (often hidden or small) */}
      <div className="absolute bottom-4 right-4 z-10 w-48 h-36 border-2 border-white/20 rounded-lg overflow-hidden opacity-50 hover:opacity-100 transition-opacity">
        <WebcamFeed />
      </div>

      {/* UI Controls/Instructions */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <UIOverlay />
      </div>
    </main>
  );
}
