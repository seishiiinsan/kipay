import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AppShowcase from '@/components/AppShowcase';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <Header />
      <main>
        <RevealOnScroll>
          <Hero />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <AppShowcase />
        </RevealOnScroll>

        <RevealOnScroll>
          <Features />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <HowItWorks />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Testimonials />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <FAQ />
        </RevealOnScroll>
      </main>
      <Footer />
    </div>
  );
}
