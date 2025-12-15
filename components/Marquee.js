'use client';

import { useState, useEffect } from 'react';

const MarqueeContent = ({ marqueeText }) => (
  <>
    <span className="text-2xl font-black text-white uppercase mx-8 whitespace-nowrap">{marqueeText}</span>
    <span className="text-2xl font-black text-white uppercase mx-8 whitespace-nowrap">Gratuit</span>
    <span className="text-2xl font-black text-white uppercase mx-8 whitespace-nowrap">Sans pub</span>
    <span className="text-2xl font-black text-white uppercase mx-8 whitespace-nowrap">Sécurisé</span>
    <span className="text-2xl font-black text-white uppercase mx-8 whitespace-nowrap">•</span>
  </>
);

export default function Marquee() {
  const [totalExpenses, setTotalExpenses] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/global');
        if (res.ok) {
          const data = await res.json();
          setTotalExpenses(data.totalExpenses.toLocaleString('fr-FR'));
        }
      } catch (error) {
        console.error('Failed to fetch marquee stats:', error);
      }
    };
    fetchStats();
  }, []);

  const marqueeText = totalExpenses ? `Déjà ${totalExpenses} dépenses gérées` : 'Des milliers de dépenses gérées';

  return (
    <div className="bg-black border-y-4 border-black py-8 overflow-hidden w-full">
      <style jsx>{`
        .marquee-container {
          display: flex;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
      
      <div className="flex">
        <div className="marquee-container">
          <MarqueeContent marqueeText={marqueeText} />
        </div>
        <div className="marquee-container" aria-hidden="true">
          <MarqueeContent marqueeText={marqueeText} />
        </div>
      </div>
    </div>
  );
}
