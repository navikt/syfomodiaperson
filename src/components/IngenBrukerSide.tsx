import { Infomelding } from "./Infomelding";
import Decorator from "../decorator/Decorator";

const texts = {
  title: "Her mangler det fødselsnummer",
  melding:
    "Det mangler eller er et ugyldig fødselsnummer. Skriv inn et gyldig fødselsnummer i menylinjen",
};

export const IngenBrukerSide = () => (
  <>
    <Decorator />
    <div className="w-[40em] mx-auto">
      <Infomelding tittel={texts.title} melding={texts.melding} />
    </div>
  </>
);
