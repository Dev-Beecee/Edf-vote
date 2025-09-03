"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export const ParticipationHeroSection = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative" style={{
        backgroundImage: 'url(/edf-femme-labo-inverse.png)',
        backgroundPosition: 'bottom right',
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
        
        {/* Sous-titre */}
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold uppercase italic mt-4" style={{ color: '#001a70' }}>
          Des idées pleines d'énergie pour demain !
        </h2>
        
        {/* Bannière concours vidéo */}
        <div className="relative mx-auto px-8 py-4 transform -rotate-1 mt-8" style={{ backgroundColor: '#0e89ff', borderRadius: '16px' }}>
          <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl">
            Inscrire une classe
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

        {/* Thème du concours */}
        <div className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-8" style={{ color: '#001A70' }}>
          au concours vidéo 2025    
        </div>

        {/* Description de la participation */}
        <div className="mt-8 max-w-4xl mx-auto px-4">
          <p className="text-black text-lg text-center leading-relaxed" style={{ fontSize: '18px' }}>
            Ce formulaire est destiné aux enseignants souhaitant inscrire leur classe (du CP à la 6e) au concours. Chaque classe peut soumettre jusqu'à 2 vidéos maximum dans le cadre du concours. Si vous souhaitez envoyer une deuxième vidéo, merci de remplir à nouveau ce formulaire avec les informations correspondantes.
            <br /><br />
            N'oubliez pas de donner un titre distinct à chaque vidéo pour faciliter l'identification.
          </p>
        </div>

        {/* Bouton d'action */}
        <div className="mt-12 flex justify-center items-center">
          <Link href="/reglement.pdf">
            <Button 
              className="px-8 py-4 font-semibold text-lg uppercase"
              style={{ 
                backgroundColor: 'transparent', 
                color: '#001a70',
                border: '1px solid #001a70',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Règlement
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
