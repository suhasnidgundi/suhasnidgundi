// Serverless Admin Authentication Endpoint for Vercel Ecosystem
import { validateCredentials, generateAdminToken, verifyAdminRequest, verifyAdminToken } from './_auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCredentials(email, password)) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials. Access denied.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = generateAdminToken(email);

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: {
          $id: 'admin-suhas',
          name: 'Suhas Nidgundi',
          email: email.toLowerCase().trim(),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Authentication error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ authenticated: false, error: 'No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7).trim();
    const result = verifyAdminToken(token);

    if (!result.valid || !result.payload) {
      return new Response(
        JSON.stringify({ authenticated: false, error: 'Token is invalid or expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          $id: result.payload.sub,
          name: result.payload.name || 'Suhas Nidgundi',
          email: result.payload.email,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ authenticated: false, error: error.message || 'Verification error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
