import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useMemo } from "react";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

export const useInitialValuesReferat = (
  dialogmote: DialogmoteDTO
): Partial<ReferatSkjemaValues> => {
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const {
    referat,
    arbeidsgiver: { virksomhetsnummer },
  } = dialogmote;
  const currentNarmesteLederNavn = getCurrentNarmesteLeder(virksomhetsnummer)
    ?.narmesteLederNavn;

  return useMemo(() => {
    if (!referat) {
      return {
        naermesteLeder: currentNarmesteLederNavn,
      };
    } else {
      return {
        naermesteLeder: referat.narmesteLederNavn,
        konklusjon: referat.konklusjon,
        situasjon: referat.situasjon,
        arbeidstakersOppgave: referat.arbeidstakerOppgave,
        arbeidsgiversOppgave: referat.arbeidsgiverOppgave,
        veiledersOppgave: referat.veilederOppgave,
        behandlersOppgave: referat.behandlerOppgave,
        andreDeltakere: referat.andreDeltakere.map(({ navn, funksjon }) => ({
          navn,
          funksjon,
        })),
        standardtekster: referatTexts.standardTekster.filter((standardtekst) =>
          referat.document.some(({ key }) => key === standardtekst.key)
        ),
      };
    }
  }, [currentNarmesteLederNavn, referat]);
};
