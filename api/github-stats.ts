export async function GET(req: Request) {
  try {
    const username = 'suhasnidgundi';
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'Vercel-Portfolio-Agent' },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { 'User-Agent': 'Vercel-Portfolio-Agent' },
      }),
    ]);

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: 'GitHub user not found' }), {
        status: userRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userData = await userRes.json();
    const reposData = reposRes.ok ? await reposRes.json() : [];

    const totalStars = Array.isArray(reposData)
      ? reposData.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0)
      : 0;

    const stats = {
      name: userData.name || username,
      avatar: userData.avatar_url,
      bio: userData.bio,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default async function handler(req: Request) {
  return GET(req);
}
