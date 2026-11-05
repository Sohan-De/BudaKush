// Session admin : un cookie HttpOnly contenant un HMAC du mot de passe (jamais le mot de passe lui-même).
// Utilise Web Crypto : fonctionne dans le middleware (edge) comme dans les routes API.
export const ADMIN_COOKIE = 'admin_session';
const CONTEXT = 'budakush-admin-session-v1';

const encoder = new TextEncoder();

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

export async function sessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(CONTEXT));
  return toHex(sig);
}

// Comparaison à temps constant
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
