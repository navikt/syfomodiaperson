import React from "react";
import {
  erMulighetForArbeidInformasjon,
  finnAvventendeSykmeldingTekst,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SuccessFilled, SuccessStroke } from "@navikt/ds-icons";
import { Heading, Label } from "@navikt/ds-react";
import styled from "styled-components";

const tekster = {
  mulighetForArbeid: {
    avventende: {
      tittel: "Innspill til arbeidsgiveren ved avventende sykmelding",
    },
    beskrivelse: "Nærmere beskrivelse",
    medisinskAarsak: {
      tittel: "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
    },
    forholdPaaArbeidsplass: {
      tittel:
        "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
    },
  },
};

interface AvventendeSykmeldingProps {
  avventendeTekst: string;
}

const AvventendeSykmelding = ({
  avventendeTekst,
}: AvventendeSykmeldingProps) => (
  <div>
    <h5 className="undertittel">
      {tekster.mulighetForArbeid.avventende.tittel}
    </h5>
    <p>{avventendeTekst}</p>
  </div>
);

interface AktivitetIkkeMuligProps {
  beskrivelse?: string;
  ikkeMuligListe: string[];
  tittel: string;
}

const AktivitetHeading = styled(Heading)`
  display: flex;
  align-items: center;
`;

const AktivitetLabel = styled(Label)`
  display: flex;
  align-items: center;
  margin-left: 2em;
  margin-top: 1.5em;
`;

const StyledSuccessFilled = styled(SuccessFilled)`
  margin-right: 0.5em;
  font-size: 1.5rem;
`;

const StyledSuccessStroke = styled(SuccessStroke)`
  margin-right: 0.2em;
  font-size: 1.5rem;
`;

const AktivitetIkkeMulig = ({
  beskrivelse,
  ikkeMuligListe,
  tittel,
}: AktivitetIkkeMuligProps) => (
  <div className="MulighetForArbeid">
    <AktivitetHeading spacing size="medium" level="4">
      <StyledSuccessFilled />
      {tittel}
    </AktivitetHeading>

    {ikkeMuligListe.map((ikkeMuligTekst: string, index: number) => {
      return (
        <AktivitetLabel key={index} spacing>
          <StyledSuccessStroke key={index} />
          {ikkeMuligTekst}
        </AktivitetLabel>
      );
    })}
    {beskrivelse && [
      <h6 key={0} className="sporsmal">
        {tekster.mulighetForArbeid.beskrivelse}
      </h6>,
      <p key={1}>{beskrivelse}</p>,
    ]}
  </div>
);

interface MulighetForArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

const MulighetForArbeid = ({ sykmelding }: MulighetForArbeidProps) => {
  const mulighetForArbeid = sykmelding.mulighetForArbeid;
  const avventendeTekst = finnAvventendeSykmeldingTekst(sykmelding);
  const aktivitetIkkeMulig433 = mulighetForArbeid.aktivitetIkkeMulig433;
  const aarsakAktivitetIkkeMulig433 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig433;
  const aktivitetIkkeMulig434 = mulighetForArbeid.aktivitetIkkeMulig434;
  const aarsakAktivitetIkkeMulig434 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  const skalVise = erMulighetForArbeidInformasjon(sykmelding);
  return (
    <>
      {" "}
      {(skalVise || !!avventendeTekst) && (
        <div className="sykmeldingMotebehovVisning__avsnitt">
          {!!avventendeTekst && (
            <AvventendeSykmelding avventendeTekst={avventendeTekst} />
          )}
          {aktivitetIkkeMulig433 && (
            <AktivitetIkkeMulig
              beskrivelse={aarsakAktivitetIkkeMulig433}
              ikkeMuligListe={aktivitetIkkeMulig433}
              tittel={tekster.mulighetForArbeid.medisinskAarsak.tittel}
            />
          )}
          {aktivitetIkkeMulig434 && (
            <AktivitetIkkeMulig
              beskrivelse={aarsakAktivitetIkkeMulig434}
              ikkeMuligListe={aktivitetIkkeMulig434}
              tittel={tekster.mulighetForArbeid.forholdPaaArbeidsplass.tittel}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MulighetForArbeid;
