"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Sidebar from "@/components/sidebar";
import InscriptionsTable from "@/components/inscription-table/InscriptionsTable";

type Soumission = {
    id: string;
    nom: string;
    prenom: string;
    etablissement: string;
    classe: string;
    categorie: string;
    description: string;
    statut: string;
    video_url: string;
    created_at: string;
};


export default function InscriptionsPage() {
    const router = useRouter();
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user || !user.email?.endsWith("@beecee.fr")) {
                router.push("/login");
                return;
            }

            const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/soumissions-liste");

            if (!res.ok) {
                console.error("Erreur lors du fetch depuis la edge function");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setSoumissions(data || []);
            setLoading(false);
        };

        fetchData();
    }, [router]);

    const filteredSoumissions = soumissions.filter((s) => {
        const term = searchTerm.toLowerCase();
        return (
            s.nom.toLowerCase().includes(term) ||
            s.prenom.toLowerCase().includes(term) ||
            s.etablissement.toLowerCase().includes(term)
        );
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-64"} p-6`}>
                <h1 className="text-2xl font-bold mb-4">Liste des Soumissions</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou établissement..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <InscriptionsTable soumissions={filteredSoumissions} />

            </main>
        </div>
    );
}
