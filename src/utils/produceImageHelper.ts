/**
 * Produce Image Auto-Matching Helper
 * Maps produce names and categories to high-resolution Unsplash photographs.
 */

export const PRODUCE_IMAGE_MAP: Record<string, string> = {
  beetroot: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80',
  beet: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80',
  broccoli: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80',
  strawberry: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80',
  cauliflower: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
  orange: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80',
  capsicum: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
  pepper: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
  peas: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&auto=format&fit=crop&q=80',
  'green peas': 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&auto=format&fit=crop&q=80',
  cucumber: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop&q=80',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80',
  ginger: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  watermelon: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=80',
  grapes: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  sweetcorn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&auto=format&fit=crop&q=80',
  lettuce: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&auto=format&fit=crop&q=80',
  mushroom: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=800&auto=format&fit=crop&q=80',
  zucchini: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=800&auto=format&fit=crop&q=80',
  radish: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80',
  chilli: 'https://images.unsplash.com/photo-1588879460405-b60992389e83?w=800&auto=format&fit=crop&q=80',
  chili: 'https://images.unsplash.com/photo-1588879460405-b60992389e83?w=800&auto=format&fit=crop&q=80',
};

const DEFAULT_FARM_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

/**
 * Returns a matching high-resolution photo for any produce name.
 * e.g. getProduceImage('Beetroot') -> Beetroot Unsplash photo URL
 */
export function getProduceImage(produceName: string, category?: string): string {
  if (!produceName || typeof produceName !== 'string') {
    return DEFAULT_FARM_IMAGE;
  }

  const clean = produceName.trim().toLowerCase();

  // Exact or substring match
  for (const [key, url] of Object.entries(PRODUCE_IMAGE_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return url;
    }
  }

  // Fallback based on category
  if (category === 'Fruit') {
    return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80';
  } else if (category === 'Root') {
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80';
  } else if (category === 'Leafy Green') {
    return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80';
  }

  return DEFAULT_FARM_IMAGE;
}
