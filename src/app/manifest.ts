import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skup i Kasacja Aut - skupautwawa.pl",
    short_name: "Skup Aut",
    description: "Najlepszy skup aut i legalna kasacja pojazdów w Polsce. Darmowa wycena, dojazd do klienta w 30 minut i gotówka do ręki.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#fbbf24",
    icons: [
      {
        src: "/android/launchericon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/android/launchericon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/android/launchericon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/android/launchericon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/android/launchericon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android/launchericon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
