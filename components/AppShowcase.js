export default function AppShowcase() {
  return (
    <section className="bg-indigo-600 py-24 px-4 sm:px-6 lg:px-8 border-y-4 border-black">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000]">
          {/* Header de la fausse fenêtre */}
          <div className="h-12 border-b-4 border-black flex items-center px-4 gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black" />
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-black" />
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
          </div>
          {/* Contenu de la fausse app */}
          <div className="p-8">
            <img 
              src="/app-preview.png" // Vous devrez créer cette image
              alt="Aperçu de l'application Kipay"
              className="w-full h-auto border-4 border-black"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
