"use client";

import { useEffect, useRef } from "react";

export default function CtaVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let active = true;
    let started = false;
    const startPlayback = () => {
      if (!active || started) return;
      started = true;

      video.src = "/video/victoria-falls-activities.mp4";
      video.load();
      const playback = video.play();
      playback?.catch(() => undefined);
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          startPlayback();
        },
        { rootMargin: "120px 0px", threshold: 0.01 },
      );
      observer.observe(video);

      return () => {
        active = false;
        observer.disconnect();
      };
    }

    startPlayback();
    return () => {
      active = false;
    };
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
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
