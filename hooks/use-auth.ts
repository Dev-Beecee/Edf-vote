import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifier la session initiale
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user && session.user.email?.endsWith("@beecee.fr")) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            
            setLoading(false);
        };

        checkSession();

        // Écouter les changements de session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user && session.user.email?.endsWith("@beecee.fr")) {
                    setUser(session.user);
                    setIsAuthenticated(true);
                } else if (event === 'SIGNED_OUT' || !session) {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return {
        user,
        loading,
        isAuthenticated,
        logout
    };
}
