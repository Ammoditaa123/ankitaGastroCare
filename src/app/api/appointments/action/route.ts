import { NextResponse } from 'next/server';
import { getBookingById, updateBookingStatus, deleteBooking } from '@/lib/db';
import { sendBookingFinalConfirmation, sendBookingCancellation } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action');

  if (!id || !action) {
    return new NextResponse(
      renderStyledHtml('Error', 'Invalid parameters. Please use the original link from your email.', 'error'),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    const booking = await getBookingById(id);

    if (action === 'accept') {
      if (!booking) {
        return new NextResponse(
          renderStyledHtml('Not Found', 'We could not find this appointment record. It may have been cancelled.', 'error'),
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }

      if (booking.status === 'confirmed') {
        return new NextResponse(
          renderStyledHtml('Already Confirmed', `Your appointment is already confirmed for <strong>${booking.date}</strong> at <strong>${booking.time}</strong>. We look forward to seeing you!`, 'success'),
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }

      // Update booking to confirmed
      await updateBookingStatus(id, 'confirmed');

      // Fetch updated info
      const updatedBooking = await getBookingById(id);
      if (updatedBooking) {
        // Send final confirmation email to patient
        Promise.resolve().then(async () => {
          await sendBookingFinalConfirmation(updatedBooking);
        }).catch(err => {
          console.error('Error sending confirmation on accept:', err);
        });
      }

      return new NextResponse(
        renderStyledHtml('Appointment Confirmed', `Thank you! Your appointment has been successfully confirmed for <strong>${booking.date}</strong> at <strong>${booking.time}</strong>.`, 'success'),
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    } 
    
    if (action === 'decline') {
      if (!booking) {
        return new NextResponse(
          renderStyledHtml('Cancelled', 'This appointment has already been cancelled.', 'info'),
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }

      // Delete the booking from SQLite
      await deleteBooking(id);

      // Send cancellation email to clinic and patient
      Promise.resolve().then(async () => {
        await sendBookingCancellation(booking);
      }).catch(err => {
        console.error('Error sending cancellation on decline:', err);
      });

      return new NextResponse(
        renderStyledHtml('Appointment Cancelled', 'You have declined the rescheduling proposal. Your appointment request has been cancelled and the slot released.', 'info'),
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return new NextResponse(
      renderStyledHtml('Error', 'Unsupported action requested.', 'error'),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Action route error:', error);
    return new NextResponse(
      renderStyledHtml('Error', 'An internal server error occurred while processing your request.', 'error'),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

function renderStyledHtml(title: string, message: string, type: 'success' | 'error' | 'info'): string {
  const iconSvg = 
    type === 'success' 
      ? `<svg style="width:64px;height:64px;color:#3e7a52;margin:0 auto 16px auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
      : type === 'error'
      ? `<svg style="width:64px;height:64px;color:#a23a2e;margin:0 auto 16px auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
      : `<svg style="width:64px;height:64px;color:#bd5e2c;margin:0 auto 16px auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Ankita Gastro Care</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f7f4ee;
          color: #1b1b19;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          background-color: #ffffff;
          border: 1px solid rgba(27,27,25,0.1);
          border-radius: 4px;
          padding: 40px 24px;
          text-align: center;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(9, 53, 48, 0.04);
        }
        .header {
          color: #093530;
          font-family: Georgia, serif;
          font-size: 24px;
          margin-bottom: 12px;
        }
        .message {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(27,27,25,0.8);
          margin-bottom: 24px;
        }
        .btn {
          display: inline-block;
          padding: 10px 24px;
          background-color: #093530;
          color: #f7f4ee;
          text-decoration: none;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 2px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #bd5e2c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${iconSvg}
        <h2 class="header">${title}</h2>
        <div class="message">${message}</div>
        <a href="/" class="btn">Go to Homepage</a>
      </div>
    </body>
    </html>
  `;
}
