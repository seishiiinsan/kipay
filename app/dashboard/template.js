'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Template({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !user.email_verified) {
      router.push('/please-verify');
    }
  }, [user, authLoading, router]);

  // Si l'utilisateur n'est pas vérifié, on n'affiche rien en attendant la redirection
  if (!authLoading && user && !user.email_verified) {
    return null;
  }

  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ ease: 'easeOut', duration: 0.3 }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
