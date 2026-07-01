import { NextResponse } from 'next/server';
import { getBookingById, deleteBooking } from '@/lib/db';
import { sendBookingCancellation } from '@/lib/email';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if booking exists
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found.' },
        { status: 404 }
      );
    }

    // Delete booking from SQLite
    await deleteBooking(id);

    // Send emails asynchronously
    Promise.resolve().then(async () => {
      await sendBookingCancellation(booking);
    }).catch(err => {
      console.error('Asynchronous cancellation email trigger error:', err);
    });

    return NextResponse.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error: any) {
    console.error('Database deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
