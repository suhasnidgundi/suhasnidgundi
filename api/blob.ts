import { put, list, del } from '@vercel/blob';
import { verifyAdminRequest } from './_auth';

export async function GET(req: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Vercel Blob token is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { blobs } = await list();
    return new Response(JSON.stringify({ blobs }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Blob listing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Vercel Blob token is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { filename, content } = body;
      if (!filename || !content) {
        return new Response(
          JSON.stringify({ error: 'Both filename and content are required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const blob = await put(filename, content, { access: 'public', addRandomSuffix: false, allowOverwrite: true });
      return new Response(JSON.stringify(blob), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle raw file upload
    const url = new URL(req.url);
    const filename = url.searchParams.get('filename') || `upload-${Date.now()}`;
    const blob = await put(filename, req.body!, { access: 'public', addRandomSuffix: false, allowOverwrite: true });

    return new Response(JSON.stringify(blob), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Blob upload failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Vercel Blob token is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const blobUrl = url.searchParams.get('url');
    if (!blobUrl) {
      return new Response(JSON.stringify({ error: 'url parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await del(blobUrl);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Blob deletion failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


