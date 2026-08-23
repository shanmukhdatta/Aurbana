import { ProduceRecord, FarmPartner, UserSession } from '../types';

export const INITIAL_PRODUCE_RECORDS: ProduceRecord[] = [
  {
    id: 'prod-001',
    produce_id: 'AUR-2026-TOM-8F42K',
    produce_name: 'Tomato',
    variety: 'Roma Vine-Ripened',
    category: 'Vegetable',
    age_days: 2,
    condition: 'Excellent',
    origin: 'Green Valley Farm, Punjab',
    supplier_name: 'Green Valley Agri-Cooperative',
    farmer_name: 'Harpreet Singh',
    harvest_date: '2026-08-21',
    collection_date: '2026-08-22',
    registration_date: '2026-08-22',
    batch_number: 'BATCH-2026-TOM-114',
    quantity: '450 kg (18 crates)',
    storage_location: 'Hub 3 - Cold Zone A (12°C)',
    notes: 'Firm texture, deep crimson color, zero surface blemishes. Hand-harvested at peak brix.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-22T08:30:00Z',
    updated_at: '2026-08-23T06:15:00Z',
    scan_count: 142,
    grade: 'Grade A+',
    shelf_life_days: 10,
    temp_celsius: 12,
    journey: [
      {
        title: 'Harvested',
        date: '21 Aug 2026, 06:30 AM',
        location: 'Field Sector 4, Green Valley Farm, Punjab',
        handler: 'Harpreet Singh (Lead Grower)',
        notes: 'Hand-picked in early morning mist to preserve firmness.',
        status: 'completed'
      },
      {
        title: 'Collected & Graded',
        date: '22 Aug 2026, 09:15 AM',
        location: 'Ludhiana Ag Hub Collection Center',
        handler: 'Aurbana Transit Logistics',
        notes: 'Graded Grade A+ after optical sorting and brix test (4.8%).',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '22 Aug 2026, 02:40 PM',
        location: 'Aurbana Agri-Facility North 1',
        handler: 'Shanmukh Datta (Quality Officer)',
        notes: 'Digital identity generated. Thermal QR crate tags applied.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 07:00 AM',
        location: 'Metro Distribution & Retail Centers',
        notes: 'Produce active in distribution network. Scannable by retailers and consumers.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-002',
    produce_id: 'AUR-2026-POT-92JDQ',
    produce_name: 'Potato',
    variety: 'Kufri Jyoti Hill Potato',
    category: 'Root',
    age_days: 4,
    condition: 'Good',
    origin: 'Sunrise Farm, Himachal Pradesh',
    supplier_name: 'Himalayan Organics Syndicate',
    farmer_name: 'Ramesh Thakur',
    harvest_date: '2026-08-19',
    collection_date: '2026-08-21',
    registration_date: '2026-08-21',
    batch_number: 'BATCH-2026-POT-882',
    quantity: '1,200 kg (40 sacks)',
    storage_location: 'Ambient Warehouse Bay 4 (15°C)',
    notes: 'Even skin texture, low sugar content ideal for boiling and light frying.',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-21T10:00:00Z',
    updated_at: '2026-08-23T04:20:00Z',
    scan_count: 89,
    grade: 'Grade A',
    shelf_life_days: 35,
    temp_celsius: 14,
    journey: [
      {
        title: 'Harvested',
        date: '19 Aug 2026, 07:00 AM',
        location: 'Terraced Hills, Solan, Himachal Pradesh',
        handler: 'Ramesh Thakur',
        notes: 'Tubers harvested after natural foliage drying.',
        status: 'completed'
      },
      {
        title: 'Cured & Collected',
        date: '21 Aug 2026, 11:30 AM',
        location: 'Shimla Transit Depot',
        handler: 'Himalayan Organics',
        notes: 'Skin cured under controlled humidity to prevent moisture loss.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '21 Aug 2026, 04:00 PM',
        location: 'Aurbana Hub North',
        handler: 'Rajesh Mehra (Inspector)',
        notes: 'Tagged with Aurbana identity.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 08:00 AM',
        location: 'Central Mandi Wholesale Hub',
        notes: 'Dispatched to retail distributors.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-003',
    produce_id: 'AUR-2026-MAN-4K21P',
    produce_name: 'Mango',
    variety: 'Ratnagiri Alphonso (Hapus)',
    category: 'Fruit',
    age_days: 3,
    condition: 'Excellent',
    origin: 'Ratnagiri Orchards, Maharashtra',
    supplier_name: 'Konkan Fruit Growers Guild',
    farmer_name: 'Anand Patil',
    harvest_date: '2026-08-20',
    collection_date: '2026-08-21',
    registration_date: '2026-08-22',
    batch_number: 'BATCH-2026-MAN-041',
    quantity: '320 kg (25 wooden crates)',
    storage_location: 'Ripening Room 2 (18°C / 85% RH)',
    notes: 'Geographical Indication (GI) tagged Ratnagiri origin. Rich saffron pulp, naturally ripened with hay.',
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-22T09:10:00Z',
    updated_at: '2026-08-23T05:00:00Z',
    scan_count: 276,
    grade: 'Grade A+',
    shelf_life_days: 7,
    temp_celsius: 18,
    journey: [
      {
        title: 'Harvested',
        date: '20 Aug 2026, 05:45 AM',
        location: 'Coastal Grove, Ratnagiri, Maharashtra',
        handler: 'Anand Patil',
        notes: 'Plucked with 2-inch stalk to prevent sap injury.',
        status: 'completed'
      },
      {
        title: 'Washed & Graded',
        date: '21 Aug 2026, 10:00 AM',
        location: 'Konkan Packhouse Facility',
        handler: 'Konkan Fruit Guild',
        notes: 'Passed hot water immersion test for phytosanitary clearance.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '22 Aug 2026, 01:20 PM',
        location: 'Aurbana Western Logistics Hub',
        handler: 'Pooja Kulkarni (Quality Lead)',
        notes: 'Unique Aurbana QR code applied to each crate & premium box.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 06:30 AM',
        location: 'Gourmet Produce Retail Network',
        notes: 'Live on consumer scan terminals.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-004',
    produce_id: 'AUR-2026-CAR-7H31X',
    produce_name: 'Carrot',
    variety: 'Nilgiri Sweet Orange',
    category: 'Root',
    age_days: 1,
    condition: 'Excellent',
    origin: 'Blue Hills Farm, Ooty, Tamil Nadu',
    supplier_name: 'Nilgiri Highland Growers',
    farmer_name: 'K. Subramaniam',
    harvest_date: '2026-08-22',
    collection_date: '2026-08-22',
    registration_date: '2026-08-23',
    batch_number: 'BATCH-2026-CAR-309',
    quantity: '600 kg (24 crates)',
    storage_location: 'Cold Cell 1 (4°C / 95% RH)',
    notes: 'Crisp crunch, high carotene density. Washed with purified mountain stream water.',
    image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-23T06:00:00Z',
    updated_at: '2026-08-23T07:10:00Z',
    scan_count: 64,
    grade: 'Grade A+',
    shelf_life_days: 14,
    temp_celsius: 4,
    journey: [
      {
        title: 'Harvested',
        date: '22 Aug 2026, 06:00 AM',
        location: 'Elevation 2,200m, Ooty, Tamil Nadu',
        handler: 'K. Subramaniam',
        notes: 'Harvested at crisp morning temperature.',
        status: 'completed'
      },
      {
        title: 'Hydro-cooled & Packed',
        date: '22 Aug 2026, 11:00 AM',
        location: 'Ooty Highland Packhouse',
        handler: 'Nilgiri Highland Logistics',
        notes: 'Pre-cooled within 4 hours of harvest.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '23 Aug 2026, 06:15 AM',
        location: 'Aurbana South Hub, Bengaluru',
        handler: 'Divya Nair (Quality Officer)',
        notes: 'Batch tagged and verified.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 07:30 AM',
        location: 'Fresh Supermarket Outlets',
        notes: 'Delivered in temperature-controlled reefer vehicle.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-005',
    produce_id: 'AUR-2026-BAN-5L90M',
    produce_name: 'Banana',
    variety: 'Grand Naine Cavendish',
    category: 'Fruit',
    age_days: 2,
    condition: 'Good',
    origin: 'Kaveri Basin Plantation, Jalgaon, Maharashtra',
    supplier_name: 'Jalgaon Banana Export Syndicate',
    farmer_name: 'Deepak Chaudhari',
    harvest_date: '2026-08-21',
    collection_date: '2026-08-22',
    registration_date: '2026-08-22',
    batch_number: 'BATCH-2026-BAN-512',
    quantity: '850 kg (42 corrugated boxes)',
    storage_location: 'Banana Ripening Bay 3 (14°C)',
    notes: 'Uniform bunch size, calibrated finger thickness. Color stage 4 (turning yellow).',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-22T11:00:00Z',
    updated_at: '2026-08-23T05:40:00Z',
    scan_count: 112,
    grade: 'Grade A',
    shelf_life_days: 6,
    temp_celsius: 14,
    journey: [
      {
        title: 'Harvested',
        date: '21 Aug 2026, 07:15 AM',
        location: 'Riverbank Sector, Jalgaon',
        handler: 'Deepak Chaudhari',
        notes: 'Cut using protective foam pads to avoid bruising.',
        status: 'completed'
      },
      {
        title: 'De-handed & Washed',
        date: '22 Aug 2026, 09:30 AM',
        location: 'Jalgaon Central Packhouse',
        handler: 'Export Syndicate Quality Team',
        notes: 'Treated with food-grade alum wash and vacuum packed.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '22 Aug 2026, 03:00 PM',
        location: 'Aurbana Western Logistics Hub',
        handler: 'Pooja Kulkarni',
        notes: 'Identity generated and QR codes affixed.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 08:15 AM',
        location: 'City Distribution Network',
        notes: 'Distributed to supermarkets.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-006',
    produce_id: 'AUR-2026-SPN-1A88Z',
    produce_name: 'Spinach',
    variety: 'Baby Leaf Hydroponic',
    category: 'Leafy Green',
    age_days: 0,
    condition: 'Excellent',
    origin: 'Evergreen Hydroponics, Nashik, Maharashtra',
    supplier_name: 'Evergreen Controlled Environment Farms',
    farmer_name: 'Sunil Jagtap',
    harvest_date: '2026-08-23',
    collection_date: '2026-08-23',
    registration_date: '2026-08-23',
    batch_number: 'BATCH-2026-SPN-009',
    quantity: '180 kg (60 climate crates)',
    storage_location: 'Cold Air Cell 0 (3°C)',
    notes: 'Harvested today at 05:00 AM. Pesticide-free greenhouse cultivated, nutrient film technique.',
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-23T06:30:00Z',
    updated_at: '2026-08-23T07:15:00Z',
    scan_count: 51,
    grade: 'Grade A+',
    shelf_life_days: 5,
    temp_celsius: 3,
    journey: [
      {
        title: 'Harvested',
        date: '23 Aug 2026, 05:00 AM',
        location: 'Hydro Greenhouse 2, Nashik',
        handler: 'Sunil Jagtap',
        notes: 'Cut-to-order morning harvest under climate control.',
        status: 'completed'
      },
      {
        title: 'Cleaned & Chilled',
        date: '23 Aug 2026, 06:00 AM',
        location: 'On-site Cleanroom Packhouse',
        handler: 'Evergreen QA',
        notes: 'Ozonated water wash & rapid vacuum cooling.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '23 Aug 2026, 06:45 AM',
        location: 'Aurbana Express Transit Depot',
        handler: 'Kavita Sharma',
        notes: 'Registered within 2 hours of harvest.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: '23 Aug 2026, 07:30 AM',
        location: 'Urban Direct Grocery Deliveries',
        notes: 'Freshly available on consumer tables today.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'prod-007',
    produce_id: 'AUR-2026-STR-99999',
    produce_name: 'Strawberry',
    variety: 'Highland Organic Sweet',
    category: 'Fruit',
    age_days: 1,
    condition: 'Excellent',
    origin: 'Ooty Organic Farms, Tamil Nadu',
    supplier_name: 'Nilgiri Highland Produce Co.',
    farmer_name: 'K. Subramaniam',
    harvest_date: '2026-08-23',
    collection_date: '2026-08-23',
    registration_date: '2026-08-24',
    batch_number: 'BATCH-2026-STR-999',
    quantity: '250 kg (50 trays)',
    storage_location: 'Cold Air Cell 1 (2°C / 90% RH)',
    notes: 'Sun-ripened organic berries, hand-picked at 06:00 AM, high natural aroma & sweetness.',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    created_at: '2026-08-24T00:00:00Z',
    updated_at: '2026-08-24T00:00:00Z',
    scan_count: 98,
    grade: 'Grade A+',
    shelf_life_days: 5,
    temp_celsius: 2,
    journey: [
      {
        title: 'Harvested',
        date: '23 Aug 2026, 06:00 AM',
        location: 'Elevation 2,200m, Ooty, Tamil Nadu',
        handler: 'K. Subramaniam',
        notes: 'Hand-picked into clamshell trays at peak brix sweetness.',
        status: 'completed'
      },
      {
        title: 'Pre-cooled & Inspected',
        date: '23 Aug 2026, 10:00 AM',
        location: 'Highland Cold Transit Depot',
        handler: 'Nilgiri Highland Logistics',
        notes: 'Pre-chilled to 2°C to prevent respiration loss.',
        status: 'completed'
      },
      {
        title: 'Registered with Aurbana',
        date: '24 Aug 2026, 07:00 AM',
        location: 'Aurbana South Identity Registry',
        handler: 'Divya Nair (Quality Officer)',
        notes: 'Digital passport issued. Assigned ID AUR-2026-STR-99999.',
        status: 'completed'
      },
      {
        title: 'Available for Verification',
        date: 'Active in Real-Time',
        location: 'Public Aurbana Verification Portal',
        notes: 'Scannable by distributors, retail grocers, and consumers.',
        status: 'completed'
      }
    ]
  }
];

export const MOCK_FARMS: FarmPartner[] = [
  {
    id: 'farm-01',
    name: 'Green Valley Farm',
    region: 'Ludhiana District',
    state: 'Punjab',
    primary_crops: ['Tomato', 'Cauliflower', 'Green Peas', 'Capsicum'],
    certified_organic: true,
    total_batches: 218,
    partner_since: 'March 2024',
    contact_person: 'Harpreet Singh',
    avatar: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'farm-02',
    name: 'Sunrise Farm',
    region: 'Solan Foothills',
    state: 'Himachal Pradesh',
    primary_crops: ['Potato', 'Apple', 'Garlic', 'Ginger'],
    certified_organic: false,
    total_batches: 164,
    partner_since: 'June 2024',
    contact_person: 'Ramesh Thakur',
    avatar: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'farm-03',
    name: 'Ratnagiri Orchards',
    region: 'Konkan Coastline',
    state: 'Maharashtra',
    primary_crops: ['Alphonso Mango', 'Cashew', 'Kokum'],
    certified_organic: true,
    total_batches: 312,
    partner_since: 'January 2024',
    contact_person: 'Anand Patil',
    avatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'farm-04',
    name: 'Blue Hills Farm',
    region: 'Ooty Nilgiri Range',
    state: 'Tamil Nadu',
    primary_crops: ['Carrot', 'Beetroot', 'Broccoli', 'Zucchini'],
    certified_organic: true,
    total_batches: 195,
    partner_since: 'September 2024',
    contact_person: 'K. Subramaniam',
    avatar: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'farm-05',
    name: 'Evergreen Hydroponics',
    region: 'Dindori Valley',
    state: 'Maharashtra',
    primary_crops: ['Baby Spinach', 'Butterhead Lettuce', 'Basil', 'Cherry Tomatoes'],
    certified_organic: true,
    total_batches: 140,
    partner_since: 'November 2024',
    contact_person: 'Sunil Jagtap',
    avatar: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_USERS: UserSession[] = [
  {
    id: 'usr-1',
    name: 'Shanmukh Datta',
    role: 'Quality Officer',
    email: 'shanmukh.datta@aurbana.com',
    facility: 'Aurbana Hub North 1 (Ludhiana)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Rajesh Mehra',
    role: 'Facility Manager',
    email: 'rajesh.mehra@aurbana.com',
    facility: 'Aurbana Western Logistics Hub (Mumbai)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Divya Nair',
    role: 'Admin',
    email: 'divya.nair@aurbana.com',
    facility: 'Aurbana HQ Central (Bengaluru)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  }
];

export const PRODUCE_PRESETS = [
  { name: 'Tomato', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 10 },
  { name: 'Beetroot', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 20 },
  { name: 'Broccoli', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 9 },
  { name: 'Strawberry', category: 'Fruit' as const, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 5 },
  { name: 'Potato', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 30 },
  { name: 'Onion', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 28 },
  { name: 'Carrot', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 14 },
  { name: 'Cauliflower', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 8 },
  { name: 'Spinach', category: 'Leafy Green' as const, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 5 },
  { name: 'Apple', category: 'Fruit' as const, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 21 },
  { name: 'Mango', category: 'Fruit' as const, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 7 },
  { name: 'Banana', category: 'Fruit' as const, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 6 },
  { name: 'Orange', category: 'Fruit' as const, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 14 },
  { name: 'Capsicum', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 10 },
  { name: 'Green Peas', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 7 },
  { name: 'Cucumber', category: 'Vegetable' as const, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 9 },
  { name: 'Garlic', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 60 },
  { name: 'Ginger', category: 'Root' as const, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 45 },
  { name: 'Mushroom', category: 'Fungi' as const, image: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=800&auto=format&fit=crop&q=80', defaultShelfLife: 7 }
];
