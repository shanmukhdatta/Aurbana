import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCE_RECORDS, MOCK_FARMS } from './src/data/mockProduce.js';
import { normalizeProduceId, findProduceIndex } from './src/utils/idNormalizer.js';
import { getProduceImage } from './src/utils/produceImageHelper.js';

const DATA_FILE = path.join(process.cwd(), 'produce_store.json');
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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
    console.warn('Could not read produce_store.json, using defaults:', err);
  }

  const seeded = INITIAL_PRODUCE_RECORDS.map((record, index) => normalizeRecord(record, index));
  saveProduceRecords(seeded);
  return seeded;
}

function saveProduceRecords(records: ProduceRecord[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write produce_store.json:', err);
  }
}

let produceRecords = loadProduceRecords();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Redirect legacy ?p=ID links to clean /p/ID paths (helps QR scans from old labels)
  app.get('/', (req, res, next) => {
    const queryId =
      req.query.p ||
      req.query.produceId ||
      req.query.id ||
      req.query.batch ||
      req.query.scan;

    if (typeof queryId === 'string' && queryId.trim()) {
      const normalized = normalizeProduceId(queryId);
      if (normalized.startsWith('AUR-') || /^[A-Z]{3,4}-\d{8}-\d{4}/i.test(normalized)) {
        return res.redirect(302, `/p/${encodeURIComponent(normalized)}`);
      }
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      recordsCount: produceRecords.length,
      dataFile: DATA_FILE,
      environment: isProduction ? 'production' : 'development',
    });
  });

  app.get('/api/produce', (_req, res) => {
    res.json(produceRecords);
  });

  app.get('/api/produce/search', (req, res) => {
    const query = (req.query.q || req.query.query || '').toString().trim().toLowerCase();
    if (!query) {
      return res.json(produceRecords);
    }

    const results = produceRecords.filter((r) => {
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
    let index = findProduceIndex(produceRecords, targetId);

    if (index < 0) {
      // If it follows Aurbana ID format (AUR-YYYY-CODE-TOKEN or CODE-YYYYMMDD-HHmm), auto-generate a passport record
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
          notes: 'Freshly registered batch identity.',
          image_url: cropCode === 'STR' 
            ? 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80'
            : cropCode === 'MAN'
            ? 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
        }, 0);

        produceRecords.unshift(autoCreated);
        saveProduceRecords(produceRecords);
        return res.json(autoCreated);
      }

      return res.status(404).json({ error: 'Produce not found', requestedId: req.params.id });
    }

    res.json(produceRecords[index]);
  });

  app.post('/api/produce', (req, res) => {
    try {
      const recordData = req.body;
      if (!recordData.produce_name || !recordData.produce_id) {
        return res.status(400).json({ error: 'Missing required produce fields (produce_name, produce_id)' });
      }

      const normalizedId = normalizeProduceId(recordData.produce_id);
      const existingIndex = findProduceIndex(produceRecords, normalizedId);

      const newRecord = normalizeRecord(
        {
          ...recordData,
          produce_id: normalizedId,
          id: recordData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          created_at: recordData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          scan_count: recordData.scan_count || 0,
        },
        existingIndex >= 0 ? existingIndex : 0
      );

      if (existingIndex >= 0) {
        newRecord.created_at = produceRecords[existingIndex].created_at;
        produceRecords[existingIndex] = newRecord;
      } else {
        produceRecords.unshift(newRecord);
      }

      saveProduceRecords(produceRecords);
      res.status(existingIndex >= 0 ? 200 : 201).json(newRecord);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Server error';
      console.error('Error creating produce record:', err);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/produce/:id/scan', (req, res) => {
    const targetId = normalizeProduceId(req.params.id || '');
    const index = findProduceIndex(produceRecords, targetId);

    if (index < 0) {
      return res.status(404).json({ error: 'Produce not found for scan', requestedId: req.params.id });
    }

    produceRecords[index].scan_count = (produceRecords[index].scan_count || 0) + 1;
    produceRecords[index].updated_at = new Date().toISOString();
    saveProduceRecords(produceRecords);

    res.json({ success: true, scan_count: produceRecords[index].scan_count });
  });

  app.patch('/api/produce/:id', (req, res) => {
    const targetId = normalizeProduceId(req.params.id || '');
    const index = findProduceIndex(produceRecords, targetId);

    if (index < 0) {
      return res.status(404).json({ error: 'Produce not found for update', requestedId: req.params.id });
    }

    produceRecords[index] = normalizeRecord(
      {
        ...produceRecords[index],
        ...req.body,
        produce_id: produceRecords[index].produce_id,
        id: produceRecords[index].id,
        updated_at: new Date().toISOString(),
      },
      index
    );

    saveProduceRecords(produceRecords);
    res.json(produceRecords[index]);
  });

  app.delete('/api/produce/:id', (req, res) => {
    const targetId = normalizeProduceId(req.params.id || '');
    const index = findProduceIndex(produceRecords, targetId);

    if (index < 0) {
      return res.status(404).json({ error: 'Produce not found for delete', requestedId: req.params.id });
    }

    const removed = produceRecords.splice(index, 1)[0];
    saveProduceRecords(produceRecords);
    res.json({ success: true, removed });
  });

  app.get('/api/farms', (_req, res) => {
    res.json(MOCK_FARMS);
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }

      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }

      res.status(404).send('Application build not found. Run npm run build first.');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aurbana Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
    console.log(`Database file: ${DATA_FILE} (${produceRecords.length} records)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
