'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function PleaseVerifyPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleResend = async () => {
    // TODO: Créer l'endpoint /api/auth/resend-verification
    showToast("Un nouvel email de vérification a été envoyé.", "success");
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center bg-white dark:bg-black border-4 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
        <h1 className="text-4xl font-black text-black dark:text-white uppercase">Vérifiez votre email</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Un email de vérification a été envoyé à <span className="font-bold text-indigo-500">{user?.email}</span>.
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Veuillez cliquer sur le lien dans l&#39;email pour activer votre compte.
        </p>
        
        <div className="mt-8 space-y-4">
          <button 
            onClick={handleResend}
            className="w-full px-6 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase"
          >
            Renvoyer l&#39;email
          </button>
          <button 
            onClick={logout}
            className="text-sm font-bold text-gray-500 hover:underline"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
