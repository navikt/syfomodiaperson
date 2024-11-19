import React, { ReactElement, useState } from "react";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import {
  HistorikkEvent,
  HistorikkEventType,
} from "@/data/historikk/types/historikkTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Box, Select, Table, Tag } from "@navikt/ds-react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  sykefravaerstilfelleLabel: "Sykefraværstilfelle",
};
const byTidspunkt: () => (h1: HistorikkEvent, h2: HistorikkEvent) => number =
  () => (h1: HistorikkEvent, h2: HistorikkEvent) => {
    return new Date(h2.tidspunkt).getTime() - new Date(h1.tidspunkt).getTime();
  };

function isEventInTilfelle(
  event: HistorikkEvent,
  tilfelle: OppfolgingstilfelleDTO
): boolean {
  return (
    new Date(tilfelle.start) <= new Date(event.tidspunkt) &&
    new Date(event.tidspunkt) <= new Date(tilfelle.end)
  );
}

function hentEventUtenforTilfelleList(
  tilfelleliste: OppfolgingstilfelleDTO[],
  historikkEvents: HistorikkEvent[]
): HistorikkEvent[] {
  return historikkEvents.filter((event) => {
    return !tilfelleliste.some((tilfelle) =>
      isEventInTilfelle(event, tilfelle)
    );
  });
}

function tagFromKilde(kilde: HistorikkEventType): ReactElement {
  switch (kilde) {
    case "OPPFOLGINGSPLAN":
      return <Tag variant="alt3">Oppfølgingsplan</Tag>;
    case "OPPFOLGINGSPLAN_LPS":
      return <Tag variant="alt3">Oppfølgingsplan LPS</Tag>;
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
      return <Tag variant="info">Friskmelding til arbeidsformidling</Tag>;
    case "DIALOG_MED_BEHANDLER":
      return <Tag variant="neutral">Dialog med behandler</Tag>;
    case "SEN_OPPFOLGING":
      return <Tag variant="alt2">Snart slutt på sykepengene</Tag>;
    case "MOTEBEHOV":
    case "MOTER":
    case "DIALOGMOTEKANDIDAT":
      return <Tag variant="success">Dialogmøte</Tag>;
  }
}

function logSykefravaerstilfelleChanged(isUtenforTilfelle: boolean) {
  Amplitude.logEvent({
    type: EventType.OptionSelected,
    data: {
      url: window.location.href,
      tekst: "Sykefraværstilfelle valgt",
      option: isUtenforTilfelle
        ? "Utenfor sykefraværstilfelle"
        : "Innenfor et sykefraværstilfelle",
    },
  });
}

interface Props {
  historikkEvents: HistorikkEvent[];
  tilfeller: OppfolgingstilfelleDTO[];
}

export function Historikk({ historikkEvents, tilfeller }: Props): ReactElement {
  const [selectedTilfelleIndex, setSelectedTilfelleIndex] = useState<number>(0);
  const eventUtenforTilfelleList = hentEventUtenforTilfelleList(
    tilfeller,
    historikkEvents
  );

  function filteredEvents() {
    if (selectedTilfelleIndex === -1) {
      return eventUtenforTilfelleList;
    } else {
      return historikkEvents.filter((event) =>
        isEventInTilfelle(event, tilfeller[selectedTilfelleIndex])
      );
    }
  }

  function sykefravaerstilfelleOnChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedTilfelleIndex(Number(event.target.value));
    const isUtenforTilfelle = event.target.value === "-1";
    logSykefravaerstilfelleChanged(isUtenforTilfelle);
  }

  return (
    <Box background="surface-default" padding="4">
      <Select
        className="w-fit mb-4"
        label={texts.sykefravaerstilfelleLabel}
        onChange={sykefravaerstilfelleOnChange}
      >
        {tilfeller.map((tilfelle, index) => (
          <option key={index} value={index}>
            {tilLesbarPeriodeMedArstall(tilfelle.start, tilfelle.end)}
          </option>
        ))}
        {eventUtenforTilfelleList.length > 0 && (
          <option value={-1}>Utenfor sykefraværstilfelle</option>
        )}
      </Select>
      <Box>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col">Dato</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Beskrivelse</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredEvents()
              .sort(byTidspunkt())
              .map((event, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.DataCell>
                      {tilLesbarDatoMedArstall(event.tidspunkt)}
                    </Table.DataCell>
                    <Table.DataCell>{event.tekst}</Table.DataCell>
                    <Table.DataCell>{tagFromKilde(event.kilde)}</Table.DataCell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
