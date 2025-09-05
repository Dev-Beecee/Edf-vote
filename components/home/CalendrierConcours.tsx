import Image from "next/image";

export function CalendrierConcours() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}

        <div className="relative mx-auto px-8 py-4 transform -rotate-1" style={{ backgroundColor: '#0e89ff', borderRadius: '16px', marginTop: '55px', width: 'fit-content' }}>
          <span className="text-white font-bold uppercase italic text-lg md:text-xl lg:text-2xl ">
          Calendrier
          </span>
        
        </div>

        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase italic mb-4 font-hore" style={{ color: '#001a70' }}>
            du Concours            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-black font-edf2020">
              Certaines dates sont susceptibles d&apos;être modifiées.              </p>
            </div>
          </div>

        {/* Timeline Cards */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 mb-12 relative">
          {/* Card 1 - Inscription */}
          <div className="flex flex-col items-center text-center w-full md:w-48 lg:w-64 relative bg-blue-100 p-6 rounded-lg transition-all duration-300 hover:bg-blue-900 group">
            <div className="relative z-10 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900">
              <Image
                src="/edf-pen.png"
                alt="Inscription"
                width={48}
                height={48}
                className="text-[#001A70] group-hover:text-white"
                
              />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-[#001A70] group-hover:text-white font-edf2020">
              Du 15 septembre au 24 octobre
            </h4>
            <p className="text-[#001A70] text-sm group-hover:text-white font-edf2020">
              Inscription et enregistrement des participations
            </p>
            {/* Connector image */}
            <div className="hidden md:block absolute right-[-30%] z-20" style={{ top: "8rem" }}>
              <Image
                src="/edf-calendrier-sep1.png"
                alt="Séparateur"
                width={80}
                height={20}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Card 2 - Votes */}
          <div className="flex flex-col items-center text-center w-full md:w-48 lg:w-64 relative bg-blue-100 p-6 rounded-lg transition-all duration-300 hover:bg-blue-900 group">
            <div className="relative z-10 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900">
              <Image
                src="/edf-eclair.png"
                alt="Votes"
                width={48}
                height={48}
                className="text-[#001A70] group-hover:text-white"
                
              />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-[#001A70] group-hover:text-white font-edf2020">
              Du 27 octobre au 7 novembre 2025
            </h4>
            <p className="text-[#001A70] text-sm group-hover:text-white font-edf2020">
              Votes du public sur le site du concours
            </p>
            {/* Connector image */}
            <div className="hidden md:block absolute right-[-30%] z-20" style={{ top: "8rem" }}>
              <Image
                src="/edf-calendrier-sep2.png"
                alt="Séparateur"
                width={80}
                height={20}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Card 3 - Délibérations */}
          <div className="flex flex-col items-center text-center w-full md:w-48 lg:w-64 relative bg-blue-100 p-6 rounded-lg transition-all duration-300 hover:bg-blue-900 group">
            <div className="relative z-10 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900">
              <Image
                src="/edf-fire.png"
                alt="Délibérations"
                width={48}
                height={48}
                className="text-[#001A70] group-hover:text-white"
              />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-[#001A70] group-hover:text-white font-edf2020">
              Du 10 au 12 novembre 2025
            </h4>
            <p className="text-[#001A70] text-sm group-hover:text-white font-edf2020">
              Délibérations du jury sur les différentes catégories
            </p>
            {/* Connector image */}
            <div className="hidden md:block absolute right-[-30%] z-20" style={{ top: "8rem" }}>
              <Image
                src="/edf-calendrier-sep3.png"
                alt="Séparateur"
                width={80}
                height={20}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Card 4 - Annonce */}
          <div className="flex flex-col items-center text-center w-full md:w-48 lg:w-64 relative bg-blue-100 p-6 rounded-lg transition-all duration-300 hover:bg-blue-900 group">
            <div className="relative z-10 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900">
              <Image
                src="/edf-goldcup.png"
                alt="Annonce"
                width={48}
                height={48}
                className="text-[#001A70] group-hover:text-white"
              />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-[#001A70] group-hover:text-white font-edf2020">
              Du 20 au 22 novembre 2025
            </h4>
            <p className="text-[#001A70] text-sm group-hover:text-white font-edf2020">
              Annonce des gagnants et remise des prix
            </p>
          </div>
        </div>

        
        
      </div>
    </section>
  );
}
