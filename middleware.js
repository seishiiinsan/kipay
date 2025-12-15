// Middleware désactivé pour le moment pour simplifier le débogage.
// La protection se fait maintenant directement dans chaque route API.

import { NextResponse } from 'next/server';

export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // Ne rien intercepter
};
