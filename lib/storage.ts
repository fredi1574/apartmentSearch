import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function getUserDataFile(userId: string) {
    return path.join(DATA_DIR, `apartments_${userId}.json`);
}

export interface Apartment {
  id: string;
  userId?: string;
  url: string;
  price: string;
  address: string;
  contactPhone?: string;
  contactName?: string;
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

export async function getApartments(userId: string): Promise<Apartment[]> {
  await ensureDataDir();
  const userFile = getUserDataFile(userId);
  try {
    const data = await fs.readFile(userFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getApartment(userId: string, id: string): Promise<Apartment | null> {
  const apartments = await getApartments(userId);
  return apartments.find(a => a.id === id) || null;
}

export async function saveApartment(userId: string, apartment: Apartment): Promise<void> {
  const apartments = await getApartments(userId);
  // Check if exists - only for real URLs
  if (!apartment.url.startsWith('manual-') && apartments.some(a => a.url === apartment.url)) {
      console.log('Apartment already exists');
      return;
  }
  const newApartment = { ...apartment, userId };
  apartments.unshift(newApartment);
  const userFile = getUserDataFile(userId);
  await fs.writeFile(userFile, JSON.stringify(apartments, null, 2));
}

export async function updateApartment(userId: string, id: string, updates: Partial<Apartment>): Promise<void> {
    const apartments = await getApartments(userId);
    const index = apartments.findIndex(a => a.id === id);
    if (index !== -1) {
        apartments[index] = { ...apartments[index], ...updates };
        const userFile = getUserDataFile(userId);
        await fs.writeFile(userFile, JSON.stringify(apartments, null, 2));
    }
}

export async function deleteApartment(userId: string, id: string): Promise<void> {
    const apartments = await getApartments(userId);
    const filtered = apartments.filter(a => a.id !== id);
    if (filtered.length !== apartments.length) {
        const userFile = getUserDataFile(userId);
        await fs.writeFile(userFile, JSON.stringify(filtered, null, 2));
    }
}
