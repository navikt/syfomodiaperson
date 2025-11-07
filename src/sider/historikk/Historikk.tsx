import React, { ReactElement, useState } from "react";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import {
  HistorikkEvent,
  HistorikkEventType,
} from "@/data/historikk/types/historikkTypes";
import {
  isDateInOppfolgingstilfelle,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Box, HStack, Select, Table, Tag } from "@navikt/ds-react";
import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  velgTilfelleLabel: "Velg sykefraværstilfelle",
  velgTilfelleDefaultValg: "Alle sykefraværstilfeller",
  linkTiltak: "Åpne tiltakshistorikk",
};
const byTidspunkt: () => (h1: HistorikkEvent, h2: HistorikkEvent) => number =
  () => (h1: HistorikkEvent, h2: HistorikkEvent) => {
    return new Date(h2.tidspunkt).getTime() - new Date(h1.tidspunkt).getTime();
  };

function hentEventUtenforTilfelleList(
  tilfelleliste: OppfolgingstilfelleDTO[],
  historikkEvents: HistorikkEvent[]
): HistorikkEvent[] {
  return historikkEvents.filter((event) => {
    return !tilfelleliste.some((tilfelle) =>
      isDateInOppfolgingstilfelle(event.tidspunkt, tilfelle)
    );
  });
}

function tagFromKilde(kilde: HistorikkEventType): ReactElement {
  switch (kilde) {
    case "OPPFOLGINGSPLAN":
      return <Tag variant="alt3">Oppfølgingsplan</Tag>;
    case "OPPFOLGINGSPLAN_LPS":
      return <Tag variant="alt3">Oppfølgingsplan LPS</Tag>;
    case "OPPFOLGINGSPLAN_FORESPORSEL":
      return <Tag variant="alt3">Forespørsel oppfølgingsplan</Tag>;
    case "LEDER":
      return <Tag variant="alt2">Leder</Tag>;
    case "VEILEDER_TILDELING":
      return <Tag variant="alt2">Veileder</Tag>;
    case "AKTIVITETSKRAV":
      return <Tag variant="alt1">Aktivitetskrav</Tag>;
    case "ARBEIDSUFORHET":
      return <Tag variant="warning">Arbeidsuførhet</Tag>;
    case "MANGLENDE_MEDVIRKNING":
      return <Tag variant="warning">Manglende medvirkning</Tag>;
    case "FRISKMELDING_TIL_ARBEIDSFORMIDLING":
      return (
        <Tag className="w-max" variant="info">
          Friskmelding til arbeidsformidling
        </Tag>
      );
    case "DIALOG_MED_BEHANDLER":
      return (
        <Tag className="w-max" variant="neutral">
          Dialog med behandler
        </Tag>
      );
    case "SEN_OPPFOLGING":
      return (
        <Tag className="w-max" variant="alt2">
          Snart slutt på sykepengene
        </Tag>
      );
    case "OPPFOLGINGSOPPGAVE":
      return <Tag variant="info">Oppfølgingsoppgave</Tag>;
    case "MOTEBEHOV":
    case "MOTER":
    case "DIALOGMOTEKANDIDAT":
      return <Tag variant="success">Dialogmøte</Tag>;
    case "TILDELT_OPPFOLGINGSENHET":
      return <Tag variant="alt1-moderate">Oppfølgingsenhet</Tag>;
  }
}

interface Props {
  historikkEvents: HistorikkEvent[];
  tilfeller: OppfolgingstilfelleDTO[];
}

export default function Historikk({
  historikkEvents,
  tilfeller,
}: Props): ReactElement {
  const [selectedTilfelleIndex, setSelectedTilfelleIndex] = useState<number>(0);
  const eventUtenforTilfelleList = hentEventUtenforTilfelleList(
    tilfeller,
    historikkEvents
  );

  function filteredEvents(): HistorikkEvent[] {
    if (selectedTilfelleIndex === 0) {
      return historikkEvents;
    } else if (selectedTilfelleIndex === -1) {
      return eventUtenforTilfelleList;
    } else {
      return historikkEvents.filter((event) =>
        isDateInOppfolgingstilfelle(
          event.tidspunkt,
          tilfeller[selectedTilfelleIndex]
        )
      );
    }
  }

  function sykefravaerstilfelleOnChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedTilfelleIndex(Number(event.target.value));
  }

  const historikkEntries = filteredEvents().sort(byTidspunkt());

  return (
    <Box background="surface-default" padding="4">
      <HStack justify="space-between" align="start">
        <Select
          className="w-fit mb-4"
          label={texts.velgTilfelleLabel}
          onChange={sykefravaerstilfelleOnChange}
        >
          <option value={0}>{texts.velgTilfelleDefaultValg}</option>
          {tilfeller.map((tilfelle, index) => (
            <option key={index + 1} value={index + 1}>
              {tilLesbarPeriodeMedArstall(tilfelle.start, tilfelle.end)}
            </option>
          ))}
          {eventUtenforTilfelleList.length > 0 && (
            <option value={-1}>Utenfor sykefraværstilfelle</option>
          )}
        </Select>
        <EksternLenke
          href={fullNaisUrlIntern(
            "veilarbpersonflate",
            "/arbeidsmarkedstiltak"
          )}
          className="mr-4"
        >
          {texts.linkTiltak}
        </EksternLenke>
      </HStack>
      <Box>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col"></Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Dato</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Beskrivelse</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {historikkEntries.map(
              ({ expandableContent, kilde, tekst, tidspunkt }, i) => {
                return expandableContent ? (
                  <Table.ExpandableRow
                    key={i}
                    content={
                      <span className="whitespace-pre-wrap">
                        {expandableContent}
                      </span>
                    }
                  >
                    <Table.DataCell>
                      {tilLesbarDatoMedArstall(tidspunkt)}
                    </Table.DataCell>
                    <Table.DataCell>{tekst}</Table.DataCell>
                    <Table.DataCell>{tagFromKilde(kilde)}</Table.DataCell>
                  </Table.ExpandableRow>
                ) : (
                  <Table.Row key={i}>
                    <Table.DataCell></Table.DataCell>
                    <Table.DataCell>
                      {tilLesbarDatoMedArstall(tidspunkt)}
                    </Table.DataCell>
                    <Table.DataCell>{tekst}</Table.DataCell>
                    <Table.DataCell>{tagFromKilde(kilde)}</Table.DataCell>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
