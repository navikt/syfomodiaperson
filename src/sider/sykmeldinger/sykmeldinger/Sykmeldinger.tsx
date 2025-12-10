import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingLinkPanel from "./SykmeldingLinkPanel";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

interface SykmeldingTeasereProps {
  sykmeldinger: SykmeldingOldFormat[];
  tittel: string;
  ingenSykmeldingerMelding: string;
  children?: ReactElement;
}

export default function Sykmeldinger({
  sykmeldinger,
  tittel,
  ingenSykmeldingerMelding,
  children,
}: SykmeldingTeasereProps): ReactElement {
  const hasSykmeldinger = !!sykmeldinger.length;
  return (
    <div className="mb-4">
      <Box
        background="surface-default"
        padding="6"
        className="flex justify-between gap-4 items-center mb-px"
      >
        <div>
          <Heading size="xsmall" level="5">
            {tittel}
          </Heading>
          {!hasSykmeldinger && (
            <BodyShort size="small" className="flex-1 mt-3">
              {ingenSykmeldingerMelding}
            </BodyShort>
          )}
        </div>
        {children}
      </Box>
      {hasSykmeldinger &&
        sykmeldinger.map((sykmelding, idx) => (
          <SykmeldingLinkPanel key={idx} sykmelding={sykmelding} />
        ))}
    </div>
  );
}
