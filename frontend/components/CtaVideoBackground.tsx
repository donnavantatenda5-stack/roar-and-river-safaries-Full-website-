"use client";

import { useEffect, useRef } from "react";

export default function CtaVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const playback = video.play();
    playback?.catch(() => undefined);
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      poster="/images/hero.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/video/victoria-falls-activities.mp4" type="video/mp4" />
    </video>
  );
}
