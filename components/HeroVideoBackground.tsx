"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-screen looping video background for the hero.
 *
 * Plays a middle 30 second segment of the clip, then loops it seamlessly, so a
 * short loop never shows its own head or tail. A poster image covers the first
 * paint and doubles as the fallback when the clip can't play.
 *
 * To change the footage, drop an MP4 at /public/video/<file> and update
 * VIDEO_SRC below. Keep the clip silent — browser autoplay policy blocks
 * unmuted autoplay, so anything with audio would be muted anyway.
 */

const VIDEO_SRC = "/video/hero.mp4";
const SEGMENT_SECONDS = 30;

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const segmentRef = useRef<{ start: number; end: number } | null>(null);
  const [ready, setReady] = useState(false);

  // Centre the loop on the clip's middle, skipping any intro or outro.
  const markSegment = () => {
    const video = videoRef.current;
    if (!video) return;
    const duration = video.duration;
    if (isFinite(duration) && duration > SEGMENT_SECONDS) {
      const start = (duration - SEGMENT_SECONDS) / 2;
      segmentRef.current = { start, end: start + SEGMENT_SECONDS };
      video.currentTime = start;
    }
  };

  // Restart the segment when it runs past the end.
  useEffect(() => {
    if (!ready) return;

    const id = window.setInterval(() => {
      const video = videoRef.current;
      const segment = segmentRef.current;
      if (!video || !segment) return;

      if (video.currentTime >= segment.end) {
        video.currentTime = segment.start;
        void video.play().catch(() => {
          // Autoplay can be blocked; the poster image stays visible instead.
        });
      }
    }, 200);

    return () => window.clearInterval(id);
  }, [ready]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-forest">
      <video
        ref={videoRef}
        className="h-full w-full scale-[1.04] object-cover"
        poster="/images/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedMetadata={markSegment}
        onCanPlay={() => setReady(true)}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}