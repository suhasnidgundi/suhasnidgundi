import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Suhas Nidgundi';
    const subtitle = searchParams.get('subtitle') || 'Full Stack Engineer & System Designer';
    const tag = searchParams.get('tag') || 'suhasnidgundi.tech';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0f',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 18px',
              backgroundColor: '#1e293b',
              borderRadius: '9999px',
              border: '1px solid #334155',
              color: '#38bdf8',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            <span>💻</span>
            <span>{tag}</span>
          </div>

          {/* Main Title & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: '64px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#94a3b8',
                maxWidth: '900px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {['React', 'TypeScript', 'Node.js', 'Vercel', 'Tailwind', 'Cloud'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '6px',
                  color: '#e2e8f0',
                  fontSize: '18px',
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
