export default function Testimonials() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t-4 border-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-black text-center mb-16 uppercase tracking-tighter">
          Ils nous adorent. (On suppose)
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
            <p className="text-lg font-bold text-black mb-6">
              &#34;Enfin une app qui va droit au but. Pas de chichis, pas de pub. Juste des comptes clairs.&#34;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-full" />
              <div>
                <p className="font-black text-black uppercase">Léa D.</p>
                <p className="font-bold text-gray-600">Colocataire heureuse</p>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] md:mt-12">
            <p className="text-lg font-bold text-black mb-6">
              &#34;J&#39;ai organisé un week-end pour 12 personnes. Kipay a sauvé mon couple et mes amitiés.&#34;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-300 border-2 border-black rounded-full" />
              <div>
                <p className="font-black text-black uppercase">Thomas R.</p>
                <p className="font-bold text-gray-600">Organisateur de voyages</p>
              </div>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
            <p className="text-lg font-bold text-black mb-6">
              &#34;Le design est brutal, mais l&#39;efficacité est douce. J&#39;adore.&#34;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-300 border-2 border-black rounded-full" />
              <div>
                <p className="font-black text-black uppercase">Chloé M.</p>
                <p className="font-bold text-gray-600">Fan de design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
