'use client'

import Image from 'next/image'

export function Footer() {
    return (
        <footer className="w-full mt-12 md:mt-72 text-center text-sm text-muted-foreground">

<section 
        className="w-full relative"
        style={{
          height: '195px',
          backgroundImage: 'url(/edf-sep1-pattern.png)',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Image 
          src="/edf-homme-labo.png" 
          alt="Homme en laboratoire EDF"
          width={287}
          height={287}
          className="absolute left-0 -top-[310px] md:-top-[310px] -top-[50px] h-[240px] md:h-auto w-1/2 md:w-auto"
        />
      </section>

      <section 
        className="w-full relative"
        style={{
          backgroundImage: 'url(/edf-bg-section-participer-2x.png)',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-row justify-center items-center py-8">
          <a href="/" className="text-white uppercase font-bold font-edf2020 hover:underline">
            Accueil
          </a>
          <div className="w-8 h-px bg-white mx-6"></div>
          <a href="/vote" className="text-white uppercase font-bold font-edf2020 hover:underline">
            Voter
          </a>
          <div className="w-8 h-px bg-white mx-6"></div>
          <a href="/participation" className="text-white uppercase font-bold font-edf2020 hover:underline">
            S&apos;inscrire
          </a>
        </div>
                   {/* Séparateur blanc */}
        <div className="w-1/2 h-px bg-white mx-auto"></div>

{/* Section liens et copyright */}
<div className="flex flex-col md:flex-row justify-evenly items-center py-6 px-4">
  <div className="flex gap-6 mb-4 md:mb-0">
    <a href="/Reglement_du_Concours.pdf" target="_blank" rel="noopener noreferrer" className="text-white underline text-sm">
      Règlement du jeu &  Politique de confidentialité
    </a>
   
  </div>
  <div className="text-white text-sm">
    © 2025 EDF en Martinique
  </div>
</div>

{/* Logo centré */}
<div className="flex justify-center py-4">
  <Image 
    src="/edf-footer-logo.png" 
    alt="Logo EDF Footer"
    width={150}
    height={150}
    className=" w-auto"
  />
</div>
      </section>

     
           
        </footer>
    )
}