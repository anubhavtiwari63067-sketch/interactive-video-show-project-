import * as THREE from "three";

export const generateShapePoints = (shape: string, count: number): Float32Array => {
  const points = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    
    switch (shape) {
      case "HEART": {
        const t = Math.random() * Math.PI * 2;
        // Heart formula
        x = 16 * Math.pow(Math.sin(t), 3);
        y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        z = (Math.random() - 0.5) * 5;
        // Scale down
        x *= 0.15;
        y *= 0.15;
        break;
      }
      
      case "FLOWER": {
        const t = Math.random() * Math.PI * 2;
        const r = 2 * Math.cos(5 * t); // 5 petals
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        z = (Math.random() - 0.5) * 2;
        break;
      }
      
      case "SATURN": {
        const isRing = Math.random() > 0.4;
        if (isRing) {
          const t = Math.random() * Math.PI * 2;
          const r = 3 + Math.random() * 2;
          x = r * Math.cos(t);
          y = (Math.random() - 0.5) * 0.2;
          z = r * Math.sin(t);
        } else {
          // Sphere core
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const r = 2.2;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }
        break;
      }
      
      case "FIREWORK": {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 5 * Math.pow(Math.random(), 0.5); // Exploded sphere
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
      
      case "STAR_BLAST": {
        const t = Math.random() * Math.PI * 2;
        const arms = 5;
        const r = 4 * Math.pow(Math.random(), 0.5) * (1 + 0.3 * Math.sin(arms * t));
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        z = (Math.random() - 0.5) * 2;
        break;
      }
      
      case "SPHERE":
      default: {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 3;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
    }
    
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  
  return points;
};
