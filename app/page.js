import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import AppShowcase from '@/components/AppShowcase';
import Marquee from '@/components/Marquee';

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase">
              Les bons comptes <br/> font les bons amis.
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-bold text-gray-700 max-w-3xl mx-auto">
              L&#39;app de dépenses partagées qui ne triche pas. Simple. Brut. Efficace.
            </p>
            <div className="mt-12">
              <Link 
                href="/register" 
                className="inline-block px-12 py-5 border-4 border-black bg-indigo-600 text-white font-black text-2xl uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-[8px_8px_0px_0px_#000] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]"
              >
                Créer un groupe
              </Link>
            </div>
          </div>
        </section>

        {/* App Showcase */}
        <AppShowcase />

        {/* Features Section */}
        <Features />

        {/* Social Proof Marquee */}
        <Marquee />

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Final */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600 border-t-4 border-black text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter transform rotate-1">
            Prêt à simplifier vos comptes ?
          </h2>
          <Link 
            href="/register" 
            className="inline-block px-12 py-6 border-4 border-black bg-white text-black font-black text-2xl uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[12px_12px_0px_0px_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
          >
            C&#39;est parti !
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
