import React from "react";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  InlineMessage,
  Loader,
  LocalAlert,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import { DelvisInnvilgelsePeriodeDatepicker } from "@/sider/utenlandsopphold/DelvisInnvilgelsePeriodeDatepicker.tsx";
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
  beregnAvslattePerioder,
  SoknadStatusDTO,
  Utfall,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { erLokal } from "@/utils/miljoUtil.ts";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  didNotFindSoknad: "Fant ikke søknaden",
  modiaWarningHeader: "Begrenset behandling i Modia",
  modiaWarningContent:
    "Det er kun mulig med utfallet 'innvilgelse' på søknaden her i Modia. Dersom søknaden skal delvis innvilges eller avslås, må vedtaket fattes i Infotrygd som tidligere.",
  goToSoknad: "Vis hele søknaden",
  soknadTidspunkt: "Søknaden ble innsendt:",
  singlePeriod: "Perioden det er søkt om:",
  multiplePeriods: "Periodene det er søkt om:",
  radioButtons: {
    innvilgelse: "Innvilgelse: Godkjenn hele perioden",
    delvisInnvilgelse: "Delvis innvilgelse: Godkjenn deler av perioden",
    avslag: "Avslag: Avslå hele perioden",
  },
  buttons: {
    sendButton: "Send vedtak",
    previewContentLabel: "Forhåndsvisning",
    backButton: "Tilbake",
  },
  ingenAvslattePerioderWarning:
    "Du har valgt å innvilge alle perioder. Velg 'Innvilgelse' som utfall i stedet for 'Delvis innvilgelse'",
  vedtakFattetNotification:
    "Vedtaket om utenlandsopphold utenfor EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
  alertBehandlet: "Denne søknaden er allerede behandlet av",
  missingUtfall: "Du må velge et utfall for å fatte vedtaket",
};

// En midlertidig lokal feature-toggle, frem til vi har fått brevmaler på plass
const isAvslagAndDelvisInnvilgelseEnabled = erLokal();

interface InnvilgetPeriode {
  fom?: Date;
  tom?: Date;
}

interface SkjemaValues {
  utfall: Utfall;
  innvilgedePerioder: InnvilgetPeriode[];
}

