import { Accordion, BodyLong } from "@navikt/ds-react";
import React from "react";

const texts = {
  header: "Les her om tidspunkt og plikt for dialogmøte 2",
  part1:
    "Nav skal innkalle til dialogmøte 2 senest innen 26 uker etter at en arbeidstaker har blitt sykmeldt. Møtet kan imidlertid avholdes tidligere dersom arbeidstaker eller arbeidsgiver ber om det.",
  part2:
    "I slike tilfeller har Nav plikt til å kalle inn og gjennomføre møtet. I slike tilfeller gjelder ikke unntaksreglene som vanligvis kan gjøre at møtet ikke blir holdt.",
  part3:
    "Nav kan heller ikke stille krav om at arbeidsgiver først må ha gjennomført dialogmøte 1 eller sendt inn oppfølgingsplan. Plikten til å gjennomføre dialogmøte 2 gjelder selv om arbeidsgiver ikke har oppfylt sine plikter i oppfølgingsarbeidet.",
};

export default function HjelpetekstVedMeldtBehov() {
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>{texts.header}</Accordion.Header>
        <Accordion.Content>
          <BodyLong size="small" spacing={true}>
            {texts.part1}
          </BodyLong>
          <BodyLong size="small" spacing={true}>
            {texts.part2}
          </BodyLong>
          <BodyLong size="small">{texts.part3}</BodyLong>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
