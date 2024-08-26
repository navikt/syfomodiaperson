import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  tilDatoMedManedNavn,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import React, { ReactElement } from "react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { AktivitetskravAlertstripe } from "@/sider/aktivitetskrav/AktivitetskravAlertstripe";
import { BodyLong, BodyShort, Label } from "@navikt/ds-react";
import { isExpiredForhandsvarsel } from "@/utils/aktivitetskravUtils";

const texts = {
  forhandsvarselInfoBody:
    "Når fristen er passert vil det dukke opp en hendelse i oversikten.",
  forhandsvarselWarningLabel: "Aktivitetskravet må vurderes",
  forhandsvarselWarningBody:
    "Fristen er gått ut og aktivitetskravet må vurderes.",
};

interface AktivitetskravVurderingAlertProps {
  vurdering: AktivitetskravVurderingDTO;
}

export const AktivitetskravVurderingAlert = ({
  vurdering,
}: AktivitetskravVurderingAlertProps): ReactElement | null => {
  const { status, beskrivelse, arsaker, frist, createdAt } = vurdering;
  const vurderingDato = tilLesbarDatoMedArUtenManedNavn(createdAt);

  switch (status) {
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return isExpiredForhandsvarsel(vurdering) ? (
        <AktivitetskravAlertstripe variant="warning">
          <Label size="small">{texts.forhandsvarselWarningLabel}</Label>
          <BodyShort size="small">{`Det ble sendt ut et forhåndsvarsel ${vurderingDato}.`}</BodyShort>
          <BodyShort size="small">{texts.forhandsvarselWarningBody}</BodyShort>
        </AktivitetskravAlertstripe>
      ) : (
        <AktivitetskravAlertstripe variant="info">
          <Label size="small">{`Forhåndsvarsel er sendt ${vurderingDato}`}</Label>
          <BodyShort size="small">{texts.forhandsvarselInfoBody}</BodyShort>
        </AktivitetskravAlertstripe>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <AktivitetskravAlertstripe variant="warning">
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
        </AktivitetskravAlertstripe>
      );
    }
    default: {
      throw new Error(`Not supported`);
    }
  }
};