export function UtenlandsoppholdSoknad() {
  const { data, isPending, isError } = useSoknaderQuery();
  const { mutate, isPending: mutateIsPending } = useVedtakMutation();
  const { getVedtakDocument } = useUtenlandsoppholdSoknadDocument();
  const formMethods = useForm<SkjemaValues>({
    defaultValues: { innvilgedePerioder: [] },
  });
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = formMethods;

  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const valgtUtfall = watch("utfall");
  const valgteInnvilgedePerioder = watch("innvilgedePerioder");

  function handleUtfallChange(utfall: Utfall) {
    if (utfall === "INNVILGET") {
      setValue(
        "innvilgedePerioder",
        soktePerioder.map((periode) => ({
          fom: periode.fom,
          tom: periode.tom,
        })),
      );
    } else {
      // Resetter denne når man velger DELVIS_INNVILGET eller AVSLAG
      setValue("innvilgedePerioder", []);
    }
    clearErrors("innvilgedePerioder");
  }

  function submit(soknadId: string, values: SkjemaValues) {
    const { utfall, innvilgedePerioder } = values;
    const perioder = innvilgedePerioder
      .filter((periode) => periode.fom && periode.tom)
      .map((periode) => ({
        fom: dayjs(periode.fom).format("YYYY-MM-DD"),
        tom: dayjs(periode.tom).format("YYYY-MM-DD"),
      }));
    const request = {
      soknadIdPathParam: soknadId,
      vedtak: {
        utfall: utfall,
        innvilgedePerioder: perioder,
        document: vedtakDocument, // TODO: Må oppdateres basert på utfall
      },
    };
    mutate(request, {
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
  const avslattePerioder =
    valgtUtfall === "DELVIS_INNVILGET"
      ? beregnAvslattePerioder(soktePerioder, valgteInnvilgedePerioder)
      : [];
  const vedtakDocument = getVedtakDocument({
    soknadDato: utenlandsoppholdSoknad.innsendtTidspunkt,
    perioder: utenlandsoppholdSoknad.soktePerioder,
  });

  return (
    <Box background="default" padding="space-16" className="flex flex-col">
      <div className={"flex flex-col gap-8"}>
        {!isAvslagAndDelvisInnvilgelseEnabled && (
          <LocalAlert status={"warning"}>
            <LocalAlert.Header>
              <LocalAlert.Title>{texts.modiaWarningHeader}</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>{texts.modiaWarningContent}</LocalAlert.Content>
          </LocalAlert>
        )}

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
            size="small"
            variant="secondary"
          >
            {texts.goToSoknad}
          </Button>
        </div>

        <div>
          <BodyShort size="small" weight="semibold">
            {periodText}
          </BodyShort>
          {utenlandsoppholdSoknad.soktePerioder.map((periode, index) => (
            <BodyShort key={index} size="small">
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
              {texts.buttons.backButton}
            </Button>
          </>
        )}

        {!soknadBehandlet && (
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit((values) =>
                submit(utenlandsoppholdSoknad.soknadId, values),
              )}
              className="flex flex-col gap-8"
            >
              <RadioGroup
                legend={"Velg utfall"}
                name="utfall"
                size="small"
                error={errors.utfall && texts.missingUtfall}
                onChange={handleUtfallChange}
              >
                <Radio
                  value={"INNVILGET"}
                  {...register("utfall", { required: true })}
                >
                  {texts.radioButtons.innvilgelse}
                </Radio>
                {isAvslagAndDelvisInnvilgelseEnabled && (
                  <>
                    <Radio
                      value={"DELVIS_INNVILGET"}
                      {...register("utfall", { required: true })}
                    >
                      {texts.radioButtons.delvisInnvilgelse}
                    </Radio>
                    <Radio
                      value={"AVSLAG"}
                      {...register("utfall", { required: true })}
                    >
                      {texts.radioButtons.avslag}
                    </Radio>
                  </>
                )}
              </RadioGroup>
              {valgtUtfall === "DELVIS_INNVILGET" && (
                <Box className="flex flex-col gap-4">
                  <BodyShort size="small" weight="semibold">
                    Velg perioden som skal godkjennes
                  </BodyShort>
                  <Box className="flex flex-row gap-20">
                    <DelvisInnvilgelsePeriodeDatepicker
                      soktePerioder={soktePerioder}
                    />
                    {valgteInnvilgedePerioder.every(
                      (periode) => periode.tom,
                    ) && (
                      <div>
                        <BodyShort size="small" weight="semibold">
                          Periodene som avslås:
                        </BodyShort>
                        {avslattePerioder.map((periode, index) => (
                          <BodyShort key={index} size="small">
                            {tilLesbarPeriodeMedArUtenManednavn(
                              periode.fom,
                              periode.tom,
                            )}
                          </BodyShort>
                        ))}
                      </div>
                    )}
                  </Box>
                  {avslattePerioder.length === 0 && (
                    <InlineMessage status="warning" size="small">
                      {texts.ingenAvslattePerioderWarning}
                    </InlineMessage>
                  )}
                </Box>
              )}
              <div className="flex flex-row gap-4">
                <Button
                  variant="primary"
                  type="submit"
                  loading={mutateIsPending}
                >
                  {texts.buttons.sendButton}
                </Button>
                <Forhandsvisning
                  contentLabel={texts.buttons.previewContentLabel}
                  getDocumentComponents={() => vedtakDocument}
                />
                <Button
                  as={Link}
                  to={`/sykefravaer/utenlandsopphold`}
                  variant="tertiary"
                >
                  {texts.buttons.backButton}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </Box>
  );
}
