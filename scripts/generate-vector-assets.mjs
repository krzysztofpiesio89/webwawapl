import fs from 'fs';
import path from 'path';

const architectDir = path.join(process.cwd(), 'public', 'images', 'industries', 'architect');
const accountantDir = path.join(process.cwd(), 'public', 'images', 'industries', 'accountant');

if (!fs.existsSync(architectDir)) {
  fs.mkdirSync(architectDir, { recursive: true });
}
if (!fs.existsSync(accountantDir)) {
  fs.mkdirSync(accountantDir, { recursive: true });
}

// Helper to generate the SVG template wrapper
function getBaseSvg(theme, title, subtitle, illustrationHtml) {
  const primaryColor = theme === 'architect' ? '#f59e0b' : '#10b981';
  const secondaryColor = theme === 'architect' ? '#d97706' : '#059669';
  const glowColor = theme === 'architect' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';
  const badgeText = theme === 'architect' ? '📐 ARCHITECTURE &amp; DESIGN' : '📊 FINANCE &amp; ACCOUNTING';
  
  const escapedTitle = title.toUpperCase().replace(/&/g, '&amp;');
  const escapedSubtitle = subtitle.replace(/&/g, '&amp;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <!-- Background Gradients -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b0f19" />
        <stop offset="50%" stop-color="#111827" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>
      
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1f2937" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#111827" stop-opacity="0.8" />
      </linearGradient>

      <!-- Grid Pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
      </pattern>
      
      <!-- Accent Gradients -->
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>

      <linearGradient id="accentGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <rect width="1200" height="630" fill="url(#grid)" />
    
    <!-- Decorative Glowing Aura -->
    <circle cx="950" cy="315" r="300" fill="${glowColor}" filter="url(#glow)" />
    <circle cx="150" cy="150" r="200" fill="${glowColor}" filter="url(#glow)" opacity="0.5" />

    <!-- Main UI Frame / Glassmorphic Card -->
    <rect x="80" y="60" width="1040" height="510" rx="32" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
    
    <!-- UI Header Elements (Browser window dots) -->
    <circle cx="130" cy="100" r="7" fill="#ef4444" />
    <circle cx="155" cy="100" r="7" fill="#f59e0b" />
    <circle cx="180" cy="100" r="7" fill="#10b981" />
    
    <!-- Watermark Header -->
    <rect x="220" y="88" width="220" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <text x="330" y="104" fill="rgba(255,255,255,0.4)" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1" text-anchor="middle">WEBWAWA.PL // SECURE_SSL</text>

    <!-- Left Content Column -->
    <g transform="translate(130, 160)">
      <!-- Badge -->
      <rect x="0" y="0" width="220" height="30" rx="15" fill="rgba(255,255,255,0.05)" stroke="${primaryColor}" stroke-opacity="0.3" stroke-width="1.5" />
      <text x="110" y="19" fill="${primaryColor}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="850" letter-spacing="1.5" text-anchor="middle">${badgeText}</text>
      
      <!-- Title -->
      <text x="0" y="85" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" font-style="italic">
        <tspan x="0" dy="0">${escapedTitle}</tspan>
      </text>
      
      <!-- Subtitle/Description -->
      <text x="0" y="150" fill="rgba(255,255,255,0.6)" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400">
        <tspan x="0" dy="0">${escapedSubtitle.split('\n')[0] || ''}</tspan>
        <tspan x="0" dy="24">${escapedSubtitle.split('\n')[1] || ''}</tspan>
        <tspan x="0" dy="24">${escapedSubtitle.split('\n')[2] || ''}</tspan>
      </text>
      
      <!-- CTA Elements Mockup -->
      <g transform="translate(0, 260)">
        <rect x="0" y="0" width="180" height="46" rx="14" fill="url(#accentGrad)" />
        <text x="90" y="27" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.5">DARMOWA WYCENA</text>
        
        <rect x="195" y="0" width="140" height="46" rx="14" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        <text x="265" y="27" fill="rgba(255,255,255,0.8)" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" text-anchor="middle">SPECYFIKACJA</text>
      </g>
    </g>

    <!-- Right Illustration Column (Interactive Blueprint/Dashboard Area) -->
    <g transform="translate(680, 150)">
      <!-- Panel Border -->
      <rect x="0" y="0" width="380" height="360" rx="20" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
      <rect x="0" y="0" width="380" height="360" rx="20" fill="rgba(255,255,255,0.01)" />
      
      <!-- Accent Top Corner Grid Lines -->
      <path d="M 0 30 L 30 0" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
      <path d="M 0 20 L 20 0" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
      
      <!-- Illustration Payload -->
      ${illustrationHtml}
    </g>
    
    <!-- Watermark Footer -->
    <text x="1040" y="540" fill="rgba(255,255,255,0.15)" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="750" letter-spacing="2" text-anchor="end">WEBWAWA.PL // PREMIUM IT SOLUTIONS</text>
  </svg>`;
}

// ----------------------------------------------------
// ARCHITECT ILLUSTRATIONS
// ----------------------------------------------------

const architectMainIllust = `
  <!-- Building Outline Blueprint -->
  <g transform="translate(40, 20)">
    <!-- Reference grid -->
    <line x1="0" y1="280" x2="300" y2="280" stroke="rgba(245,158,11,0.2)" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="150" y1="20" x2="150" y2="300" stroke="rgba(245,158,11,0.2)" stroke-width="1" stroke-dasharray="4,4" />
    
    <!-- Isometric Structure Sketch -->
    <path d="M 50 260 L 150 210 L 250 260 L 150 300 Z" fill="none" stroke="#f59e0b" stroke-width="2.5" />
    <path d="M 50 260 L 50 110 L 150 60 L 150 210 Z" fill="none" stroke="#f59e0b" stroke-width="2.5" />
    <path d="M 150 210 L 150 60 L 250 110 L 250 260 Z" fill="none" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.8" />
    
    <!-- Secondary levels -->
    <path d="M 50 160 L 150 110 L 250 160" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.7" stroke-dasharray="2,2" />
    
    <!-- Architectural notes/guidelines -->
    <path d="M 30 110 L 50 110" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
    <path d="M 30 260 L 50 260" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
    <line x1="35" y1="110" x2="35" y2="260" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
    <text x="25" y="190" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="9" text-anchor="middle" transform="rotate(-90 25 190)">H = 15.0m</text>

    <!-- Compass rose blueprint style -->
    <circle cx="260" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <line x1="260" y1="25" x2="260" y2="75" stroke="#f59e0b" stroke-width="1.5" />
    <line x1="235" y1="50" x2="285" y2="50" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
    <text x="260" y="20" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">N</text>
  </g>
`;

const architectArchitectIllust = `
  <!-- Blueprint drawing desk representation -->
  <g transform="translate(40, 20)">
    <!-- Architect ruler / Drafting board -->
    <rect x="20" y="40" x-radius="8" width="260" height="230" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    
    <!-- Drawing grid -->
    <path d="M 20 90 L 280 90 M 20 140 L 280 140 M 20 190 L 280 190 M 20 240 L 280 240" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    
    <!-- Drafting tools: Triangle Ruler and Compass -->
    <path d="M 60 70 L 180 210 L 60 210 Z" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-width="2" />
    <path d="M 80 120 L 140 190 L 80 190 Z" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.6" />
    
    <!-- Dividers/Compass tool -->
    <g transform="translate(190, 80) rotate(15)">
      <line x1="0" y1="0" x2="-20" y2="90" stroke="rgba(255,255,255,0.6)" stroke-width="3" />
      <line x1="0" y1="0" x2="20" y2="90" stroke="rgba(255,255,255,0.6)" stroke-width="3" />
      <circle cx="0" cy="0" r="6" fill="#f59e0b" />
      <!-- Drawing radius arc -->
      <path d="M -15 80 A 80 80 0 0 0 25 75" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3" />
    </g>
  </g>
`;

const architectInteriorIllust = `
  <!-- Interior Design Plan / Living room layout blueprint -->
  <g transform="translate(40, 25)">
    <!-- Grid -->
    <rect x="20" y="30" width="260" height="240" fill="none" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3,3" />
    
    <!-- Walls -->
    <path d="M 20 30 L 280 30 L 280 270 L 20 270 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
    <path d="M 20 30 L 120 30" fill="none" stroke="#f59e0b" stroke-width="5" />
    <path d="M 180 30 L 280 30" fill="none" stroke="#f59e0b" stroke-width="5" />
    <!-- Door swing -->
    <path d="M 120 30 A 60 60 0 0 1 180 90" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3" />
    <line x1="120" y1="30" x2="180" y2="90" stroke="rgba(255,255,255,0.4)" stroke-width="1" />

    <!-- Sofa outline -->
    <rect x="50" y="160" width="130" height="70" rx="8" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-width="2" />
    <rect x="60" y="170" width="110" height="15" rx="4" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.7" />
    <!-- Armchair outline -->
    <rect x="200" y="160" width="60" height="70" rx="8" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-width="2" />
    
    <!-- Coffee Table -->
    <circle cx="140" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    <text x="140" y="104" fill="rgba(255,255,255,0.3)" font-family="sans-serif" font-size="9" text-anchor="middle">TABLE</text>
    
    <!-- Plant in corner -->
    <circle cx="45" cy="55" r="12" fill="none" stroke="#10b981" stroke-width="1.5" />
    <path d="M 45 43 C 40 50 40 60 45 67" stroke="#10b981" stroke-width="1" />
    <path d="M 33 55 C 40 50 50 50 57 55" stroke="#10b981" stroke-width="1" />
  </g>
`;

const architectLandscapeIllust = `
  <!-- Landscape architecture / Garden layout plan -->
  <g transform="translate(40, 20)">
    <!-- Site outline -->
    <rect x="20" y="30" width="260" height="240" rx="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    
    <!-- Curved pathway -->
    <path d="M 20 220 Q 120 180 140 120 T 280 80" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="30" stroke-linecap="round" />
    <path d="M 20 220 Q 120 180 140 120 T 280 80" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,4" />
    
    <!-- Tree symbols -->
    <g transform="translate(70, 80)">
      <circle cx="0" cy="0" r="25" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="2" />
      <circle cx="0" cy="0" r="18" fill="none" stroke="#10b981" stroke-dasharray="3,3" stroke-width="1" />
      <line x1="0" y1="-25" x2="0" y2="25" stroke="#10b981" stroke-width="1.2" />
      <line x1="-25" y1="0" x2="25" y2="0" stroke="#10b981" stroke-width="1.2" />
    </g>
    
    <g transform="translate(210, 180)">
      <circle cx="0" cy="0" r="32" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="2" />
      <!-- Star bursts for pine tree symbol -->
      <path d="M -32 0 L 32 0 M 0 -32 L 0 32 M -22 -22 L 22 22 M -22 22 L 22 -22" stroke="#10b981" stroke-width="1" opacity="0.6" />
    </g>
    
    <!-- Patio / Decking pattern area -->
    <rect x="180" y="40" width="70" height="50" fill="none" stroke="#f59e0b" stroke-width="1.5" />
    <path d="M 180 50 L 250 50 M 180 60 L 250 60 M 180 70 L 250 70 M 180 80 L 250 80" stroke="#f59e0b" stroke-width="1" opacity="0.5" />
  </g>
`;

const architectUrbanIllust = `
  <!-- Urban planning grid blueprint -->
  <g transform="translate(40, 20)">
    <!-- Base blocks -->
    <rect x="20" y="30" width="110" height="100" rx="8" fill="rgba(245,158,11,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <rect x="150" y="30" width="130" height="100" rx="8" fill="rgba(16,185,129,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    
    <rect x="20" y="150" width="110" height="120" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <rect x="150" y="150" width="130" height="120" rx="8" fill="rgba(245,158,11,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    
    <!-- Main roads intersecting (yellow/orange glow lines) -->
    <line x1="0" y1="140" x2="300" y2="140" stroke="#f59e0b" stroke-width="8" stroke-opacity="0.8" />
    <line x1="140" y1="0" x2="140" y2="300" stroke="#f59e0b" stroke-width="8" stroke-opacity="0.8" />
    
    <!-- Road center dashes -->
    <line x1="0" y1="140" x2="300" y2="140" stroke="#ffffff" stroke-width="1" stroke-dasharray="6,6" />
    <line x1="140" y1="0" x2="140" y2="300" stroke="#ffffff" stroke-width="1" stroke-dasharray="6,6" />
    
    <!-- Roundabout in intersection -->
    <circle cx="140" cy="140" r="22" fill="#111827" stroke="#f59e0b" stroke-width="3" />
    <circle cx="140" cy="140" r="12" fill="none" stroke="#ffffff" stroke-dasharray="3,2" stroke-width="1" />
    
    <!-- Zone labels -->
    <text x="75" y="85" fill="#f59e0b" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" opacity="0.6">ZONE A</text>
    <text x="215" y="85" fill="#10b981" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" opacity="0.6">GREEN ZONE</text>
    <text x="215" y="215" fill="#f59e0b" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" opacity="0.6">ZONE B</text>
  </g>
`;

const architectStructuralIllust = `
  <!-- Structural Engineering / Truss bridge engineering layout -->
  <g transform="translate(30, 30)">
    <!-- Ground line -->
    <line x1="10" y1="240" x2="310" y2="240" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    
    <!-- Columns -->
    <rect x="50" y="160" width="24" height="80" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
    <rect x="246" y="160" width="24" height="80" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
    
    <!-- Concrete footing hatching -->
    <path d="M 50 240 L 74 240 M 246 240 L 270 240" stroke="rgba(255,255,255,0.3)" stroke-width="2" />

    <!-- Main steel bridge truss structure -->
    <g stroke="#f59e0b" stroke-width="2.5" fill="none">
      <!-- Deck -->
      <line x1="20" y1="160" x2="300" y2="160" stroke-width="4" />
      
      <!-- Top chord -->
      <path d="M 60 160 L 90 90 L 230 90 L 260 160" />
      
      <!-- Internal braces -->
      <line x1="60" y1="160" x2="90" y2="90" />
      <line x1="90" y1="90" x2="120" y2="160" />
      <line x1="120" y1="160" x2="160" y2="90" />
      <line x1="160" y1="90" x2="200" y2="160" />
      <line x1="200" y1="160" x2="230" y2="90" />
      <line x1="230" y1="90" x2="260" y2="160" />
      
      <!-- Verticals -->
      <line x1="90" y1="90" x2="90" y2="160" />
      <line x1="160" y1="90" x2="160" y2="160" />
      <line x1="230" y1="90" x2="230" y2="160" />
    </g>
    
    <!-- Stress points (red/orange glowing spots) -->
    <circle cx="90" cy="90" r="5" fill="#ef4444" />
    <circle cx="160" cy="90" r="5" fill="#f59e0b" />
    <circle cx="230" cy="90" r="5" fill="#ef4444" />
    <circle cx="120" cy="160" r="4" fill="#10b981" />
    <circle cx="200" cy="160" r="4" fill="#10b981" />
  </g>
`;


// ----------------------------------------------------
// ACCOUNTANT ILLUSTRATIONS
// ----------------------------------------------------

const accountantMainIllust = `
  <!-- Financial dashboard mockup with graphs -->
  <g transform="translate(30, 25)">
    <!-- Top widget cards -->
    <rect x="15" y="20" width="130" height="70" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />
    <text x="30" y="45" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="10" font-weight="bold">NET PROFIT</text>
    <text x="30" y="70" fill="#10b981" font-family="sans-serif" font-size="18" font-weight="800">+24.8%</text>

    <rect x="175" y="20" width="130" height="70" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />
    <text x="190" y="45" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="10" font-weight="bold">TAX REDUCTION</text>
    <text x="190" y="70" fill="#10b981" font-family="sans-serif" font-size="18" font-weight="800">12,400 zł</text>

    <!-- Main graph panel -->
    <rect x="15" y="110" width="290" height="170" rx="12" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />
    
    <!-- Grid inside graph -->
    <line x1="35" y1="130" x2="285" y2="130" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    <line x1="35" y1="170" x2="285" y2="170" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    <line x1="35" y1="210" x2="285" y2="210" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    <line x1="35" y1="250" x2="285" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    
    <!-- Chart bars/lines -->
    <path d="M 45 240 L 85 210 L 125 230 L 165 170 L 205 150 L 245 180 L 275 130" fill="none" stroke="#10b981" stroke-width="3" />
    <path d="M 45 240 L 85 210 L 125 230 L 165 170 L 205 150 L 245 180 L 275 130 L 275 250 L 45 250 Z" fill="url(#accentGlow)" opacity="0.3" />
    
    <!-- Points on chart -->
    <circle cx="205" cy="150" r="5" fill="#10b981" />
    <circle cx="275" cy="130" r="5" fill="#10b981" />
  </g>
`;

const accountantAccountantIllust = `
  <!-- Spreadsheet / Balance ledger sheet mockup -->
  <g transform="translate(30, 20)">
    <!-- Spreadsheet outer shell -->
    <rect x="15" y="20" width="290" height="260" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
    
    <!-- Sheet header row -->
    <rect x="15" y="20" width="290" height="35" rx="10" fill="rgba(16,185,129,0.12)" />
    <line x1="15" y1="55" x2="305" y2="55" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    
    <!-- Grid columns -->
    <line x1="105" y1="20" x2="105" y2="280" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    <line x1="205" y1="20" x2="205" y2="280" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    
    <!-- Grid rows -->
    <line x1="15" y1="95" x2="305" y2="95" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="15" y1="135" x2="305" y2="135" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="15" y1="175" x2="305" y2="175" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="15" y1="215" x2="305" y2="215" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="15" y1="245" x2="305" y2="245" stroke="rgba(255,255,255,0.08)" stroke-width="2" /> <!-- Total row line -->

    <!-- Header texts -->
    <text x="60" y="42" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">ITEM</text>
    <text x="155" y="42" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">DEBIT</text>
    <text x="255" y="42" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">CREDIT</text>

    <!-- Spreadsheet cell content representations -->
    <!-- Row 1 -->
    <rect x="25" y="68" width="60" height="10" rx="3" fill="rgba(255,255,255,0.15)" />
    <text x="155" y="78" fill="rgba(255,255,255,0.6)" font-family="monospace" font-size="11" text-anchor="middle">14,250.00</text>
    
    <!-- Row 2 -->
    <rect x="25" y="108" width="50" height="10" rx="3" fill="rgba(255,255,255,0.15)" />
    <text x="255" y="118" fill="#10b981" font-family="monospace" font-size="11" text-anchor="middle">3,120.00</text>
    
    <!-- Row 3 -->
    <rect x="25" y="148" width="65" height="10" rx="3" fill="rgba(255,255,255,0.15)" />
    <text x="155" y="158" fill="rgba(255,255,255,0.6)" font-family="monospace" font-size="11" text-anchor="middle">2,480.00</text>
    
    <!-- Row 4 (TOTAL) -->
    <text x="60" y="266" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">TOTAL</text>
    <text x="255" y="266" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">15,890.00</text>
  </g>
`;

const accountantOfficeIllust = `
  <!-- Binder folders / Tax audit documents stack -->
  <g transform="translate(45, 20)">
    <!-- Back binder -->
    <path d="M 40 260 L 40 60 L 100 60 L 100 260 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <rect x="52" y="80" width="36" height="28" fill="rgba(255,255,255,0.05)" />
    <circle cx="70" cy="180" r="10" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    
    <!-- Middle binder (Emerald accent) -->
    <path d="M 110 260 L 110 40 L 170 40 L 170 260 Z" fill="rgba(16,185,129,0.03)" stroke="#10b981" stroke-width="2.5" />
    <!-- Label -->
    <rect x="122" y="65" width="36" height="35" fill="#111827" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    <line x1="128" y1="75" x2="152" y2="75" stroke="#10b981" stroke-width="2" />
    <line x1="128" y1="85" x2="145" y2="85" stroke="#10b981" stroke-width="2" />
    <!-- Finger hole -->
    <circle cx="140" cy="170" r="10" fill="#111827" stroke="#10b981" stroke-width="1.5" />
    
    <!-- Front binder -->
    <path d="M 180 260 L 180 80 L 240 80 L 240 260 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <rect x="192" y="100" width="36" height="28" fill="rgba(255,255,255,0.05)" />
    <circle cx="210" cy="190" r="10" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  </g>
`;

const accountantAuditorIllust = `
  <!-- Magnifying glass looking at financial values / Pie chart -->
  <g transform="translate(30, 20)">
    <!-- Background pie chart -->
    <circle cx="150" cy="130" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="40" />
    <circle cx="150" cy="130" r="80" fill="none" stroke="#10b981" stroke-width="40" stroke-dasharray="140,500" stroke-dashoffset="0" />
    <circle cx="150" cy="130" r="80" fill="none" stroke="#059669" stroke-width="40" stroke-dasharray="210,500" stroke-dashoffset="-145" />
    
    <!-- Tax/Audit check mark badge -->
    <circle cx="230" cy="70" r="28" fill="#111827" stroke="#10b981" stroke-width="2.5" />
    <path d="M 218 70 L 226 78 L 244 60" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Magnifying Glass Audit Tool -->
    <g transform="translate(60, 110) rotate(-15)">
      <!-- Handle -->
      <line x1="80" y1="80" x2="140" y2="140" stroke="rgba(255,255,255,0.6)" stroke-width="12" stroke-linecap="round" />
      <line x1="80" y1="80" x2="140" y2="140" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
      <!-- Glass rim -->
      <circle cx="40" cy="40" r="55" fill="rgba(16,185,129,0.06)" stroke="#10b981" stroke-width="6" />
      <circle cx="40" cy="40" r="52" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3" />
      
      <!-- Audited percentage text inside glass -->
      <text x="40" y="47" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">OK</text>
    </g>
  </g>
`;

const accountantAdvisorIllust = `
  <!-- Investment Advisor curve with coins / growth circles -->
  <g transform="translate(30, 20)">
    <!-- Target Bullseye/Allocation rings -->
    <circle cx="150" cy="140" r="100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
    <circle cx="150" cy="140" r="70" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
    
    <!-- Growth lines radiating -->
    <line x1="150" y1="40" x2="150" y2="240" stroke="rgba(255,255,255,0.04)" stroke-width="1.5" stroke-dasharray="3,3" />
    <line x1="50" y1="140" x2="250" y2="140" stroke="rgba(255,255,255,0.04)" stroke-width="1.5" stroke-dasharray="3,3" />
    
    <!-- Main advisory growth curve -->
    <path d="M 40 220 C 100 220, 120 120, 180 100 C 220 80, 240 70, 280 40" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" />
    
    <!-- Node points of allocation -->
    <circle cx="40" cy="220" r="6" fill="#10b981" />
    <circle cx="180" cy="100" r="8" fill="#10b981" />
    <circle cx="280" cy="40" r="9" fill="#10b981" />
    <circle cx="280" cy="40" r="16" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.5" />
    
    <!-- Floating currency icons / Growth metrics -->
    <g transform="translate(195, 75)">
      <rect x="0" y="0" width="70" height="24" rx="12" fill="#111827" stroke="rgba(16,185,129,0.4)" stroke-width="1" />
      <text x="35" y="16" fill="#10b981" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">ROI +35%</text>
    </g>
  </g>
`;

const accountantPayrollIllust = `
  <!-- Payroll calendar ledger / check sheet -->
  <g transform="translate(30, 20)">
    <!-- Calendar grid representation -->
    <rect x="15" y="20" width="290" height="260" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
    
    <!-- Calendar Header -->
    <rect x="15" y="20" width="290" height="45" rx="12" fill="rgba(16,185,129,0.12)" />
    <text x="160" y="48" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="1">PAYROLL SCHEDULE</text>
    
    <!-- Calendar Squares Grid -->
    <g fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5">
      <!-- Grid lines -->
      <line x1="15" y1="105" x2="305" y2="105" />
      <line x1="15" y1="155" x2="305" y2="155" />
      <line x1="15" y1="205" x2="305" y2="205" />
      
      <line x1="73" y1="65" x2="73" y2="280" />
      <line x1="131" y1="65" x2="131" y2="280" />
      <line x1="189" y1="65" x2="189" y2="280" />
      <line x1="247" y1="65" x2="247" y2="280" />
    </g>
    
    <!-- Payout day highlighted (Day 10 or 25) -->
    <rect x="133" y="107" width="54" height="46" rx="6" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2.5" />
    <text x="160" y="136" fill="#10b981" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">25</text>
    
    <!-- Payout success badge -->
    <circle cx="270" cy="240" r="22" fill="#111827" stroke="#10b981" stroke-width="2" />
    <!-- Dollar sign inside -->
    <text x="270" y="247" fill="#10b981" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">$</text>
  </g>
`;

// Define mapping for all files
const files = [
  // Architect
  {
    theme: 'architect',
    filename: 'main.svg',
    title: 'Projektowanie & IT',
    subtitle: 'Nowoczesne platformy www i pozycjonowanie w wyszukiwarkach AI.\nRozwiązania skrojone dla biur projektowych i inżynierskich.\nZbuduj profesjonalną widoczność.',
    illustration: architectMainIllust,
    dir: architectDir
  },
  {
    theme: 'architect',
    filename: 'architect.svg',
    title: 'Strony dla Architektów',
    subtitle: 'Profesjonalne portfolio projektów, integracja z social media.\nDoskonała ekspozycja projektów koncepcyjnych.\nPozyskuj prestiżowe kontrakty.',
    illustration: architectArchitectIllust,
    dir: architectDir
  },
  {
    theme: 'architect',
    filename: 'interiorDesigner.svg',
    title: 'Projektowanie Wnętrz',
    subtitle: 'Nacisk na wizualne portfolio, szybkie ładowanie galerii.\nIntuicyjny kontakt i spersonalizowane oferty.\nWyróżnij się unikalnym stylem.',
    illustration: architectInteriorIllust,
    dir: architectDir
  },
  {
    theme: 'architect',
    filename: 'landscapeArchitect.svg',
    title: 'Architektura Krajobrazu',
    subtitle: 'Pozycjonowanie lokalne, galerie realizacji w wysokiej rozdzielczości.\nOptymalizacja pod urządzenia mobilne.\nPokaż swoje realizacje w ogrodach.',
    illustration: architectLandscapeIllust,
    dir: architectDir
  },
  {
    theme: 'architect',
    filename: 'urbanPlanner.svg',
    title: 'Urbaniści & Planowanie',
    subtitle: 'Systemy prezentacji projektów zagospodarowania przestrzeni.\nSzybki dostęp do dokumentacji i map.\nProfesjonalizm w każdym detalu.',
    illustration: architectUrbanIllust,
    dir: architectDir
  },
  {
    theme: 'architect',
    filename: 'structuralEngineer.svg',
    title: 'Inżynieria Budowlana',
    subtitle: 'Prezentacja obliczeń statycznych, wdrożonych projektów i norm.\nBezpieczeństwo danych i stabilny backend.\nBuduj zaufanie partnerów biznesowych.',
    illustration: architectStructuralIllust,
    dir: architectDir
  },

  // Accountant
  {
    theme: 'accountant',
    filename: 'main.svg',
    title: 'Finanse & Księgowość',
    subtitle: 'Bezpieczne portale, systemy e-rezerwacji i pozycjonowanie lokalne.\nRozwiązania zoptymalizowane pod pozyskiwanie firm B2B.\nKsięgowość nowej ery.',
    illustration: accountantMainIllust,
    dir: accountantDir
  },
  {
    theme: 'accountant',
    filename: 'accountant.svg',
    title: 'Strony dla Księgowych',
    subtitle: 'Prosty kontakt, blogi eksperckie wyjaśniające zmiany podatkowe.\nPozycjonowanie w Warszawie i okolicach.\nBądź doradcą pierwszego wyboru.',
    illustration: accountantAccountantIllust,
    dir: accountantDir
  },
  {
    theme: 'accountant',
    filename: 'accountingOffice.svg',
    title: 'Biura Rachunkowe',
    subtitle: 'Integracje z CRM, formularze przesyłania dokumentów i e-obsługa.\nPełna certyfikacja SSL i bezpieczeństwo RODO.\nSkuteczny lejek konwersji.',
    illustration: accountantOfficeIllust,
    dir: accountantDir
  },
  {
    theme: 'accountant',
    filename: 'auditor.svg',
    title: 'Audyt & Badanie Ksiąg',
    subtitle: 'Minimalistyczny, prestiżowy design wzbudzający pełne zaufanie.\nSzczegółowa prezentacja oferty audytorskiej.\nNajwyższe standardy rynkowe.',
    illustration: accountantAuditorIllust,
    dir: accountantDir
  },
  {
    theme: 'accountant',
    filename: 'financialAdvisor.svg',
    title: 'Doradztwo Finansowe',
    subtitle: 'Interaktywne kalkulatory zysków, pożyczek i analizy kosztów.\nBudowanie wizerunku niezależnego eksperta.\nZdobądź przewagę konkurencyjną.',
    illustration: accountantAdvisorIllust,
    dir: accountantDir
  },
  {
    theme: 'accountant',
    filename: 'payrollSpecialist.svg',
    title: 'Kadry i Płace',
    subtitle: 'Prezentacja usług outsourcingu kadrowo-płacowego (HR & Payroll).\nPrzejrzyste cenniki i kalkulatory etatów.\nZoptymalizuj koszty obsługi kadrowej.',
    illustration: accountantPayrollIllust,
    dir: accountantDir
  }
];

console.log("Generating premium SVG vector assets for Architect and Accountant industries...");

files.forEach(file => {
  const svgContent = getBaseSvg(file.theme, file.title, file.subtitle, file.illustration);
  const filePath = path.join(file.dir, file.filename);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`Successfully generated: ${filePath}`);
});

console.log("Vector asset generation completed!");
