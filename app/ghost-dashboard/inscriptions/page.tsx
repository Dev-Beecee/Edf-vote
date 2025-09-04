"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import InscriptionsTable from "@/components/inscription-table/InscriptionsTable";
import { useAuth } from "@/hooks/use-auth";

// Utiliser le même type que dans InscriptionsTable
type Soumission = {
    id: string;
    nom: string;
    prenom: string;
    etablissement: string;
    nom_classe?: string;
    categorie: string;
    description_breve: string;
    statut: string;
    video_url: string;
    titre_projet: string;
    email: string;
    telephone: string;
    etablissement_adresse: string;
    nb_eleves: number;
    created_at: string;
};

export default function InscriptionsPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Si l'authentification échoue, rediriger
        if (!authLoading && !user) {
            router.push("/ghost");
            return;
        }

        // Charger les données seulement si authentifié
        if (user) {
            const fetchData = async () => {
                const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/soumissions-liste");

                if (!res.ok) {
                    console.error("Erreur lors du fetch depuis la edge function");
                    setDataLoading(false);
                    return;
                }

                const data = await res.json();
                setSoumissions(data || []);
                setDataLoading(false);
            };

            fetchData();
        }
    }, [user, authLoading, router]);

    const filteredSoumissions = soumissions.filter((s) => {
        const term = searchTerm.toLowerCase();
        return (
            s.nom.toLowerCase().includes(term) ||
            s.prenom.toLowerCase().includes(term) ||
            s.etablissement.toLowerCase().includes(term)
        );
    });

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
        <div
            className="flex min-h-screen bg-gray-100"
        >
            <Sidebar onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-64"} p-6`}>
                <h1 className="text-2xl font-bold mb-4 text-black">Liste des Inscriptions</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou établissement..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {dataLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <InscriptionsTable soumissions={filteredSoumissions} />
                )}
            </main>
        </div>
    );
}
