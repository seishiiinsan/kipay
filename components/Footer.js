import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t-2 border-black dark:border-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pied de page</h2>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <Link href="/" className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
              Kipay
            </Link>
            <span className="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
            <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
              Les bons comptes font les bons amis.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Link href="/features" className="text-sm font-bold text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/how-it-works" className="text-sm font-bold text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
              Comment ça marche
            </Link>
            <Link href="/contact" className="text-sm font-bold text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs font-bold text-gray-400 uppercase">
            &copy; 2024 Kipay
          </div>
        </div>
      </div>
    </footer>
  );
}
