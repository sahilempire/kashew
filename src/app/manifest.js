import { MetadataRoute } from 'next'

export default function manifest() {
  return {
    name: "Kashew",
    short_name: "Kashew",
    description: "Modern Invoicing System",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f5d742",
    icons: [
      {
        src: "/images/Kashew.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/images/Kashew.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
} 