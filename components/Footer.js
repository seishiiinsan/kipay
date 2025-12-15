import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b-4 border-black pb-12">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-black">Produit</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#features" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-black">Légal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/terms" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Conditions</Link></li>
              <li><Link href="/privacy" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-black">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/contact" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Nous écrire</Link></li>
              <li><a href="https://twitter.com/kipay" className="text-base font-bold text-gray-600 hover:text-black hover:underline">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-4xl md:text-6xl font-black text-center text-black uppercase">
          KIPAY © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
