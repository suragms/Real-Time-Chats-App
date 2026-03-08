import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const baseUrl = (process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ?? "").trim();
const insforgeHost = baseUrl ? new URL(baseUrl).hostname : null;

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(insforgeHost && {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: insforgeHost,
          pathname: "/api/storage/**",
        },
        {
          protocol: "http",
          hostname: insforgeHost,
          pathname: "/api/storage/**",
        },
      ],
    },
  }),
};

export default withPWA(nextConfig);
