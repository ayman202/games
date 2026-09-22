/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            // Deliberately permissive on script-src/frame-src: the admin panel lets the
            // site owner paste arbitrary third-party ad network embed codes (AdSense etc.)
            // and video trailers embed from YouTube/Vimeo, so those must stay allowed.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' https: data:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "font-src 'self' https: data:",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https:",
              "connect-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Admin panel: never allow it to be framed by anyone, even same-origin.
        source: "/admin/:path*",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default nextConfig;
