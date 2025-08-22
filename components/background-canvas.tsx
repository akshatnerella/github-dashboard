'use client';

import { motion, useReducedMotion } from 'framer-motion';

const AnimatedBlob = ({ 
  initialX, 
  initialY, 
  size, 
  color, 
  index 
}: {
  initialX: number;
  initialY: number;
  size: number;
  color: string;
  index: number;
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  const blobVariants = {
    animate: {
      x: [initialX - 20, initialX + 20, initialX - 15, initialX + 25, initialX],
      y: [initialY - 15, initialY + 25, initialY - 20, initialY + 15, initialY],
      scale: [1, 1.03, 0.98, 1.02, 1],
    }
  };

  return (
    <motion.div
      className="absolute opacity-40 blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: '50%',
      }}
      variants={shouldReduceMotion ? {} : blobVariants}
      animate={shouldReduceMotion ? {} : "animate"}
      transition={{
        duration: 20 + index * 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export function BackgroundCanvas() {
  const blobs = [
    { x: '10%', y: '20%', size: 300, color: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)' },
    { x: '80%', y: '10%', size: 250, color: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' },
    { x: '60%', y: '80%', size: 280, color: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 canvas-gradient">
      {blobs.map((blob, index) => (
        <AnimatedBlob
          key={index}
          initialX={parseInt(blob.x)}
          initialY={parseInt(blob.y)}
          size={blob.size}
          color={blob.color}
          index={index}
        />
      ))}
    </div>
  );
}