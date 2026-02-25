import React from "react";
import { Paragraph } from "@/components/Paragraph";
import { VisBrev } from "@/components/VisBrev";
import { vurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { capitalizeWord } from "@/utils/stringUtils";
import { Accordion } from "@navikt/ds-react";
import { useState } from "react";

const texts = {
  arsakTitle: "Årsak",
  vurdertAv: "Vurdert av",
};

function headerPrefix(status: AktivitetskravStatus): string {
  switch (status) {
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.UNNTAK: {
      return capitalizeWord(status);
    }
    case AktivitetskravStatus.IKKE_OPPFYLT: {
      return "Ikke oppfylt";
    }
    case AktivitetskravStatus.INNSTILLING_OM_STANS: {
      return "Innstilling om stans";
    }
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return "Forhåndsvarsel";
    }
    case AktivitetskravStatus.AVVENT: {
      return "Avventer";
    }
    case AktivitetskravStatus.IKKE_AKTUELL: {
      return "Ikke aktuell";
    }
    case AktivitetskravStatus.NY:
    case AktivitetskravStatus.NY_VURDERING:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
    case AktivitetskravStatus.LUKKET: {
      // Ikke relevant for historikk
      return "";
    }
  }
}

interface Props {
  vurdering: AktivitetskravVurderingDTO;
}

export function HistoriskVurdering({ vurdering }: Props) {
  const { arsaker, beskrivelse, createdAt, createdBy, status, varsel } =
    vurdering;
  const [isOpen, setIsOpen] = useState(false);
  const { data: veilederinfo } = useVeilederInfoQuery(createdBy);
  const header = `${headerPrefix(status)} - ${tilDatoMedManedNavn(createdAt)}`;
  const beskrivelseTitle =
    status === AktivitetskravStatus.AVVENT ? "Beskrivelse" : "Begrunnelse";
  const arsakerText = () =>
    arsaker.map((arsak) => vurderingArsakTexts[arsak] || arsak).join(", ");

  const handleAccordionClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {header}
      </Accordion.Header>
      <Accordion.Content>
        {arsaker.length > 0 && (
          <Paragraph label={texts.arsakTitle} body={arsakerText()} />
        )}
        {!!beskrivelse && (
          <Paragraph label={beskrivelseTitle} body={beskrivelse} />
        )}
        <Paragraph
          label={texts.vurdertAv}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
        {status === AktivitetskravStatus.FORHANDSVARSEL && varsel?.document && (
          <VisBrev document={varsel.document} />
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
}
