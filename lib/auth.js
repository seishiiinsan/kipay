import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'votre-cle-secrete-tres-longue-et-securisee-a-changer-en-prod'
);

// Hachage du mot de passe
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Vérification du mot de passe
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Création du JWT
export async function signJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Le token expire dans 24h
    .sign(SECRET_KEY);
}

// Vérification du JWT
export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}
