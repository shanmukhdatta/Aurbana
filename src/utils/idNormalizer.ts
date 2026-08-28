/**
 * Shared produce ID normalization for URLs, QR payloads, and API lookups.
 * Handles raw IDs, full URLs, query params (?p=), and /p/ path segments.
 */
// Pattern supporting new format (e.g. TOM-20260829-1223) and legacy format (AUR-2026-TOM-8F42K)
const PRODUCE_ID_REGEX = /(?:AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+|[A-Z]{3,4}-\d{8}-\d{4}(?:-\d+)?)/i;

export function normalizeProduceId(raw: string): string {
  if (!raw) return '';

  let cleaned = decodeURIComponent(raw).trim().toUpperCase();

  // Direct produce ID anywhere in the string
  const directMatch = cleaned.match(PRODUCE_ID_REGEX);
  if (directMatch) {
    return directMatch[0].toUpperCase();
  }

  // Query parameter (?p=... or &produceId=...)
  const queryMatch = cleaned.match(/[?&](?:P|PRODUCEID|ID|BATCH|SCAN)=([^&#\s]+)/i);
  if (queryMatch?.[1]) {
    cleaned = queryMatch[1].trim();
    const nested = cleaned.match(PRODUCE_ID_REGEX);
    if (nested) return nested[0].toUpperCase();
  }

  // Path segment (/p/ID or /produce/ID)
  const pathMatch = cleaned.match(/\/(?:P|PRODUCE)\/([^/?#&\s]+)/i);
  if (pathMatch?.[1]) {
    cleaned = pathMatch[1].trim();
    const nested = cleaned.match(PRODUCE_ID_REGEX);
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
