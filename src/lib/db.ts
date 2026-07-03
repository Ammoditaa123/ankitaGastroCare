import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'proposed';
  created_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: string;
}

// Check if we are running with a Vercel Postgres/Neon instance
const isVercel = process.env.VERCEL === '1';
const isPostgresEnabled = isVercel || !!process.env.POSTGRES_URL || !!process.env.DATABASE_URL;

// If Postgres is enabled, verify POSTGRES_URL is populated for the Vercel Postgres client
if (isPostgresEnabled && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL || '';
}

// Local JSON File Database Fallback (for local development with zero config)
const dataDir = path.join(process.cwd(), 'data');
const bookingsPath = path.join(dataDir, 'bookings.json');
const contactsPath = path.join(dataDir, 'contacts.json');

function readJSON<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJSON<T>(filePath: string, data: T[]): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Database initialization helper for Vercel Postgres
let tablesInitialized = false;

async function initPostgresTables(): Promise<void> {
  if (!isPostgresEnabled || tablesInitialized) return;

  try {
    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        reason VARCHAR(255) NOT NULL,
        "date" VARCHAR(255) NOT NULL,
        "time" VARCHAR(255) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    tablesInitialized = true;
    console.log('Vercel Postgres tables initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Vercel Postgres tables:', error);
    throw error;
  }
}

// Database Operations Wrapper
export async function addBooking(booking: Omit<Booking, 'created_at'>): Promise<void> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    await sql`
      INSERT INTO bookings (id, name, phone, email, reason, "date", "time", notes, status)
      VALUES (${booking.id}, ${booking.name}, ${booking.phone}, ${booking.email || ''}, ${booking.reason}, ${booking.date}, ${booking.time}, ${booking.notes || ''}, ${booking.status || 'pending'})
    `;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    bookings.push({
      ...booking,
      status: booking.status || 'pending',
      created_at: new Date().toISOString()
    });
    writeJSON(bookingsPath, bookings);
  }
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    const { rows } = await sql<Booking>`
      SELECT * FROM bookings WHERE "date" = ${date}
    `;
    return rows;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    return bookings.filter(b => b.date === date);
  }
}

export async function getBookingsByPhone(phone: string): Promise<Booking[]> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    const cleanPhone = phone.replace(/\s+/g, '');
    const { rows } = await sql<Booking>`
      SELECT * FROM bookings WHERE REPLACE(phone, ' ', '') LIKE ${'%' + cleanPhone + '%'}
    `;
    return rows;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    const cleanPhone = phone.replace(/\s+/g, '');
    return bookings.filter(b => b.phone.replace(/\s+/g, '').includes(cleanPhone));
  }
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    const { rows } = await sql<Booking>`
      SELECT * FROM bookings WHERE id = ${id}
    `;
    return rows[0] || undefined;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    return bookings.find(b => b.id === id);
  }
}

export async function deleteBooking(id: string): Promise<void> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    await sql`
      DELETE FROM bookings WHERE id = ${id}
    `;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    const filtered = bookings.filter(b => b.id !== id);
    writeJSON(bookingsPath, filtered);
  }
}

export async function addContact(contact: Contact): Promise<void> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    await sql`
      INSERT INTO contacts (id, name, email, phone, message)
      VALUES (${contact.id}, ${contact.name}, ${contact.email}, ${contact.phone || ''}, ${contact.message})
    `;
  } else {
    const contacts = readJSON<Contact>(contactsPath);
    contacts.push({
      ...contact,
      created_at: new Date().toISOString()
    });
    writeJSON(contactsPath, contacts);
  }
}

export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'proposed',
  date?: string,
  time?: string
): Promise<void> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    if (date && time) {
      await sql`
        UPDATE bookings 
        SET status = ${status}, "date" = ${date}, "time" = ${time} 
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE bookings 
        SET status = ${status} 
        WHERE id = ${id}
      `;
    }
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    const updated = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(date && time ? { date, time } : {})
        };
      }
      return b;
    });
    writeJSON(bookingsPath, updated);
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  if (isPostgresEnabled) {
    await initPostgresTables();
    const { rows } = await sql<Booking>`
      SELECT * FROM bookings ORDER BY "date" DESC, "time" ASC
    `;
    return rows;
  } else {
    const bookings = readJSON<Booking>(bookingsPath);
    return bookings.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return a.time.localeCompare(b.time);
    });
  }
}
