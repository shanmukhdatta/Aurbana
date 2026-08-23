import { ProduceRecord, FarmPartner, UserSession } from '../types';
import { INITIAL_PRODUCE_RECORDS, MOCK_FARMS, DEFAULT_USERS } from '../data/mockProduce';
import { normalizeProduceId, findProduceIndex } from '../utils/idNormalizer';

const STORAGE_KEY = 'aurbana_produce_records_v1';
const USER_KEY = 'aurbana_active_user_v1';
const SCANS_LOG_KEY = 'aurbana_scan_logs_v1';

export class ProduceStorageService {
  private static syncedWithServer = false;
  private static listeners = new Set<() => void>();

  /**
   * Subscribe to database updates (triggers on create, update, delete, or server sync)
   */
  static subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in ProduceStorageService listener', err);
      }
    });
  }

  /**
   * Normalize an ID string for robust matching across URLs, queries, and direct IDs
   */
  static normalizeId(id: string): string {
    return normalizeProduceId(id);
  }

  /**
   * Synchronize local storage cache with server database
   */
  static async syncWithServer(): Promise<ProduceRecord[]> {
    try {
      const response = await fetch('/api/produce');
      if (response.ok) {
        const serverRecords: ProduceRecord[] = await response.json();
        if (Array.isArray(serverRecords)) {
          const map = new Map<string, ProduceRecord>();

          // Server is source of truth; keep any local-only records not yet synced
          const local = this.getLocalRecordsOnly();
          serverRecords.forEach((record) => map.set(record.produce_id.toUpperCase(), record));
          local.forEach((record) => {
            const key = record.produce_id.toUpperCase();
            if (!map.has(key)) {
              map.set(key, record);
            }
          });

          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );

          this.syncedWithServer = true;
          this.saveRecords(merged);
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not sync produce records with server API', e);
    }
    this.syncedWithServer = true;
    return this.getRecords();
  }

  private static getLocalRecordsOnly(): ProduceRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCE_RECORDS;
  }

  /**
   * Get all produce records (initializing from seed if empty, triggers background sync)
   */
  static getRecords(): ProduceRecord[] {
    if (!this.syncedWithServer && typeof window !== 'undefined') {
      this.syncWithServer().catch(() => {});
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read produce records from localStorage', e);
    }
    // Seed initial records
    this.saveRecords(INITIAL_PRODUCE_RECORDS);
    return INITIAL_PRODUCE_RECORDS;
  }

  /**
   * Save all records to localStorage and notify UI subscribers
   */
  static saveRecords(records: ProduceRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to write produce records to localStorage', e);
    }
  }

  /**
   * Search database asynchronously (queries server API and falls back to local cache)
   */
  static async searchRecords(query: string): Promise<ProduceRecord[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.getRecords();

    try {
      const res = await fetch(`/api/produce/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const remoteResults: ProduceRecord[] = await res.json();
        if (Array.isArray(remoteResults)) {
          return remoteResults;
        }
      }
    } catch (err) {
      console.warn('Backend search query failed, using local filter fallback', err);
    }

    // Local fallback search
    return this.getRecords().filter((r) => {
      const matchName = r.produce_name.toLowerCase().includes(q);
      const matchId = r.produce_id.toLowerCase().includes(q);
      const matchOrigin = r.origin.toLowerCase().includes(q);
      const matchFarmer = (r.farmer_name || '').toLowerCase().includes(q);
      const matchBatch = (r.batch_number || '').toLowerCase().includes(q);
      const matchCategory = (r.category || '').toLowerCase().includes(q);
      const matchVariety = (r.variety || '').toLowerCase().includes(q);
      return matchName || matchId || matchOrigin || matchFarmer || matchBatch || matchCategory || matchVariety;
    });
  }

  /**
   * Find record by public produce_id synchronous (from cache)
   */
  static getRecordByProduceId(produceId: string): ProduceRecord | null {
    const clean = this.normalizeId(produceId);
    if (!clean) return null;

    const records = this.getRecords();
    const index = findProduceIndex(records, clean);
    return index >= 0 ? records[index] : null;
  }

  /**
   * Async fetch record by produceId (checks cache, then queries server API)
   */
  static async fetchRecordByProduceId(produceId: string): Promise<ProduceRecord | null> {
    const clean = this.normalizeId(produceId);
    if (!clean) return null;

    // 1. Check local cache first
    const cached = this.getRecordByProduceId(clean);
    if (cached) return cached;

    // 2. Query Server API
    try {
      const res = await fetch(`/api/produce/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const remoteRecord: ProduceRecord = await res.json();
        if (remoteRecord && remoteRecord.produce_id) {
          // Cache in local storage
          const current = this.getRecords();
          const exists = current.some(r => r.produce_id.toUpperCase() === remoteRecord.produce_id.toUpperCase());
          if (!exists) {
            this.saveRecords([remoteRecord, ...current]);
          }
          return remoteRecord;
        }
      }
    } catch (err) {
      console.warn('API query failed for produce ID', clean, err);
    }

    // 3. Trigger full sync and retry lookup
    try {
      const refreshed = await this.syncWithServer();
      const index = findProduceIndex(refreshed, clean);
      if (index >= 0) return refreshed[index];
    } catch {
      // ignore
    }

    return null;
  }

  /**
   * Increment scan count when someone views or scans a produce
   */
  static recordScan(produceId: string): void {
    const clean = this.normalizeId(produceId);
    const records = this.getRecords();
    const index = findProduceIndex(records, clean);
    if (index !== -1) {
      records[index].scan_count = (records[index].scan_count || 0) + 1;
      records[index].updated_at = new Date().toISOString();
      this.saveRecords(records);
    }

    fetch(`/api/produce/${encodeURIComponent(clean)}/scan`, { method: 'POST' }).catch(() => {});

    try {
      const logs = JSON.parse(localStorage.getItem(SCANS_LOG_KEY) || '[]');
      logs.unshift({
        produce_id: clean,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      });
      // keep latest 100
      localStorage.setItem(SCANS_LOG_KEY, JSON.stringify(logs.slice(0, 100)));
    } catch {
      // ignore
    }
  }

  /**
   * Create a new produce identity record
   */
  static async createRecord(
    recordData: Omit<ProduceRecord, 'id' | 'created_at' | 'updated_at' | 'scan_count'>
  ): Promise<ProduceRecord> {
    const newRecord: ProduceRecord = {
      ...recordData,
      produce_id: this.normalizeId(recordData.produce_id),
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scan_count: 0,
    };

    try {
      const response = await fetch('/api/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        const saved: ProduceRecord = await response.json();
        const records = this.getRecords().filter(
          (record) => record.produce_id.toUpperCase() !== saved.produce_id.toUpperCase()
        );
        this.saveRecords([saved, ...records]);
        return saved;
      }
    } catch (err) {
      console.warn('Could not post new produce record to server API', err);
    }

    const records = this.getRecords();
    this.saveRecords([newRecord, ...records]);
    return newRecord;
  }

  /**
   * Update an existing record
   */
  static updateRecord(produceId: string, updates: Partial<ProduceRecord>): ProduceRecord | null {
    const clean = this.normalizeId(produceId);
    const records = this.getRecords();
    const index = findProduceIndex(records, clean);
    if (index === -1) return null;

    records[index] = {
      ...records[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.saveRecords(records);

    fetch(`/api/produce/${encodeURIComponent(clean)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});

    return records[index];
  }

  /**
   * Deactivate or Delete a produce record
   */
  static setStatus(produceId: string, status: ProduceRecord['status']): boolean {
    return !!this.updateRecord(produceId, { status });
  }

  static deleteRecord(produceId: string): boolean {
    const clean = this.normalizeId(produceId);
    const records = this.getRecords();
    const index = findProduceIndex(records, clean);
    if (index === -1) return false;

    const filtered = records.filter((_, i) => i !== index);
    this.saveRecords(filtered);

    fetch(`/api/produce/${encodeURIComponent(clean)}`, { method: 'DELETE' }).catch(() => {});
    return true;
  }

  /**
   * Reset to initial demo records
   */
  static resetToDefault(): ProduceRecord[] {
    this.saveRecords(INITIAL_PRODUCE_RECORDS);
    return INITIAL_PRODUCE_RECORDS;
  }

  /**
   * Get registered farms
   */
  static getFarms(): FarmPartner[] {
    return MOCK_FARMS;
  }

  /**
   * Authentication session management
   */
  static getActiveUser(): UserSession | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return null;
  }

  static setActiveUser(user: UserSession | null): void {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set active user session', e);
    }
  }

  static getAvailableUsers(): UserSession[] {
    return DEFAULT_USERS;
  }
}
