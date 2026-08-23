export type ProduceCondition = 'Excellent' | 'Good' | 'Average' | 'Poor';
export type ProduceStatus = 'Active' | 'Delivered' | 'Deactivated' | 'Archived';
export type ProduceCategory = 'Vegetable' | 'Fruit' | 'Herb' | 'Leafy Green' | 'Root' | 'Other';

export interface TraceabilityStep {
  title: string;
  date: string;
  location: string;
  handler?: string;
  notes?: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface ProduceRecord {
  id: string;
  produce_id: string; // e.g. AUR-2026-TOM-8F42K
  produce_name: string; // e.g. Tomato
  variety?: string; // e.g. Roma Vine-Ripened
  category: ProduceCategory;
  age_days: number;
  condition: ProduceCondition;
  origin: string; // e.g. Green Valley Farm, Punjab
  supplier_name?: string;
  farmer_name?: string;
  harvest_date: string;
  collection_date: string;
  registration_date: string;
  batch_number: string;
  quantity?: string; // e.g. 450 kg (18 Crates)
  storage_location?: string; // e.g. Cold Unit B-04 (4°C)
  notes?: string;
  image_url?: string;
  status: ProduceStatus;
  created_at: string;
  updated_at: string;
  scan_count: number;
  grade?: 'Grade A+' | 'Grade A' | 'Grade B' | 'Standard';
  shelf_life_days?: number;
  temp_celsius?: number;
  journey?: TraceabilityStep[];
}

export interface FarmPartner {
  id: string;
  name: string;
  region: string;
  state: string;
  primary_crops: string[];
  certified_organic: boolean;
  total_batches: number;
  partner_since: string;
  contact_person: string;
  avatar: string;
}

export interface UserSession {
  id: string;
  name: string;
  role: 'Quality Officer' | 'Facility Manager' | 'Admin' | 'Supplier Partner';
  email: string;
  facility: string;
  avatar: string;
}
