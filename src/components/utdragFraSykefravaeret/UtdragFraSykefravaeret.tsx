import React from "react";
import UtdragOppfolgingsplaner from "./UtdragOppfolgingsplaner";
import { BodyShort, Box, Heading, Link } from "@navikt/ds-react";
import Sykmeldinger from "./Sykmeldinger";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { finnNaisUrlIntern } from "@/utils/miljoUtil";
import { EventType, trackEvent } from "@/utils/umami";

const texts = {
  header: "Utdrag fra sykefraværet",
  kommunikasjonMedBruker: "Kommunikasjon med bruker",
};

function tilfelleText(start: Date, end: Date, varighet: number) {
  return `Gjelder sykefraværet: ${tilLesbarPeriodeMedArstall(
    start,
    end
  )} (${varighet} uker).`;
}

const lenkeKommunikasjonMedBruker = `https://modiapersonoversikt${finnNaisUrlIntern()}/person/meldinger`;

function logEvent() {
  trackEvent({
    type: EventType.LenkeKlikket,
    data: {
      tekst: texts.kommunikasjonMedBruker,
      destinasjonUrl: lenkeKommunikasjonMedBruker,
    },
  });
}

function Samtalereferat() {
  return (
    <Link href={lenkeKommunikasjonMedBruker} target="_blank" onClick={logEvent}>
      {texts.kommunikasjonMedBruker}
    </Link>
  );
}

interface Props {
  selectedOppfolgingstilfelle?: OppfolgingstilfelleDTO;
}

export default function UtdragFraSykefravaeret({
  selectedOppfolgingstilfelle,
}: Props) {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelle =
    selectedOppfolgingstilfelle || latestOppfolgingstilfelle;

  return (
    <Box
      padding="4"
      background="surface-default"
      className="mb-2 h-min flex flex-col gap-6"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        {oppfolgingstilfelle && (
          <BodyShort size="small">
            {tilfelleText(
              oppfolgingstilfelle?.start,
              oppfolgingstilfelle?.end,
              oppfolgingstilfelle?.varighetUker
            )}
          </BodyShort>
        )}
      </div>
      <UtdragOppfolgingsplaner
        selectedOppfolgingstilfelle={oppfolgingstilfelle}
      />
      <Sykmeldinger selectedOppfolgingstilfelle={oppfolgingstilfelle} />
      <Samtalereferat />
    </Box>
  );
}
