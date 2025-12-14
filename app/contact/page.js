'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'loading', ''
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setToast(null);

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setToast({ message: 'Message envoyé avec succès !', type: 'success' });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      setToast({ message: 'Une erreur est survenue. Veuillez réessayer.', type: 'error' });
    } finally {
      setStatus('');
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col">
      <Header />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <main className="flex-grow">
        <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl uppercase">Contactez-nous</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Une question, une suggestion, ou juste envie de dire bonjour ? Remplissez le formulaire ci-dessous.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-lg font-bold text-black dark:text-white uppercase">Nom</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 block w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-lg font-bold text-black dark:text-white uppercase">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-lg font-bold text-black dark:text-white uppercase">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-2 block w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center px-8 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
