/**
 * Returns the URL (trimmed) if it's a valid http:// or https:// URL, otherwise null.
 * Blocks javascript:, data:, vbscript: and other schemes that could run code when clicked.
 */
export function safeHttpUrl(input: string | null | undefined): string | null {
  const value = (input || "").trim();
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/**
 * SSRF guard for server-side fetches of admin-supplied URLs: only public http(s) hosts.
 * Rejects localhost, private/loopback/link-local IP ranges (including the 169.254.169.254
 * cloud-metadata address) and non-http schemes.
 */
export function isSafePublicUrl(input: string): boolean {
  if (!safeHttpUrl(input)) return false;
  const host = new URL(input).hostname.toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (host === "[::1]" || host === "::1" || host.startsWith("[fc") || host.startsWith("[fd") || host.startsWith("[fe80")) return false;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
  }
  return true;
}

/** JSON.stringify that is safe to embed inside a <script type="application/ld+json"> tag. */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
