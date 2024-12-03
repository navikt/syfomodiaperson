import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingLinkPanel from "./SykmeldingLinkPanel";
import { Heading } from "@navikt/ds-react";

interface SykmeldingTeasereProps {
  sykmeldinger: SykmeldingOldFormat[];
  className: string;
  tittel: string;
  ingenSykmeldingerMelding: string;
  id: string;
  children?: ReactElement;
}

function Sykmeldinger({
  sykmeldinger,
  className,
  tittel = "",
  ingenSykmeldingerMelding,
  id,
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
      <div id={id} className={className || "js-content"}>
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

export default Sykmeldinger;
