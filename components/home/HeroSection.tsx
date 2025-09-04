"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative" style={{
        backgroundImage: 'url(/edf-femme-labo.png)',
        backgroundPosition: 'bottom left',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '15%'
      }}>
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
        
        {/* Phrase centrée avec style */}
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold uppercase italic" style={{ color: '#001a70' }}>
          Des idées pleines d&apos;énergie pour demain !
        </h2>
        
       
        
        {/* Bannière concours vidéo */}
        <div className="relative mx-auto px-8 py-4 transform -rotate-1" style={{ backgroundColor: '#0e89ff', borderRadius: '16px', marginTop: '55px' }}>
          <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl">
            Concours vidéo ludique
          </span>
          <Image
            src="/edf-goldcup.png"
            alt="Trophée"
            width={64}
            height={64}
            className="absolute"
            style={{ top: '-2.5rem', right: '-1.75rem' }}
          />
        </div>

         {/* Nouvelle div avec le texte demandé */}
         <div className="text-center text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#001A70' }}>
         « Intelligences et transition énergétique »     
         </div>

        {/* Description du concours */}
        <div className="mt-8 max-w-4xl mx-auto px-4">
          <p className="text-black text-lg text-center" style={{ fontSize: '18px' }}>
            EDF en Martinique et le Carbet des Sciences lancent un concours vidéo ludique, pédagogique et engagé destiné aux classes du CP à la 6e, sur le thème « Intelligences et transition énergétique ».
            À travers la création de vidéos de 3 minutes, les élèves sont invités à imaginer des solutions locales et intelligentes pour aider la Martinique à réussir sa transition énergétique.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/participation">
            <button 
              className="px-6 py-3 text-white font-semibold"
              style={{ 
                backgroundColor: '#001a70', 
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)'
              }}
            >
              Je participe
            </button>
          </Link>
          <Link href="/vote">
            <button 
              className="px-6 py-3 text-white font-semibold"
              style={{ 
                backgroundColor: '#FE5715', 
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)'
              }}
            >
              Je vote
            </button>
          </Link>
        </div>

        {/* Section des prix */}
        <div className="mt-8 max-w-4xl mx-auto px-4">
          <p className="text-right" style={{ color: '#001A70' }}>
            À LA CLÉ ?
          </p>
          <p className="text-right underline font-normal text-2xl md:text-3xl lg:text-3xl" style={{ color: '#001A70', fontWeight: '400' }}>
            Une sortie pédagogique et des cadeaux <br></br>à gagner pour les meilleures vidéos.
          </p>
        </div>

        
      </section>

      {/* Section full width avec background pattern */}
      <section 
        className="w-full"
        style={{
          height: '195px',
          backgroundImage: 'url(/edf-sep1-pattern.png)',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </>
  );
};
