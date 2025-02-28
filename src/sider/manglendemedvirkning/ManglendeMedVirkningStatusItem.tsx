import {
  Arbeidsgiver,
  StatusEndring,
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
  statusStansLabel: "Melding om stans sendt",
};

interface StatusEndringItemProps {
  status: StatusEndring;
}

export default function StatusItem({ status }: StatusEndringItemProps) {
  const { veilederIdent } = status;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederIdent.value);
  const { sykmeldinger } = useSykmeldingerQuery();
  const opprettet = new Date(status.opprettet);
  const header = `${texts.statusStansLabel} - ${tilDatoMedManedNavn(
    opprettet
  )}`;

  const allArbeidsgivere = uniqueArbeidsgivere(
    sykmeldingerToArbeidsgiver(sykmeldinger)
  );

  function getArbeidsgiverNavn(statusEndring: StatusEndring) {
    return allArbeidsgivere.find(
      (ag: Arbeidsgiver) => ag.orgnummer === statusEndring.virksomhetNr?.value
    )?.navn;
  }

  const arbeidsgiver = status.virksomhetNr
    ? ` · Gjelder for: ${getArbeidsgiverNavn(status)}`
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
