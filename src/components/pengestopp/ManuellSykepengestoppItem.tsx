import {
  Arbeidsgiver,
  Sykepengestopp,
  VirksomhetNr,
} from "@/data/pengestopp/types/FlaggPerson";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  sykmeldingerToArbeidsgiver,
  uniqueArbeidsgivere,
} from "@/utils/pengestoppUtils";
import { Accordion } from "@navikt/ds-react";
import { Paragraph } from "@/components/Paragraph";
import React from "react";

const texts = {
  vurdertLabel: "Vurdert av",
  arbeidsgiverLabel: "Arbeidsgiver",
  statusStansLabel: "Automatisk utbetaling stanset",
};

interface Props {
  sykepengestopp: Sykepengestopp;
}

export default function ManuellSykepengestoppItem({
  sykepengestopp: { veilederIdent, opprettet, virksomhetNr },
}: Props) {
  const { data: veilederinfo } = useVeilederInfoQuery(veilederIdent.value);
  const { sykmeldinger } = useSykmeldingerQuery();
  const header = `${texts.statusStansLabel} - ${tilDatoMedManedNavn(
    new Date(opprettet)
  )}`;

  function getArbeidsgiverNavn(virksomhetNr: VirksomhetNr) {
    const allArbeidsgivere = uniqueArbeidsgivere(
      sykmeldingerToArbeidsgiver(sykmeldinger)
    );

    return (
      allArbeidsgivere.find(
        (ag: Arbeidsgiver) => ag.orgnummer === virksomhetNr?.value
      )?.navn ?? "Ukjent arbeidsgiver"
    );
  }

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        {virksomhetNr && (
          <Paragraph
            label={texts.arbeidsgiverLabel}
            body={`${getArbeidsgiverNavn(virksomhetNr)}`}
          />
        )}
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
}
