"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast'
import { format } from "date-fns";
import { fr } from "date-fns/locale";


type StatsType = {
    participationsParBoutique: Record<string, number>;
    participationsParTranche: Record<string, number>;
    montantMin: number;
    montantMax: number;
    montantMinBoutique?: string;
    montantMaxBoutique?: string;
    jourMin: string;
    jourMax: string;
    moyenneParJour: number;
    moyenneParJoueur: number;
    participationsParJour: Record<string, number>;
};

export default function StatisticsDashboard() {
    const [stats, setStats] = useState<StatsType | null>(null);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);

        const res = await fetch("https://nkymassyzvfwzrjekatr.supabase.co/functions/v1/statistique", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
        });

        const json = await res.json();

        if (res.ok && json.stats) {
            setStats(json.stats);
            toast({ title: "Statistiques générées avec succès." });
        } else {
            toast({ title: "Erreur lors du chargement des statistiques", variant: "destructive" });
        }

        setLoading(false);
    };



    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Statistiques</h2>

            <div className="flex gap-4">
                <Button onClick={fetchStats} disabled={loading}>
                    {loading ? "Chargement..." : "Afficher les statistiques"}
                </Button>

            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bloc résumé */}
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Résumé général</h3>
                        <p><strong>Moyenne par jour :</strong> {stats.moyenneParJour}</p>
                        <p><strong>Moyenne par joueur :</strong> {stats.moyenneParJoueur}</p>
                        <p><strong>Jour le plus actif :</strong> {format(new Date(stats.jourMax), 'd MMM yyyy', { locale: fr })}</p>
                        <p><strong>Jour le moins actif :</strong> {format(new Date(stats.jourMin), 'd MMM yyyy', { locale: fr })}</p>
                        <p><strong>Montant minimum :</strong> {stats.montantMin} € ({stats.montantMinBoutique})</p>
                        <p><strong>Montant maximum :</strong> {stats.montantMax} € ({stats.montantMaxBoutique})</p>
                    </div>

                    {/* Bloc par tranche */}
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Par tranche de montant</h3>
                        {Object.entries(stats.participationsParTranche).map(([tranche, count]) => (
                            <p key={tranche}>{tranche} € : {count}</p>
                        ))}
                    </div>

                    {/* Bloc participations par jour */}
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-2 col-span-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Participations par jour</h3>
                        <ul className="space-y-1 text-sm">
                            {Object.entries(stats.participationsParJour).map(([date, count]) => {
                                const parsedDate = new Date(date);
                                const isValid = !isNaN(parsedDate.getTime());

                                return (
                                    <li key={date}>
                                        {isValid
                                            ? format(parsedDate, 'd MMM yyyy', { locale: fr })
                                            : date} : {count} participations
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Bloc participations par boutique */}
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-2 col-span-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Participations par boutique</h3>
                        <ul className="space-y-1 text-sm">
                            {Object.entries(stats.participationsParBoutique).map(([name, count]) => (
                                <li key={name}>{name} : {count}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
