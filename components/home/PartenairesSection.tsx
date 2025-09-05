import Image from "next/image";

export default function PartenairesSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        {/* Div vide 30% */}
        <div className="w-[30%]"></div>
        
        {/* Contenu principal 70% */}
        <div className="w-full md:w-[70%]">
          {/* Badge bleu avec rotation */}
          <div className="relative px-8 py-4 transform -rotate-1" style={{ backgroundColor: '#0e89ff', borderRadius: '16px', marginTop: '55px', width: 'fit-content' }}>
            <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl font-work-sans">
              partenaires
            </span>
            <Image
              src="/edf-gros-eclair.png"
              alt="Trophée"
              width={64}
              height={64}
              className="absolute"
              style={{ top: '-2.5rem', right: '-1.75rem' }}
            />
          </div>
          
          {/* Titre bleu 900 uppercase */}
          <h2 className="text-blue-900 font-bold uppercase text-2xl md:text-3xl lg:text-4xl  mb-6 font-hore">
            engagé pour le concours
          </h2>
          
          {/* Paragraphe */}
          <p className="text-black text-lg leading-relaxed mb-8 font-edf2020">
            EDF et ses partenaires sont fiers de soutenir ce concours, reflet de leur engagement en faveur de projets innovants, éducatifs et durables. Ensemble, ils encouragent les jeunes à devenir acteurs de la transition énergétique.
          </p>
          
          {/* Image CDS_logo.png alignée à gauche */}
          <div className="flex justify-start">
            <Image
              src="/CDS_logo.png"
              alt="Logo CDS"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
