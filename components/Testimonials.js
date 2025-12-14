'use client';

import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Voyageuse',
    content: "Enfin une app qui ne plante pas quand on est 15 en vacances ! Le mode hors-ligne m'a sauvé la vie au Pérou.",
    stars: 5,
  },
  {
    name: 'Thomas Dubois',
    role: 'Colocataire',
    content: "Le design est incroyable, ça change des applications bancaires ennuyeuses. Et les calculs sont justes.",
    stars: 5,
  },
  {
    name: 'Léa & Marc',
    role: 'Couple',
    content: "On l'utilise pour toutes nos courses communes. C'est super simple de savoir qui doit quoi à la fin du mois.",
    stars: 4,
  },
  {
    name: 'Karim B.',
    role: 'Organisateur',
    content: "J'organise des EVG/EVJF toute l'année. Kipay est le seul outil que j'arrive à faire utiliser à tout le monde.",
    stars: 5,
  },
  {
    name: 'Julie R.',
    role: 'Étudiante',
    content: "Fini les embrouilles pour le papier toilette ou les pâtes. On rentre tout dans l'app et ça calcule tout seul.",
    stars: 5,
  },
  {
    name: 'Alexandre P.',
    role: 'Freelance',
    content: "Je l'utilise même pour partager les frais de coworking avec mes collègues. Simple et efficace.",
    stars: 4,
  },
];

export default function Testimonials() {
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      if (!isDragging && scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        const oneSetWidth = scrollRef.current.scrollWidth / 3;
        if (scrollRef.current.scrollLeft >= oneSetWidth) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - oneSetWidth;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-white dark:bg-black border-b-2 border-black dark:border-white py-16 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white sm:text-5xl uppercase">
            Ils nous adorent
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 font-medium">
            Déjà adopté par des milliers de groupes.
          </p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className={`relative w-full overflow-x-hidden whitespace-nowrap ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="inline-flex">
          {infiniteTestimonials.map((t, i) => (
            <div 
              key={i} 
              className="w-[350px] mx-4 flex-shrink-0 flex flex-col justify-between bg-gray-50 dark:bg-gray-900 p-8 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] whitespace-normal"
            >
              <div>
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg key={starIndex} className={`h-6 w-6 ${starIndex < t.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">&#34;{t.content}&#34;</p>
              </div>
              <div className="flex items-center mt-auto pt-4 border-t-2 border-gray-100 dark:border-gray-800">
                <div className="h-10 w-10 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-lg border-2 border-transparent flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase truncate">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
