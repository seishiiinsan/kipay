export default function Hero() {
  return (
    <section className="bg-white dark:bg-black border-b-2 border-black dark:border-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white sm:text-6xl md:text-8xl uppercase">
          <span className="block">Les bons comptes</span>
          <span className="block text-indigo-500">font les bons amis.</span>
        </h1>
        <p className="mt-8 max-w-lg mx-auto text-xl text-black dark:text-gray-300 sm:max-w-3xl">
          Gérez vos dépenses de vacances, de colocation ou de couple en toute simplicité. Ne vous demandez plus jamais &#34;Qui paie ?&#34;.
        </p>
        <div className="mt-12 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <a href="#" className="flex items-center justify-center px-8 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              Rejoindre la liste d&#39;attente
            </a>
            <a href="#" className="flex items-center justify-center px-8 py-3 border-2 border-black text-lg font-bold text-black bg-white hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              Voir une démo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
