import Header from '@/components/Header';
import Footer from '@/components/Footer';

const steps = [
  {
    step: 1,
    title: 'Créez votre groupe Kipay',
    description: 'Tout commence par un groupe. Donnez-lui un nom évocateur ("Vacances en Italie", "Coloc de la Victoire", "Cadeau pour Maman"). Vous pouvez ensuite inviter des membres depuis vos contacts, par email, ou en partageant un lien unique. Chaque membre invité pourra rejoindre le groupe en un clic.',
  },
  {
    step: 2,
    title: 'Ajoutez une dépense',
    description: 'C\'est le cœur de l\'application. Cliquez sur le bouton "+", entrez le montant, et donnez une description ("Restaurant", "Courses", "Billets de train"). Sélectionnez qui a payé. Par défaut, la dépense est divisée équitablement entre tous les membres, mais vous pouvez ajuster ça : division par parts, par montant exact, ou en excluant certaines personnes.',
  },
  {
    step: 3,
    title: 'Consultez les soldes',
    description: 'Plus besoin de sortir la calculatrice. L\'écran principal du groupe vous montre en temps réel qui doit de l\'argent, et à qui. Les soldes sont mis à jour instantanément à chaque nouvelle dépense ajoutée. C\'est simple, clair et transparent.',
  },
  {
    step: 4,
    title: 'Remboursez et soldez les comptes',
    description: 'Quand il est temps de solder les comptes, Kipay vous facilite la tâche. Notre algorithme d\'équilibrage vous propose la méthode la plus efficace pour que tout le monde soit remboursé, en minimisant le nombre de virements. Marquez un remboursement comme "effectué" pour mettre les soldes à jour. Une fois que tous les soldes sont à zéro, le groupe est équilibré !',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-white dark:bg-black border-b-2 border-black dark:border-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl uppercase">Comment ça marche ?</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              De la création du groupe au remboursement final, tout est simple.
            </p>
          </div>
        </div>
        <div className="py-16 sm:py-24 bg-indigo-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.step} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  <div className="flex items-center justify-center h-24 w-24 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-5xl font-black text-black">{step.step}</span>
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-black text-white uppercase">{step.title}</h2>
                    <p className="mt-2 text-lg text-indigo-200">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
