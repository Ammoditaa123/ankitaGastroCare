import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  addBooking, 
  getBookingsByDate, 
  getBookingsByPhone, 
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  Booking 
} from '@/lib/db';
import { 
  sendBookingConfirmation, 
  sendBookingAlert,
  sendRescheduleProposal,
  sendBookingFinalConfirmation
} from '@/lib/email';
import { verifyToken } from '@/lib/auth';

// Helper to check admin authentication via secure session cookie
async function isAuthorizedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ankita_gastro_session')?.value;
    if (!token) return false;
    
    const payload = verifyToken(token);
    return payload !== null;
  } catch (err) {
    console.error('Auth verification error:', err);
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const phone = searchParams.get('phone');

  try {
    if (date) {
      const bookings = await getBookingsByDate(date);
      // Return list of taken slots directly for availability check
      // Only block slots that are pending or confirmed
      const takenSlots = bookings
        .filter(b => b.status === 'pending' || b.status === 'confirmed')
        .map(b => b.time);
      return NextResponse.json({ success: true, takenSlots });
    }

    if (phone) {
      const bookings = await getBookingsByPhone(phone);
      return NextResponse.json({ success: true, bookings });
    }

    // Default to return all bookings for Admin panel lookup (ADMIN ONLY)
    const isAdmin = await isAuthorizedAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const bookings = await getAllBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, reason, date, time, notes } = body;

    // Simple backend validation
    if (!name || !phone || !reason || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Check double-booking
    const existing = await getBookingsByDate(date);
    const isTaken = existing.some(b => (b.status === 'pending' || b.status === 'confirmed') && b.time === time);
    if (isTaken) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked.' },
        { status: 409 }
      );
    }

    // Prepare booking model
    const booking: Booking = {
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      name,
      phone,
      email: email || '',
      reason,
      date,
      time,
      notes: notes || '',
      status: 'pending'
    };

    // Save to SQLite
    await addBooking(booking);

    // Send email confirmations asynchronously to avoid blocking the HTTP response
    Promise.resolve().then(async () => {
      await sendBookingConfirmation(booking);
      await sendBookingAlert(booking);
    }).catch(err => {
      console.error('Asynchronous email trigger error:', err);
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Database insert error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Admin authorization check
    const isAdmin = await isAuthorizedAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, date, time } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID or target status.' },
        { status: 400 }
      );
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found.' },
        { status: 404 }
      );
    }

    // If rescheduling, check slot availability
    if (status === 'proposed' && date && time) {
      const existing = await getBookingsByDate(date);
      const isTaken = existing.some(b => b.id !== id && (b.status === 'pending' || b.status === 'confirmed') && b.time === time);
      if (isTaken) {
        return NextResponse.json(
          { success: false, error: 'Target time slot is already occupied.' },
          { status: 409 }
        );
      }
    }

    // Update SQLite record
    await updateBookingStatus(id, status, date, time);

    // Retrieve updated booking info
    const updatedBooking = await getBookingById(id);
    if (!updatedBooking) {
      return NextResponse.json({ success: false, error: 'Error loading updated booking.' });
    }

    // Dispatch email notifications asynchronously
    Promise.resolve().then(async () => {
      if (status === 'confirmed') {
        await sendBookingFinalConfirmation(updatedBooking);
      } else if (status === 'proposed') {
        await sendRescheduleProposal(updatedBooking);
      }
    }).catch(err => {
      console.error('Asynchronous update email trigger error:', err);
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error('Database patch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
