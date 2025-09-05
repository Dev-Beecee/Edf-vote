import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TroisiemeSection = () => {
  return (
    <section 
      className="relative w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/edf-bg-section-participer-2x.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <div className="container mx-auto px-4 flex items-center flex-col-reverse md:flex-row md:px-4" style={{ padding: '20px' }}>
        {/* Div 30% avec l'image de la fille de Martinique */}
        <div className="w-full md:w-3/10 flex justify-center mb-6 md:mb-0" style={{ marginTop: '55px' }}>
          <Image 
            src="/edf-fillemartinique.png" 
            alt="Fille de Martinique" 
            width={400}
            height={600}
            className="w-1/2 md:w-1/2 h-auto"
          />
        </div>

        {/* Div 70% avec le contenu */}
        <div className="w-full md:w-7/10 md:pl-8">
          {/* Titre "Comment" */}
          <div className="relative  px-8 py-4 transform -rotate-1" 
               style={{ backgroundColor: '#fe5715', borderRadius: '16px', width: 'fit-content' }}>
            <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl font-work-sans">
            Une seule limite
            </span>
          </div>

          {/* H2 */}
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mt-6 mb-4 font-hore">
            3 minutes pour engager, sensibiliser et convaincre
          </h2>

          {/* Paragraphe */}
          <p className="text-white text-lg md:text-xl mb-6 font-edf2020 bold">
            Vos élèves peuvent laisser libre cours à leur imagination autour de :
          </p>

          {/* Liste avec éclairs */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <Image src="/edf-gros-eclair.png" alt="Éclair" width={24} height={24} className="w-6 h-6 mr-3" />
              <span className="text-white text-lg font-edf2020">Le système énergétique idéal de la Martinique dans 50 ans</span>
            </li>
            <li className="flex items-center">
              <Image src="/edf-gros-eclair.png" alt="Éclair" width={24} height={24} className="w-6 h-6 mr-3 " />
              <span className="text-white text-lg font-edf2020">Une invention qui produit de l’énergie sans polluer</span>
            </li>
            <li className="flex items-center">
              <Image src="/edf-gros-eclair.png" alt="Éclair" width={24} height={24} className="w-6 h-6 mr-3 " />
              <span className="text-white text-lg font-edf2020">L’intelligence collective au service de l’environnement</span>
            </li>
            
          </ul>

          {/* Bouton "Je participe" */}
          <Link href="/participation">
            <button 
              className="px-8 py-4 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:opacity-90 font-edf2020 uppercase"
              style={{
                backgroundColor: '#fe5715',
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)'
              }}
            >
              Je participe
            </button>
          </Link>
        </div>
      </div>

      {/* Image EDF en position absolue en bas à droite */}
      <Image 
        src="/edf-icon-edf.png" 
        alt="Icon EDF" 
        width={200}
        height={200}
        className="absolute w-auto h-auto edf-icon-responsive"
        style={{ zIndex: 10, right: '10%' }}
      />
    </section>
  );
};

export default TroisiemeSection;
