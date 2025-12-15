'use client';

import {createContext, useContext, useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

const AuthContext = createContext(null);

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inviteCode = searchParams.get('inviteCode');

    useEffect(() => {
        const storedToken = localStorage.getItem('kipay_token');
        if (storedToken) {
            const decoded = parseJwt(storedToken);
            if (decoded) {
                setToken(storedToken);
                setUser({
                    id: decoded.userId,
                    email: decoded.email,
                    email_verified: decoded.email_verified,
                    isAuthenticated: true
                });
            } else {
                localStorage.removeItem('kipay_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('kipay_token', data.token);

            const decoded = parseJwt(data.token);
            setToken(data.token);
            setUser({
                id: decoded.userId,
                email: decoded.email,
                email_verified: decoded.email_verified,
                isAuthenticated: true
            });

            // Redirection intelligente
            if (inviteCode) {
                router.push(`/join?code=${inviteCode}`);
            } else if (!decoded.email_verified) {
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password}),
        });
        return res.ok;
    };

    const logout = () => {
        localStorage.removeItem('kipay_token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    const value = {
        user,
        token,
        login,
        logout,
        register,
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
