export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = getCookie(request.headers.get("cookie"), "gh_oauth_state");

  if (!code) {
    return json({ error: "Missing code" }, 400);
  }

  if (state && cookieState && state !== cookieState) {
    return json({ error: "State mismatch" }, 400);
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return json({ error: "Missing GitHub client env vars" }, 500);
  }

  const body = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
    ...(env.REDIRECT_URI ? { redirect_uri: env.REDIRECT_URI } : {}),
    ...(state ? { state } : {}),
  });

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body,
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return json({ error: data.error || "OAuth exchange failed" }, res.status || 500);
    }

    const html = buildPostMessagePage({
      token: data.access_token,
    });

    const headers = new Headers({
      "Content-Type": "text/html",
      "Cache-Control": "no-store",
      "Set-Cookie": "gh_oauth_state=deleted; Path=/oauth; Max-Age=0; Secure; HttpOnly; SameSite=Lax",
    });

    return new Response(html, { status: 200, headers });
  } catch (err) {
    return json({ error: err.message || "Unexpected error" }, 500);
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function buildPostMessagePage(payload) {
  const data = JSON.stringify(payload);
  return `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <script>
      (function() {
        try {
          const payload = ${data};
          if (window.opener) {
            window.opener.postMessage(payload, "*");
            window.close();
          } else {
            document.body.innerText = 'Authentication complete. You can close this window.';
          }
        } catch (e) {
          document.body.innerText = 'Error completing authentication.';
        }
      })();
    </script>
  </body>
</html>`;
}

function getCookie(cookieHeader, key) {
  if (!cookieHeader) return null;
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .map((c) => c.split("="))
    .find(([k]) => k === key)?.[1];
}
