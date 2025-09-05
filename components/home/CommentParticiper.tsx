"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export const CommentParticiper = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section 
      className="py-16 px-4 bg-white relative"
      style={{
        backgroundImage: `
          url('/edf-feuilles.png'),
          url('/edf-hands.png')
        `,
        backgroundPosition: `
          bottom center,
          ${isMobile ? '115% 0%' : '102% 0%'}
        `,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundSize: 'auto, auto'
      }}
    >
        <div className="relative mx-auto px-8 py-4 transform -rotate-1" style={{ backgroundColor: '#0e89ff', borderRadius: '16px', marginTop: '55px', width: 'fit-content' }}>
          <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl ">
          Comment
          </span>
        
        </div>
      <div className="max-w-6xl mx-auto">
        {/* Titre de la section */}
                  <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase italic mb-4 font-hore" style={{ color: '#001a70' }}>
           participer au concours ?
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-black font-edf2020">
                Une belle occasion pour vos élèves de mêler créativité, sciences et engagement pour un futur plus durable. Donnez-leur la parole, et révélez les génies de l&apos;énergie !
              </p>
            </div>
          </div>
        

        {/* Étapes de participation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 mb-12">
          {/* Étape 1 */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto relative">
            <div className="relative z-10 w-24 h-24 bg-white flex items-center justify-center " >
              <Image
                src="/edf-cChiffre1.png"
                alt="Étape 1"
                width={64}
                height={64}
                className="text-primary"
              />
            </div>
            <h4 className="text-lg font-semibold mt-6 text-black">
            Réalisation de la video
            </h4>
            <p className="text-gray-600 mt-2 text-black">
            Possibilité de réaliser cela en classe ou en groupe
            </p>
            <div className="hidden md:block absolute top-12 right-[-50%] w-full">
              <Image
                src="/edf-comment-sep.png"
                alt="Séparateur"
                width={400}
                height={403}
                className="w-full"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Étape 2 */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto relative">
            <div className="relative z-10 w-24 h-24  bg-white  flex items-center justify-center " style={{ borderColor: '#FE5715' }}>
              <Image
                src="/edf-chiffre2.png"
                alt="Étape 2"
                width={64}
                height={64}
                className="text-primary"
              />
            </div>
            <h4 className="text-lg font-semibold mt-6 text-black" >
            Inscription et dépôt des vidéos
            </h4>
            <p className="text-gray-600 mt-2 text-black">
            MP4, 720p minimum ainsi que 3 minutes de vidéo maximum
            </p>
            <div className="hidden md:block absolute top-12 right-[-50%] w-full">
            <Image
                src="/edf-comment-sep.png"
                alt="Séparateur"
                width={400}
                height={403}
                className="w-full"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Étape 3 */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto relative">
            <div className="relative z-10 w-24 h-24  bg-white -lg flex items-center justify-center " style={{ borderColor: '#001a70' }}>
              <Image
                src="/edf-chiffre3.png"
                alt="Étape 3"
                width={64}
                height={64}
                className="text-primary"
              />
            </div>
            <h4 className="text-lg font-semibold mt-6 text-black" >
            Appel aux votes
            </h4>
            <p className="text-gray-600 mt-2 text-black">
            Afin de faire partie du Top 3 et de gagner le meilleur prix
            </p>
          </div>
        </div>

       
      </div>
    </section>
  );
};
