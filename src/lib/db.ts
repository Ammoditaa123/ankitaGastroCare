import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed';
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

let dbInstance: Database | null = null;

export async function getDbConnection(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const dbDirectory = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  const dbPath = path.join(dbDirectory, 'clinic.db');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Initialize Tables
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      reason TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return dbInstance;
}

export async function addBooking(booking: Omit<Booking, 'status' | 'created_at'> & { status?: string }): Promise<void> {
  const db = await getDbConnection();
  await db.run(
    `INSERT INTO bookings (id, name, phone, email, reason, date, time, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.id,
      booking.name,
      booking.phone,
      booking.email || '',
      booking.reason,
      booking.date,
      booking.time,
      booking.notes || '',
      booking.status || 'pending'
    ]
  );
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const db = await getDbConnection();
  return db.all<Booking[]>('SELECT * FROM bookings WHERE date = ?', [date]);
}

export async function getBookingsByPhone(phone: string): Promise<Booking[]> {
  const db = await getDbConnection();
  const cleanPhone = phone.replace(/\s+/g, '');
  return db.all<Booking[]>('SELECT * FROM bookings WHERE replace(phone, " ", "") LIKE ?', [`%${cleanPhone}%`]);
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const db = await getDbConnection();
  return db.get<Booking>('SELECT * FROM bookings WHERE id = ?', [id]);
}

export async function deleteBooking(id: string): Promise<void> {
  const db = await getDbConnection();
  await db.run('DELETE FROM bookings WHERE id = ?', [id]);
}

export async function addContact(contact: Contact): Promise<void> {
  const db = await getDbConnection();
  await db.run(
    `INSERT INTO contacts (id, name, email, phone, message)
     VALUES (?, ?, ?, ?, ?)`,
    [
      contact.id,
      contact.name,
      contact.email,
      contact.phone || '',
      contact.message
    ]
  );
}

export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'proposed',
  date?: string,
  time?: string
): Promise<void> {
  const db = await getDbConnection();
  if (date && time) {
    await db.run(
      'UPDATE bookings SET status = ?, date = ?, time = ? WHERE id = ?',
      [status, date, time, id]
    );
  } else {
    await db.run(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await getDbConnection();
  return db.all<Booking[]>('SELECT * FROM bookings ORDER BY date DESC, time ASC');
}
