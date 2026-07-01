import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'fallback_secret_for_ankita_gastro_auth';

export function createToken(payload: object, expiryHours = 24): string {
  const expiry = Date.now() + expiryHours * 60 * 60 * 1000;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify({ ...payload, exp: expiry })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${data}`)
    .digest('base64url');
    
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [header, data, signature] = parts;
  
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${data}`)
    .digest('base64url');
    
  if (signature !== expectedSignature) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}
