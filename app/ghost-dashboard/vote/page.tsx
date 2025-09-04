"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import VotesCountPerProject from "@/components/votes-count-per-project/VotesCountPerProject";

export default function VotePage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Si l'authentification échoue, rediriger
        if (!authLoading && !user) {
            router.push("/ghost");
            return;
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/ghost");
    };

    // Afficher le loader pendant l'authentification
    if (authLoading) {
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
    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
            <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-64"} p-6`}>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Statistiques des votes</h1>
                    <p className="text-muted-foreground mt-2">
                        Consultez les statistiques de votes pour chaque projet soumis
                    </p>
                </div>
                
                <VotesCountPerProject />
            </main>
        </div>
    );
}
