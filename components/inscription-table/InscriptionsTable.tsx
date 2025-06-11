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
    classe?: string
    categorie: string
    description: string
    statut: string
    video_url: string
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

    // Appliquer le filtre si un statut est sélectionné
    const filteredSoumissions = statutFilter !== "tous"
        ? soumissions.filter((s) => s.statut === statutFilter)
        : soumissions

    const totalPages = Math.ceil(filteredSoumissions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = filteredSoumissions.slice(startIndex, startIndex + itemsPerPage)


    const handleExportCSV = () => {
        const headers = ["Nom", "Prénom", "Établissement", "Classe", "Catégorie", "Statut", "Date"]
        const rows = soumissions.map((i) => [
            i.nom,
            i.prenom,
            i.etablissement,
            i.classe || "",
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
                <h2 className="text-xl font-semibold">Soumissions</h2>
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
                                {["Nom", "Prénom", "Établissement", "Classe", "Catégorie", "Statut", "Date", "Vidéo"].map((h) => (
                                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2 text-sm">{s.nom}</td>
                                    <td className="px-4 py-2 text-sm">{s.prenom}</td>
                                    <td className="px-4 py-2 text-sm">{s.etablissement}</td>
                                    <td className="px-4 py-2 text-sm">{s.classe || "-"}</td>
                                    <td className="px-4 py-2 text-sm">{s.categorie}</td>
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
                                    <td className="px-4 py-2 text-sm">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="link" onClick={() => setModalInfos(s)}>Voir</Button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-4xl w-full">
                                                {modalInfos && (
                                                    <>
                                                        <DialogTitle>Vidéo de la soumission</DialogTitle>
                                                        <DialogDescription className="mb-4">
                                                            Établissement : <strong>{modalInfos.etablissement}</strong><br />
                                                            Classe : <strong>{modalInfos.classe || "Non renseignée"}</strong><br />
                                                            Catégorie : <strong>{modalInfos.categorie}</strong>
                                                        </DialogDescription>
                                                        <video
                                                            src={modalInfos.video_url}
                                                            controls
                                                            className="w-full rounded-lg"
                                                        />
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
