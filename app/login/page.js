import AuthForm from '@/components/AuthForm';
import AuthSideContent from '@/components/AuthSideContent';

const LoginSideContent = () => (
  <AuthSideContent
    title="Bienvenue à nouveau !"
    subtitle="Découvrez les dernières améliorations."
  >
    <div className="bg-black/20 p-6 border-2 border-white/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <h3 className="font-bold text-white uppercase mb-2 text-lg">Nouveauté : Statistiques</h3>
      <p className="text-indigo-200">Visualisez vos dépenses par membre et par mois dans le nouveau tableau de bord.</p>
    </div>
    <div className="bg-black/20 p-6 border-2 border-white/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <h3 className="font-bold text-white uppercase mb-2 text-lg">Export CSV amélioré</h3>
      <p className="text-indigo-200">L&#39;export de vos comptes est maintenant plus rapide et plus complet.</p>
    </div>
  </AuthSideContent>
);

export default function LoginPage() {
  return <AuthForm defaultMode="login" sideContent={<LoginSideContent />} />;
}
