export default function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Suhas Nidgundi';
  const subtitle =
    searchParams.get('subtitle') ||
    'Full Stack Engineer, System Designer & Problem Solver';

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0f"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    
    <!-- Tag -->
    <g transform="translate(80, 80)">
      <rect width="260" height="42" rx="21" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="130" y="27" fill="#38bdf8" font-size="18" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle">💻 suhasnidgundi.tech</text>
    </g>

    <!-- Main Title & Subtitle -->
    <text x="80" y="260" fill="#ffffff" font-size="62" font-weight="800" font-family="system-ui, sans-serif">${title}</text>
    <text x="80" y="325" fill="#94a3b8" font-size="28" font-family="system-ui, sans-serif">${subtitle}</text>

    <!-- Tech Badges -->
    <g transform="translate(80, 480)">
      <rect x="0" y="0" width="100" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="50" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">React</text>
      
      <rect x="116" y="0" width="130" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="181" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">TypeScript</text>
      
      <rect x="262" y="0" width="110" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="317" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">Node.js</text>
      
      <rect x="388" y="0" width="100" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="438" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">Vercel</text>
      
      <rect x="504" y="0" width="90" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="549" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">Vite</text>

      <rect x="610" y="0" width="120" height="42" rx="8" fill="#1f2937" stroke="#374151" stroke-width="1"/>
      <text x="670" y="26" fill="#e2e8f0" font-size="16" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle">Tailwind</text>
    </g>
  </svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control':
        'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
