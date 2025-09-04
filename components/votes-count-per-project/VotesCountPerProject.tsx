"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";

interface VoteCount {
  soumission_id: number;
  titre_projet: string;
  nombre_votes: number;
}

interface VotesCountResponse {
  data: VoteCount[];
}

export default function VotesCountPerProject() {
  const [votesData, setVotesData] = useState<VoteCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/votes_count_per_project');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result: VotesCountResponse = await response.json();
      // Trier les données par nombre de votes décroissant
      const sortedData = (result.data || []).sort((a, b) => b.nombre_votes - a.nombre_votes);
      setVotesData(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotesData();
  }, []);

  const exportToCSV = () => {
    if (votesData.length === 0) return;

    // En-têtes CSV
    const headers = ['ID Soumission', 'Titre du Projet', 'Nombre de Votes'];
    
    // Données CSV
    const csvData = votesData.map(vote => [
      vote.soumission_id,
      `"${vote.titre_projet}"`, // Guillemets pour éviter les problèmes avec les virgules dans les titres
      vote.nombre_votes
    ]);

    // Création du contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Création et téléchargement du fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `votes_projets_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalVotes = votesData.reduce((sum, vote) => sum + vote.nombre_votes, 0);
  const totalProjects = votesData.length;

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Chargement des données de votes...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Récupération des statistiques...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchVotesData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Statistiques des Votes par Projet</CardTitle>
          <div className="flex gap-2">
            <Button onClick={fetchVotesData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalProjects}
            </div>
            <div className="text-sm text-muted-foreground">Projets soumis</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalVotes}
            </div>
            <div className="text-sm text-muted-foreground">Total des votes</div>
          </div>
         
        </div>

        {/* Tableau des votes */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre du Projet</TableHead>
                <TableHead className="w-[150px] text-right">Nombre de Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votesData.length === 0 ? (
                <TableRow>
                                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                  Aucun projet trouvé
                </TableCell>
                </TableRow>
              ) : (
                votesData.map((vote) => (
                  <TableRow key={vote.soumission_id}>
                    <TableCell className="font-medium">
                      {vote.titre_projet}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vote.nombre_votes === 0 
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          : vote.nombre_votes <= 5
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : vote.nombre_votes <= 10
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {vote.nombre_votes} vote{vote.nombre_votes !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
