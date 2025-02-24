import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  isExpiredForhandsvarsel,
  tilDatoMedManedNavn,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import React, { ReactElement } from "react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { Alert, BodyLong, BodyShort, Label } from "@navikt/ds-react";

const texts = {
  forhandsvarselInfoBody:
    "Når fristen er passert vil det dukke opp en hendelse i oversikten.",
  forhandsvarselWarningLabel: "Aktivitetskravet må vurderes",
  forhandsvarselWarningBody:
    "Fristen er gått ut og aktivitetskravet må vurderes.",
};

interface Props {
  vurdering: AktivitetskravVurderingDTO;
}

export function AktivitetskravVurderingAlert({
  vurdering,
}: Props): ReactElement | null {
  const { status, beskrivelse, arsaker, frist, createdAt } = vurdering;
  const vurderingDato = tilLesbarDatoMedArUtenManedNavn(createdAt);

  switch (status) {
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return isExpiredForhandsvarsel(vurdering.varsel?.svarfrist) ? (
        <Alert variant="warning" className="mb-4">
          <Label size="small">{texts.forhandsvarselWarningLabel}</Label>
          <BodyShort size="small">{`Det ble sendt ut et forhåndsvarsel ${vurderingDato}.`}</BodyShort>
          <BodyShort size="small">{texts.forhandsvarselWarningBody}</BodyShort>
        </Alert>
      ) : (
        <Alert variant="info" className="mb-4">
          <Label size="small">{`Forhåndsvarsel er sendt ${vurderingDato}`}</Label>
          <BodyShort size="small">{texts.forhandsvarselInfoBody}</BodyShort>
        </Alert>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <Alert variant="warning" className="mb-4" contentMaxWidth={false}>
          <Label size="small">
            {frist ? `Avventer til ${tilDatoMedManedNavn(frist)}` : "Avventer"}
          </Label>
          <BodyLong size="small">{beskrivelse}</BodyLong>
          <ul>
            {arsaker.map((arsak, index) => {
              const avventArsakText = avventVurderingArsakTexts[arsak] || arsak;
              return (
                <li key={index}>
                  <BodyShort size="small">{avventArsakText}</BodyShort>
                </li>
              );
            })}
          </ul>
        </Alert>
      );
    }
    default: {
      throw new Error(`Not supported`);
    }
  }
}
