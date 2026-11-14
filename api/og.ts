export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Suhas Nidgundi';
  const role = searchParams.get('role') || 'Full Stack Engineer & System Designer';
  const status = searchParams.get('status') || 'Available for Opportunities';

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
        My Portfolio — Suhas Nidgundi (Windows XP Professional)
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
        Belgaum / Pune, India • ${status}
      </text>

      <line x1="45" y1="190" x2="795" y2="190" stroke="#aca899" stroke-width="1"/>

      <!-- Features Box / System Info Style -->
      <g transform="translate(45, 210)">
        <rect width="750" height="150" fill="#ffffff" stroke="#7f9db9" stroke-width="1" rx="2"/>
        
        <text x="20" y="32" fill="#000000" font-size="14" font-weight="bold" font-family="Tahoma, sans-serif">
          Operating System Features:
        </text>
        <text x="35" y="60" fill="#374151" font-size="13" font-family="Tahoma, sans-serif">
          • Interactive Windows Explorer with Project &amp; Experience Folders
        </text>
        <text x="35" y="85" fill="#374151" font-size="13" font-family="Tahoma, sans-serif">
          • Built-in AI Assistant powered by Vercel AI SDK &amp; Gemini Flash
        </text>
        <text x="35" y="110" fill="#374151" font-size="13" font-family="Tahoma, sans-serif">
          • Working WordPad, Notepad, PDF Resume Viewer, Calculator &amp; Minesweeper
        </text>
        <text x="35" y="135" fill="#374151" font-size="13" font-family="Tahoma, sans-serif">
          • 100% Native Vercel Ecosystem (Edge Network, Functions, Blob, Speed Insights)
        </text>
      </g>

      <!-- Classic XP OK / Cancel Buttons -->
      <g transform="translate(685, 395)">
        <rect width="110" height="34" rx="3" fill="#ece9d8" stroke="#003c74" stroke-width="1"/>
        <text x="55" y="22" fill="#000000" font-size="13" font-weight="bold" font-family="Tahoma, sans-serif" text-anchor="middle">
          OK
        </text>
      </g>

      <!-- URL Badge -->
      <text x="45" y="418" fill="#6b7280" font-size="13" font-family="Tahoma, sans-serif">
        https://suhasnidgundi.tech
      </text>
    </g>

    <!-- Windows XP Taskbar along the bottom -->
    <rect y="600" width="1200" height="30" fill="#245edb"/>
    <!-- Start Button -->
    <path d="M 0 600 L 95 600 Q 105 600 108 605 L 115 630 L 0 630 Z" fill="#388e3c"/>
    <text x="40" y="621" fill="#ffffff" font-size="14" font-weight="bold" font-family="Tahoma, sans-serif" font-style="italic">start</text>
  </svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
