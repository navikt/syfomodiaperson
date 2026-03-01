import React from "react";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  HistorikkEntry,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  Sykepengestopp,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import ManuellSykepengestoppItem from "@/components/pengestopp/ManuellSykepengestoppItem";
import { HistoriskVurdering } from "./HistoriskVurdering";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere vurderinger av aktivitetskravet i Modia",
  visBrev: "Se hele brevet",
  visBrevLabel: "Vis brevet",
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

export function AktivitetskravHistorikk() {
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
      background="default"
      padding="space-32"
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
            <HistoriskVurdering
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
}
