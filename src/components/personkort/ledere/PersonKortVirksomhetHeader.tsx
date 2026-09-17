import React, { ReactNode } from "react";
import { formaterOrgnr } from "@/utils";
import { lederHasActiveSykmelding } from "@/utils/ledereUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, Tag } from "@navikt/ds-react";
import { Buildings2Icon } from "@navikt/aksel-icons";

const texts = {
  activeSykmelding: "Sykmeldt nå",
};

function arbeidsgiverForskuttererToText(
  arbeidsgiverForskutterer?: boolean,
): string {
  if (arbeidsgiverForskutterer === undefined) {
    return "Forskuttering ikke oppgitt";
  }
  return arbeidsgiverForskutterer
    ? "Arbeidsgiver forskutterer"
    : "Arbeidsgiver forskutterer ikke";
}

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
      <div className="mb-4 flex items-center bg-ax-bg-neutral-soft p-2">
        <Buildings2Icon title="a11y-title" fontSize="1.5rem" className="mr-2" />
        <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr] grid-rows-1  gap-x-2 items-center">
          <BodyShort weight="semibold" size="small">
            {virksomhetsnavn}
          </BodyShort>
          <BodyShort weight="semibold" size="small">
            {virksomhetsnummerText}
          </BodyShort>
          <BodyShort weight="semibold" size="small">
            {arbeidsgiverForskuttererToText(arbeidsgiverForskutterer)}
          </BodyShort>
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
        </div>
      </div>
      {children}
    </div>
  );
}
