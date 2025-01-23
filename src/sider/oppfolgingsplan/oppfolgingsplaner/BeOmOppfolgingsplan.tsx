import { BodyLong, BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import React from "react";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { NewOppfolgingsplanForesporselDTO } from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { UseMutationResult } from "@tanstack/react-query";

const texts = {
  header: "Be om oppfølgingsplan fra arbeidsgiver",
  description:
    "Her kan du be om oppfølgingsplan fra arbeidsgiver eller purre om det mangler.",
  virksomhet: "Virksomhet:",
  narmesteLeder: "Nærmeste leder:",
  button: "Be om oppfølgingsplan",
};

function logOppfolgingsplanForesporselEvent() {
  Amplitude.logEvent({
    type: EventType.ButtonClick,
    data: {
      url: window.location.href,
      tekst: "Be om oppfølgingsplan",
    },
  });
}

interface Props {
  aktivNarmesteLeder: NarmesteLederRelasjonDTO;
  postOppfolgingsplanForesporsel: UseMutationResult<
    NewOppfolgingsplanForesporselDTO,
    Error,
    NewOppfolgingsplanForesporselDTO,
    unknown
  >;
}

export default function BeOmOppfolgingsplan({
  aktivNarmesteLeder,
  postOppfolgingsplanForesporsel,
}: Props) {
  const personident = useValgtPersonident();

  function onClick() {
    const foresporsel: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: personident,
      virksomhetsnummer: aktivNarmesteLeder.virksomhetsnummer,
      narmestelederPersonident:
        aktivNarmesteLeder.narmesteLederPersonIdentNumber,
      document: [],
    };
    postOppfolgingsplanForesporsel.mutate(foresporsel, {
      onSuccess: () => logOppfolgingsplanForesporselEvent(),
    });
  }

  return (
    <Box background="surface-default" className="mb-4 flex flex-col p-4">
      <Heading size="small" level="3">
        {texts.header}
      </Heading>
      <BodyLong className="mb-2">{texts.description}</BodyLong>
      <BodyShort>
        {texts.virksomhet} {aktivNarmesteLeder.virksomhetsnavn}
      </BodyShort>
      <BodyShort className="mb-2">
        {texts.narmesteLeder} {aktivNarmesteLeder.narmesteLederNavn}
      </BodyShort>
      <Button
        className="w-fit mb-2"
        size="small"
        onClick={onClick}
        loading={postOppfolgingsplanForesporsel.isPending}
      >
        {texts.button}
      </Button>
    </Box>
  );
}
