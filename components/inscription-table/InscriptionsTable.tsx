"use client"

import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Soumission = {
    id: string
    nom: string
    prenom: string
    etablissement: string
    nom_classe?: string
    categorie: string
    description_breve: string
    statut: string
    video_url: string
    titre_projet: string
    email: string
    telephone: string
    etablissement_adresse: string
    nb_eleves: number
    created_at: string
}

type Props = {
    soumissions: Soumission[]
}

export default function InscriptionsTable({ soumissions }: Props) {
    const [currentPage, setCurrentPage] = useState(1)
    const [modalVideo, setModalVideo] = useState<string | null>(null)
    const [modalInfos, setModalInfos] = useState<Soumission | null>(null)
    const [statutFilter, setStatutFilter] = useState<string>("tous")
    const { toast } = useToast()
    const itemsPerPage = 10

    const [selectedStatuts, setSelectedStatuts] = useState<{ [id: string]: string }>(
        Object.fromEntries(soumissions.map((s) => [s.id, s.statut]))
    )

    // Appliquer le filtre si un statut est sélectionné et trier par date de création (du plus récent au plus ancien)
    const filteredSoumissions = (statutFilter !== "tous"
        ? soumissions.filter((s) => s.statut === statutFilter)
        : soumissions
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const totalPages = Math.ceil(filteredSoumissions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = filteredSoumissions.slice(startIndex, startIndex + itemsPerPage)


    const handleExportCSV = () => {
        const headers = ["Nom", "Prénom", "Établissement", "Nom de la classe", "Catégorie", "Statut", "Date"]
        const rows = soumissions.map((i) => [
            i.nom,
            i.prenom,
            i.etablissement,
            i.nom_classe || "",
            i.categorie,
            i.statut,
            new Date(i.created_at).toLocaleDateString()
        ])

        const csvContent =
            [headers, ...rows]
                .map((row) => row.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(","))
                .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "soumissions.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({ title: "Export réussi", description: "Le fichier CSV des soumissions a été téléchargé." })
    }

    const handleStatutChange = async (id: string, newStatut: string) => {
        setSelectedStatuts((prev) => ({ ...prev, [id]: newStatut }))

        const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/dynamic-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, statut: newStatut })
        })

        if (res.ok) {
            toast({ title: "Statut mis à jour", description: "Le statut a été modifié avec succès." })
        } else {
            toast({ title: "Erreur", description: "Impossible de mettre à jour le statut." })
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                
                <div className="flex items-center gap-4">
                    <Select onValueChange={(value) => setStatutFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tous">Tous</SelectItem>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="pret_pour_vote">Prêt pour vote</SelectItem>
                            <SelectItem value="refuse">Refusé</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleExportCSV}>Exporter en CSV</Button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-12">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Nom", "Prénom", "Établissement", "Nom de la classe", "Catégorie", "Statut", "Date", "Vidéo"].map((h) => (
                                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2 text-sm text-black">{s.nom}</td>
                                    <td className="px-4 py-2 text-sm text-black">{s.prenom}</td>
                                    <td className="px-4 py-2 text-sm text-black">{s.etablissement}</td>
                                    <td className="px-4 py-2 text-sm text-black">{s.nom_classe || "-"}</td>
                                    <td className="px-4 py-2 text-sm text-black">{s.categorie}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <Select
                                            value={selectedStatuts[s.id]}
                                            onValueChange={(value) => handleStatutChange(s.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en_attente">En attente</SelectItem>
                                                <SelectItem value="pret_pour_vote">Prêt pour vote</SelectItem>
                                                <SelectItem value="refuse">Refusé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-black">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="link" onClick={() => setModalInfos(s)}>Voir</Button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-4xl w-full bg-white max-h-[90vh] overflow-y-auto">
                                                {modalInfos && (
                                                    <>
                                                        <DialogTitle className="text-black text-xl font-bold mb-4">
                                                            Détails de la soumission
                                                        </DialogTitle>
                                                        
                                                        {/* Informations sur l'enseignant */}
                                                        <div className="flex flex-row gap-6">
                                                            <div className="mb-6 flex-1">
                                                            <h3 className="text-lg font-semibold text-black mb-3 border-b pb-2">
                                                                Informations sur l&apos;enseignant
                                                            </h3>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Prénom :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.prenom}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Nom :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.nom}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Email :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.email}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Téléphone :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.telephone}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Informations sur l'établissement */}
                                                            <div className="mb-6 flex-1">
                                                            <h3 className="text-lg font-semibold text-black mb-3 border-b pb-2">
                                                                Informations sur l&apos;établissement
                                                            </h3>
                                                            <div className="space-y-3 text-sm">
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Nom de l&apos;école/collège :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.etablissement}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Adresse :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.etablissement_adresse}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Catégorie de la classe :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.categorie}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Nom de la classe :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.nom_classe || "Non renseignée"}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Nombre d&apos;élèves :</span>
                                                                    <span className="ml-2 text-black">{modalInfos.nb_eleves}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Projet soumis */}
                                                        <div className="mb-6">
                                                            <h3 className="text-lg font-semibold text-black mb-3 border-b pb-2">
                                                                Projet soumis par la classe
                                                            </h3>
                                                            <div className="space-y-3 text-sm">
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Titre du projet :</span>
                                                                    <span className="ml-2 text-black font-semibold">{modalInfos.titre_projet}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Description du projet :</span>
                                                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                                        <span className="text-black">{modalInfos.description_breve}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Vidéo */}
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-black mb-3 border-b pb-2">
                                                                Vidéo du projet
                                                            </h3>
                                                            <video
                                                                src={modalInfos.video_url}
                                                                controls
                                                                className="w-full rounded-lg"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    >
                        Précédent
                    </Button>
                    <span className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</span>
                    <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div >
    )
}
