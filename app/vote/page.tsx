"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ParticipationHeroSection } from "@/components/participation/ParticipationHeroSection"

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
    const [currentStep, setCurrentStep] = useState(1)
    const { toast } = useToast()

    const categories = Object.keys(data)

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

    const clearVoteForStep = (step: number) => {
        if (step === 1 && categories[0]) {
            setVotes((prev) => {
                const newVotes = { ...prev }
                delete newVotes[categories[0]]
                return newVotes
            })
        } else if (step === 2 && categories[1]) {
            setVotes((prev) => {
                const newVotes = { ...prev }
                delete newVotes[categories[1]]
                return newVotes
            })
        }
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const canProceedToNext = () => {
        // L'utilisateur peut toujours passer à l'étape suivante
        return true
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

    const renderStepContent = () => {
        if (currentStep === 1 && categories[0]) {
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-black">Étape 1 : Votez pour {categories[0]}</h2>
                        {votes[categories[0]] && (
                            <Button 
                                onClick={() => clearVoteForStep(1)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Désélectionner
                            </Button>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(data[categories[0]]) ? (
                            data[categories[0]].map((video) => (
                                <div key={video.id} className="p-4 rounded-lg bg-white">
                                    <video src={video.video_url} controls className="w-full rounded mb-2" />
                                    <p className="text-black"><strong>{video.titre_projet}</strong></p>
                                    <p className="text-black text-sm mb-2">{video.description_breve}</p>
                                    <p className="text-black text-sm"><strong>Établissement :</strong> {video.etablissement}</p>
                                    <p className="text-black text-sm mb-3"><strong>Classe :</strong> {video.nom_classe || "Non renseignée"}</p>
                                    <div className="flex justify-center">
                                        <label className="flex items-center mt-2 space-x-2 text-black cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`vote-${categories[0]}`}
                                                value={video.id}
                                                checked={votes[categories[0]] === video.id}
                                                onChange={() => handleVoteChange(categories[0], video.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-black font-medium">Je vote</span>
                                        </label>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-4 text-black bg-gray-50 rounded">
                                Aucune vidéo disponible pour cette catégorie.
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        if (currentStep === 2 && categories[1]) {
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-black">Étape 2 : Votez pour {categories[1]}</h2>
                        {votes[categories[1]] && (
                            <Button 
                                onClick={() => clearVoteForStep(2)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Désélectionner
                            </Button>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(data[categories[1]]) ? (
                            data[categories[1]].map((video) => (
                                <div key={video.id} className="p-4 rounded-lg bg-white">
                                    <video src={video.video_url} controls className="w-full rounded mb-2" />
                                    <p className="text-black"><strong>{video.titre_projet}</strong></p>
                                    <p className="text-black text-sm mb-2">{video.description_breve}</p>
                                    <p className="text-black text-sm"><strong>Établissement :</strong> {video.etablissement}</p>
                                    <p className="text-black text-sm mb-3"><strong>Classe :</strong> {video.nom_classe || "Non renseignée"}</p>
                                    <div className="flex justify-center">
                                        <label className="flex items-center mt-2 space-x-2 text-black cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`vote-${categories[1]}`}
                                                value={video.id}
                                                checked={votes[categories[1]] === video.id}
                                                onChange={() => handleVoteChange(categories[1], video.id)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-black font-medium">Je vote</span>
                                        </label>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-4 text-black bg-gray-50 rounded">
                                Aucune vidéo disponible pour cette catégorie.
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        if (currentStep === 3) {
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Étape 3 : Confirmez votre vote</h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-black mb-4">Récapitulatif de vos votes :</h3>
                        {Object.entries(votes).map(([categorie, videoId]) => {
                            const video = data[categorie]?.find(v => v.id === videoId)
                            return (
                                <div key={categorie} className="mb-3 p-3 bg-white rounded">
                                    <p className="text-black"><strong>{categorie} :</strong> {video?.titre_projet}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="space-y-4">
                        <label className="block text-black font-medium">
                            Votre adresse email :
                        </label>
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            className="w-full p-3 border rounded-lg text-black bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <main>
            <ParticipationHeroSection />
       
            <div className="p-6 max-w-6xl mx-auto mt-16 text-black">
                <h1 className="text-3xl font-bold mb-6 text-black">Votez pour vos vidéos préférées</h1>

                {/* Indicateur de progression */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step <= currentStep 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 text-center">
                                        {step === 1 && <span>{categories[0]}</span>}
                                        {step === 2 && <span>{categories[1]}</span>}
                                        {step === 3 && <span>Validation</span>}
                                    </div>
                                </div>
                                {index < 2 && (
                                    <div className={`w-16 h-1 mx-4 ${
                                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {hasVoted ? (
                    <div className="p-6 text-green-600 font-medium border border-green-300 bg-green-50 rounded">
                        Merci pour votre participation ! Vous avez déjà voté.
                    </div>
                ) : (
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
                            </div>
                        ) : Object.keys(data).length === 0 ? (
                            <div className="text-center py-20 text-black">
                                Aucune soumission disponible pour le moment.
                            </div>
                        ) : (
                            <>
                                {renderStepContent()}

                                {/* Navigation */}
                                <div className="flex justify-between mt-8">
                                    {currentStep > 1 && (
                                        <Button 
                                            onClick={handlePrevious}
                                            className="bg-[#001a70] text-white border-none"
                                        >
                                            Précédent
                                        </Button>
                                    )}
                                    
                                    <div className={`flex space-x-4 ${currentStep === 1 ? 'ml-auto' : ''}`}>
                                        {currentStep < 3 ? (
                                            <Button 
                                                onClick={handleNext}
                                                className="border-none"
                                            >
                                                Suivant
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={handleSubmit}
                                                className="border-none"
                                            >
                                                Valider mes votes
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
