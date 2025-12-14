'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus('success');
          // Rediriger vers le login après un court délai
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="max-w-md w-full text-center">
      {status === 'verifying' && (
        <h1 className="text-3xl font-black text-black dark:text-white uppercase animate-pulse">Vérification en cours...</h1>
      )}
      {status === 'success' && (
        <div className="bg-green-50 p-8 border-4 border-green-500">
          <h1 className="text-3xl font-black text-green-600 uppercase">Email vérifié !</h1>
          <p className="mt-4 text-lg text-green-800">Votre compte est maintenant actif. Vous allez être redirigé vers la page de connexion.</p>
          <Link href="/login" className="mt-6 inline-block font-bold text-green-600 hover:underline">Connexion</Link>
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 p-8 border-4 border-red-500">
          <h1 className="text-3xl font-black text-red-600 uppercase">Erreur</h1>
          <p className="mt-4 text-lg text-red-800">Le lien de vérification est invalide ou a expiré.</p>
          <Link href="/register" className="mt-6 inline-block font-bold text-red-600 hover:underline">S'inscrire à nouveau</Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-xl font-bold">Chargement...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
