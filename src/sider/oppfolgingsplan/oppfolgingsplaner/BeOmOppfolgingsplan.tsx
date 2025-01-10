import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
} from "@navikt/ds-react";
import React from "react";
import {
  NewOppfolgingsplanForesporselDTO,
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporselQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Veileder } from "@/data/veilederinfo/types/Veileder";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  header: "Be om oppfølgingsplan fra arbeidsgiver",
  description:
    "Her kan du be om oppfølgingsplan fra arbeidsgiver eller purre om det mangler.",
  virksomhet: "Virksomhet:",
  narmesteLeder: "Nærmeste leder:",
  aktivForesporsel:
    "Obs! Det ble bedt om oppfølgingsplan fra denne arbeidsgiveren",
  button: "Be om oppfølgingsplan",
};

interface Props {
  aktivVeileder: Veileder;
  aktivNarmesteLeder: NarmesteLederRelasjonDTO;
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO;
}

function logOppfolgingsplanForesporselEvent() {
  Amplitude.logEvent({
    type: EventType.ButtonClick,
    data: {
      url: window.location.href,
      tekst: "Be om oppfølgingsplan",
    },
  });
}

export default function BeOmOppfolgingsplan({
  aktivVeileder,
  aktivNarmesteLeder,
  latestOppfolgingstilfelle,
}: Props) {
  const personident = useValgtPersonident();
  const getOppfolgingsplanForesporsel = useGetOppfolgingsplanForesporselQuery();

  const postOppfolgingsplanForesporselQuery =
    usePostOppfolgingsplanForesporselQuery();

  function onClick() {
    const foresporsel: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: personident,
      veilederident: aktivVeileder.ident,
      virksomhetsnummer: aktivNarmesteLeder.virksomhetsnummer,
      narmestelederPersonident:
        aktivNarmesteLeder.narmesteLederPersonIdentNumber,
    };
    postOppfolgingsplanForesporselQuery.mutate(foresporsel, {
      onSuccess: () => logOppfolgingsplanForesporselEvent(),
    });
  }

  const lastForesporselCreatedAt =
    getOppfolgingsplanForesporsel.data?.[0]?.createdAt;

  const isActiveForesporsel = !!lastForesporselCreatedAt
    ? latestOppfolgingstilfelle.start <= lastForesporselCreatedAt &&
      lastForesporselCreatedAt <= latestOppfolgingstilfelle.end
    : false;

  return (
    <Box
      background="surface-default"
      className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8"
    >
      <Heading size="medium">{texts.header}</Heading>
      <BodyLong className="mb-2">{texts.description}</BodyLong>
      <BodyShort>
        {texts.virksomhet} {aktivNarmesteLeder.virksomhetsnavn}
      </BodyShort>
      <BodyShort className="mb-2">
        {texts.narmesteLeder} {aktivNarmesteLeder.narmesteLederNavn}
      </BodyShort>
      {isActiveForesporsel && !!lastForesporselCreatedAt && (
        <Alert inline variant="warning" className="mb-2">
          {texts.aktivForesporsel}{" "}
          {tilLesbarDatoMedArUtenManedNavn(lastForesporselCreatedAt)}
        </Alert>
      )}
      <Button className="w-fit" size="small" onClick={onClick}>
        {texts.button}
      </Button>
    </Box>
  );
}
