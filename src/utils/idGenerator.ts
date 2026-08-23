/**
 * Generates an Aurbana Produce ID in the standardized format:
 * AUR-YYYY-PROD-XXXXX (e.g. AUR-2026-TOM-8F42K)
 */
export function generateProduceId(produceName: string): string {
  const year = new Date().getFullYear();
  
  // Clean produce code (3 letters uppercase)
  let code = produceName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  if (code.length < 3) {
    code = (code + 'PRD').slice(0, 3);
  }
  
  // 5-character alphanumeric token
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // non-ambiguous chars (no 0/O, 1/I)
  let token = '';
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `AUR-${year}-${code}-${token}`;
}

export function getPublicProduceUrl(produceId: string): string {
  const cleanId = produceId.trim().toUpperCase();
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin.replace(/\/+$/, '');
    return `${origin}/p/${encodeURIComponent(cleanId)}`;
  }
  return `https://aurbana.vercel.app/p/${encodeURIComponent(cleanId)}`;
}
