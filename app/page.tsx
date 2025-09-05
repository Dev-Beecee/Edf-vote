import { HeroSection } from "@/components/home/HeroSection";
import { CommentParticiper } from "@/components/home/CommentParticiper";
import TroisiemeSection from "@/components/home/TroisiemeSection";
import { CalendrierConcours } from "@/components/home/CalendrierConcours";
import PartenairesSection from "@/components/home/PartenairesSection";

export const metadata = {
  title: "Les Génies de l'énergie - Accueil | Concours vidéo EDF Martinique",
  description: "Découvrez le concours vidéo ludique 'Les Génies de l'énergie' organisé par EDF Martinique et le Carbet des Sciences. Un défi pédagogique pour les classes du CP à la 6e sur le thème 'Intelligences et transition énergétique'.",
  openGraph: {
    type: "website",
    url: "https://concoursvideo.edf-mq.fr",
    title: "Les Génies de l'énergie - Concours vidéo EDF Martinique",
    description: "Découvrez le concours vidéo ludique 'Les Génies de l'énergie' organisé par EDF Martinique et le Carbet des Sciences. Un défi pédagogique pour les classes du CP à la 6e sur le thème 'Intelligences et transition énergétique'.",
    images: [
      {
        url: "/edf-partage.jpg",
        width: 1200,
        height: 630,
        alt: "Les Génies de l'énergie - EDF Martinique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@EDF_Martinique",
    title: "Les Génies de l'énergie - Concours vidéo EDF Martinique",
    description: "Découvrez le concours vidéo ludique 'Les Génies de l'énergie' organisé par EDF Martinique et le Carbet des Sciences. Un défi pédagogique pour les classes du CP à la 6e sur le thème 'Intelligences et transition énergétique'.",
    images: [
      "/edf-partage.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <CommentParticiper />
      
      <TroisiemeSection />
      <CalendrierConcours />
      <PartenairesSection />
    </>
  );
}
