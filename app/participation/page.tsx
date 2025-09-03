"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ParticipationHeroSection } from "@/components/participation/ParticipationHeroSection";

type FormState = {
  // 1) Enseignant
  nom: string
  prenom: string
  email: string
  telephone: string

  // 2) Établissement
  etablissement: string
  etablissement_adresse: string
  categorie: string            // <- "CP/CE1/CE2" ou "CM1/CM2/6e" (catégorie de la classe concernée)
  nom_classe: string           // ex: "CP1", "CE2 B", etc.
  nb_eleves: string            // on garde string dans l'UI, converti en number au submit

  // 3) Projet
  titre_projet: string
  description_breve: string

  // 4) Vidéo
  video_url: string

  // 5) Consentements
  reglement_accepte: boolean
  autorisations_parentales: boolean
  autorise_diffusion: boolean
}

export default function InscriptionPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState<FormState>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    etablissement: "",
    etablissement_adresse: "",
    categorie: "",         // "CP/CE1/CE2" | "CM1/CM2/6e"
    nom_classe: "",
    nb_eleves: "",
    titre_projet: "",
    description_breve: "",
    video_url: "",
    reglement_accepte: false,
    autorisations_parentales: false,
    autorise_diffusion: false,
  })

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    } else {
      toast({ title: "Fichier invalide", description: "Merci de déposer une vidéo uniquement." })
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    maxFiles: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? String(value) : value,
    }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const uploadVideoToS3 = async () => {
    if (!videoFile) return null

    const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: videoFile.name, type: videoFile.type }),
    })

    if (!res.ok) {
      toast({ title: "Erreur", description: "Impossible d'obtenir une URL d'upload." })
      return null
    }

    const { uploadUrl, fileUrl } = await res.json()

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("PUT", uploadUrl, true)
      xhr.setRequestHeader("Content-Type", videoFile.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) resolve(fileUrl)
        else reject(new Error("Échec de l'upload vers S3"))
      }

      xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload vers S3"))
      xhr.send(videoFile)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      toast({ title: "Erreur", description: "Merci de déposer une vidéo." })
      return
    }

    // validations simples côté client
    if (!formData.reglement_accepte || !formData.autorisations_parentales || !formData.autorise_diffusion) {
      toast({ title: "Consentements requis", description: "Merci de cocher toutes les cases obligatoires." })
      return
    }
    if (!formData.categorie) {
      toast({ title: "Catégorie manquante", description: "Merci de sélectionner la catégorie de la classe concernée." })
      return
    }
    if (!formData.nom_classe) {
      toast({ title: "Nom de la classe manquant", description: "Merci d'indiquer le nom de la classe." })
      return
    }
    if (formData.nb_eleves === "" || isNaN(parseInt(formData.nb_eleves))) {
      toast({ title: "Nombre d'élèves invalide", description: "Merci d'indiquer un entier." })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const fileUrl = await uploadVideoToS3()
      if (!fileUrl) return

      const payload = {
        // 1) Enseignant
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone || null,

        // 2) Établissement
        etablissement: formData.etablissement,
        etablissement_adresse: formData.etablissement_adresse,
        categorie: formData.categorie,          // "CP/CE1/CE2" | "CM1/CM2/6e"
        nom_classe: formData.nom_classe,
        nb_eleves: parseInt(formData.nb_eleves, 10),

        // 3) Projet
        titre_projet: formData.titre_projet,
        description_breve: formData.description_breve,

        // 4) Vidéo
        video_url: fileUrl,

        // 5) Consentements
        reglement_accepte: formData.reglement_accepte,
        autorisations_parentales: formData.autorisations_parentales,
        autorise_diffusion: formData.autorise_diffusion,
      }

      // ⚠️ Vérifie que l'URL pointe bien sur l'Edge Function mise à jour
      const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Erreur lors de l'enregistrement")
      }

      // Redirection vers la page de confirmation
      router.push('/participation/confirmation')
    } catch (error) {
      toast({ title: "Erreur", description: (error as Error).message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <main>
      <ParticipationHeroSection />
    <section className="" style={{
      backgroundImage: 'url(/edf-hands.png), url(/edf-eolienne.png)',
      backgroundPosition: '10% 10%, 85% 60%',
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundSize: 'auto, auto'
    }}>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 mt-16 px-2.5 md:px-0">
                {/* 1) Informations sur l'enseignant */}
                <div className="flex flex-col mb-6">
              <Image 
                src="/edf-cChiffre1.png" 
                alt="Étape 1" 
                width={64} 
                height={64} 
                className="text-primary" 
              />
              <p className="text-black mt-2 text-[20px] md:text-[32px] font-bold">Informations sur l&apos;enseignant</p>
            </div>
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#344054]">Prénom*</Label>
              <Input name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
            <div>
              <Label className="text-[#344054]">Nom*</Label>
              <Input name="nom" placeholder="Votre nom" value={formData.nom} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
            <div className="md:col-span-1">
              <Label className="text-[#344054]">Adresse mail professionnelle*</Label>
              <Input type="email" name="email" placeholder="exemple@ecole.fr" value={formData.email} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
            <div className="md:col-span-1">
              <Label className="text-[#344054]">Numéro de téléphone (facultatif)</Label>
              <Input name="telephone" placeholder="06 12 34 56 78" value={formData.telephone} onChange={handleChange} className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
          </div>
        </section>

        {/* 2) Informations sur l'établissement */}
        <div className="flex flex-col mb-6">
              <Image 
                src="/edf-chiffre2.png" 
                alt="Étape 2" 
                width={64} 
                height={64} 
                className="text-primary" 
              />
              <p className="text-black mt-2 text-[20px] md:text-[32px] font-bold">Informations sur l’établissement</p>
            </div>
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-[#344054]">Nom de l&apos;école ou du collège*</Label>
              <Input name="etablissement" placeholder="École élémentaire Jean Moulin" value={formData.etablissement} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-[#344054]">Adresse*</Label>
              <Input name="etablissement_adresse" placeholder="123 rue de la République, 75001 Paris" value={formData.etablissement_adresse} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-[#344054]">Catégorie de la classe concernée*</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData((p) => ({ ...p, categorie: value }))}
              >
                <SelectTrigger className="bg-white border-[#d0d5dd] text-black">
                  <SelectValue placeholder="Sélectionner une catégorie" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CP/CE1/CE2">CP/CE1/CE2</SelectItem>
                  <SelectItem value="CM1/CM2/6e">CM1/CM2/6e</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#344054]">Nom de la classe*</Label>
              <Input
                name="nom_classe"
                placeholder="Exemple: CP1, CE2 B..."
                value={formData.nom_classe}
                onChange={handleChange}
                required
                className="bg-white placeholder:text-black text-black border-[#d0d5dd]"
              />
            </div>

            <div>
              <Label className="text-[#344054]">Nombre d&apos;élèves dans la classe*</Label>
              <Input
                type="number"
                min={0}
                name="nb_eleves"
                placeholder="25"
                value={formData.nb_eleves}
                onChange={handleChange}
                required
                className="bg-white placeholder:text-black text-black border-[#d0d5dd]"
              />
            </div>
          </div>
        </section>

        {/* 3) Projet soumis par la classe */}
        <div className="flex flex-col mb-6">
              <Image 
                src="/edf-chiffre3.png" 
                alt="Étape 3" 
                width={64} 
                height={64} 
                className="text-primary" 
              />
              <p className="text-black mt-2 text-[20px] md:text-[32px] font-bold">Projet soumis par la classe</p>
            </div>
        
        <section className="space-y-4">
          <div>
            <Label className="text-[#344054]">Titre du projet*</Label>
            <Input name="titre_projet" placeholder="Titre de votre projet" value={formData.titre_projet} onChange={handleChange} required className="bg-white placeholder:text-black text-black border-[#d0d5dd]" />
          </div>
          <div>
            <Label className="text-[#344054]">Brève description du projet (max)</Label>
            <textarea
              name="description_breve"
              placeholder="Décrivez brièvement votre projet..."
              value={formData.description_breve}
              onChange={handleChange}
              required
              className="w-full border border-[#d0d5dd] rounded p-2 min-h-[120px] bg-white placeholder:text-black text-black"
            />
          </div>
        </section>

        {/* 4) Vidéo */}
        <section className="space-y-2">
          <Label className="text-[#344054]">Vidéo*</Label>
          <div
            {...getRootProps()}
            className="w-full border-2 border-dashed border-[#d0d5dd] p-8 rounded text-center cursor-pointer bg-white hover:bg-gray-50 min-h-[120px] flex items-center justify-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Déposez la vidéo ici...</p>
            ) : videoFile ? (
              <p className="text-black">🎬 {videoFile.name}</p>
            ) : (
              <>
                <p className="text-black">Faites glisser une vidéo ici ou cliquez pour en sélectionner une<br></br><span className="text-muted-foreground">Format accepté: MP4</span></p>
                <br></br>
              
              </>
            )}
          </div>

          {videoPreview && (
            <video src={videoPreview} controls className="mt-4 w-full rounded border-[#d0d5dd] shadow" />
          )}

          {uploading && (
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="h-2 bg-blue-500 rounded transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </section>

        {/* 5) Consentements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="reglement_accepte"
              type="checkbox"
              name="reglement_accepte"
              checked={formData.reglement_accepte}
              onChange={handleCheckbox}
              required
              className="w-5 h-5"
            />
            <Label htmlFor="reglement_accepte" className="text-black">J&apos;ai lu et accepté le <a href="/reglement.pdf" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800 underline">règlement</a>*</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="autorisations_parentales"
              type="checkbox"
              name="autorisations_parentales"
              checked={formData.autorisations_parentales}
              onChange={handleCheckbox}
              required
              className="w-5 h-5"
            />
            <Label htmlFor="autorisations_parentales" className="text-black">J&apos;ai réuni les autorisations parentales nécessaires*</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="autorise_diffusion"
              type="checkbox"
              name="autorise_diffusion"
              checked={formData.autorise_diffusion}
              onChange={handleCheckbox}
              required
              className="w-5 h-5"
            />
            <Label htmlFor="autorise_diffusion" className="text-black">J&apos;autorise la diffusion des vidéos sur la plateforme publique*</Label>
          </div>
        </section>

        <div className="flex justify-center">
          <Button type="submit" disabled={uploading} className="w-full md:w-auto" style={{ backgroundColor: '#FE5715' }}>
            {uploading ? "Envoi en cours..." : "Valider l'inscription"}
          </Button>
        </div>
      </form>
    </section>
    </main>
    
  )
}
