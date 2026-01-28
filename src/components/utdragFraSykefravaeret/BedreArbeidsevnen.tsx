import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyLong, BodyShort, VStack } from "@navikt/ds-react";

const tekster = {
  header: "Hva skal til for å bedre arbeidsevnen?",
  tilretteleggingTittel:
    "Tilrettelegging/hensyn som bør tas på arbeidsplassen. Beskriv",
  tiltakNavTittel: "Tiltak i regi av Nav. Beskriv",
  tiltakAndreTittel: "Eventuelle andre innspill til Nav. Beskriv",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function BedreArbeidsevnen({ sykmelding }: Props) {
  const arbeidsevne = sykmelding.arbeidsevne;
  return (
    <VStack gap="2" className="mt-4">
      <BodyShort size="small" weight="semibold">
        {tekster.header}
      </BodyShort>

      {arbeidsevne.tilretteleggingArbeidsplass && (
        <div>
          <BodyShort size="small" weight="semibold">
            {tekster.tilretteleggingTittel}
          </BodyShort>
          <BodyLong size="small">
            {arbeidsevne.tilretteleggingArbeidsplass}
          </BodyLong>
        </div>
      )}

      {arbeidsevne.tiltakNAV && (
        <div>
          <BodyShort size="small" weight="semibold">
            {tekster.tiltakNavTittel}
          </BodyShort>
          <BodyLong size="small">{arbeidsevne.tiltakNAV}</BodyLong>
        </div>
      )}

      {arbeidsevne.tiltakAndre && (
        <div>
          <BodyShort size="small" weight="semibold">
            {tekster.tiltakAndreTittel}
          </BodyShort>
          <BodyLong size="small">{arbeidsevne.tiltakAndre}</BodyLong>
        </div>
      )}
    </VStack>
  );
}
