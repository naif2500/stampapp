'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-32">
      <h1 className="text-3xl font-bold text-[#385C32] mb-6">
        Vilkår og betingelser
      </h1>

      <p className="text-gray-600 mb-4">
        Senest opdateret: 25. december 2025
      </p>

      <section className="space-y-4 text-gray-700 leading-relaxed">

        <p>
          Velkommen til Stamply. Ved at bruge vores tjeneste accepterer du disse vilkår. 
          Hvis du ikke accepterer vilkårene, må du ikke bruge Stamply.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          1. Hvad er Stamply
        </h2>
        <p>
          Stamply er en digital loyalitetsplatform, der gør det muligt for dig at 
          modtage og bruge digitale stempelkort, optjene stempler ved at scanne en 
          QR-kode i deltagende virksomheder og indløse belønninger, når et kort er fyldt.
          De enkelte virksomheder er ansvarlige for deres egne tilbud og belønninger.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          2. Brugerkonto og anonymitet
        </h2>
        <p>
          Stamply anvender anonym autentificering. Du behøver ikke oprette en traditionel konto eller
          oplyse navn, e-mail eller telefonnummer. Systemet opretter en anonym bruger-ID, som bruges til 
          at gemme dine kort og stempler. Hvis du mister adgang til din enhed eller browserdata, kan Stamply
          ikke garantere, at dine stempler kan genskabes.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          3. Brug af QR-koder
        </h2>
        <p>
          For at optjene stempler skal du vise en QR-kode til virksomheden. QR-koden kan være tidsbegrænset 
          eller indeholde sikkerhedstokens for at forhindre misbrug. Stamply kan annullere stempler eller 
          belønninger ved mistanke om snyd eller uregelmæssigheder.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          4. Forholdet mellem dig og virksomheden
        </h2>
        <p>
          Stamply leverer kun platformen. Virksomhederne administrerer selv deres tilbud, regler for stempler 
          og belønninger. Stamply er ikke ansvarlig for manglende belønninger, ændrede kampagner eller konflikter 
          mellem dig og virksomheden.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          5. Drift og ansvar
        </h2>
        <p>
          Stamply leveres &quot;som den er&quot; og kan indeholde tekniske fejl eller perioder med nedetid. 
          Stamply er ikke ansvarlig for tab af data, tab af stempler, tekniske problemer, eller økonomiske tab 
          som følge af brug af tjenesten.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          6. Ændringer i tjenesten
        </h2>
        <p>
          Stamply kan til enhver tid ændre funktioner, tjenesten eller vilkår. Ved fortsat brug accepterer du 
          automatisk de opdaterede vilkår.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          7. Misbrug
        </h2>
        <p>
          Du må ikke forsøge at manipulere stempler, dele QR-koder for at opnå uberettigede fordele, bruge 
          automatiserede værktøjer eller udnytte fejl i systemet. Overtrædelser kan føre til lukning af adgang 
          eller annullering af stempler.
        </p>

        <h2 className="text-xl font-semibold text-[#385C32] mt-6">
          8. Kontakt
        </h2>
        <p>
          Har du spørgsmål til disse vilkår, kan du kontakte os på: 
          <br />
          <strong> info@stamply.dk</strong>
        </p>

      </section>

      <div className="h-12" />
    </div>
  );
}
