import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useMemo } from "react";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";

export const useInitialValuesReferat = (
  dialogmote: DialogmoteDTO
): Partial<ReferatSkjemaValues> => {
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const {
    arbeidsgiver: { virksomhetsnummer },
    behandler,
  } = dialogmote;
  const { mellomlagretReferat } = useDialogmoteReferat(dialogmote);
  const currentNarmesteLederNavn = getCurrentNarmesteLeder(virksomhetsnummer)
    ?.narmesteLederNavn;

  return useMemo(() => {
    const behandlerInitialValues = behandler
      ? {
          behandlerDeltatt: behandler.deltatt,
          behandlerMottarReferat: behandler.mottarReferat,
        }
      : {};
    if (!mellomlagretReferat) {
      return {
        naermesteLeder: currentNarmesteLederNavn,
        ...behandlerInitialValues,
      };
    } else {
      return {
        naermesteLeder: mellomlagretReferat.narmesteLederNavn,
        konklusjon: mellomlagretReferat.konklusjon,
        situasjon: mellomlagretReferat.situasjon,
        arbeidstakersOppgave: mellomlagretReferat.arbeidstakerOppgave,
        arbeidsgiversOppgave: mellomlagretReferat.arbeidsgiverOppgave,
        veiledersOppgave: mellomlagretReferat.veilederOppgave,
        behandlersOppgave: mellomlagretReferat.behandlerOppgave,
        andreDeltakere: mellomlagretReferat.andreDeltakere.map(
          ({ navn, funksjon }) => ({
            navn,
            funksjon,
          })
        ),
        standardtekster: referatTexts.standardTekster.filter((standardtekst) =>
          mellomlagretReferat.document.some(
            ({ key }) => key === standardtekst.key
          )
        ),
        ...behandlerInitialValues,
      };
    }
  }, [currentNarmesteLederNavn, mellomlagretReferat, behandler]);
};
