import { jwtVerify } from 'jose';

export async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Fallback pour éviter l'erreur si .env n'est pas chargé
    const secretKey = process.env.JWT_SECRET_KEY || 'votre-cle-secrete-tres-longue-et-securisee-a-changer-en-prod';
    
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload && payload.userId) {
      return payload.userId;
    }
    
    return null;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}
