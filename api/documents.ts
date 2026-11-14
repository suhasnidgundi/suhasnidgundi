// Dynamic Document Management API for Notepad and WordPad backed by Vercel Blob Storage
import { put, list } from '@vercel/blob';
import { createHmac } from 'crypto';

function verifyAdminRequest(req: Request): { authorized: boolean; reason?: string } {
  const customKey = req.headers.get('x-admin-key');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SuhasAdmin@2026!';
  if (customKey && customKey === ADMIN_PASSWORD) return { authorized: true };

  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, reason: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.substring(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return { authorized: false, reason: 'Malformed token' };

  const [header, payload, signature] = parts;
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'xp_jwt_suhas_sec_99a8b1c4d7e2f50821639a0b';
  const expectedSig = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSig) return { authorized: false, reason: 'Invalid signature' };

  let decoded: any;
  try {
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
  } catch {
    return { authorized: false, reason: 'Invalid payload' };
  }

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    return { authorized: false, reason: 'Token expired' };
  }

  return { authorized: true };
}

const README_BLOB = 'readme.txt';
const WORDPAD_BLOB = 'wordpad-story.json';

function getDefaultReadme() {
  return '';
}

function getDefaultWordpad() {
  return {
    title: '',
    subtitle: '',
    contact: '',
    sections: [],
  };
}

async function getBlobItem(blobName: string): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: blobName });
    const match = blobs.find((b) => b.pathname === blobName);
    if (!match) return null;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn('Vercel Blob document read error:', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'readme';

    if (type === 'wordpad' || type === 'story') {
      const text = await getBlobItem(WORDPAD_BLOB);
      if (text) {
        try {
          const data = JSON.parse(text);
          return new Response(JSON.stringify({ ...data, source: 'blob' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            },
          });
        } catch {
          // ignore parse error, fallback to default
        }
      }
      return new Response(JSON.stringify({ ...getDefaultWordpad(), source: 'default' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default: README text
    const text = await getBlobItem(README_BLOB);
    return new Response(JSON.stringify({ content: text || getDefaultReadme(), source: text ? 'blob' : 'default' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to read document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Admin login required to save document to Blob' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'readme';
    const body = await req.json();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(JSON.stringify({ error: 'Blob token missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type === 'wordpad' || type === 'story') {
      const payload = {
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const blob = await put(WORDPAD_BLOB, JSON.stringify(payload, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return new Response(JSON.stringify({ success: true, url: blob.url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // README save
    const content = typeof body === 'string' ? body : (body.content || '');
    const blob = await put(README_BLOB, content, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return new Response(JSON.stringify({ success: true, url: blob.url, source: 'blob' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to save document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
