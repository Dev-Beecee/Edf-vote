import React from 'react';

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
          <img 
            src="/edf-fillemartinique.png" 
            alt="Fille de Martinique" 
            className="w-full md:w-1/2 h-auto"
          />
        </div>

        {/* Div 70% avec le contenu */}
        <div className="w-full md:w-7/10 md:pl-8">
          {/* Titre "Comment" */}
          <div className="relative  px-8 py-4 transform -rotate-1" 
               style={{ backgroundColor: '#fe5715', borderRadius: '16px', width: 'fit-content' }}>
            <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl">
            Une seule limite
            </span>
          </div>

          {/* H2 */}
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mt-6 mb-4">
            3 minutes pour engager, sensibiliser et convaincre
          </h2>

          {/* Paragraphe */}
          <p className="text-white text-lg md:text-xl mb-6">
            Vos élèves peuvent laisser libre cours à leur imagination autour de :
          </p>

          {/* Liste avec éclairs */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <img src="/edf-gros-eclair.png" alt="Éclair" className="w-6 h-6 mr-3" />
              <span className="text-white text-lg">L'énergie renouvelable et la transition écologique</span>
            </li>
            <li className="flex items-center">
              <img src="/edf-gros-eclair.png" alt="Éclair" className="w-6 h-6 mr-3" />
              <span className="text-white text-lg">Les innovations technologiques du secteur énergétique</span>
            </li>
            <li className="flex items-center">
              <img src="/edf-gros-eclair.png" alt="Éclair" className="w-6 h-6 mr-3" />
              <span className="text-white text-lg">La consommation responsable et les économies d'énergie</span>
            </li>
            <li className="flex items-center">
              <img src="/edf-gros-eclair.png" alt="Éclair" className="w-6 h-6 mr-3" />
              <span className="text-white text-lg">Les métiers de l'énergie et les carrières du futur</span>
            </li>
          </ul>

          {/* Bouton "Je participe" */}
          <button 
            className="px-8 py-4 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: '#fe5715',
              borderRadius: '8px',
              boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)'
            }}
          >
            Je participe
          </button>
        </div>
      </div>

      {/* Image EDF en position absolue en bas à droite */}
      <img 
        src="/edf-icon-edf.png" 
        alt="Icon EDF" 
        className="absolute right-0 w-auto h-auto"
        style={{ zIndex: 10, bottom: '-50px' }}
      />
    </section>
  );
};

export default TroisiemeSection;
