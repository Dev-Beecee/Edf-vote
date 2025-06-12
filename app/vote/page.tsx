"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Soumission = {
    id: string
    etablissement: string
    classe: string
    categorie: string
    description: string
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
        <div className="p-6 max-w-6xl mx-auto mt-16">
            <h1 className="text-3xl font-bold mb-6">Votez pour vos vidéos préférées</h1>

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
                    ) : (
                        Object.entries(data).map(([categorie, videos]) => (
                            <div key={categorie} className="mb-10">
                                <h2 className="text-xl font-semibold mb-4">{categorie}</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {videos.map((video) => (
                                        <div key={video.id} className="border p-4 rounded shadow">
                                            <video src={video.video_url} controls className="w-full rounded mb-2" />
                                            <p><strong>Établissement :</strong> {video.etablissement}</p>
                                            <p><strong>Classe :</strong> {video.classe || "Non renseignée"}</p>
                                            <p><strong>Description :</strong> {video.description}</p>
                                            <label className="flex items-center mt-2 space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`vote-${categorie}`}
                                                    value={video.id}
                                                    checked={votes[categorie] === video.id}
                                                    onChange={() => handleVoteChange(categorie, video.id)}
                                                />
                                                <span>Voter</span>
                                            </label>
                                        </div>
                                    ))}
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
    )
}
