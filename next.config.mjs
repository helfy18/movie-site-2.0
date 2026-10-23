/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static build: every page is an HTML file in out/, served by the
  // Netlify CDN with no serverless functions.
  output: "export",
  trailingSlash: true,
  images: {
    // next/image optimisation needs a server; TMDB already serves fixed-width posters.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
