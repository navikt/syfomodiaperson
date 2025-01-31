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
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import {
  NewOppfolgingsplanForesporselDTO,
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporsel,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  isDateInOppfolgingstilfelle,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingsplanForesporselDocument } from "@/hooks/oppfolgingsplan/useOppfolgingsplanForesporselDocument";
import { oppfolgingstilfelle } from "../../../../test/aktivitetskrav/vurdering/vurderingTestUtils";

const texts = {
  aktivForesporsel:
    "Obs! Det ble bedt om oppfølgingsplan fra denne arbeidsgiveren",
  header: "Be om oppfølgingsplan fra arbeidsgiver",
  description:
    "Her kan du be om oppfølgingsplan fra arbeidsgiver eller purre om det mangler.",
  virksomhet: "Virksomhet:",
  narmesteLeder: "Nærmeste leder:",
  button: "Be om oppfølgingsplan",
  foresporselSendt: "Forespørsel om oppfølgingsplan sendt",
  foresporselFeilet: "Det skjedde en uventet feil. Vennligst prøv igjen senere",
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

  const lastForesporselCreatedAt =
    getOppfolgingsplanForesporsel.data?.[0]?.createdAt;
  const isAktivForesporsel =
    !!lastForesporselCreatedAt &&
    !!currentOppfolgingstilfelle &&
    !postOppfolgingsplanForesporsel.isSuccess
      ? isDateInOppfolgingstilfelle(
          lastForesporselCreatedAt,
          oppfolgingstilfelle
        )
      : false;
  const aktivForesporselTekst = `${
    texts.aktivForesporsel
  } ${tilLesbarDatoMedArUtenManedNavn(lastForesporselCreatedAt)}`;

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

  return (
    <>
      {isAktivForesporsel && (
        <Alert variant="warning" className="mb-2">
          {aktivForesporselTekst}
        </Alert>
      )}
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
        {postOppfolgingsplanForesporsel.isSuccess ? (
          <Alert inline variant="success">
            {texts.foresporselSendt}
          </Alert>
        ) : (
          <Button
            className="w-fit mb-2"
            size="small"
            onClick={onClick}
            loading={postOppfolgingsplanForesporsel.isPending}
          >
            {texts.button}
          </Button>
        )}
        {postOppfolgingsplanForesporsel.isError && (
          <Alert inline variant="error">
            {texts.foresporselFeilet}
          </Alert>
        )}
      </Box>
    </>
  );
}
