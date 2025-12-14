import AuthForm from '@/components/AuthForm';
import AuthSideContent from '@/components/AuthSideContent';

const RegisterSideContent = () => (
  <AuthSideContent
    title="Les bons comptes font les bons amis."
    subtitle="Rejoignez Kipay et mettez fin aux calculs interminables et aux oublis."
  >
    <ul className="space-y-5 text-xl font-medium text-indigo-100">
      <li className="flex items-start gap-4">
        <span className="font-black text-2xl mt-[-2px] text-white">✓</span>
        <span>Créez des groupes pour vos voyages, colocations, ou couples.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="font-black text-2xl mt-[-2px] text-white">✓</span>
        <span>Ajoutez vos dépenses en quelques secondes.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="font-black text-2xl mt-[-2px] text-white">✓</span>
        <span>Laissez notre algorithme calculer qui doit quoi à qui.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="font-black text-2xl mt-[-2px] text-white">✓</span>
        <span>C&#39;est 100% gratuit. Pour toujours.</span>
      </li>
    </ul>
  </AuthSideContent>
);

export default function RegisterPage() {
  return <AuthForm defaultMode="register" sideContent={<RegisterSideContent />} />;
}
