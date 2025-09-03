'use client'

import Image from 'next/image'

export function Footer() {
    return (
        <footer className="w-full  mt-12 py-6 text-center text-sm text-muted-foreground">

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
          className="absolute left-0 -top-[310px] md:-top-[310px] -top-[85px] h-[287px] md:h-auto"
        />
      </section>
           
        </footer>
    )
}