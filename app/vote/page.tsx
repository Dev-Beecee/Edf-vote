"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ParticipationHeroSection } from "@/components/participation/ParticipationHeroSection";

type Soumission = {
    id: string
    etablissement: string
    nom_classe: string
    categorie: string
    description_breve: string
    titre_projet: string
    video_url: string
}

export default function VotePage() {
    const [data, setData] = useState<Record<string, Soumission[]>>({})
    const [votes, setVotes] = useState<{ [categorie: string]: string }>({})
    const [email, setEmail] = useState("")
    const [ip, setIp] = useState("")
    const [loading, setLoading] = useState(true)
    const [hasVoted, setHasVoted] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/soumissions-par-categorie")
            const result = await res.json()
            console.log("API Response:", result) // Debug log
            setData(result)
            setLoading(false)
        }

        const fetchIP = async () => {
            const res = await fetch("https://api.ipify.org?format=json")
            const json = await res.json()
            setIp(json.ip)
        }

        fetchData()
        fetchIP()
    }, [])

    const handleVoteChange = (categorie: string, soumissionId: string) => {
        setVotes((prev) => ({ ...prev, [categorie]: soumissionId }))
    }

    const handleSubmit = async () => {
        if (!email || !ip) {
            toast({ title: "Email requis", description: "Merci de saisir votre email pour voter." })
            return
        }

        if (Object.keys(votes).length === 0) {
            toast({ title: "Sélection requise", description: "Merci de sélectionner au moins une vidéo." })
            return
        }

        const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/soumettre-vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, ip, votes }),
        })

        const result = await res.json()

        if (result.alreadyVoted) {
            setHasVoted(true)
            toast({ title: "Déjà voté", description: "Vous avez déjà voté avec cet email ou depuis cette adresse IP." })
            return
        }

        if (result.inserted?.length > 0) {
            setHasVoted(true)
            setEmail("")
            setVotes({})
            toast({ title: "Merci pour votre participation", description: "Vos votes ont bien été enregistrés." })
        }

        if (result.errors?.length > 0) {
            toast({ title: "Erreur", description: result.errors.join(", ") })
        }
    }

    return (
        <main>
            <ParticipationHeroSection />
       
        <div className="p-6 max-w-6xl mx-auto mt-16 text-black">
            <h1 className="text-3xl font-bold mb-6 text-black">Votez pour vos vidéos préférées</h1>

            {hasVoted ? (
                <div className="p-6 text-green-600 font-medium border border-green-300 bg-green-50 rounded">
                    Merci pour votre participation ! Vous avez déjà voté.
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
                        </div>
                    ) : Object.keys(data).length === 0 ? (
                        <div className="text-center py-20 text-black">
                            Aucune soumission disponible pour le moment.
                        </div>
                    ) : (
                        Object.entries(data).map(([categorie, videos]) => (
                            <div key={categorie} className="mb-10">
                                <h2 className="text-xl font-semibold mb-4 text-black">{categorie}</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.isArray(videos) ? (
                                        videos.map((video) => (
                                            <div key={video.id} className=" p-4  text-black">
                                                <video src={video.video_url} controls className="w-full rounded mb-2" />
                                                <p className="text-black"><strong>{video.titre_projet}</strong></p>
                                                <p className="text-black">{video.description_breve}</p>
                                                <p className="text-black"><strong>Établissement :</strong> {video.etablissement}</p>
                                                <p className="text-black"><strong>Classe :</strong> {video.nom_classe || "Non renseignée"}</p>
                                                
                                                <label className="flex items-center mt-2 space-x-2 text-black">
                                                    <input
                                                        type="radio"
                                                        name={`vote-${categorie}`}
                                                        value={video.id}
                                                        checked={votes[categorie] === video.id}
                                                        onChange={() => handleVoteChange(categorie, video.id)}
                                                    />
                                                    <span className="text-black">Je vote</span>
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full p-4 text-black bg-gray-50 rounded">
                                            Aucune vidéo disponible pour cette catégorie ou format de données incorrect.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && (
                        <Button className="mt-8" onClick={handleSubmit}>
                            Valider mes votes
                        </Button>
                    )}
                </>
            )}
        </div>
        </main>
    )
}
