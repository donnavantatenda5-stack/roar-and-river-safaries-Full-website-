import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Qualities used by <Image quality={...}> in the site (hero art uses 85). */
  images: {
    qualities: [70, 75, 85],
  },
};

export default nextConfig;
