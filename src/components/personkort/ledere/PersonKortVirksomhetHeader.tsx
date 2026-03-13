import React, { ReactNode } from "react";
import styled from "styled-components";
import { formaterOrgnr } from "@/utils";
import { lederHasActiveSykmelding } from "@/utils/ledereUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Tag } from "@navikt/ds-react";
import { Buildings2Icon } from "@navikt/aksel-icons";

const texts = {
  activeSykmelding: "Sykmeldt nå",
};

function arbeidsgiverForskuttererToText(
  arbeidsgiverForskutterer?: boolean
): string {
  if (arbeidsgiverForskutterer === undefined) {
    return "Forskuttering ikke oppgitt";
  }
  return arbeidsgiverForskutterer
    ? "Arbeidsgiver forskutterer"
    : "Arbeidsgiver forskutterer ikke";
}

const GridRow = styled.div`
  width: 100%;
  display: inline-grid;
  grid-template-columns: 4fr 2fr 2fr 2fr;
  grid-template-rows: 1fr;
  gap: 0em 0.5em;
  font-weight: 800;
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
  return (
    <div className="mb-8">
      <div className="personkortElement__tittel bg-ax-bg-neutral-soft p-2 border-0">
        <Buildings2Icon title="a11y-title" fontSize="1.5rem" className="mr-2" />
        <GridRow>
          <div className="flex items-end">{virksomhetsnavn}</div>
          <div className="flex items-end">{virksomhetsnummerText}</div>
          <div className="flex items-end">
            {arbeidsgiverForskuttererToText(arbeidsgiverForskutterer)}
          </div>
          {lederHasActiveSykmelding(virksomhetsnummer, sykmeldinger) && (
            <Tag
              size="small"
              data-color="info"
              variant="outline"
              className="max-w-fit"
            >
              {texts.activeSykmelding}
            </Tag>
          )}
        </GridRow>
      </div>
      {children}
    </div>
  );
}
