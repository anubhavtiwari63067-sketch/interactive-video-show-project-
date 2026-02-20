"use client";

import { useEffect, useRef } from "react";
import { useHandTracking } from "@/hooks/useHandTracking";

export default function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoaded } = useHandTracking(videoRef, canvasRef);

  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover -scale-x-100"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none"
      />
      {!isLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-4 p-4">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest opacity-70">Initializing AI...</p>
        </div>
      ) : (
        <div className="absolute top-2 right-2 z-20 pointer-events-auto">
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors"
            title="Reload Camera"
          >
             📷
          </button>
        </div>
      )}
    </div>
  );
}
