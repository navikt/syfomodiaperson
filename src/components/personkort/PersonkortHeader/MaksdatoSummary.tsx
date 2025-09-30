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
  startDate?: Date;
}

export function MaksdatoSummary({ maxDate, startDate }: MaksdatoSummaryProps) {
  const isUtbetaltTomBeforeStart =
    !!startDate && !!maxDate.utbetalt_tom && maxDate.utbetalt_tom < startDate;
  const utbetaltTom =
    !maxDate.utbetalt_tom || isUtbetaltTomBeforeStart
      ? "Mangler"
      : tilLesbarDatoMedArUtenManedNavn(maxDate.utbetalt_tom);

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
