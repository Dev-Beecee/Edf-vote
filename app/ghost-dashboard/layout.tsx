"use client"

import { ReactNode, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Layout pour le dashboard admin - masque la navbar et footer du layout principal
export default function GhostDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Vérifier la session une seule fois au chargement
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session || !session.user.email?.endsWith("@beecee.fr")) {
                router.push("/ghost");
                return;
            }
            
            setIsAuthenticated(true);
        };

        checkAuth();

        // Écouter les changements de session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || !session || !session.user.email?.endsWith("@beecee.fr")) {
                    router.push("/ghost");
                } else {
                    setIsAuthenticated(true);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router]);

    // Masquer la navbar et footer du layout principal avec CSS
    useEffect(() => {
        // Ajouter une classe CSS au body pour masquer navbar et footer
        document.body.classList.add('dashboard-mode');
        
        // Masquer directement avec CSS
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-mode [data-navbar],
            .dashboard-mode [data-footer] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.body.classList.remove('dashboard-mode');
            document.head.removeChild(style);
        };
    }, []);

    // Afficher un loader pendant la vérification
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Vérification de l&apos;authentification...</p>
                </div>
            </div>
        );
    }

    // Si non authentifié, ne rien afficher (redirection en cours)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {/* Layout Admin Dashboard - Navbar et Footer masqués avec CSS */}
            {children}
            <Toaster />
        </ThemeProvider>
    );
}
