"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function GhostDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

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
                <h1 className="text-2xl font-bold mb-6 text-black">Dashboard Administrateur</h1>
                
                {/* Contenu à ajouter ici */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500">Contenu du dashboard à venir...</p>
                </div>
            </main>
        </div>
    );
}
