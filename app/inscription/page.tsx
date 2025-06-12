"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

export default function InscriptionPage() {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        etablissement: "",
        classe: "",
        categorie: "",
        description: "",
        video_url: "",
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
            toast({
                title: "Fichier invalide",
                description: "Merci de déposer une vidéo uniquement.",
            })
        }
    }, [toast])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "video/*": [] },
        maxFiles: 1,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const uploadVideoToS3 = async () => {
        if (!videoFile) return null;

        const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/presigned-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename: videoFile.name, type: videoFile.type }),
        });

        if (!res.ok) {
            toast({ title: "Erreur", description: "Impossible d'obtenir une URL d'upload." });
            return null;
        }

        const { uploadUrl, fileUrl } = await res.json();

        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);
            xhr.setRequestHeader("Content-Type", videoFile.type);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(fileUrl);
                } else {
                    reject(new Error("Échec de l'upload vers S3"));
                }
            };

            xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload vers S3"));

            xhr.send(videoFile);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!videoFile) {
            toast({ title: "Erreur", description: "Merci de déposer une vidéo." })
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            const fileUrl = await uploadVideoToS3()
            if (!fileUrl) return

            const res = await fetch("https://yiuvykjjpycqzkxlnhmc.supabase.co/functions/v1/inscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, video_url: fileUrl }),
            })

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement")

            toast({ title: "Succès", description: "Soumission enregistrée." })

            // ✅ Reset complet
            setFormData({
                nom: "",
                prenom: "",
                etablissement: "",
                classe: "",
                categorie: "",
                description: "",
                video_url: "",
            })
            setVideoFile(null)
            setVideoPreview(null)
            setUploadProgress(0)
        } catch (error) {
            toast({ title: "Erreur", description: (error as Error).message })
        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 mt-16">
            <div>
                <Label>Nom</Label>
                <Input name="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div>
                <Label>Prénom</Label>
                <Input name="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div>
                <Label>Établissement</Label>
                <Input name="etablissement" value={formData.etablissement} onChange={handleChange} required />
            </div>
            <div>
                <Label>Classe</Label>
                <Input name="classe" value={formData.classe} onChange={handleChange} />
            </div>
            <div>
                <Label>Choisissez une catégorie</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, categorie: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisissez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Collège">Collège</SelectItem>
                        <SelectItem value="Lycée">Lycée</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Description</Label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <Label>Vidéo</Label>
                <div
                    {...getRootProps()}
                    className="w-full border-2 border-dashed p-4 rounded text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Déposez la vidéo ici...</p>
                    ) : videoFile ? (
                        <p className="text-green-600">🎬 {videoFile.name}</p>
                    ) : (
                        <p>Faites glisser une vidéo ici ou cliquez pour en sélectionner une</p>
                    )}
                </div>
                {videoPreview && (
                    <video
                        src={videoPreview}
                        controls
                        className="mt-4 w-full rounded border shadow"
                    />
                )}
                {uploading && (
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                        <div
                            className="h-2 bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={uploading}>
                {uploading ? "Envoi en cours..." : "Soumettre"}
            </Button>
        </form>
    )
}
