"use client";

/**
 * Full-screen looping video background for the hero.
 *
 * The clip at /video/hero.mp4 is pre-cut to 38 seconds and has its audio
 * stripped, so the native `loop` attribute and `muted` handle everything: it
 * restarts on its own and stays silent. No timer or segment seeking needed.
 *
 * To change the footage, replace public/video/hero.mp4. See the README in that
 * folder for the encode settings.
 */
export default function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-forest">
      <video
        className="h-full w-full scale-[1.04] object-cover"
        poster="/images/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}