export default async function getAccessToken() {
  const jwtHeader = {
    alg: "RS256",
    typ: "JWT"
  };

  const jwtClaim = {
    iss: process.env.REACT_APP_GDRIVE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };

  function base64url(source) {
    return btoa(String.fromCharCode(...new Uint8Array(source)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const header = base64url(encoder.encode(JSON.stringify(jwtHeader)));
  const claim = base64url(encoder.encode(JSON.stringify(jwtClaim)));
  const input = `${header}.${claim}`;

  const privateKey = process.env.REACT_APP_GDRIVE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const cryptoKey = await window.crypto.subtle.importKey(
    'pkcs8',
    str2ab(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, encoder.encode(input));
  const signedJWT = `${input}.${base64url(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJWT}`
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(tokenJson.error_description);
  return tokenJson.access_token;
}

function str2ab(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
