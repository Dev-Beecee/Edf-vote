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
import { Download, RefreshCw, Medal, Trophy, Award } from "lucide-react";

interface VoteCount {
  soumission_id: number;
  titre_projet: string;
  nombre_votes: number;
  categorie: string;
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
      // Trier les données par catégorie puis par nombre de votes décroissant
      const sortedData = (result.data || []).sort((a, b) => {
        // D'abord trier par catégorie
        if (a.categorie !== b.categorie) {
          return a.categorie.localeCompare(b.categorie);
        }
        // Puis par nombre de votes décroissant
        return b.nombre_votes - a.nombre_votes;
      });
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
    const headers = ['Catégorie', 'ID Soumission', 'Titre du Projet', 'Nombre de Votes'];
    
    // Création du contenu CSV organisé par catégorie
    const csvLines = [headers.join(',')];
    
    // Ajouter une ligne vide et les données pour chaque catégorie
    categories.forEach(category => {
      const categoryData = groupedByCategory[category];
      const categoryVotes = categoryData.reduce((sum, vote) => sum + vote.nombre_votes, 0);
      
      // Ligne de séparation avec statistiques de catégorie
      csvLines.push(''); // Ligne vide
      csvLines.push(`"=== ${category} ===","${categoryData.length} projets","${categoryVotes} votes","==="`);
      
      // Données de la catégorie
      categoryData.forEach(vote => {
        csvLines.push([
          `"${vote.categorie}"`,
          vote.soumission_id,
          `"${vote.titre_projet}"`,
          vote.nombre_votes
        ].join(','));
      });
    });

    const csvContent = csvLines.join('\n');

    // Création et téléchargement du fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `votes_projets_par_categorie_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalVotes = votesData.reduce((sum, vote) => sum + vote.nombre_votes, 0);
  const totalProjects = votesData.length;

  // Grouper les données par catégorie
  const groupedByCategory = votesData.reduce((acc, vote) => {
    if (!acc[vote.categorie]) {
      acc[vote.categorie] = [];
    }
    acc[vote.categorie].push(vote);
    return acc;
  }, {} as Record<string, VoteCount[]>);

  const categories = Object.keys(groupedByCategory).sort();

  // Fonction pour obtenir le badge de podium
  const getPodiumBadge = (position: number, votes: number) => {
    if (votes === 0) return null; // Pas de badge pour 0 vote
    
    switch (position) {
      case 1:
        return (
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">1er</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1">
            <Medal className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">2ème</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">3ème</span>
          </div>
        );
      default:
        return null;
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">Catégories</div>
          </div>
        </div>

        {/* Podium des gagnants */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">🏆 Podium par catégorie</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map(category => {
                const categoryData = groupedByCategory[category];
                const topThree = categoryData.slice(0, 3).filter(vote => vote.nombre_votes > 0);
                
                if (topThree.length === 0) return null;
                
                return (
                  <div key={category} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg border">
                    <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{category}</h4>
                    <div className="space-y-3">
                      {topThree.map((vote, index) => {
                        const position = index + 1;
                        const podiumBadge = getPodiumBadge(position, vote.nombre_votes);
                        
                        return (
                          <div key={vote.soumission_id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-md shadow-sm">
                            {podiumBadge}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{vote.titre_projet}</div>
                              <div className="text-sm text-muted-foreground">
                                {vote.nombre_votes} vote{vote.nombre_votes !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Statistiques par catégorie */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">📊 Statistiques par catégorie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryData = groupedByCategory[category];
                const categoryVotes = categoryData.reduce((sum, vote) => sum + vote.nombre_votes, 0);
                return (
                  <div key={category} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      {categoryData.length} projet{categoryData.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{category}</div>
                    <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                      {categoryVotes} vote{categoryVotes !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tableaux des votes par catégorie */}
        {votesData.length === 0 ? (
          <div className="border rounded-lg p-8">
            <div className="text-center text-muted-foreground">
              Aucun projet trouvé
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map(category => {
              const categoryData = groupedByCategory[category];
              const categoryVotes = categoryData.reduce((sum, vote) => sum + vote.nombre_votes, 0);
              
              return (
                <div key={category} className="space-y-4">
                  {/* En-tête de catégorie */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        {category}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {categoryData.length} projet{categoryData.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {categoryVotes} vote{categoryVotes !== 1 ? 's' : ''} au total
                    </div>
                  </div>

                  {/* Tableau pour cette catégorie */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Classement</TableHead>
                          <TableHead>Titre du Projet</TableHead>
                          <TableHead className="w-[150px] text-right">Nombre de Votes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.map((vote, index) => {
                          const position = index + 1;
                          const podiumBadge = getPodiumBadge(position, vote.nombre_votes);
                          
                          return (
                            <TableRow 
                              key={vote.soumission_id}
                              className={position <= 3 && vote.nombre_votes > 0 ? 'bg-gradient-to-r from-yellow-50/20 to-transparent dark:from-yellow-900/10' : ''}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {podiumBadge || (
                                    <span className="text-sm font-medium text-muted-foreground min-w-[2rem]">
                                      {position}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className={position <= 3 && vote.nombre_votes > 0 ? 'font-semibold' : ''}>
                                  {vote.titre_projet}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  vote.nombre_votes === 0 
                                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                    : position === 1
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ring-2 ring-yellow-300'
                                    : position === 2
                                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 ring-2 ring-gray-300'
                                    : position === 3
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 ring-2 ring-amber-300'
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
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
