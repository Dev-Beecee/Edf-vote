"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Trophy, Users, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

type StatsConcoursType = {
    projets_total: number;
    projets_en_attente: number;
    projets_pret_pour_vote: number;
    projets_refuse: number;
    votes_total: number;
    top_projet: {
        soumission_id: number;
        titre_projet: string;
        nombre_votes: number;
    } | null;
};

export default function StatsConcours() {
    const [stats, setStats] = useState<StatsConcoursType | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/stats_concours", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok && result.data) {
                setStats(result.data);
                toast({ title: "Statistiques du concours chargées avec succès." });
            } else {
                toast({ 
                    title: "Erreur lors du chargement des statistiques", 
                    description: result.error || "Erreur inconnue",
                    variant: "destructive" 
                });
            }
        } catch (error) {
            toast({ 
                title: "Erreur de connexion", 
                description: "Impossible de récupérer les statistiques",
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
               
                <button 
                    onClick={fetchStats}
                    className="px-4 py-2 bg-[#004990] text-white rounded-lg hover:bg-[#003d7a] transition-colors"
                >
                    Actualiser
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total des projets */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total des Projets
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">
                            {stats.projets_total}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Projets soumis au total
                        </p>
                    </CardContent>
                </Card>

                {/* Projets en attente */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            En Attente
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">
                            {stats.projets_en_attente}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Projets en cours d&apos;évaluation
                        </p>
                    </CardContent>
                </Card>

                {/* Projets prêts pour vote */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Prêts pour Vote
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">
                            {stats.projets_pret_pour_vote}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Projets validés et ouverts au vote
                        </p>
                    </CardContent>
                </Card>

                {/* Projets refusés */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Refusés
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">
                            {stats.projets_refuse}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Projets non retenus
                        </p>
                    </CardContent>
                </Card>

                {/* Total des votes */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total des Votes
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">
                            {stats.votes_total}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Votes exprimés au total
                        </p>
                    </CardContent>
                </Card>

                {/* Projet le plus populaire */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Projet Populaire
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        {stats.top_projet ? (
                            <>
                                <div className="text-3xl font-bold text-gray-800">
                                    {stats.top_projet.nombre_votes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    &ldquo;{stats.top_projet.titre_projet}&rdquo;
                                </p>
                               
                            </>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-gray-300">
                                    0
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Aucun vote encore
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
