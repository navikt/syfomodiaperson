import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingLinkPanel from "./SykmeldingLinkPanel";
import { Heading } from "@navikt/ds-react";

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
  return (
    <div className="mb-4">
      <header className="inngangspanelerHeader">
        <Heading size="xsmall" level="5" className="flex flex-1 self-center">
          {tittel}
        </Heading>
        {children}
      </header>
      <div>
        {sykmeldinger.length ? (
          sykmeldinger.map((sykmelding, idx) => (
            <SykmeldingLinkPanel key={idx} sykmelding={sykmelding} />
          ))
        ) : (
          <p className="typo-infotekst">{ingenSykmeldingerMelding}</p>
        )}
      </div>
    </div>
  );
}
