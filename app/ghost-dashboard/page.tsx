"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Sidebar from "@/components/sidebar";
import PeriodeJeuForm from "@/components/periodejeu/PeriodeJeuForm";
import StatCard from "@/components/statistique/StatCard";
import { TirageAuSort } from "@/components/tirage-au-sort/TirageAuSort";
import StatisticsDashboard from "@/components/statistique/StatisticsDashboard";

// Types
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
    boutique_id: string;
    created_at: string;
    boutique: Boutique;
    inscription: Inscription;
};

export default function GhostDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const [participations, setParticipations] = useState<Participation[]>([]);
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user || !user.email?.endsWith("@beecee.fr")) {
                router.push("/login");
                return;
            }

            setUser(user);

            const { data: participationsData } = await supabase
                .from("participation")
                .select(`*, boutique: boutique_id (nom), inscription: inscription_id (nom, prenom, email)`)
                .order("created_at", { ascending: false });

            const { data: inscriptionsData } = await supabase
                .from("inscription")
                .select("*")
                .order("created_at", { ascending: false });

            setParticipations(participationsData || []);
            setInscriptions(inscriptionsData || []);
            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-64"} p-6`}>
                <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Période de jeu</h2>
                    <PeriodeJeuForm />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard
                        title="Participations"
                        value={participations.length}
                        percentage={5.2}
                        data={[100, 110, 105, 103, 115, 120, participations.length]}
                    />
                    <StatCard
                        title="Inscriptions"
                        value={inscriptions.length}
                        percentage={3.1}
                        data={[80, 95, 85, 90, 92, 100, inscriptions.length]}
                    />
                </section>


            </main>
        </div>
    );
}
