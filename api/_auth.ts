// Serverless Admin Authentication & Token Verification for Vercel Ecosystem
import { createHmac } from 'crypto';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'xp_jwt_suhas_sec_99a8b1c4d7e2f50821639a0b';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'suhasnidgundi@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SuhasAdmin@2026!';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function generateAdminToken(email: string): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: 'admin-suhas',
      name: 'Suhas Nidgundi',
      email: email.toLowerCase().trim(),
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days validity
    })
  );

  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${payload}.${signature}`;
}

export function verifyAdminToken(token: string): { valid: boolean; payload?: any } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [header, payload, signature] = parts;
    const expectedSig = createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return { valid: false };
    }

    const decoded = JSON.parse(base64UrlDecode(payload));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, payload: decoded };
  } catch {
    return { valid: false };
  }
}

export function verifyAdminRequest(req: Request): { authorized: boolean; reason?: string } {
  // Allow bypassing if explicitly configured bypass header (e.g. from Vercel deployment protection)
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const customKey = req.headers.get('x-admin-key');

  if (customKey && customKey === ADMIN_PASSWORD) {
    return { authorized: true };
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, reason: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.substring(7).trim();
  const result = verifyAdminToken(token);
  if (!result.valid) {
    return { authorized: false, reason: 'Invalid or expired token' };
  }

  return { authorized: true };
}

export function validateCredentials(email: string, password: string): boolean {
  const normEmail = (email || '').toLowerCase().trim();
  const expectedEmail = ADMIN_EMAIL.toLowerCase().trim();
  return normEmail === expectedEmail && password === ADMIN_PASSWORD;
}

export { ADMIN_EMAIL };
