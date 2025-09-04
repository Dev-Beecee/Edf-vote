"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Sidebar from "@/components/sidebar";
import ParticipationsTable from "@/components/participation-table/ParticipationsTable";
import { useAuth } from "@/hooks/use-auth";

type Inscription = {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    accepte_reglement: boolean;
    accepte_marketing: boolean;
    created_at: string;
};

type Boutique = {
    id: string;
    nom: string;
    created_at: string;
};

type Participation = {
    id: string;
    statut_validation: string;
    created_at: string;
    boutique: Boutique;
    inscription: Inscription;
};

export default function ParticipationsPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                const { data } = await supabase
                    .from("participation")
                    .select("*, boutique: boutique_id (id, nom), inscription: inscription_id (id, nom, prenom, email)")
                    .order("created_at", { ascending: false });

                setParticipations((data as Participation[]) || []);
                setDataLoading(false);
            };

            fetchData();
        }
    }, [user, authLoading, router]);

    const updateParticipationStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from("participation")
            .update({ statut_validation: newStatus })
            .eq("id", id);

        if (!error) {
            setParticipations((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, statut_validation: newStatus } : p
                )
            );
        }
    };

    const filteredParticipations = participations.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.inscription.nom.toLowerCase().includes(term) ||
            p.inscription.prenom.toLowerCase().includes(term) ||
            p.inscription.email.toLowerCase().includes(term)
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
                    <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
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
                <h1 className="text-2xl font-bold mb-4">Liste des Participations</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou email..."
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
                    <ParticipationsTable
                        participations={filteredParticipations}
                        updateParticipationStatus={updateParticipationStatus}
                        setSelectedImage={setSelectedImage}
                        setIsModalOpen={setIsModalOpen}
                    />
                )}
            </main>
        </div>
    );
}
