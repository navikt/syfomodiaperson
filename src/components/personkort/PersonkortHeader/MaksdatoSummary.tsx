import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { Maksdato } from "@/data/maksdato/useMaksdatoQuery";
import { SyketilfelleSummaryElement } from "@/components/personkort/PersonkortHeader/SyketilfelleSummaryElement";

const texts = {
  maksdato: "Maksdato: ",
  utbetaltTom: "Utbetalt tom: ",
  soknadBehandletTom: "Søknad behandlet tom: ",
};

interface MaksdatoSummaryProps {
  maxDate: Maksdato;
}

export function MaksdatoSummary({ maxDate }: MaksdatoSummaryProps) {
  const utbetaltTom = maxDate.utbetalt_tom
    ? tilLesbarDatoMedArUtenManedNavn(maxDate.utbetalt_tom)
    : "Mangler";
  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <SyketilfelleSummaryElement
        keyword={texts.maksdato}
        value={tilLesbarDatoMedArUtenManedNavn(
          maxDate.forelopig_beregnet_slutt
        )}
      />
      <SyketilfelleSummaryElement
        keyword={texts.utbetaltTom}
        value={utbetaltTom}
      />
      <SyketilfelleSummaryElement
        keyword={texts.soknadBehandletTom}
        value={tilLesbarDatoMedArUtenManedNavn(maxDate.tom)}
      />
    </div>
  );
}
