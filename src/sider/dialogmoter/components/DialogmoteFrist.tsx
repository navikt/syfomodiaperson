import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";

const FRIST_DIALOGMOTE2_IN_WEEKS = 26;

export const DialogmoteFrist = () => {
  const { hasActiveOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  const getFrist = (startDate: Date) =>
    addWeeks(startDate, FRIST_DIALOGMOTE2_IN_WEEKS);

  const showFrist =
    isKandidat && hasActiveOppfolgingstilfelle && latestOppfolgingstilfelle;

  return showFrist ? (
    <p>{`Frist for dialogmøte 2: ${tilLesbarDatoMedArUtenManedNavn(
      getFrist(latestOppfolgingstilfelle.start)
    )}`}</p>
  ) : null;
};
