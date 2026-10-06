"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Smooth 3D tilt driven by scroll: the card lies back in perspective as it
 * enters the viewport and settles flat as it reaches the middle of the screen.
 *
 * The progress is spring-smoothed so the motion keeps easing after the wheel
 * stops, and everything is skipped for visitors who prefer reduced motion.
 */
export default function Tilt3D({
  children,
  className,
  rotate = 14,
  depth = 140,
}: {
  children: React.ReactNode;
  className?: string;
  /** Degrees the card starts tilted back, easing to 0 as it settles. */
  rotate?: number;
  /** How far back in Z the card starts, in pixels. */
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 130, damping: 27, mass: 0.4 });

  const rotateX = useTransform(smooth, [0, 1], [rotate, 0]);
  const translateZ = useTransform(smooth, [0, 1], [-depth, 0]);
  const scale = useTransform(smooth, [0, 1], [0.94, 1]);

  return (
    <div ref={ref} className={cn("h-full w-full", className)} style={{ perspective: "1200px" }}>
      <motion.div
        className="h-full w-full"
        style={
          reduce
            ? undefined
            : {
                rotateX,
                z: translateZ,
                scale,
                transformOrigin: "50% 100%",
                transformStyle: "preserve-3d",
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
