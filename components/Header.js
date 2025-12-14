import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-black w-full px-4 sm:px-6 lg:px-8 border-b-2 border-black dark:border-white">
      <div className="flex items-center justify-between h-20">
        <div className="flex-shrink-0">
          <Link href="/" className="text-3xl font-black tracking-tighter text-black dark:text-white uppercase">
            Kipay
          </Link>
        </div>
        <nav className="hidden md:flex md:space-x-8">
          <Link href="/features" className="text-lg font-bold text-black hover:underline decoration-2 underline-offset-4 dark:text-white">
            Fonctionnalités
          </Link>
          <Link href="/how-it-works" className="text-lg font-bold text-black hover:underline decoration-2 underline-offset-4 dark:text-white">
            Comment ça marche
          </Link>
          <Link href="/contact" className="text-lg font-bold text-black hover:underline decoration-2 underline-offset-4 dark:text-white">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-lg font-bold text-black hover:underline decoration-2 underline-offset-4 dark:text-white">
            Connexion
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-6 py-2 border-2 border-black text-lg font-bold text-white bg-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            S&#39;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
