"use client";

import { useStore } from "@/store/useStore";

export default function UIOverlay() {
  const { 
    gesture, 
    currentShape, 
    handActive, 
    toggleShape,
    isMuted,
    setIsMuted,
    volume,
    setVolume
  } = useStore();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between text-white drop-shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-cyan-400">NEBULUX</h1>
          <p className="text-sm opacity-60">Hand-Controlled AI Particle System</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-xs uppercase opacity-50 mb-1">Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${handActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-mono text-sm">{handActive ? 'HAND TRACKED' : 'SEARCHING...'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-sm max-w-xs">
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <h3 className="font-bold mb-2 text-cyan-300">GESTURES</h3>
          <ul className="space-y-1 opacity-80">
            <li>🖐️ <b>Open Palm:</b> Attract Particles</li>
            <li>✊ <b>Fist:</b> Repel Particles</li>
            <li>🤌 <b>Pinch:</b> Expand Shape</li>
            <li>✌️ <b>Peace:</b> Change Shape</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <h3 className="font-bold text-cyan-300 flex items-center gap-2">
            <span>MUSIC</span>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </h3>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            title="Music Volume"
            aria-label="Music Volume"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 pointer-events-auto h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={toggleShape}
            className="pointer-events-auto bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-full font-bold transition-all active:scale-95"
          >
            CHANGE SHAPE
          </button>
          <div className="bg-white/10 px-4 py-2 rounded-full font-mono">
            {currentShape}
          </div>
        </div>
      </div>

      <div className="text-[10px] opacity-30 text-center uppercase tracking-widest mt-auto">
        Powered by Three.js & MediaPipe
      </div>
    </div>
  );
}
