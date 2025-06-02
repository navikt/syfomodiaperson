import React from "react";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  arsakTexts,
  HistorikkEntry,
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { Paragraph } from "@/components/Paragraph";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { VisBrev } from "@/components/VisBrev";
import {
  Sykepengestopp,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import ManuellSykepengestoppItem from "@/components/pengestopp/ManuellSykepengestoppItem";

const texts = {
  header: "Historikk",
  tidligereVurderinger: "Tidligere vurderinger av §8-4 arbeidsuførhet i Modia",
  noVurderinger:
    "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia",
  begrunnelseLabel: "Begrunnelse",
  arsakLabel: "Årsak",
  vurdertLabel: "Vurdert av",
};

interface VurderingHistorikkItemProps {
  vurdering: VurderingResponseDTO;
}

const getButtonText = (type: VurderingType): string => {
  switch (type) {
    case VurderingType.FORHANDSVARSEL: {
      return "Se sendt forhåndsvarsel";
    }
    case VurderingType.OPPFYLT: {
      return "Se oppfylt vurdering";
    }
    case VurderingType.AVSLAG: {
      return "Se innstilling om avslag";
    }
    case VurderingType.IKKE_AKTUELL: {
      throw new Error("Not supported");
    }
    case VurderingType.AVSLAG_UTEN_FORHANDSVARSEL:
    case VurderingType.OPPFYLT_UTEN_FORHANDSVARSEL: {
      return "Se innstilling";
    }
  }
};

const VurderingHistorikkItem = ({ vurdering }: VurderingHistorikkItemProps) => {
  const { type, arsak, begrunnelse, createdAt, veilederident } = vurdering;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederident);
  const header = `${typeTexts[type]} - ${tilDatoMedManedNavn(createdAt)}`;
  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        {begrunnelse && (
          <Paragraph label={texts.begrunnelseLabel} body={begrunnelse} />
        )}
        {arsak && (
          <Paragraph label={texts.arsakLabel} body={arsakTexts[arsak]} />
        )}
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
        {type !== VurderingType.IKKE_AKTUELL && (
          <VisBrev
            document={vurdering.document}
            buttonText={getButtonText(type)}
          />
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

function isVurderingResponseDTO(
  item: HistorikkEntry
): item is VurderingResponseDTO {
  return "type" in item;
}

function dateFromHistorikkEntry(historikkEntry: HistorikkEntry) {
  return isVurderingResponseDTO(historikkEntry)
    ? new Date(historikkEntry.createdAt)
    : new Date(historikkEntry.opprettet);
}

function sortHistorikkEntriesDesc(a: HistorikkEntry, b: HistorikkEntry) {
  return (
    dateFromHistorikkEntry(b).getTime() - dateFromHistorikkEntry(a).getTime()
  );
}

function filterSykepengestoppArbeidsuforhet(
  sykepengestoppList: Sykepengestopp[]
) {
  return sykepengestoppList.filter((sykepengestopp) =>
    sykepengestopp.arsakList.some(
      (arsak) => arsak.type === ValidSykepengestoppArsakType.MEDISINSK_VILKAR
    )
  );
}

export const VurderingHistorikk = () => {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const { data: sykepengestoppList } = usePengestoppStatusQuery();
  const arbeidsuforhetSykepengestopp: Sykepengestopp[] =
    filterSykepengestoppArbeidsuforhet(sykepengestoppList);
  const items: HistorikkEntry[] = [
    ...arbeidsuforhetSykepengestopp,
    ...data,
  ].sort(sortHistorikkEntriesDesc);
  const subheader =
    items.length > 0 ? texts.tidligereVurderinger : texts.noVurderinger;

  return (
    <Box
      padding="6"
      background="surface-default"
      className="flex flex-col gap-8 mb-2"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <BodyShort size="small">{subheader}</BodyShort>
      </div>
      <Accordion>
        {items.map((item, index) =>
          isVurderingResponseDTO(item) ? (
            <VurderingHistorikkItem
              key={index}
              vurdering={item as VurderingResponseDTO}
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
