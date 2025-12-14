import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Header/>

            <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Gros 404 Brutaliste */}
                    <h1 className="text-9xl font-black text-black dark:text-white tracking-tighter mb-8 select-none">
                        404
                    </h1>

                    <div
                        className="bg-indigo-500 border-4 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <h2 className="text-3xl font-black text-white uppercase mb-4">
                            Oups, vous êtes perdu.
                        </h2>
                        <p className="text-xl text-indigo-100 font-medium mb-8">
                            Cette page n&#39;existe pas. Peut-être qu&#39;elle a été supprimée, ou peut-être que vous avez mal
                            tapé l&#39;adresse.
                        </p>

                        <Link
                            href="/"
                            className="inline-block px-8 py-4 border-4 border-black bg-white text-black font-black text-xl uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            Retour à l&#39;accueil
                        </Link>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
