import React from "react";
import { restdatoTildato } from "@/utils/datoUtils";
import { PersonKortVirksomhetHeader } from "./PersonKortVirksomhetHeader";
import EpostButton from "../EpostButton";
import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledereTypes";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { capitalizeAllWords, formatPhonenumber } from "@/utils/stringUtils";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Table } from "@navikt/ds-react";

const texts = {
  name: "Navn",
  phone: "Telefon",
  email: "E-post",
  orgnummer: "Org.nummer",
  startDate: "Meldt inn",
  status: "Status",
  active: "Nåværende",
  deactivated: "Deaktivert",
  deactivatedArbeidstaker: "Deaktivert av arbeidstakeren",
  deactivatedLeder: "Deaktivert av lederen",
  deactivatedArbeidsforhold: "Arbeidsforholdet er avsluttet",
  deactivatedNyLeder: "Ny leder er meldt inn",
};

const getNarmesteLederRelasjonStatusText = (
  status: NarmesteLederRelasjonStatus,
) => {
  switch (status) {
    case NarmesteLederRelasjonStatus.INNMELDT_AKTIV:
      return texts.active;
    case NarmesteLederRelasjonStatus.DEAKTIVERT:
      return texts.deactivated;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSTAKER:
      return texts.deactivatedArbeidstaker;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING:
      return texts.deactivatedArbeidstaker;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_LEDER:
      return texts.deactivatedLeder;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSFORHOLD:
      return texts.deactivatedArbeidsforhold;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_NY_LEDER:
      return texts.deactivatedNyLeder;
    default:
      return "";
  }
};

interface PersonKortVirksomhetLederColumnProps {
  colSize: number;
  text?: string;
  isActive: boolean;
}

function PersonKortVirksomhetLederColumn({
  text,
  isActive,
}: PersonKortVirksomhetLederColumnProps) {
  return <p>{isActive ? <b>{text}</b> : text}</p>;
}

interface PersonKortVirksomhetLedereProps {
  sykmeldinger: SykmeldingOldFormat[];
  virksomhetLederMap: Map<string, NarmesteLederRelasjonDTO>;
  virksomhetsnummer: string;
}

export function PersonKortVirksomhetLedere({
  sykmeldinger,
  virksomhetLederMap,
  virksomhetsnummer,
}: PersonKortVirksomhetLedereProps) {
  const currentLeder: NarmesteLederRelasjonDTO =
    virksomhetLederMap[virksomhetsnummer][0];

  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);

  return (
    <PersonKortVirksomhetHeader
      arbeidsgiverForskutterer={currentLeder.arbeidsgiverForskutterer}
      virksomhetsnavn={virksomhetsnavn || ""}
      virksomhetsnummer={currentLeder.virksomhetsnummer}
      sykmeldinger={sykmeldinger}
    >
      <Table size={"small"}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader align={"left"} scope="col">
              {texts.name}
            </Table.ColumnHeader>
            <Table.ColumnHeader align={"left"} scope="col">
              {texts.email}
            </Table.ColumnHeader>
            <Table.ColumnHeader align={"left"} scope="col">
              {texts.phone}
            </Table.ColumnHeader>
            <Table.ColumnHeader align={"left"} scope="col">
              {texts.startDate}
            </Table.ColumnHeader>
            <Table.ColumnHeader align={"left"} scope="col">
              {texts.status}
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        {virksomhetLederMap[virksomhetsnummer].map(
          (leder: NarmesteLederRelasjonDTO, idx: number) => {
            const isActive =
              leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
            return (
              <Table.Row className="mb-2" key={idx}>
                <Table.DataCell align={"left"} textSize={"small"}>
                  <PersonKortVirksomhetLederColumn
                    colSize={3}
                    text={capitalizeAllWords(leder.narmesteLederNavn)}
                    isActive={isActive}
                  />
                </Table.DataCell>
                <Table.DataCell align={"left"} textSize={"small"}>
                  <EpostButton
                    epost={leder.narmesteLederEpost}
                    isActive={isActive}
                  />
                </Table.DataCell>
                <Table.DataCell align={"left"} textSize={"small"}>
                  <PersonKortVirksomhetLederColumn
                    colSize={2}
                    text={formatPhonenumber(leder.narmesteLederTelefonnummer)}
                    isActive={isActive}
                  />
                </Table.DataCell>
                {leder.aktivFom && (
                  <Table.DataCell align={"left"} textSize={"small"}>
                    <PersonKortVirksomhetLederColumn
                      colSize={2}
                      text={restdatoTildato(leder.aktivFom)}
                      isActive={isActive}
                    />
                  </Table.DataCell>
                )}
                {leder.status && (
                  <Table.DataCell align={"left"} textSize={"small"}>
                    <PersonKortVirksomhetLederColumn
                      colSize={2}
                      text={getNarmesteLederRelasjonStatusText(leder.status)}
                      isActive={isActive}
                    />
                  </Table.DataCell>
                )}
              </Table.Row>
            );
          },
        )}
      </Table>
    </PersonKortVirksomhetHeader>
  );
}
