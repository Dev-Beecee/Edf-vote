"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { VoteHeroSection } from "@/components/vote/VoteHeroSection"
import Image from "next/image"

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
    const [showAllVideos, setShowAllVideos] = useState<{ [categorie: string]: boolean }>({})
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
        // Pour passer à l'étape 3, l'utilisateur doit avoir voté pour au moins une catégorie
        if (currentStep === 2) {
            return Object.keys(votes).length > 0
        }
        // Pour les autres étapes, l'utilisateur peut toujours passer à l'étape suivante
        return true
    }

    const handleSubmit = async () => {
        if (!email || !ip) {
            toast({ 
                title: "Email requis", 
                description: "Merci de saisir votre email pour voter.",
                style: { backgroundColor: 'white', color: '#001a70' }
            })
            return
        }

        if (Object.keys(votes).length === 0) {
            toast({ 
                title: "Sélection requise", 
                description: "Merci de sélectionner au moins une vidéo.",
                style: { backgroundColor: 'white', color: '#001a70' }
            })
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
            toast({ 
                title: "Déjà voté", 
                description: "Vous avez déjà voté avec cet email depuis cette adresse IP.",
                style: { backgroundColor: 'white', color: '#001a70' }
            })
            return
        }

        if (result.inserted?.length > 0) {
            setHasVoted(true)
            setEmail("")
            setVotes({})
            toast({ 
                title: "Merci pour votre participation", 
                description: "Vos votes ont bien été enregistrés.",
                style: { backgroundColor: 'white', color: '#001a70' }
            })
        }

        if (result.errors?.length > 0) {
            toast({ 
                title: "Erreur", 
                description: result.errors.join(", "),
                style: { backgroundColor: 'white', color: '#001a70' }
            })
        }
    }

    const handleShowAllVideos = (categorie: string) => {
        setShowAllVideos(prev => ({ ...prev, [categorie]: true }))
    }

    const renderStepContent = () => {
        if (currentStep === 1 && categories[0]) {
            const videos = Array.isArray(data[categories[0]]) ? data[categories[0]] : []
            const displayedVideos = showAllVideos[categories[0]] ? videos : videos.slice(0, 6)
            const hasMoreVideos = videos.length > 6

            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-[#001a70]">Étape 1 : Votez pour {categories[0]}</h2>
                        {votes[categories[0]] && (
                            <Button 
                                onClick={() => clearVoteForStep(1)}
                                variant="outline"
                                size="sm"
                                className="text-[#FE5715] border-[#FE5715] bg-white hover:bg-white hover:text-[#FE5715]"
                            >
                                Désélectionner
                            </Button>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedVideos.length > 0 ? (
                            displayedVideos.map((video) => (
                                <div key={video.id} className="p-4 rounded-lg bg-white">
                                    <video src={video.video_url} controls className="w-full rounded mb-2" />
                                    <p className="text-black"><strong>{video.titre_projet}</strong></p>
                                    <div className="h-[90px]">
                                    <p className="text-black text-sm mb-2">{video.description_breve}</p>
                                    </div>
                                    
                                    <p className="text-black text-sm mt-2.5"><strong>Établissement </strong></p>
                                    <p className="text-black text-sm">{video.etablissement}</p>
                                    <p className="text-black text-sm mt-2.5"><strong>Classe </strong> </p>
                                    <p className="text-black text-sm "> {video.nom_classe || "Non renseignée"}</p>
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
                    
                    {hasMoreVideos && !showAllVideos[categories[0]] && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => handleShowAllVideos(categories[0])}
                                className="px-6 py-3 text-[#001a70] bg-transparent border border-[#001a70] rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'rgb(0, 26, 112)',
                                    border: '1px solid rgb(0, 26, 112)',
                                    borderRadius: '8px',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px',
                                    transition: '0.3s',
                                    transform: 'translateY(0px)'
                                }}
                            >
                                Voir plus de vidéos
                            </button>
                        </div>
                    )}
                </div>
            )
        }

        if (currentStep === 2 && categories[1]) {
            const videos = Array.isArray(data[categories[1]]) ? data[categories[1]] : []
            const displayedVideos = showAllVideos[categories[1]] ? videos : videos.slice(0, 6)
            const hasMoreVideos = videos.length > 6

            return (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-[#001a70]">Étape 2 : Votez pour {categories[1]}</h2>
                        {votes[categories[1]] && (
                            <Button 
                                onClick={() => clearVoteForStep(2)}
                                variant="outline"
                                size="sm"
                                className="text-[#FE5715] border-[#FE5715] bg-white hover:bg-white hover:text-[#FE5715]"
                            >
                                Désélectionner
                            </Button>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedVideos.length > 0 ? (
                            displayedVideos.map((video) => (
                                <div key={video.id} className="p-4 rounded-lg bg-white">
                                    <video src={video.video_url} controls className="w-full rounded mb-2" />
                                    <p className="text-black"><strong>{video.titre_projet}</strong></p>
                                    <div className="h-[90px]">
                                    <p className="text-black text-sm mb-2">{video.description_breve}</p>
                                    </div>
                                    
                                    <p className="text-black text-sm mt-2.5"><strong>Établissement </strong></p>
                                    <p className="text-black text-sm">{video.etablissement}</p>
                                    <p className="text-black text-sm mt-2.5"><strong>Classe </strong> </p>
                                    <p className="text-black text-sm "> {video.nom_classe || "Non renseignée"}</p>
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
                    
                    {hasMoreVideos && !showAllVideos[categories[1]] && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => handleShowAllVideos(categories[1])}
                                className="px-6 py-3 text-[#001a70] bg-transparent border border-[#001a70] rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'rgb(0, 26, 112)',
                                    border: '1px solid rgb(0, 26, 112)',
                                    borderRadius: '8px',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px',
                                    transition: '0.3s',
                                    transform: 'translateY(0px)'
                                }}
                            >
                                Voir plus de vidéos
                            </button>
                        </div>
                    )}
                </div>
            )
        }

        if (currentStep === 3) {
            return (
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[#001a70]">Étape 3 : Confirmez votre vote</h2>
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
                      {/* Bannière vote */}
        <div className="relative mx-auto px-8 py-4 transform -rotate-1 mt-8" style={{ backgroundColor: '#0e89ff', borderRadius: '16px', width: 'max-content' }}>
          <span className="text-white font-bold uppercase italic text-sm md:text-xl lg:text-2xl">
          Pour valider vos votes
          </span>
          <Image
            src="/edf-gros-eclair.png"
            alt="Trophée"
            width={64}
            height={64}
            className="absolute"
            style={{ top: '-2.5rem', right: '-1.75rem' }}
          />
        </div>

        {/* Titre du vote */}
        <div className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-8" style={{ color: '#001A70' }}>
        un vote par catégorie !
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
            <VoteHeroSection />
       
            <div className="p-6 max-w-6xl mx-auto mt-16 mb-50 text-black">
               

                {/* Indicateur de progression */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step <= currentStep 
                                            ? 'bg-[#001a70] text-white' 
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step}
                                    </div>
                                    <div className="mt-2 text-sm text-center">
                                        {step === 1 && <span className={step <= currentStep ? 'text-[#001a70]' : 'text-gray-600'}>{categories[0]}</span>}
                                        {step === 2 && <span className={step <= currentStep ? 'text-[#001a70]' : 'text-gray-600'}>{categories[1]}</span>}
                                        {step === 3 && <span className={step <= currentStep ? 'text-[#001a70]' : 'text-gray-600'}>Validation</span>}
                                    </div>
                                </div>
                                {index < 2 && (
                                    <div className={`w-0 md:w-16 h-1 mx-4 ${
                                        step < currentStep ? 'bg-[#001a70]' : 'bg-gray-200'
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
                                            className="bg-[#001a70] text-white border-none uppercase"
                                        >
                                            Précédent
                                        </Button>
                                    )}
                                    
                                    <div className={`flex space-x-4 ${currentStep === 1 ? 'ml-auto' : ''}`}>
                                        {currentStep < 3 ? (
                                            <Button 
                                                onClick={handleNext}
                                                className="border-none uppercase"
                                                disabled={!canProceedToNext()}
                                            >
                                                Suivant
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={handleSubmit}
                                                className="border-none uppercase"
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
