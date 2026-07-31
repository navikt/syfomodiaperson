import React, { useState } from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Loader,
  LocalAlert,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import {
  useSoknaderQuery,
  useVedtakMutation,
} from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  tilLesbarDatoMedArUtenManedNavn,
  tilLesbarPeriodeMedArUtenManednavn,
} from "@/utils/datoUtils.ts";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useUtenlandsoppholdSoknadDocument } from "@/hooks/utenlandsopphold/useUtenlandsoppholdSoknadDocument";
import { useNotification } from "@/context/notification/NotificationContext.tsx";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import {
  SoknadStatusDTO,
  Utfall,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { erProd } from "@/utils/miljoUtil.ts";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  didNotFindSoknad: "Fant ikke søknaden",
  modiaWarningHeader: "Begrenset behandling i Modia",
  modiaWarningContent(isAvslagEnabled: boolean): string {
    if (isAvslagEnabled) {
      return "Det er kun mulig med utfallene 'innvilgelse' eller 'avslag' på søknaden her i Modia. Dersom søknaden skal delvis innvilges, må vedtaket fattes i Infotrygd som tidligere.";
    } else {
      return "Det er kun mulig med utfallet 'innvilgelse' på søknaden her i Modia. Dersom søknaden skal delvis innvilges eller avslås, må vedtaket fattes i Infotrygd som tidligere.";
    }
  },
  goToSoknad: "Vis hele søknaden",
  soknadTidspunkt: "Søknaden ble innsendt:",
  singlePeriod: "Perioden det er søkt om:",
  multiplePeriods: "Periodene det er søkt om:",
  innvilgelse: "Innvilgelse: Godkjenn hele perioden",
  avslag: "Avslag: Avslå hele perioden",
  sendButton: "Send vedtak",
  previewContentLabel: "Forhåndsvisning",
  backButton: "Tilbake",
  vedtakFattetNotification:
    "Vedtaket om utenlandsopphold utenfor EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
  alertBehandlet: "Denne søknaden er allerede behandlet av",
};

// En midlertidig lokal feature-toggle, frem til vi har fått brevmaler på plass
const isAvslagEnabled = !erProd();

export function UtenlandsoppholdSoknad() {
  const { data, isPending, isError } = useSoknaderQuery();
  const { mutate, isPending: mutateIsPending } = useVedtakMutation();
  const { getVedtakDocument } = useUtenlandsoppholdSoknadDocument();
  const [selectedUtfall, setSelectedUtfall] = useState<Utfall | null>(null);

  const navigate = useNavigate();
  const { setNotification } = useNotification();

  function submit(soknadId: string) {
    if (!selectedUtfall) {
      return;
    }
    const innvilgedePerioder =
      selectedUtfall === "INNVILGET"
        ? soktePerioder.map((periode) => ({
            fom: periode.fom.toISOString(),
            tom: periode.tom.toISOString(),
          }))
        : selectedUtfall === "AVSLAG" // For å være eksplisitt
          ? []
          : [];
    const requestDTO = {
      soknadId: soknadId,
      vedtak: {
        utfall: selectedUtfall,
        innvilgedePerioder: innvilgedePerioder,
        document: vedtakDocument, // TODO: Må oppdateres basert på utfall
      },
    };
    mutate(requestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.vedtakFattetNotification,
        });
        navigate(`${utenlandsoppholdPath}`);
      },
    });
  }

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
          <LocalAlert.Content>
            {texts.modiaWarningContent(isAvslagEnabled)}
          </LocalAlert.Content>
        </LocalAlert>

        <BodyShort>
          {texts.soknadTidspunkt}{" "}
          {tilLesbarDatoMedArUtenManedNavn(
            utenlandsoppholdSoknad.innsendtTidspunkt,
          )}
        </BodyShort>

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
          <BodyShort>{periodText}</BodyShort>
          {utenlandsoppholdSoknad.soktePerioder.map((periode, index) => (
            <BodyShort key={index} weight={"semibold"}>
              {tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)}
            </BodyShort>
          ))}
        </div>

        {soknadBehandlet && (
          <>
            <Alert variant="info" size="small" className="w-fit p-4">
              {texts.alertBehandlet} {utenlandsoppholdSoknad.vedtak?.fattetAv}{" "}
              {tilLesbarDatoMedArUtenManedNavn(
                utenlandsoppholdSoknad.vedtak?.fattetTidspunkt,
              )}
            </Alert>
            <Button
              className="w-fit"
              as={Link}
              to={`/sykefravaer/utenlandsopphold`}
              variant="primary"
            >
              {texts.backButton}
            </Button>
          </>
        )}

        <div className="flex flex-col gap-4">
          {!soknadBehandlet && (
            <>
              <RadioGroup
                legend={"Velg utfall"}
                value={selectedUtfall}
                onChange={setSelectedUtfall}
              >
                <Radio value={"INNVILGET"}>{texts.innvilgelse}</Radio>
                {isAvslagEnabled && (
                  <Radio value={"AVSLAG"}>{texts.avslag}</Radio>
                )}
              </RadioGroup>
              <div className="flex flex-row gap-4">
                <Button
                  variant="primary"
                  onClick={() => submit(utenlandsoppholdSoknad.soknadId)}
                  loading={mutateIsPending}
                >
                  {texts.sendButton}
                </Button>
                <Forhandsvisning
                  contentLabel={texts.previewContentLabel}
                  getDocumentComponents={() => vedtakDocument}
                />
                <Button
                  as={Link}
                  to={`/sykefravaer/utenlandsopphold`}
                  variant="tertiary"
                >
                  {texts.backButton}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
