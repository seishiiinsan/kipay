'use client';

export default function AppShowcase() {
  return (
    <section className="bg-indigo-500 border-b-2 border-black dark:border-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl font-black tracking-tighter text-white sm:text-5xl uppercase">
          Simple. Rapide. Brut.
        </h2>
        <p className="mt-4 text-xl text-indigo-200 font-medium">
          Pas de fioritures. Juste ce qu&#39;il faut pour gérer vos comptes.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8 px-4">
        
        {/* Card 1: Liste des dépenses (Rotation gauche) */}
        <div className="relative group w-72 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
          <div className="bg-gray-100 h-96 border-2 border-black p-4 flex flex-col gap-3 overflow-hidden">
            <div className="h-8 bg-black w-1/2 mb-4"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-indigo-400 border-2 border-black"></div>
                  <div className="w-20 h-2 bg-gray-300 my-auto"></div>
                </div>
                <div className="w-10 h-4 bg-black"></div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-black text-center text-xl uppercase">Vos Dépenses</p>
        </div>

        {/* Card 2: Ajout (Pas de rotation, au premier plan) */}
        <div className="relative group w-72 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300 z-20">
          <div className="bg-indigo-500 h-96 border-2 border-black p-4 flex flex-col justify-center items-center gap-6">
            <div className="text-white font-black text-6xl">+</div>
            <div className="w-full bg-white border-2 border-black p-2 text-center font-bold">45.00 €</div>
            <div className="w-full bg-black text-white border-2 border-white p-3 text-center font-bold uppercase cursor-pointer hover:bg-white hover:text-black">Valider</div>
          </div>
          <p className="mt-4 font-black text-center text-xl uppercase">Ajout Éclair</p>
        </div>

        {/* Card 3: Équilibre (Rotation droite) */}
        <div className="relative group w-72 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
          <div className="bg-gray-100 h-96 border-2 border-black p-4 flex flex-col gap-4">
            <div className="h-8 bg-black w-2/3 mb-2"></div>
            <div className="bg-green-200 p-3 border-2 border-black">
              <p className="font-bold text-xs uppercase">Vous recevez</p>
              <p className="font-black text-2xl">120 €</p>
            </div>
            <div className="bg-red-200 p-3 border-2 border-black">
              <p className="font-bold text-xs uppercase">Vous devez</p>
              <p className="font-black text-2xl">0 €</p>
            </div>
            <div className="mt-auto w-full h-2 bg-gray-300"></div>
            <div className="w-2/3 h-2 bg-gray-300"></div>
          </div>
          <p className="mt-4 font-black text-center text-xl uppercase">L&#39;Équilibre</p>
        </div>

      </div>
    </section>
  );
}
