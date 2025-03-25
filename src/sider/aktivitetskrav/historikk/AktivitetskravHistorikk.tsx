import React, { useState } from "react";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  HistorikkEntry,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { capitalizeWord } from "@/utils/stringUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { vurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { VisBrev } from "@/components/VisBrev";
import { Paragraph } from "@/components/Paragraph";
import {
  Sykepengestopp,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import ManuellSykepengestoppItem from "@/components/pengestopp/ManuellSykepengestoppItem";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere vurderinger av aktivitetskravet i Modia",
  arsakTitle: "Årsak",
  visBrev: "Se hele brevet",
  visBrevLabel: "Vis brevet",
  vurdertAv: "Vurdert av",
};

function isAktivitetskravVurderingDTO(
  item: HistorikkEntry
): item is AktivitetskravVurderingDTO {
  return "arsaker" in item;
}

function dateFromHistorikkEntry(historikkEntry: HistorikkEntry) {
  return isAktivitetskravVurderingDTO(historikkEntry)
    ? new Date(historikkEntry.createdAt)
    : new Date(historikkEntry.opprettet);
}

function sortHistorikkEntriesDesc(a: HistorikkEntry, b: HistorikkEntry) {
  return (
    dateFromHistorikkEntry(b).getTime() - dateFromHistorikkEntry(a).getTime()
  );
}

function filterStatusAktivitetskrav(sykepengestoppList: Sykepengestopp[]) {
  return sykepengestoppList.filter((sykepengestopp) =>
    sykepengestopp.arsakList.some(
      (arsak) => arsak.type === ValidSykepengestoppArsakType.AKTIVITETSKRAV
    )
  );
}

const isRelevantForHistorikk = (vurdering: AktivitetskravVurderingDTO) =>
  vurdering.status === AktivitetskravStatus.OPPFYLT ||
  vurdering.status === AktivitetskravStatus.UNNTAK ||
  vurdering.status === AktivitetskravStatus.INNSTILLING_OM_STANS ||
  vurdering.status === AktivitetskravStatus.IKKE_OPPFYLT ||
  vurdering.status === AktivitetskravStatus.FORHANDSVARSEL ||
  vurdering.status === AktivitetskravStatus.AVVENT ||
  vurdering.status === AktivitetskravStatus.IKKE_AKTUELL;

const byCreatedAt = (
  v1: AktivitetskravVurderingDTO,
  v2: AktivitetskravVurderingDTO
) => new Date(v2.createdAt).getTime() - new Date(v1.createdAt).getTime();

export const AktivitetskravHistorikk = () => {
  const { data } = useAktivitetskravQuery();
  const vurderinger = data.flatMap((aktivitetskrav) =>
    aktivitetskrav.vurderinger.filter(isRelevantForHistorikk)
  );
  const { data: sykepengestoppList } = usePengestoppStatusQuery();
  const aktivitetskravSykepengestopp: Sykepengestopp[] =
    filterStatusAktivitetskrav(sykepengestoppList);
  const items: HistorikkEntry[] = [
    ...aktivitetskravSykepengestopp,
    ...vurderinger,
  ].sort(sortHistorikkEntriesDesc);

  return (
    <Box
      background="surface-default"
      padding="8"
      className="flex flex-col mb-4 gap-8"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <BodyShort size="small">{texts.subHeader}</BodyShort>
      </div>
      <Accordion>
        {items.map((item, index) =>
          isAktivitetskravVurderingDTO(item) ? (
            <HistorikkElement
              key={index}
              vurdering={item as AktivitetskravVurderingDTO}
            />
          ) : (
            <ManuellSykepengestoppItem
              key={index}
              sykepengestopp={item as Sykepengestopp}
            />
          )
        )}
      </Accordion>
    </Box>
  );
};

const headerPrefix = (status: AktivitetskravStatus): string => {
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
};

interface HistorikkElementProps {
  vurdering: AktivitetskravVurderingDTO;
}

const HistorikkElement = ({ vurdering }: HistorikkElementProps) => {
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
    if (!isOpen) {
      // Vil bare logge klikk som åpner accordion
      Amplitude.logEvent({
        type: EventType.AccordionOpen,
        data: {
          tekst: `Åpne accordion aktivitetskrav historikk: ${header}`,
          url: window.location.href,
        },
      });
    }
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
};
