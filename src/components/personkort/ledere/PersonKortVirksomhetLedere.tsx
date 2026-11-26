import { formatShortDate } from "@/utils/datoUtils";
import EpostButton from "../EpostButton";
import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledereTypes";
import { capitalizeAllWords, formatPhonenumber } from "@/utils/stringUtils";
import { BodyShort, Table } from "@navikt/ds-react";

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

function getNarmesteLederRelasjonStatusText(
  status: NarmesteLederRelasjonStatus,
) {
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
}

function PersonKortVirksomhetLederColumn({
  text,
  isActive,
}: {
  text?: string;
  isActive: boolean;
}) {
  return <BodyShort size="small">{isActive ? <b>{text}</b> : text}</BodyShort>;
}

interface Props {
  ledere: NarmesteLederRelasjonDTO[];
}

export function PersonKortVirksomhetLedere({ ledere }: Props) {
  return (
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
          <Table.ColumnHeader align={"left"} scope="col" textSize="small">
            {texts.name}
          </Table.ColumnHeader>
          <Table.ColumnHeader align={"left"} scope="col" textSize="small">
            {texts.email}
          </Table.ColumnHeader>
          <Table.ColumnHeader align={"left"} scope="col" textSize="small">
            {texts.phone}
          </Table.ColumnHeader>
          <Table.ColumnHeader align={"left"} scope="col" textSize="small">
            {texts.startDate}
          </Table.ColumnHeader>
          <Table.ColumnHeader align={"left"} scope="col" textSize="small">
            {texts.status}
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {ledere.map((leder: NarmesteLederRelasjonDTO, idx: number) => {
          const isActive =
            leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
          return (
            <Table.Row className="mb-2" key={idx}>
              <Table.DataCell align={"left"} textSize={"small"}>
                <PersonKortVirksomhetLederColumn
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
                  text={formatPhonenumber(leder.narmesteLederTelefonnummer)}
                  isActive={isActive}
                />
              </Table.DataCell>
              {leder.aktivFom && (
                <Table.DataCell align={"left"} textSize={"small"}>
                  <PersonKortVirksomhetLederColumn
                    text={formatShortDate(leder.aktivFom)}
                    isActive={isActive}
                  />
                </Table.DataCell>
              )}
              {leder.status && (
                <Table.DataCell align={"left"} textSize={"small"}>
                  <PersonKortVirksomhetLederColumn
                    text={getNarmesteLederRelasjonStatusText(leder.status)}
                    isActive={isActive}
                  />
                </Table.DataCell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
