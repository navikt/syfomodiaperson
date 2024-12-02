import React from "react";
import { Alert, Tag } from "@navikt/ds-react";
import { MaksdatoSummary } from "@/components/personkort/PersonkortHeader/MaksdatoSummary";
import { isDateBefore } from "@/utils/datoUtils";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { Maksdato } from "@/data/maksdato/useMaksdatoQuery";

const texts = {
  ikkeUtbetalt: "Sykepenger ikke utbetalt",
  utbetalingsinfoAlert:
    "Maksdatoen kan gjelde et tidligere oppfølgingstilfelle.",
};

interface Props {
  maksdato: Maksdato | null | undefined;
}

export default function Utbetalingsinfo({ maksdato }: Props) {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const isUtbetalingsinfoFromBeforeOppfolgingstilfelleStart = isDateBefore(
    maksdato?.opprettet,
    startDate
  );
  return maksdato ? (
    <>
      <MaksdatoSummary maxDate={maksdato} />
      {isUtbetalingsinfoFromBeforeOppfolgingstilfelleStart && (
        <Alert inline variant="warning" size="small">
          {texts.utbetalingsinfoAlert}
        </Alert>
      )}
    </>
  ) : (
    <Tag variant="warning" size="small" className="mt-1">
      {texts.ikkeUtbetalt}
    </Tag>
  );
}
