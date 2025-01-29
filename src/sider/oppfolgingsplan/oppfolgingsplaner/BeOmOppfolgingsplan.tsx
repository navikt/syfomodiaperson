import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
} from "@navikt/ds-react";
import React from "react";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import {
  NewOppfolgingsplanForesporselDTO,
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporsel,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { useOppfolgingsplanForesporselDocument } from "@/hooks/oppfolgingsplan/useOppfolgingsplanForesporselDocument";

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
  currentOppfolgingstilfelle: OppfolgingstilfelleDTO;
}

export default function BeOmOppfolgingsplan({
  aktivNarmesteLeder,
  currentOppfolgingstilfelle,
}: Props) {
  const personident = useValgtPersonident();
  const getOppfolgingsplanForesporsel = useGetOppfolgingsplanForesporselQuery();
  const postOppfolgingsplanForesporsel = usePostOppfolgingsplanForesporsel();
  const { getForesporselDocument } = useOppfolgingsplanForesporselDocument();

  function onClick() {
    const foresporsel: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: personident,
      virksomhetsnummer: aktivNarmesteLeder.virksomhetsnummer,
      narmestelederPersonident:
        aktivNarmesteLeder.narmesteLederPersonIdentNumber,
      document: getForesporselDocument({
        narmesteLeder: aktivNarmesteLeder.narmesteLederNavn,
        virksomhetNavn: aktivNarmesteLeder.virksomhetsnavn,
      }),
    };
    postOppfolgingsplanForesporsel.mutate(foresporsel, {
      onSuccess: () => logOppfolgingsplanForesporselEvent(),
    });
  }

  const lastForesporselCreatedAt =
    getOppfolgingsplanForesporsel.data?.[0]?.createdAt;

  const isAktivForesporsel = !!lastForesporselCreatedAt
    ? currentOppfolgingstilfelle.start <= lastForesporselCreatedAt &&
      lastForesporselCreatedAt <= currentOppfolgingstilfelle.end
    : false;
  const aktivForesporselTekst = `${
    texts.aktivForesporsel
  } ${tilLesbarDatoMedArUtenManedNavn(lastForesporselCreatedAt)}`;

  return (
    <>
      {postOppfolgingsplanForesporsel.isSuccess && (
        <Alert variant="success" className="mb-2" size="small">
          Forespørsel om oppfølgingsplan ble sendt
        </Alert>
      )}
      <Box background="surface-default" className="mb-4 flex flex-col p-4">
        <Heading size="medium">{texts.header}</Heading>
        <BodyLong className="mb-2">{texts.description}</BodyLong>
        <BodyShort>
          {texts.virksomhet} {aktivNarmesteLeder.virksomhetsnavn}
        </BodyShort>
        <BodyShort className="mb-2">
          {texts.narmesteLeder} {aktivNarmesteLeder.narmesteLederNavn}
        </BodyShort>
        {isAktivForesporsel && !!lastForesporselCreatedAt && (
          <Alert inline variant="warning" className="mb-2">
            {aktivForesporselTekst}
          </Alert>
        )}
        <Button
          className="w-fit mb-2"
          size="small"
          onClick={onClick}
          loading={postOppfolgingsplanForesporsel.isPending}
        >
          {texts.button}
        </Button>
      </Box>
    </>
  );
}
