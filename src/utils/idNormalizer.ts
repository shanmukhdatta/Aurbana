/**
 * Shared produce ID normalization for URLs, QR payloads, and API lookups.
 * Handles raw IDs, full URLs, query params (?p=), and /p/ path segments.
 */
export function normalizeProduceId(raw: string): string {
  if (!raw) return '';

  let cleaned = decodeURIComponent(raw).trim().toUpperCase();

  // Direct Aurbana ID anywhere in the string (AUR-YYYY-CODE-TOKEN)
  const aurMatch = cleaned.match(/AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+/i);
  if (aurMatch) {
    return aurMatch[0].toUpperCase();
  }

  // Query parameter (?p=... or &produceId=...)
  const queryMatch = cleaned.match(/[?&](?:P|PRODUCEID|ID|BATCH|SCAN)=([^&#\s]+)/i);
  if (queryMatch?.[1]) {
    cleaned = queryMatch[1].trim();
    const nested = cleaned.match(/AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+/i);
    if (nested) return nested[0].toUpperCase();
  }

  // Path segment (/p/ID or /produce/ID)
  const pathMatch = cleaned.match(/\/(?:P|PRODUCE)\/([^/?#&\s]+)/i);
  if (pathMatch?.[1]) {
    cleaned = pathMatch[1].trim();
    const nested = cleaned.match(/AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+/i);
    if (nested) return nested[0].toUpperCase();
  }

  // Strip trailing slashes, hashes, and query fragments
  cleaned = cleaned.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
  return cleaned;
}

export function findProduceIndex(records: { produce_id: string; id?: string }[], targetId: string): number {
  const normalized = normalizeProduceId(targetId);
  if (!normalized) return -1;

  const stripped = normalized.replace(/[^A-Z0-9]/g, '');

  return records.findIndex((record) => {
    const produceId = record.produce_id.toUpperCase();
    if (produceId === normalized) return true;
    if (record.id?.toUpperCase() === normalized) return true;
    if (produceId.replace(/[^A-Z0-9]/g, '') === stripped) return true;
    return false;
  });
}
