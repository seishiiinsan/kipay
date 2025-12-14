'use client';

const faqs = [
  {
    question: "Est-ce que l'application est gratuite ?",
    answer: "Oui, Kipay est 100% gratuit et le restera. Toutes les fonctionnalités sont accessibles à tous, sans abonnement ni frais cachés."
  },
  {
    question: "Dois-je créer un compte pour l'utiliser ?",
    answer: "Oui. Pour garantir la sécurité de vos données et vous permettre de retrouver vos groupes sur tous vos appareils, la création d'un compte est nécessaire. C'est rapide et gratuit."
  },
  {
    question: "Comment fonctionne l'équilibrage des dettes ?",
    answer: "Notre algorithme calcule le moyen le plus efficace de rembourser tout le monde en minimisant le nombre de transactions. Fini les chaines de remboursement interminables !"
  },
  {
    question: "Puis-je utiliser Kipay hors ligne ?",
    answer: "Absolument. Vous pouvez ajouter des dépenses sans connexion internet (en avion, à l'étranger...). L'application se synchronisera automatiquement dès que vous retrouverez du réseau."
  },
  {
    question: "Mes données bancaires sont-elles connectées ?",
    answer: "Non. Kipay est un outil de gestion, pas une banque. Nous ne nous connectons pas à vos comptes bancaires. Vous déclarez simplement qui a payé quoi."
  },
  {
    question: "Peut-on gérer plusieurs devises ?",
    answer: "Oui ! Idéal pour les voyages. Vous pouvez ajouter une dépense en Dollars, une autre en Yens, et Kipay convertira tout dans la devise de référence du groupe."
  }
];

export default function FAQ() {
  return (
    <section className="bg-indigo-500 border-b-2 border-black dark:border-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter text-white sm:text-5xl uppercase">
            Questions Fréquentes
          </h2>
          <p className="mt-4 text-xl text-indigo-200 font-medium">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] open:shadow-none open:translate-x-[4px] open:translate-y-[4px] transition-all duration-200"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                <h3 className="text-lg font-black text-black dark:text-white uppercase pr-8">
                  {faq.question}
                </h3>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="24" className="text-black dark:text-white">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-gray-600 dark:text-gray-300 px-6 pb-6 font-medium text-lg border-t-2 border-black dark:border-white pt-4">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
