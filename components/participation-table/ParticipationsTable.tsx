"use client";

import * as React from "react";
import { useState } from "react";
import { format, isAfter, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

// Types
type Participation = {
    id: string;
    boutique: {
        nom: string;
    };
    inscription: {
        nom: string;
        prenom: string;
        email: string;
    };
    ocr_date_achat: string;
    ocr_montant: number;
    statut_validation: string;
    image_url: string | null;
};

type ParticipationsTableProps = {
    participations: Participation[];
    updateParticipationStatus: (id: string, newStatus: string) => void;
    setSelectedImage: (url: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
};

export default function ParticipationsTable({
    participations,
    updateParticipationStatus,
    setSelectedImage,
    setIsModalOpen,
}: ParticipationsTableProps) {
    const [filterStatus, setFilterStatus] = useState<string>("tous");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { toast } = useToast();

    // Filtres combinés
    const filteredParticipations = participations.filter((p) => {
        const matchesStatus =
            filterStatus === "tous" || p.statut_validation === filterStatus;

        const achatDate = new Date(p.ocr_date_achat);
        const matchesDate =
            (!dateRange?.from || !isBefore(achatDate, dateRange.from)) &&
            (!dateRange?.to || !isAfter(achatDate, dateRange.to));

        return matchesStatus && matchesDate;
    });

    const totalPages = Math.ceil(filteredParticipations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredParticipations.slice(startIndex, startIndex + itemsPerPage);

    const handleExportCSV = () => {
        const headers = ["Boutique", "Nom", "Prénom", "Email", "Date d'achat", "Montant (€)", "Statut"];
        const rows = filteredParticipations.map((p) => [
            p.boutique.nom,
            p.inscription.nom,
            p.inscription.prenom,
            p.inscription.email,
            new Date(p.ocr_date_achat).toLocaleDateString(),
            p.ocr_montant.toFixed(2),
            p.statut_validation,
        ]);

        const csvContent =
            [headers, ...rows]
                .map((row) =>
                    row.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(",")
                )
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "participations.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export réussi",
            description: "Le fichier CSV a bien été téléchargé.",
            duration: 3000,
        });
    };

    return (
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Participations</h2>

            {/* Filtres */}
            <div className="mb-6 flex flex-wrap items-end gap-6">
                <div className="space-y-1">
                    <Label>Filtrer par statut</Label>
                    <Select
                        value={filterStatus}
                        onValueChange={(value) => {
                            setFilterStatus(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tous">Tous</SelectItem>
                            <SelectItem value="en attente">En attente</SelectItem>
                            <SelectItem value="validé">Validé</SelectItem>
                            <SelectItem value="validéia">Validé ia</SelectItem>
                            <SelectItem value="rejeté">Rejeté</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label>Plage de dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "dd/MM/yyyy")
                                    )
                                ) : (
                                    <span>Choisir une date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="ml-auto mt-6">
                    <Button onClick={handleExportCSV}>Exporter en CSV</Button>
                </div>
            </div>

            {/* Tableau */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d&apos;achat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.boutique.nom}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.inscription.nom}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.inscription.prenom}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.inscription.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.ocr_date_achat).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.ocr_montant} €</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <Select
                                            value={p.statut_validation}
                                            onValueChange={(value) => updateParticipationStatus(p.id, value)}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en attente">En attente</SelectItem>
                                                <SelectItem value="validé">Validé</SelectItem>
                                                <SelectItem value="validéia">Validé ia</SelectItem>
                                                <SelectItem value="rejeté">Rejeté</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {p.image_url && (
                                            <Button
                                                variant="link"
                                                className="text-indigo-600 p-0 h-auto"
                                                onClick={() => {
                                                    setSelectedImage(p.image_url!);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Voir
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                    <Button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        variant={currentPage === 1 ? "outline" : "default"}
                    >
                        Précédent
                    </Button>

                    <span className="text-sm text-gray-700">
                        Page {currentPage} sur {totalPages}
                    </span>

                    <Button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant={currentPage === totalPages ? "outline" : "default"}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
