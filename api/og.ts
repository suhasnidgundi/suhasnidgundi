export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || process.env.PORTFOLIO_NAME || 'Suhas Nidgundi';
  const role = searchParams.get('role') || process.env.PORTFOLIO_ROLE || 'Full Stack Engineer & System Designer';
  const status = searchParams.get('status') || process.env.PORTFOLIO_STATUS || 'Available for Opportunities';
  const location = searchParams.get('location') || process.env.PORTFOLIO_LOCATION || 'Belgaum / Pune, India';

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Bliss Sky Gradient -->
      <linearGradient id="blissSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2a75d3"/>
        <stop offset="50%" stop-color="#4a95e6"/>
        <stop offset="100%" stop-color="#a3cbf5"/>
      </linearGradient>

      <!-- Bliss Hill Gradient -->
      <linearGradient id="blissHill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4e9927"/>
        <stop offset="50%" stop-color="#6bb339"/>
        <stop offset="100%" stop-color="#8fd447"/>
      </linearGradient>

      <!-- Luna Titlebar Gradient -->
      <linearGradient id="lunaTitle" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0997ff"/>
        <stop offset="8%" stop-color="#0053ee"/>
        <stop offset="40%" stop-color="#0050ee"/>
        <stop offset="88%" stop-color="#0066ff"/>
        <stop offset="95%" stop-color="#005bff"/>
        <stop offset="100%" stop-color="#003dd7"/>
      </linearGradient>

      <!-- Window Frame 3D Shadow -->
      <filter id="winShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.45"/>
      </filter>
    </defs>

    <!-- Wallpaper: Bliss Simulation -->
    <rect width="1200" height="630" fill="url(#blissSky)"/>
    
    <!-- Rolling Green Hills -->
    <path d="M 0 420 Q 350 340 700 440 T 1200 390 L 1200 630 L 0 630 Z" fill="url(#blissHill)"/>
    <path d="M 0 490 Q 400 420 850 510 T 1200 460 L 1200 630 L 0 630 Z" fill="#468822" opacity="0.65"/>

    <!-- Central Windows XP Dialog Box -->
    <g transform="translate(180, 85)" filter="url(#winShadow)">
      <!-- Outer Window Border -->
      <rect width="840" height="460" rx="8" fill="#ece9d8" stroke="#0055ea" stroke-width="3"/>
      
      <!-- Luna Blue Titlebar -->
      <rect width="840" height="38" rx="7" fill="url(#lunaTitle)"/>
      <rect y="32" width="840" height="6" fill="url(#lunaTitle)"/>
      
      <!-- Titlebar Icon & Text -->
      <circle cx="24" cy="19" r="8" fill="#ffcc00"/>
      <text x="42" y="25" fill="#ffffff" font-size="16" font-weight="bold" font-family="'Trebuchet MS', Tahoma, sans-serif" filter="drop-shadow(1px 1px 1px #0f1089)">
        ${title} — Windows XP Professional Portfolio
      </text>

      <!-- Close Button (X) -->
      <g transform="translate(798, 7)">
        <rect width="26" height="24" rx="3" fill="#e04343" stroke="#fff" stroke-width="1"/>
        <text x="13" y="17" fill="#fff" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">✕</text>
      </g>

      <!-- Window Content Area -->
      <!-- Avatar Frame -->
      <g transform="translate(45, 65)">
        <rect width="100" height="100" rx="4" fill="#ffffff" stroke="#7f9db9" stroke-width="2"/>
        <text x="50" y="62" font-size="44" text-anchor="middle">💻</text>
      </g>

      <!-- Headings -->
      <text x="170" y="105" fill="#000000" font-size="34" font-weight="bold" font-family="Tahoma, sans-serif">
        ${title}
      </text>
      <text x="170" y="140" fill="#0055ea" font-size="18" font-weight="bold" font-family="Tahoma, sans-serif">
        ${role}
      </text>
      <text x="170" y="165" fill="#4b5563" font-size="14" font-family="Tahoma, sans-serif">
        ${location} • ${status}
      </text>

      <line x1="45" y1="190" x2="795" y2="190" stroke="#aca899" stroke-width="1"/>

      <!-- Features Box / System Info Style -->
      <g transform="translate(45, 210)">
        <rect width="750" height="150" fill="#ffffff" stroke="#7f9db9" stroke-width="1" rx="2"/>
        
        <text x="25" y="35" fill="#000080" font-size="15" font-weight="bold" font-family="Tahoma, sans-serif">
          Cloud Infrastructure & Architecture:
        </text>
        
        <text x="25" y="65" fill="#333333" font-size="14" font-family="Tahoma, sans-serif">
          ▲ Vercel Edge Config — sub-millisecond configuration switches & live broadcast
        </text>
        <text x="25" y="90" fill="#333333" font-size="14" font-family="Tahoma, sans-serif">
          ▲ Vercel Blob Storage — durable persistent guestbook & object storage
        </text>
        <text x="25" y="115" fill="#333333" font-size="14" font-family="Tahoma, sans-serif">
          ▲ Vercel Serverless & AI SDK — real-time intelligent streaming assistant
        </text>
        <text x="25" y="140" fill="#333333" font-size="14" font-family="Tahoma, sans-serif">
          ▲ Vercel Speed Insights & Analytics — edge performance telemetry
        </text>
      </g>

      <!-- Footer Buttons -->
      <g transform="translate(560, 390)">
        <!-- OK Button -->
        <rect width="105" height="28" rx="3" fill="#ece9d8" stroke="#003c74" stroke-width="1"/>
        <text x="52" y="19" fill="#000000" font-size="13" font-family="Tahoma, sans-serif" text-anchor="middle">View Projects</text>
      </g>

      <g transform="translate(685, 390)">
        <!-- Cancel Button -->
        <rect width="105" height="28" rx="3" fill="#ece9d8" stroke="#7f9db9" stroke-width="1"/>
        <text x="52" y="19" fill="#000000" font-size="13" font-family="Tahoma, sans-serif" text-anchor="middle">Explore OS</text>
      </g>
    </g>
  </svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
