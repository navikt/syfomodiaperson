import { Infomelding } from "./Infomelding";

const texts = {
  title: "Søk på person",
  melding: "Søk på en person. Skriv inn et gyldig fødselsnummer i menylinjen",
};

export const PersonsokSide = () => (
  <div className="w-[40em] mx-auto">
    <Infomelding tittel={texts.title} melding={texts.melding} />
  </div>
);
