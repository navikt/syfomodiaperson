import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { createParagraph } from "@/utils/documentComponentUtils";

export const useForhandsvisningIntro = () => {
  const navBruker = useNavBrukerData();
  const gjelder = createParagraph(
    `Gjelder ${navBruker.navn}, f.nr. ${navBruker.kontaktinfo.fnr}`
  );
  const hei = createParagraph(`Hei ${navBruker.navn}`);

  return {
    introHilsenArbeidstaker: hei,
    introHilsenArbeidsgiver: gjelder,
    introHilsenBehandler: gjelder,
  };
};
