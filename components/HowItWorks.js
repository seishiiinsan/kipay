export default function HowItWorks() {
  return (
    <div id="how-it-works" className="bg-indigo-500 border-b-2 border-black dark:border-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-lg font-bold text-white tracking-wider uppercase">Comment ça marche</h2>
          <p className="mt-2 text-4xl leading-8 font-black tracking-tighter text-white sm:text-5xl uppercase">
            Commencez en 3 étapes simples
          </p>
        </div>

        <div className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center justify-center h-20 w-20 bg-indigo-100 border-2 border-black dark:border-white">
                <span className="text-4xl font-black text-black">1</span>
              </div>
              <h3 className="mt-5 text-xl font-black text-black dark:text-white uppercase">Créez un groupe</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Donnez un nom à votre groupe et invitez les participants.
              </p>
            </div>
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center justify-center h-20 w-20 bg-indigo-100 border-2 border-black dark:border-white">
                <span className="text-4xl font-black text-black">2</span>
              </div>
              <h3 className="mt-5 text-xl font-black text-black dark:text-white uppercase">Ajoutez vos dépenses</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Entrez qui a payé quoi, et pour qui.
              </p>
            </div>
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center justify-center h-20 w-20 bg-indigo-100 border-2 border-black dark:border-white">
                <span className="text-4xl font-black text-black">3</span>
              </div>
              <h3 className="mt-5 text-xl font-black text-black dark:text-white uppercase">Remboursez simplement</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Voyez en un clin d&#39;œil qui doit de l&#39;argent à qui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
