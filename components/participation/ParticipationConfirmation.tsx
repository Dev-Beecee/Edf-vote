"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export const ParticipationConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" >
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
          Des idées pleines d&apos;énergie pour demain !
        </h2>
        
        {/* Bannière concours vidéo */}
        <div className="relative mx-auto px-8 py-4 transform -rotate-1 mt-8" style={{ backgroundColor: '#0e89ff', borderRadius: '16px' }}>
          <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl font-edf2020">
           Merci
          </span>
          
        </div>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Titre principal */}
       

        {/* Message de confirmation */}
        <div className="space-y-4">
    
          <p className="text-2xl md:text-3xl font-bold text-[#001a70] font-hore">
            POUR VOTRE INSCRIPTION!
          </p>
        </div>

        {/* Informations détaillées */}
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-black leading-relaxed font-edf2020">
            Votre classe est désormais inscrite au concours vidéo &quot;Intelligences &amp; Transition Énergétique&quot; organisé par EDF et le Carbet des Sciences dans le cadre de la Fête de la Science 2025.
          </p>
        </div>

        {/* Bouton de retour */}
        <div className="pt-8">
          <Link href="/">
            <Button 
              className="px-8 py-4 text-lg font-semibold rounded-lg uppercase font-edf2020"
              style={{ backgroundColor: '#FE5715' }}
            >
              RETOUR À L&apos;ACCUEIL
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
