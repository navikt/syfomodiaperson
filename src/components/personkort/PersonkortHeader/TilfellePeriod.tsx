import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";

const texts = {
  startDate: "Sykmeldt: ",
};

export function TilfellePeriod() {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  const periode = `${tilLesbarDatoMedArUtenManedNavn(
    startDate
  )} - ${tilLesbarDatoMedArUtenManedNavn(endDate)}`;
  return (
    !!startDate &&
    !!endDate && (
      <div className="font-normal">
        <span>{texts.startDate}</span>
        <b>{periode}</b>
      </div>
    )
  );
}
