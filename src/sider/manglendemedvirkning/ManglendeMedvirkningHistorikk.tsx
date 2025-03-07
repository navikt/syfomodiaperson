import React from "react";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { Paragraph } from "@/components/Paragraph";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { VisBrev } from "@/components/VisBrev";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import {
  HistorikkEntry,
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import {
  StatusEndring,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import StatusItem from "@/sider/manglendemedvirkning/ManglendeMedVirkningStatusItem";

const texts = {
  header: "Historikk",
  tidligereVurderinger:
    "Tidligere vurderinger av § 8-8 medvirkningsplikten i Modia.",
  noVurderinger:
    "Det finnes ingen tidligere vurderinger av § 8-8 medvirkningsplikten i Modia.",
  begrunnelseLabel: "Begrunnelse",
  svarfristLabel: "Svarfrist i forhåndsvarselet",
  vurdertLabel: "Vurdert av",
};

interface VurderingHistorikkItemProps {
  vurdering: VurderingResponseDTO;
}

const getButtonText = (type: VurderingType): string => {
  switch (type) {
    case VurderingType.FORHANDSVARSEL:
      return "Se sendt forhåndsvarsel";
    case VurderingType.OPPFYLT:
      return "Se oppfylt vurdering";
    case VurderingType.STANS:
      return "Se innstilling om stans";
    case VurderingType.UNNTAK:
      return "Se unntak";
    case VurderingType.IKKE_AKTUELL:
      return "Se ikke aktuell vurdering";
  }
};

function HistorikkItem({ vurdering }: VurderingHistorikkItemProps) {
  const { vurderingType, begrunnelse, createdAt, veilederident, varsel } =
    vurdering;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederident);
  const header = `${typeTexts[vurderingType]} - ${tilDatoMedManedNavn(
    createdAt
  )}`;
  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        {varsel?.svarfrist && (
          <Paragraph
            label={texts.svarfristLabel}
            body={tilDatoMedManedNavn(varsel.svarfrist)}
          />
        )}
        {begrunnelse && (
          <Paragraph label={texts.begrunnelseLabel} body={begrunnelse} />
        )}
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
        <VisBrev
          document={vurdering.document}
          buttonText={getButtonText(vurderingType)}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
}

function isVurderingResponseDTO(
  item: HistorikkEntry
): item is VurderingResponseDTO {
  return "vurderingType" in item;
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

function filterStatusEndringManglendeMedvirkning(
  statusEndringer: StatusEndring[]
) {
  return statusEndringer.filter((statusEndring) =>
    statusEndring.arsakList.some(
      (arsak) =>
        arsak.type === ValidSykepengestoppArsakType.MANGLENDE_MEDVIRKING
    )
  );
}

export default function ManglendeMedvirkningHistorikk() {
  const { data } = useManglendemedvirkningVurderingQuery();
  const { data: statusEndringList } = usePengestoppStatusQuery();
  const manglendeMedvirkningStatus: StatusEndring[] =
    filterStatusEndringManglendeMedvirkning(statusEndringList);
  const items: HistorikkEntry[] = [...manglendeMedvirkningStatus, ...data].sort(
    sortHistorikkEntriesDesc
  );
  const subheader =
    items.length > 0 ? texts.tidligereVurderinger : texts.noVurderinger;

  return (
    <Box
      padding="6"
      background="surface-default"
      className="flex flex-col gap-8"
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
            <HistorikkItem
              key={index}
              vurdering={item as VurderingResponseDTO}
            />
          ) : (
            <StatusItem key={index} status={item as StatusEndring} />
          )
        )}
      </Accordion>
    </Box>
  );
}
