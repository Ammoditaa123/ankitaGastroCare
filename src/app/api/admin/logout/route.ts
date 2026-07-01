import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the session cookie
  response.cookies.delete('ankita_gastro_session');

  return response;
}

export async function GET() {
  // Support GET logout for simple hyperlink clicks if needed
  const response = NextResponse.redirect(new URL('/admin/login', process.env.APP_URL || 'http://localhost:3000'));
  response.cookies.delete('ankita_gastro_session');
  return response;
}
