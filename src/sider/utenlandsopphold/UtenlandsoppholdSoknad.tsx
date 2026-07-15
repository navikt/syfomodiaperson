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
import {
  useSoknaderQuery,
  useVedtakMutation,
} from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils.ts";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useUtenlandsoppholdSoknadDocument } from "@/hooks/utenlandsopphold/useUtenlandsoppholdSoknadDocument";
import { useNotification } from "@/context/notification/NotificationContext.tsx";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import { SoknadStatusDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

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
  previewContentLabel: "Forhåndsvisning",
  backButton: "Tilbake",
  vedtakFattetNotification:
    "Vedtaket om utenlandsopphold utenfor EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
  alertBehandlet: "Denne søknaden er allerede behandlet",
};

export function UtenlandsoppholdSoknad() {
  const { data, isPending, isError } = useSoknaderQuery();
  const { mutate, isPending: mutateIsPending } = useVedtakMutation();
  const { getVedtakDocument } = useUtenlandsoppholdSoknadDocument();

  const navigate = useNavigate();
  const { setNotification } = useNotification();

  const { utenlandsoppholdSoknadId } = useParams<{
    utenlandsoppholdSoknadId: string;
  }>();

  const utenlandsoppholdSoknad = data?.soknader.find(
    (soknad) =>
      soknad.soknadId === utenlandsoppholdSoknadId ||
      soknad.eksternId === utenlandsoppholdSoknadId,
  );

  if (!utenlandsoppholdSoknad) {
    return (
      <Box background="default" padding="space-16" className="flex flex-col">
        {isPending ? (
          <Loader size="xlarge" title={texts.pending} />
        ) : isError ? (
          <Alert size="small" variant="error">
            {texts.error}
          </Alert>
        ) : (
          <BodyShort>{texts.didNotFindSoknad}</BodyShort>
        )}
      </Box>
    );
  }

  const soknadBehandlet =
    utenlandsoppholdSoknad.status !== SoknadStatusDTO.MOTTATT;
  const soktePerioder = utenlandsoppholdSoknad.soktePerioder;
  const periodText =
    soktePerioder.length > 1 ? texts.multiplePeriods : texts.singlePeriod;
  const vedtakDocument = getVedtakDocument({
    soknadDato: utenlandsoppholdSoknad.innsendtTidspunkt,
    perioder: utenlandsoppholdSoknad.soktePerioder,
  });

  return (
    <Box background="default" padding="space-16" className="flex flex-col">
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
          {utenlandsoppholdSoknad.soktePerioder.map((periode, index) => (
            <BodyShort key={index} weight={"semibold"}>
              {tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)}
            </BodyShort>
          ))}
        </div>

        {soknadBehandlet && (
          <Alert variant="info" size="small" className="w-fit p-4 mb-4">
            {texts.alertBehandlet}
          </Alert>
        )}

        <div className="flex flex-row gap-4">
          {!soknadBehandlet && (
            <>
              <Button
                variant="primary"
                onClick={() =>
                  mutate(
                    {
                      soknadId: utenlandsoppholdSoknad.soknadId,
                      vedtak: {
                        utfall: "INNVILGET",
                        innvilgetePerioder: soktePerioder.map((periode) => ({
                          fom: periode.fom.toISOString(),
                          tom: periode.tom.toISOString(),
                        })),
                        document: vedtakDocument,
                      },
                    },
                    {
                      onSuccess: () => {
                        setNotification({
                          message: texts.vedtakFattetNotification,
                        });
                        navigate(`${utenlandsoppholdPath}`);
                      },
                    },
                  )
                }
                loading={mutateIsPending}
              >
                {texts.sendButton}
              </Button>
              <Forhandsvisning
                contentLabel={texts.previewContentLabel}
                getDocumentComponents={() => vedtakDocument}
              />
            </>
          )}
          <Button
            as={Link}
            to={`/sykefravaer/utenlandsopphold`}
            variant={soknadBehandlet ? "primary" : "tertiary"}
          >
            {texts.backButton}
          </Button>
        </div>
      </div>
    </Box>
  );
}
