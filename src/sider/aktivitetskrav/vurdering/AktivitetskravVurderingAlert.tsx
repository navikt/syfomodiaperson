import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  isExpired,
  formatDateWithMonthName,
  formatNumericDate,
} from "@/utils/datoUtils";
import { ReactElement } from "react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { BodyLong, InfoCard, LocalAlert } from "@navikt/ds-react";
import {
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
} from "@navikt/aksel-icons";

const texts = {
  forhandsvarselInfoTitle: (dato: string) => `Forhåndsvarsel er sendt ${dato}`,
  forhandsvarselInfoBody:
    "Når fristen er passert vil det dukke opp en hendelse i oversikten.",
  forhandsvarselWarningTitle: "Aktivitetskravet må vurderes",
  forhandsvarselWarningSendt: (dato: string) =>
    `Det ble sendt ut et forhåndsvarsel ${dato}.`,
  forhandsvarselWarningBody:
    "Fristen er gått ut og aktivitetskravet må vurderes.",
  avventerTil: (dato: string) => `Avventer til ${dato}`,
  avventer: "Avventer",
};

interface Props {
  vurdering: AktivitetskravVurderingDTO;
}

export function AktivitetskravVurderingAlert({
  vurdering,
}: Props): ReactElement | null {
  const { status, beskrivelse, arsaker, frist, createdAt } = vurdering;
  const vurderingDato = formatNumericDate(createdAt);

  switch (status) {
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return isExpired(vurdering.varsel?.svarfrist) ? (
        <LocalAlert status="warning" className="mb-4">
          <LocalAlert.Header>
            <LocalAlert.Title>
              {texts.forhandsvarselWarningTitle}
            </LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            {texts.forhandsvarselWarningSendt(vurderingDato)}{" "}
            {texts.forhandsvarselWarningBody}
          </LocalAlert.Content>
        </LocalAlert>
      ) : (
        <InfoCard data-color="info" className="mb-4">
          <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
            <InfoCard.Title>
              {texts.forhandsvarselInfoTitle(vurderingDato)}
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>{texts.forhandsvarselInfoBody}</InfoCard.Content>
        </InfoCard>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <InfoCard data-color="warning" className="mb-4">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title>
              {frist
                ? texts.avventerTil(formatDateWithMonthName(frist))
                : texts.avventer}
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <BodyLong>{beskrivelse}</BodyLong>
            <ul>
              {arsaker.map((arsak, index) => (
                <li key={index}>{avventVurderingArsakTexts[arsak] || arsak}</li>
              ))}
            </ul>
          </InfoCard.Content>
        </InfoCard>
      );
    }
    default: {
      throw new Error(`Not supported`);
    }
  }
}
