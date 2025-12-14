import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Exclure les routes d'authentification de la protection
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Protéger toutes les autres routes API
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Missing token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyJWT(token);

    if (!payload) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Ajouter les infos de l'utilisateur à la requête pour un accès facile dans les routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', payload.userId);
    requestHeaders.set('X-User-Email', payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configuration du matcher pour spécifier quelles routes sont concernées par le middleware
export const config = {
  matcher: '/api/:path*',
};
