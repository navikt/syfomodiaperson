import React from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Detail,
  Loader,
  LocalAlert,
} from "@navikt/ds-react";
import { useSoknaderQuery } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { Link, useParams } from "react-router-dom";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils.ts";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  didNotFindSoknad: "Fant ikke søknaden",
  modiaWarningHeader: "Begrenset behandling i Modia",
  modiaWarningContent:
    "Det er kun mulighet for å innvilge søknaden i Modia. Dersom søknaden skal delvis innvilges eller avslås, må vedtaket fattes i Infotrygd som tidligere.",
  goToSoknad: "Vis hele søknaden",
  singlePeriod: "Perioden det er søkt om innvilges i sin helhet",
  multiplePeriods: "Periodene det er søkt om innvilges i sin helhet",
  sendButton: "Godkjenn og send vedtak",
  previewButton: "Forhåndsvisning",
  backButton: "Tilbake",
};

export function UtenlandsoppholdSoknad() {
  const { data, isPending, isError } = useSoknaderQuery();

  const { utenlandsoppholdSoknadId } = useParams<{
    utenlandsoppholdSoknadId: string;
  }>();

  const utenlandsoppholdSoknad = data?.soknader.find(
    (soknad) => soknad.soknadId === utenlandsoppholdSoknadId,
  );
  const soktePerioder = utenlandsoppholdSoknad?.soktePerioder;

  const periodText =
    soktePerioder && soktePerioder?.length > 1
      ? texts.multiplePeriods
      : texts.singlePeriod;

  return (
    <Box background="default" padding="space-16" className="flex flex-col">
      {isPending ? (
        <Loader size="xlarge" title={texts.pending} />
      ) : isError ? (
        <Alert size="small" variant="error">
          {texts.error}
        </Alert>
      ) : !utenlandsoppholdSoknad ? (
        <BodyShort>{texts.didNotFindSoknad}</BodyShort>
      ) : (
        <div className={"flex flex-col gap-8"}>
          <LocalAlert status={"warning"}>
            <LocalAlert.Header>
              <LocalAlert.Title>{texts.modiaWarningHeader}</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>{texts.modiaWarningContent}</LocalAlert.Content>
          </LocalAlert>

          <div>
            <Button
              as={Link}
              to={`/sykefravaer/sykepengesoknader/${utenlandsoppholdSoknad.eksternId}`}
              size="medium"
              variant="secondary"
            >
              {texts.goToSoknad}
            </Button>
          </div>

          <div>
            <Detail>{periodText}</Detail>
            {soktePerioder?.map((periode, index) => (
              <BodyShort key={index} weight={"semibold"}>
                {tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)}
              </BodyShort>
            ))}
          </div>

          <div className="flex flex-row gap-4">
            <Button as="a" variant="primary">
              {texts.sendButton}
            </Button>
            <Button variant="secondary">{texts.previewButton}</Button>
            <Button
              as={Link}
              to={`/sykefravaer/utenlandsopphold`}
              variant="tertiary"
            >
              {texts.backButton}
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
}
