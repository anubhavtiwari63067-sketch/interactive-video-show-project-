"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isMuted, volume } = useStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle initial play on user interaction
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(err => {
          console.log("Autoplay blocked, waiting for user interaction");
        });
      }
    };

    window.addEventListener("click", playAudio, { once: true });
    return () => window.removeEventListener("click", playAudio);
  }, [isMuted]);

  return (
    <audio
      ref={audioRef}
      src="/audio/bg_music.mp3"
      loop
      autoPlay
      className="hidden"
    />
  );
}
