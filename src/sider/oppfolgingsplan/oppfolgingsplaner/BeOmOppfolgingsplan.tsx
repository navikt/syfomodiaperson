import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  ReadMore,
} from "@navikt/ds-react";
import { PaperplaneIcon } from "@navikt/aksel-icons";
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
import LabelAndText from "@/components/LabelAndText";

const texts = {
  aktivForesporsel:
    "Obs! Det ble bedt om oppfølgingsplan fra denne arbeidsgiveren",
  header: "Be om oppfølgingsplan",
  description: {
    info1: "Her kan du be om oppfølgingsplan fra arbeidsgiver.",
    info2:
      "Forespørselen blir journalført og vil være tilgjengelig for den sykmeldte på innloggede sider.",
    info3: "Nærmeste leder vil motta et varsel på e-post.",
  },
  virksomhet: "Virksomhet:",
  narmesteLeder: "Nærmeste leder:",
  button: "Send forespørsel",
  foresporselSendt: "Forespørsel om oppfølgingsplan sendt",
  foresporselFeilet: "Det skjedde en uventet feil. Vennligst prøv igjen senere",
  readMoreText: "Dette får nærmeste leder tilsendt i e-posten fra Nav",
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

function logReadMoreClick(isOpened: boolean) {
  if (isOpened) {
    Amplitude.logEvent({
      type: Amplitude.EventType.ButtonClick,
      data: {
        url: window.location.href,
        tekst: "Åpne ReadMore for innhold epost",
      },
    });
  }
}

function ReadMoreContent() {
  return (
    <BodyShort className="whitespace-pre-line">
      {`Hei, \n
      Nav ber om at du sender inn oppfølgingsplan for en av dine ansatte som er sykmeldt.
      Logg inn på "Min side - arbeidsgiver". Klikk på varselet i "bjella" for å se hvem det gjelder. \n
      Har du spørsmål, kan du kontakte oss på 55 55 33 36. \n
      Vennlig hilsen Nav. \n
      Du kan ikke svare på denne meldingen.
      `}
    </BodyShort>
  );
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
      <Box
        background="surface-default"
        className="mb-4 flex flex-col p-4 gap-4"
      >
        <Heading size="small" level="3">
          {texts.header}
        </Heading>
        <div>
          <BodyLong>{texts.description.info1}</BodyLong>
          <BodyLong>{texts.description.info2}</BodyLong>
        </div>
        <div>
          <LabelAndText
            label={texts.virksomhet}
            text={aktivNarmesteLeder.virksomhetsnavn}
          />
          <LabelAndText
            label={texts.narmesteLeder}
            text={aktivNarmesteLeder.narmesteLederNavn}
          />
        </div>
        <div>
          <BodyLong>{texts.description.info3}</BodyLong>
          <ReadMore header={texts.readMoreText} onOpenChange={logReadMoreClick}>
            <ReadMoreContent />
          </ReadMore>
        </div>
        {postOppfolgingsplanForesporsel.isSuccess ? (
          <Alert inline variant="success">
            {texts.foresporselSendt}
          </Alert>
        ) : (
          <Button
            className="w-fit"
            onClick={onClick}
            loading={postOppfolgingsplanForesporsel.isPending}
            icon={<PaperplaneIcon />}
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
