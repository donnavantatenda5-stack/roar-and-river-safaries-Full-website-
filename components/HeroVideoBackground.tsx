"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-screen looping video background for the hero.
 *
 * The clip at /video/hero.mp4 is pre-cut to 38 seconds and has its audio
 * stripped, so native `loop` handles restarts and `muted` keeps it silent.
 *
 * Mobile autoplay needs more than the attributes. iOS Safari in particular
 * decides whether to autoplay from the `muted` *property* on the element, not
 * the `muted` *attribute* in the HTML. React renders the attribute, so on the
 * first paint `video.muted` can still read false and iOS refuses to play. The
 * effect below sets the property explicitly and kicks off `play()` by hand,
 * which is what makes autoplay actually work on iPhone and Android Chrome.
 *
 * The poster image sits underneath as a fallback, so a failed or blocked
 * playback still shows a proper photo instead of an empty green box.
 */
export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set both the property and the attribute so iOS treats the video as muted.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");

    // Autoplay can still be refused, e.g. Low Power Mode on iOS. Swallow the
    // rejection so it doesn't surface as an unhandled promise.
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => undefined);
    }
  }, []);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-forest">
      {/*
        Poster as a real element rather than only the `poster` attribute, so it
        stays visible until the video has actually painted a frame. Without this
        there is a brief empty green flash on slow mobile connections.
      */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: "url(/images/hero.jpg)" }}
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
        poster="/images/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setPlaying(true)}
        onPlaying={() => setPlaying(true)}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}