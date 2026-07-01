import { NextResponse } from 'next/server';
import { addContact, Contact } from '@/lib/db';
import { sendContactAlert } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Backend validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const contact: Contact = {
      id: 'contact-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone: phone || '',
      message
    };

    // Save in SQLite
    await addContact(contact);

    // Send email alert to clinic reception asynchronously
    Promise.resolve().then(async () => {
      await sendContactAlert(contact);
    }).catch(err => {
      console.error('Asynchronous contact email trigger error:', err);
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error: any) {
    console.error('Database contact save error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
