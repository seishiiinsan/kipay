export default function AuthSideContent({ title, subtitle, children }) {
  return (
    <div className="flex flex-col justify-center h-full max-w-lg">
      {/* Titre standardisé */}
      <h2 className="text-5xl font-black tracking-tighter uppercase mb-6 leading-none text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        {title}
      </h2>
      
      {/* Sous-titre standardisé */}
      {subtitle && (
        <p className="text-xl font-bold text-indigo-100 mb-10 border-l-4 border-black pl-6 py-2 bg-black/10">
          {subtitle}
        </p>
      )}
      
      {/* Contenu spécifique */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
