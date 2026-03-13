import React from "react";
import { Column, Row } from "nav-frontend-grid";
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
import { BodyShort } from "@navikt/ds-react";

const texts = {
  name: "Navn",
  phone: "Telefon",
  email: "E-post",
  orgnummer: "Org.nummer",
  startDate: "Meldt inn",
  active: "Nåværende",
  deactivated: "Deaktivert",
  deactivatedArbeidstaker: "Deaktivert av arbeidstakeren",
  deactivatedLeder: "Deaktivert av lederen",
  deactivatedArbeidsforhold: "Arbeidsforholdet er avsluttet",
  deactivatedNyLeder: "Ny leder er meldt inn",
};

const getNarmesteLederRelasjonStatusText = (
  status: NarmesteLederRelasjonStatus
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
  colSize,
  text,
  isActive,
}: PersonKortVirksomhetLederColumnProps) {
  return (
    <Column className={`col-sm-${colSize}`}>
      <p>{isActive ? <b>{text}</b> : text}</p>
    </Column>
  );
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
      <Row className="w-full mb-2 flex items-center">
        <div className="col-sm-3">
          <BodyShort className="text-sm">{texts.name}</BodyShort>
        </div>
        <div className="col-sm-3">
          <BodyShort className="text-sm">{texts.email}</BodyShort>
        </div>
        <div className="col-sm-2">
          <BodyShort className="text-sm">{texts.phone}</BodyShort>
        </div>
        <div className="col-sm-2">
          <BodyShort className="text-sm">{texts.startDate}</BodyShort>
        </div>
      </Row>
      {virksomhetLederMap[virksomhetsnummer].map(
        (leder: NarmesteLederRelasjonDTO, idx: number) => {
          const isActive =
            leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
          return (
            <Row className="w-full mb-2 flex items-center" key={idx}>
              <PersonKortVirksomhetLederColumn
                colSize={3}
                text={capitalizeAllWords(leder.narmesteLederNavn)}
                isActive={isActive}
              />
              <EpostButton
                epost={leder.narmesteLederEpost}
                isActive={isActive}
              />
              <PersonKortVirksomhetLederColumn
                colSize={2}
                text={formatPhonenumber(leder.narmesteLederTelefonnummer)}
                isActive={isActive}
              />
              {leder.aktivFom && (
                <PersonKortVirksomhetLederColumn
                  colSize={2}
                  text={restdatoTildato(leder.aktivFom)}
                  isActive={isActive}
                />
              )}
              {leder.status && (
                <PersonKortVirksomhetLederColumn
                  colSize={2}
                  text={getNarmesteLederRelasjonStatusText(leder.status)}
                  isActive={isActive}
                />
              )}
            </Row>
          );
        }
      )}
    </PersonKortVirksomhetHeader>
  );
}
