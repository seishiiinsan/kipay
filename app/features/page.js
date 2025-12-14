import Header from '@/components/Header';
import Footer from '@/components/Footer';

const detailedFeatures = [
  {
    name: 'Création de groupes illimités',
    description: 'Que ce soit pour une colocation, un voyage autour du monde ou juste un week-end entre amis, créez autant de groupes que nécessaire. Invitez des membres par email ou via un simple lien.',
    icon: '👥',
  },
  {
    name: 'Ajout de dépenses intelligent',
    description: 'Notre interface vous permet d\'ajouter une dépense en quelques secondes. Précisez qui a payé, pour qui la dépense est partagée (tout le groupe, ou seulement quelques personnes), et même d\'ajouter une photo du ticket de caisse.',
    icon: '⚡️',
  },
  {
    name: 'Équilibrage des dettes optimisé',
    description: 'Fini les casse-têtes. Notre algorithme analyse toutes les dépenses et calcule la manière la plus simple de rembourser tout le monde. Au lieu de 10 petites transactions, Kipay vous proposera peut-être 2 ou 3 virements pour solder les comptes.',
    icon: '⚖️',
  },
  {
    name: 'Support multi-devises',
    description: 'En voyage ? Pas de problème. Ajoutez des dépenses en Euros, en Dollars, en Yens... Kipay se charge de la conversion en temps réel pour que tout le monde sache exactement ce qu\'il doit, dans sa propre devise.',
    icon: '🌍',
  },
  {
    name: 'Historique et export',
    description: 'Gardez une trace de toutes vos dépenses partagées. Un historique complet est disponible pour chaque groupe, et vous pouvez exporter vos données au format CSV pour vos archives personnelles.',
    icon: '📂',
  },
  {
    name: 'Notifications en temps réel',
    description: 'Soyez notifié dès qu\'un membre ajoute une dépense ou effectue un remboursement. La transparence est totale et instantanée.',
    icon: '🔔',
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-indigo-500 text-white border-b-2 border-black dark:border-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl uppercase">Fonctionnalités Détaillées</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-200">
              Découvrez tout ce que Kipay peut faire pour vous simplifier la vie.
            </p>
          </div>
        </div>
        <div className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {detailedFeatures.map((feature) => (
                <div key={feature.name} className="bg-white dark:bg-black p-6 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                  <div className="text-4xl">{feature.icon}</div>
                  <h2 className="mt-4 text-2xl font-black text-black dark:text-white uppercase">{feature.name}</h2>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
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
