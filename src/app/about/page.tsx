import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Náš příběh | VášBrand',
  description: 'Příběh a filozofie našeho e-shopu s originálními autorskými potisky.'
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Pozadí - obrázek džungle */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/jungle-bg.jpg" 
          alt="Džungle" 
          fill 
          className="object-cover"
          priority
        />
        {/* Překrytí pro lepší čitelnost textu */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Obsah */}
      <div className="relative z-10 container mx-auto py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto bg-black/30 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Vítejte v džungli !(★ ω ★)</h1>
          
          <div className="space-y-6 text-lg">
            <p>
              Vítejte ve světě HappyWilderness, kde se fantazie setkává s módou a každý kus je jedinečným vyjádřením originality a kreativity.
            </p>
            
            <p>
              Čtyři různé tvůrčí osobnosti, každá úplně jiná, společně jsme se spojily abychom vám nabídly rozmanité spektrum designů a nápadů, které vás zaujmou a zaujmou vaše okolí. Stanete se tak zdrojem inspirace pro ostatní.
            </p>
            <div className="my-8 flex justify-center">
    <div className="relative overflow-hidden rounded-lg w-full max-w-2xl h-80">
      <Image 
        src="/images/OIG1.jpeg" 
        alt="Naše inspirace" 
        fill 
        className="object-cover"
      />
    </div>
  </div>
            <p>
                Věříme, že móda má být víc než jen oblečení - má být vyjádřením vašeho jedinečného stylu a hodnot. Proto se snažíme vytvářet produkty, které nejen skvěle vypadají, ale také mají příběh.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">Naše hodnoty</h2>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Originalita</strong> - Každý design je unikátní a vytvořený s důrazem na detail.</li>
              <li><strong>Kvalita</strong> - Používáme pouze prémiové materiály, které jsou příjemné na nošení a dlouho vydrží.</li>
              <li><strong></strong> - Výroba na vyžádání znamená minimální odpad a šetrný přístup k životnímu prostředí.</li>
              <li><strong></strong> </li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">Váš příběh</h2>
            
            <p>
              Jestli jste někdy byli na nějakém kouzelném místě, moc dobře víte, že kouzlo toho místa není jen v samotné fyzické přítomnosti ale v tom, že se to místo stane součástí vás samotných a že ve vás se utvoří spojení s tímto místem, takže se na něj můžete v myšlenkách kdykoliv vracet a prožívat to okouzlení stále znovu a znovu. Z tohoto důvodu jsme se rozhodli vytvořit HappyWilderness, abychom vám mohli předat kousek tohoto kouzla a pomoci vám vytvořit si z vlastního domova nevšední místo, kde se budete cítit šťastní a naplnění.
            </p>
            
            <div className="mt-10 text-center">
              <p className="italic">
                "Věříme, že móda má být víc než jen oblečení - má být vyjádřením vašeho jedinečného stylu a hodnot."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}