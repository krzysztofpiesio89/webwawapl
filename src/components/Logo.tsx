export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Niebieski gradient — lewy trójkąt */}
        <linearGradient id="w-blue" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>

        {/* Bursztynowy gradient — prawy trójkąt */}
        <linearGradient id="w-amber" x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Lewy trójkąt: góra-lewo → dół-lewo → wierzchołek środkowy */}
      <polygon
        points="0,0 40,180 80,80"
        fill="url(#w-blue)"
      />

      {/* Prawy trójkąt: wierzchołek środkowy → dół-prawo → góra-prawo */}
      <polygon
        points="80,80 120,180 160,0"
        fill="url(#w-amber)"
      />

      {/* Subtelny biały obrys litery W — spaja całość */}
      <polyline
        points="0,0 40,180 80,80 120,180 160,0"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}