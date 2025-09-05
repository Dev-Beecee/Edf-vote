"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export const VoteHeroSection = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative participation-hero-bg">
        {/* Image centrée */}
        <div className="mb-8">
          <Image
            src="/edf-logo-header-2x.png"
            alt="EDF Logo"
            width={300}
            height={100}
            className="mx-auto"
            priority
          />
        </div>
        
        {/* Sous-titre */}
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold uppercase italic mt-4 font-work-sans" style={{ color: '#001a70' }}>
        Des idées pleines d’énergie pour demain !
        </h2>
        
        {/* Bannière vote */}
        <div className="relative mx-auto px-8 py-4 transform -rotate-1 mt-8" style={{ backgroundColor: '#0e89ff', borderRadius: '16px' }}>
          <span className="text-white font-bold uppercase italic text-sm md:text-xl lg:text-2xl font-work-sans">
          Votez pour vos vidéos préférées
          </span>
          <Image
            src="/edf-big-fire.png"
            alt="Trophée"
            width={64}
            height={64}
            className="absolute"
            style={{ top: '-2.5rem', right: '-1.75rem' }}
          />
        </div>

        {/* Titre du vote */}
        <div className="text-center text-3xl md:text-4xl lg:text-5xl font-bold  font-hore" style={{ color: '#001A70' }}>
        un vote par catégorie !
        </div>

        {/* Description du vote */}
        <div className="mt-8 max-w-4xl mx-auto px-4">
          <p className="text-black text-lg text-center leading-relaxed mb-16 font-edf2020" style={{ fontSize: '18px' }}>
          Sélectionnez votre vidéo préférée dans chaque catégorie.
            <br /><br />
            Vous pouvez voter pour 1 vidéo par niveau avant <span className="underline">le 7 novembre 2025.</span> 
          </p>
        </div>

      
      </section>
    </>
  );
};
