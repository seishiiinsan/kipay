import {useEffect, useState} from 'react';

export default function Toast({message, type, onClose}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Déclencher l'animation d'entrée
        const timer = setTimeout(() => setIsVisible(true), 10);

        // Auto-close après 5 secondes
        const closeTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Attendre la fin de l'animation de sortie
        }, 2000);

        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const title = type === 'success' ? 'SUCCÈS' : 'ERREUR';

    return (
        <div
            className={`fixed top-5 right-5 z-50 transition-all duration-300 ease-out transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div
                className={`${bgColor} border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[300px] flex items-start`}>
                <div className="flex-1">
                    <h3 className="text-white font-black text-lg uppercase">{title}</h3>
                    <p className="text-white font-medium mt-1">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-4 text-white hover:text-black font-bold"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
