import { useEffect, useState, useRef } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useStore } from "@/store/useStore";

export const useHandTracking = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef<number | null>(null);
  const lastShapeToggleRef = useRef(0); // Cooldown for shape change

  const { 
    setHandPosition, 
    setHandActive, 
    setGesture, 
    setPinchDistance,
    toggleShape 
  } = useStore();

  useEffect(() => {
    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        setIsLoaded(true);
      } catch (err) {
        console.error("Error initializing MediaPipe:", err);
      }
    }

    async function startWebcam() {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          predictWebcam();
        };
      } catch (err: any) {
        console.error("Error accessing webcam:", err);
        const errorMsg = err.name === "NotAllowedError" 
          ? "Camera permission denied. Please click the Lock icon in the address bar and set Camera to 'Allow'."
          : "Camera not found or already in use. Error: " + err.message;
        alert(errorMsg);
      }
    }

    startWebcam();
    initMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const predictWebcam = async () => {
    if (!videoRef.current || !handLandmarkerRef.current) return;

    const startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
      
      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        setHandActive(true);
        
        // Normalize coordinates (mirrored for intuitive control)
        // MediaPipe coords are 0-1. We want to map to world space roughly -10 to 10
        const wrist = landmarks[0];
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        setHandPosition({
          x: (0.5 - wrist.x) * 20, 
          y: (0.5 - wrist.y) * 15,
          z: (0.5 - wrist.z) * 10
        });

        // Simple Gesture Detection
        const dist = Math.sqrt(
          Math.pow(indexTip.x - thumbTip.x, 2) + 
          Math.pow(indexTip.y - thumbTip.y, 2)
        );
        
        setPinchDistance(dist);

        // Gesture logic
        if (dist < 0.05) {
          setGesture("PINCH");
        } else {
          // Check fingers (8-index, 12-middle, 16-ring, 20-pinky)
          // Tips (8, 12, 16, 20) vs Pips (6, 10, 14, 18)
          const indexUp = landmarks[8].y < landmarks[6].y;
          const middleUp = landmarks[12].y < landmarks[10].y;
          const ringUp = landmarks[16].y < landmarks[14].y;
          const pinkyUp = landmarks[20].y < landmarks[18].y;

          if (indexUp && middleUp && !ringUp && !pinkyUp) {
            setGesture("PEACE");
            // Toggle shape with cooldown
            const now = Date.now();
            if (now - lastShapeToggleRef.current > 2000) {
              toggleShape();
              lastShapeToggleRef.current = now;
            }
          } else if (indexUp && middleUp && ringUp && pinkyUp) {
             setGesture("OPEN_PALM");
          } else if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
             setGesture("FIST");
          } else {
             setGesture("NONE");
          }
        }

        // Draw landmarks on debug canvas if needed
        drawConnectors(results);
      } else {
        setHandActive(false);
        setGesture("NONE");
      }
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  const drawConnectors = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // Optimization: Skip drawing landmarks in production for performance
    // But helpful for debugging
  };

  return { isLoaded };
};
