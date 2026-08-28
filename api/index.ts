import express from 'express';
import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCE_RECORDS, MOCK_FARMS } from '../src/data/mockProduce.js';
import { normalizeProduceId, findProduceIndex } from '../src/utils/idNormalizer.js';
import { getProduceImage } from '../src/utils/produceImageHelper.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

const DATA_FILE = path.join('/tmp', 'produce_store.json');

type ProduceRecord = (typeof INITIAL_PRODUCE_RECORDS)[number];

function normalizeRecord(record: Partial<ProduceRecord>, index = 0): ProduceRecord {
  const now = new Date().toISOString();
  const produceId = normalizeProduceId(record.produce_id || '') || record.produce_id || '';
  const produceName = record.produce_name || 'Unknown Produce';
  const category = record.category || 'Vegetable';

  return {
    id: record.id || `prod-${Date.now()}-${index}`,
    produce_id: produceId,
    produce_name: produceName,
    variety: record.variety,
    category: category,
    age_days: typeof record.age_days === 'number' ? record.age_days : 0,
    condition: record.condition || 'Good',
    origin: record.origin || 'Unknown Origin',
    supplier_name: record.supplier_name,
    farmer_name: record.farmer_name,
    harvest_date: record.harvest_date || now.split('T')[0],
    collection_date: record.collection_date || now.split('T')[0],
    registration_date: record.registration_date || now.split('T')[0],
    batch_number: record.batch_number || `BATCH-${Date.now().toString().slice(-6)}`,
    quantity: record.quantity,
    storage_location: record.storage_location,
    notes: record.notes,
    image_url: record.image_url || getProduceImage(produceName, category),
    status: record.status || 'Active',
    created_at: record.created_at || now,
    updated_at: record.updated_at || now,
    scan_count: typeof record.scan_count === 'number' ? record.scan_count : 0,
    grade: record.grade,
    shelf_life_days: record.shelf_life_days,
    temp_celsius: record.temp_celsius,
    journey: record.journey || [],
  };
}

let inMemoryRecords: ProduceRecord[] = INITIAL_PRODUCE_RECORDS.map((r, i) => normalizeRecord(r, i));

function loadProduceRecords(): ProduceRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((record, index) => normalizeRecord(record, index));
      }
    }
  } catch (err) {
    // Ignore read errors in serverless
  }
  return inMemoryRecords;
}

function saveProduceRecords(records: ProduceRecord[]) {
  inMemoryRecords = records;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    // Ignore write errors in serverless if disk is read-only
  }
}

// REST Endpoints
app.get('/api/health', (_req, res) => {
  const records = loadProduceRecords();
  res.json({
    status: 'ok',
    recordsCount: records.length,
    environment: 'vercel-serverless',
  });
});

app.get('/api/produce', (_req, res) => {
  const records = loadProduceRecords();
  res.json(records);
});

app.get('/api/produce/search', (req, res) => {
  const query = (req.query.q || req.query.query || '').toString().trim().toLowerCase();
  const records = loadProduceRecords();
  if (!query) {
    return res.json(records);
  }

  const results = records.filter((r) => {
    const nameMatch = r.produce_name.toLowerCase().includes(query);
    const idMatch = r.produce_id.toLowerCase().includes(query);
    const originMatch = r.origin.toLowerCase().includes(query);
    const farmerMatch = (r.farmer_name || '').toLowerCase().includes(query);
    const batchMatch = (r.batch_number || '').toLowerCase().includes(query);
    const categoryMatch = (r.category || '').toLowerCase().includes(query);
    const varietyMatch = (r.variety || '').toLowerCase().includes(query);
    return nameMatch || idMatch || originMatch || farmerMatch || batchMatch || categoryMatch || varietyMatch;
  });

  res.json(results);
});

app.get('/api/produce/:id', (req, res) => {
  const targetId = normalizeProduceId(req.params.id || '');
  const records = loadProduceRecords();
  let index = findProduceIndex(records, targetId);

  if (index < 0) {
    // Auto-generate passport if valid ID (AUR-YYYY-CODE-TOKEN or CODE-YYYYMMDD-HHmm)
    const isAur = Boolean(targetId && targetId.startsWith('AUR-'));
    const isNew = Boolean(targetId && /^[A-Z]{3,4}-\d{8}-\d{4}/i.test(targetId));

    if (isAur || isNew) {
      let cropCode = 'PRD';
      if (isAur) {
        cropCode = targetId.split('-')[2] || 'PRD';
      } else if (isNew) {
        cropCode = targetId.split('-')[0] || 'PRD';
      }
      const cropNameMap: Record<string, string> = {
        STR: 'Strawberry',
        TOM: 'Tomato',
        MAN: 'Mango',
        POT: 'Potato',
        CAR: 'Carrot',
        BAN: 'Banana',
        SPN: 'Spinach',
        APP: 'Apple',
        ORG: 'Orange',
        BEE: 'Beetroot',
        BRO: 'Broccoli',
        ONI: 'Onion',
        CAU: 'Cauliflower',
        CAP: 'Capsicum',
        CUC: 'Cucumber',
        GAR: 'Garlic',
        GIN: 'Ginger',
        MUS: 'Mushroom'
      };
      const produceName = cropNameMap[cropCode] || 'Fresh Harvest Produce';

      const autoCreated = normalizeRecord({
        produce_id: targetId,
        produce_name: produceName,
        category: cropCode === 'STR' || cropCode === 'MAN' || cropCode === 'APP' || cropCode === 'BAN' || cropCode === 'ORG' ? 'Fruit' : 'Vegetable',
        age_days: 1,
        condition: 'Excellent',
        origin: 'Green Valley Organic Farm, Punjab',
        farmer_name: 'Harpreet Singh',
        batch_number: `BATCH-2026-${cropCode}-101`,
        notes: 'Freshly registered batch identity.'
      }, 0);

      records.unshift(autoCreated);
      saveProduceRecords(records);
      return res.json(autoCreated);
    }

    return res.status(404).json({ error: 'Produce not found', requestedId: req.params.id });
  }

  res.json(records[index]);
});

app.post('/api/produce', (req, res) => {
  try {
    const recordData = req.body;
    if (!recordData.produce_name || !recordData.produce_id) {
      return res.status(400).json({ error: 'Missing required produce fields (produce_name, produce_id)' });
    }

    const records = loadProduceRecords();
    const normalizedId = normalizeProduceId(recordData.produce_id);
    const existingIndex = findProduceIndex(records, normalizedId);

    const newRecord = normalizeRecord(
      {
        ...recordData,
        produce_id: normalizedId,
        id: recordData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: recordData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      records.length
    );

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.unshift(newRecord);
    }

    saveProduceRecords(records);
    res.status(existingIndex >= 0 ? 200 : 201).json(newRecord);
  } catch (err: any) {
    console.error('Error handling POST /api/produce:', err);
    res.status(500).json({ error: 'Failed to process produce record', message: err?.message });
  }
});

app.get('/api/farms', (_req, res) => {
  res.json(MOCK_FARMS);
});

export default app;
