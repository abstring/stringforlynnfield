function makeState() {
  return Math.random().toString(36).slice(2, 10);
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") || "repo";
  const state = makeState();

  if (!env.GITHUB_CLIENT_ID) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  const redirectUri =
    env.REDIRECT_URI ||
    `${url.origin}/oauth/callback`;

  const githubAuth = new URL("https://github.com/login/oauth/authorize");
  githubAuth.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  githubAuth.searchParams.set("redirect_uri", redirectUri);
  githubAuth.searchParams.set("scope", scope);
  githubAuth.searchParams.set("state", state);

  const headers = new Headers({
    Location: githubAuth.toString(),
    "Set-Cookie": `gh_oauth_state=${state}; Path=/.netlify/functions/oauth; HttpOnly; Secure; SameSite=Lax`,
    "Cache-Control": "no-store",
  });

  return new Response(null, { status: 302, headers });
}
