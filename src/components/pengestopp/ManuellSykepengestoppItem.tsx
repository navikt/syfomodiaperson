import {
  Arbeidsgiver,
  Sykepengestopp,
} from "@/data/pengestopp/types/FlaggPerson";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  sykmeldingerToArbeidsgiver,
  uniqueArbeidsgivere,
} from "@/utils/pengestoppUtils";
import { Accordion, Label } from "@navikt/ds-react";
import { Paragraph } from "@/components/Paragraph";
import React from "react";

const texts = {
  vurdertLabel: "Vurdert av",
  statusStansLabel: "Automatisk utbetaling stanset",
};

interface Props {
  sykepengestopp: Sykepengestopp;
}

export default function ManuellSykepengestoppItem({ sykepengestopp }: Props) {
  const { veilederIdent } = sykepengestopp;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederIdent.value);
  const { sykmeldinger } = useSykmeldingerQuery();
  const opprettet = new Date(sykepengestopp.opprettet);
  const header = `${texts.statusStansLabel} - ${tilDatoMedManedNavn(
    opprettet
  )}`;

  function getArbeidsgiverNavn(sykepengestopp: Sykepengestopp) {
    const allArbeidsgivere = uniqueArbeidsgivere(
      sykmeldingerToArbeidsgiver(sykmeldinger)
    );

    return allArbeidsgivere.find(
      (ag: Arbeidsgiver) => ag.orgnummer === sykepengestopp.virksomhetNr?.value
    )?.navn;
  }

  const arbeidsgiver = sykepengestopp.virksomhetNr
    ? ` · Gjelder for: ${getArbeidsgiverNavn(sykepengestopp)}`
    : ``;

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        <Label size="small">{`${opprettet.getDate()}.${
          opprettet.getMonth() + 1
        }.${opprettet.getFullYear()} ${arbeidsgiver}`}</Label>
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
}
