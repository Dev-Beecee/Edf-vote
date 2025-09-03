import { HeroSection } from "@/components/home/HeroSection";
import { CommentParticiper } from "@/components/home/CommentParticiper";
import TroisiemeSection from "@/components/home/TroisiemeSection";
import { CalendrierConcours } from "@/components/home/CalendrierConcours";
import PartenairesSection from "@/components/home/PartenairesSection";

export const metadata = {
  title: "EDF - Vote",
  description: "EDF - Vote",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "EDF - Vote",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn - Landing template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "EDF - Vote",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
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
