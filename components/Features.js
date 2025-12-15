export default function Features() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-black text-center mb-16 uppercase tracking-tighter">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-transform">
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl font-black text-black uppercase mb-4">Créez un groupe</h3>
            <p className="text-lg font-bold text-gray-700">
              Invitez vos amis en partageant un simple code. Pas besoin d&#39;email ou de numéro de téléphone.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-transform md:mt-12">
            <div className="text-6xl mb-6">⚡️</div>
            <h3 className="text-2xl font-black text-black uppercase mb-4">Ajoutez vos dépenses</h3>
            <p className="text-lg font-bold text-gray-700">
              Au fur et à mesure, notez qui paie quoi. Kipay garde tout en mémoire, même hors-ligne.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-transform">
            <div className="text-6xl mb-6">⚖️</div>
            <h3 className="text-2xl font-black text-black uppercase mb-4">Équilibrez les comptes</h3>
            <p className="text-lg font-bold text-gray-700">
              À la fin, Kipay vous dit qui doit combien à qui. Simple, efficace, et juste.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
