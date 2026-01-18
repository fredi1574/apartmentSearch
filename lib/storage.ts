import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'apartments.json');

export interface Apartment {
  id: string;
  url: string;
  price: string;
  address: string;
  contactPhone?: string;
  entryDate?: string;
  hasParking?: boolean;
  rooms: number;
  floor: number;
  sqm: number;
  imageUrl: string;
  postedTime: string;
  description: string;
  addedAt: string;
  status: "active" | "visited" | "contacted" | "irrelevant";
  pros?: string[];
  cons?: string[];
  amenities?: Record<string, string>;
  location?: {
    lat: number;
    lng: number;
  };
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getApartments(): Promise<Apartment[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getApartment(id: string): Promise<Apartment | null> {
  const apartments = await getApartments();
  return apartments.find(a => a.id === id) || null;
}

export async function saveApartment(apartment: Apartment): Promise<void> {
  const apartments = await getApartments();
  // Check if exists - only for real URLs
  if (!apartment.url.startsWith('manual-') && apartments.some(a => a.url === apartment.url)) {
      console.log('Apartment already exists');
      return;
  }
  apartments.unshift(apartment);
  await fs.writeFile(DATA_FILE, JSON.stringify(apartments, null, 2));
}

export async function updateApartment(id: string, updates: Partial<Apartment>): Promise<void> {
    const apartments = await getApartments();
    const index = apartments.findIndex(a => a.id === id);
    if (index !== -1) {
        apartments[index] = { ...apartments[index], ...updates };
        await fs.writeFile(DATA_FILE, JSON.stringify(apartments, null, 2));
    }
}

export async function deleteApartment(id: string): Promise<void> {
    const apartments = await getApartments();
    const filtered = apartments.filter(a => a.id !== id);
    if (filtered.length !== apartments.length) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
    }
}
