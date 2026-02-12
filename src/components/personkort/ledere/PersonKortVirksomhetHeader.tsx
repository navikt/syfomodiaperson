import React, { ReactNode } from "react";
import styled from "styled-components";
import { formaterOrgnr } from "@/utils";
import { lederHasActiveSykmelding } from "@/utils/ledereUtils";
import { FabrikkImage } from "../../../../img/ImageComponents";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Tag } from "@navikt/ds-react";

const texts = {
  activeSykmelding: "Sykmeldt nå",
};

function arbeidsgiverForskuttererToText(arbeidsgiverForskutterer?: boolean) {
  if (arbeidsgiverForskutterer === null) {
    return "Ikke oppgitt";
  }
  return arbeidsgiverForskutterer ? "Ja" : "Nei";
}

const GridRow = styled.div`
  width: 100%;
  display: inline-grid;
  grid-template-columns: 4fr 2fr 2fr 2fr;
  grid-template-rows: 1fr;
  gap: 0em 0.5em;
  font-weight: 800;
`;

const FlexColumn = styled.div`
  display: flex;
  align-items: flex-end;
`;

interface Props {
  children?: ReactNode;
  arbeidsgiverForskutterer?: boolean;
  virksomhetsnavn: string;
  virksomhetsnummer: string;
  sykmeldinger: SykmeldingOldFormat[];
}

export function PersonKortVirksomhetHeader({
  children,
  arbeidsgiverForskutterer,
  virksomhetsnavn,
  virksomhetsnummer,
  sykmeldinger,
}: Props) {
  const virksomhetsnummerText = `Org.nr.: ${formaterOrgnr(virksomhetsnummer)}`;
  const forskutteringText = `Forsk.: ${arbeidsgiverForskuttererToText(
    arbeidsgiverForskutterer
  )}`;
  const activeSykmeldingText =
    lederHasActiveSykmelding(virksomhetsnummer, sykmeldinger) &&
    texts.activeSykmelding;
  return (
    <div className="mb-8">
      <div className="personkortElement__tittel bg-surface-subtle p-2 border-0">
        <img src={FabrikkImage} alt="Fabrikk" />
        <GridRow>
          <FlexColumn>{virksomhetsnavn}</FlexColumn>
          <FlexColumn>{virksomhetsnummerText}</FlexColumn>
          <FlexColumn>{forskutteringText}</FlexColumn>
          {activeSykmeldingText && (
            <FlexColumn>
              <Tag variant="alt3">{activeSykmeldingText}</Tag>
            </FlexColumn>
          )}
        </GridRow>
      </div>
      {children}
    </div>
  );
}
