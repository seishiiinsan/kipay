'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('kipay_token');
      if (storedToken) {
        const decoded = parseJwt(storedToken);
        if (decoded && decoded.userId) {
          setToken(storedToken);
          
          // On initialise avec les données du token pour un affichage rapide
          setUser({ 
            id: decoded.userId, 
            email: decoded.email,
            email_verified: decoded.email_verified,
            avatar_variant: decoded.avatar_variant || 'beam',
            isAuthenticated: true 
          });

          // Ensuite, on va chercher les données fraîches en base
          try {
            const res = await fetch(`/api/users/${decoded.userId}`, {
              headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            if (res.ok) {
              const data = await res.json();
              setUser(prev => ({
                ...prev,
                ...data.user, // Met à jour name, email, avatar_variant, etc.
                isAuthenticated: true
              }));
            } else {
              // Si le token est invalide côté serveur (ex: user supprimé), on déconnecte
              if (res.status === 401 || res.status === 404) {
                localStorage.removeItem('kipay_token');
                setToken(null);
                setUser(null);
              }
            }
          } catch (error) {
            console.error("Failed to refresh user data", error);
          }
        } else {
          localStorage.removeItem('kipay_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('kipay_token', data.token);
      
      const decoded = parseJwt(data.token);
      setToken(data.token);
      
      // On utilise les données renvoyées par le login (qui sont fraîches)
      setUser({ 
        ...data.user,
        isAuthenticated: true 
      });
      
      if (!data.user.email_verified) {
        router.push('/please-verify');
      } else {
        router.push('/dashboard');
      }
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.ok;
  };

  const logout = () => {
    localStorage.removeItem('kipay_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
