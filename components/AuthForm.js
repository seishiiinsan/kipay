'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthForm({ defaultMode = 'login', sideContent }) {
  const mode = defaultMode; 
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleTabClick = (targetMode) => {
    if (targetMode === mode) return;
    router.push(targetMode === 'login' ? '/login' : '/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        showToast('Ravi de vous revoir !', 'success');
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } else {
      const success = await register(name, email, password);
      if (success) {
        showToast('Bienvenue sur Kipay !', 'success');
        await login(email, password);
      } else {
        setError("Erreur lors de l'inscription. L'email existe peut-être déjà.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 bg-white dark:bg-black border-r-4 border-black dark:border-white relative z-10">
        <div className="mb-12">
          <Link href="/" className="text-5xl font-black tracking-tighter text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
            Kipay
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto">
          <div className="flex border-b-4 border-black dark:border-white mb-8">
            <button
              onClick={() => handleTabClick('login')}
              className={`flex-1 py-3 text-lg font-black uppercase tracking-wider transition-colors ${mode === 'login' ? 'text-indigo-600 border-b-4 border-indigo-600 -mb-1' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              Connexion
            </button>
            <button
              onClick={() => handleTabClick('register')}
              className={`flex-1 py-3 text-lg font-black uppercase tracking-wider transition-colors ${mode === 'register' ? 'text-indigo-600 border-b-4 border-indigo-600 -mb-1' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              Inscription
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label htmlFor="name" className="text-lg font-bold text-black dark:text-white uppercase">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'register'}
                  className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-lg font-bold text-black dark:text-white uppercase">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                placeholder="jean@exemple.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-lg font-bold text-black dark:text-white uppercase">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 font-bold text-center animate-pulse bg-red-50 p-3 border-2 border-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center px-8 py-4 border-2 border-black text-xl font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] dark:border-white dark:bg-white dark:text-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : "C'est parti !")}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-indigo-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 max-w-lg text-white animate-in fade-in slide-in-from-right-8 duration-500">
          {sideContent}
        </div>
      </div>
    </div>
  );
}
