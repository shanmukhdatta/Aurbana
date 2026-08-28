/**
 * Generates an Aurbana Produce ID in the standardized sequence:
 * [PRODUCE_CODE]-[YYYYMMDD]-[HHmm] (e.g. TOM-20260829-1223)
 * - Produce/Vegetable Code: First 3 letters uppercase (e.g. TOM for Tomato)
 * - Date: YYYYMMDD (e.g. 20260829)
 * - Time: 24-hour HHmm format (e.g. 1223)
 */
export function generateProduceId(produceName: string, date: Date = new Date()): string {
  // Clean produce code (3 letters uppercase, e.g. TOM)
  let code = produceName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  if (code.length < 3) {
    code = (code + 'PRD').slice(0, 3);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${code}-${year}${month}${day}-${hours}${minutes}`;
}

export function getPublicProduceUrl(produceId: string): string {
  const cleanId = produceId.trim().toUpperCase();
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin.replace(/\/+$/, '');
    return `${origin}/p/${encodeURIComponent(cleanId)}`;
  }
  return `https://aurbana.vercel.app/p/${encodeURIComponent(cleanId)}`;
}
