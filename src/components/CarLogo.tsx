export default function CarLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tech-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" /> {/* amber-600 */}
          <stop offset="100%" stopColor="#b45309" /> {/* amber-700 */}
        </linearGradient>
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d97706" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Hexagon/Shield Outer Frame */}
      <polygon 
        points="50,5 90,28 90,72 50,95 10,72 10,28" 
        stroke="url(#tech-gradient)" 
        strokeWidth="6" 
        strokeLinejoin="round"
        fill="#0f172a" /* slate-900 */
        filter="url(#glow)"
      />

      {/* Code Brackets: < and > */}
      <path 
        d="M38 35L23 50L38 65" 
        stroke="#ffffff" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M62 35L77 50L62 65" 
        stroke="#ffffff" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Slash: / */}
      <path 
        d="M54 30L46 70" 
        stroke="url(#tech-gradient)" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
