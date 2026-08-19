import React, { useState } from "react";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  InlineMessage,
  Loader,
  Radio,
  RadioGroup,
  Textarea,
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
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { useUtenlandsoppholdSoknadDocument } from "@/hooks/utenlandsopphold/useUtenlandsoppholdSoknadDocument";
import { useNotification } from "@/context/notification/NotificationContext.tsx";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import {
  beregnAvslattePerioder,
  Periode,
  SoknadStatusDTO,
  Utfall,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { Maksdato, useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  didNotFindSoknad: "Fant ikke søknaden",
  goToSoknad: "Vis hele søknaden",
  soknadTidspunkt: "Søknaden ble innsendt:",
  singlePeriod: "Perioden det er søkt om:",
  multiplePeriods: "Periodene det er søkt om:",
  radioButtons: {
    innvilgelse: "Innvilget: Godkjenn hele perioden",
    delvisInnvilgelse: "Delvis innvilget: Godkjenn deler av perioden",
    avslag: "Avslag: Avslå hele perioden",
  },
  buttons: {
    sendButton: "Send vedtak",
    confirmButton: "Bekreft og send",
    previewContentLabel: "Forhåndsvisning",
    backButton: "Tilbake",
  },
  ingenAvslattePerioderWarning:
    "Du har valgt å innvilge alle perioder. Velg 'Innvilgelse' som utfall i stedet for 'Delvis innvilgelse'",
  vedtakFattetNotification:
    "Vedtaket om utenlandsopphold utenfor EU/EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
  alertBehandlet: "Denne søknaden er allerede behandlet av",
  missingUtfall: "Du må velge et utfall for å fatte vedtaket",
  ikkeUtbetaltAdvarsel:
    "Sykepenger er ikke utbetalt. Ved innvilgelse eller delvis innvilgelse blir vedtaket sendt med forbehold om at øvrige vilkår for sykepenger er tilstede. Åpne forhåndsvisningen av vedtaket for å se forbeholdet.",
  begrunnelse: {
    label: "Begrunnelse (obligatorisk)",
    description:
      "Begrunnelsen blir en del av en større brevmal. Åpne forhåndsvisning for å se hele vedtaket.",
    missing: "Vennligst angi begrunnelse",
  },
};

const begrunnelseMaxLength = 5000;

function erSykepengerUtbetalt(
  maksDato: Maksdato | null | undefined,
  oppfolgingstilfelleStart: Date | null | undefined,
): boolean {
  if (!maksDato) {
    return false;
  }
  if (!oppfolgingstilfelleStart) {
    return false;
  }
  return dayjs(maksDato.utbetalt_tom).isAfter(
    dayjs(oppfolgingstilfelleStart),
    "day",
  );
}

interface InnvilgetPeriode {
  fom?: Date;
  tom?: Date;
}

interface SkjemaValues {
  utfall: Utfall;
  innvilgedePerioder: InnvilgetPeriode[];
  begrunnelse: string;
}

export function UtenlandsoppholdSoknad() {
  const { data, isPending, isError } = useSoknaderQuery();
  const getMaksdato = useMaksdatoQuery();
  const oppfolgingstilfelleStart = useStartOfLatestOppfolgingstilfelle();
  const { mutate, isPending: mutateIsPending } = useVedtakMutation();
  const {
    getInnvilgetDocument,
    getAvslagDocument,
    getDelvisInnvilgetDocument,
  } = useUtenlandsoppholdSoknadDocument();
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
  const valgtBegrunnelse = watch("begrunnelse");
  const [visSendForhandsvisning, setVisSendForhandsvisning] = useState(false);

  function handleUtfallChange(utfall: Utfall) {
    if (utfall === "INNVILGET") {
      setValue(
        "innvilgedePerioder",
        soktePerioder.map((periode) => ({
          fom: periode.fom,
          tom: periode.tom,
        })),
      );
      setValue("begrunnelse", "");
      clearErrors("begrunnelse");
    } else {
      // Resetter denne når man velger DELVIS_INNVILGET eller AVSLAG
      setValue("innvilgedePerioder", []);
    }
    clearErrors("innvilgedePerioder");
  }

  function submit(soknadId: string, values: SkjemaValues) {
    const { utfall, innvilgedePerioder, begrunnelse } = values;
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
        document: vedtakDocument,
        begrunnelse: utfall === "INNVILGET" ? null : begrunnelse,
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
      : valgtUtfall === "AVSLAG"
        ? soktePerioder
        : [];

  // Ettersom man kan være i en tilstand der man har valgt fom, men ikke tom, i DELVIS_INNVILGET
  // må vi filtrere ut undefined-verdier i overgangen fra InnvilgetPeriode-typen til Periode-typen
  const gyldigeInnvilgedePerioder: Periode[] = valgteInnvilgedePerioder.filter(
    (periode): periode is Periode => !!periode.fom && !!periode.tom,
  );
  const isSykepengerUtbetalt = erSykepengerUtbetalt(
    getMaksdato.data?.maxDate,
    oppfolgingstilfelleStart,
  );

  const vedtakDocument = (() => {
    switch (valgtUtfall) {
      case "AVSLAG":
        return getAvslagDocument({
          soknadDato: utenlandsoppholdSoknad.innsendtTidspunkt,
          avslattePerioder: avslattePerioder,
          begrunnelse: valgtBegrunnelse ?? "",
        });
      case "DELVIS_INNVILGET":
        return getDelvisInnvilgetDocument({
          soknadDato: utenlandsoppholdSoknad.innsendtTidspunkt,
          innvilgedePerioder: gyldigeInnvilgedePerioder,
          avslattePerioder: avslattePerioder,
          begrunnelse: valgtBegrunnelse ?? "",
          medForbeholdOvrigeVilkar: !isSykepengerUtbetalt,
        });
      case "INNVILGET":
      default:
        return getInnvilgetDocument({
          soknadDato: utenlandsoppholdSoknad.innsendtTidspunkt,
          innvilgedePerioder: gyldigeInnvilgedePerioder,
          medForbeholdOvrigeVilkar: !isSykepengerUtbetalt,
        });
    }
  })();

  return (
    <Box background="default" padding="space-16" className="flex flex-col">
      <div className={"flex flex-col gap-8"}>
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
              onSubmit={handleSubmit(() => setVisSendForhandsvisning(true))}
              className="flex flex-col gap-8"
            >
              {!isSykepengerUtbetalt && (
                <Alert variant="warning" size="small">
                  {texts.ikkeUtbetaltAdvarsel}
                </Alert>
              )}
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
              {(valgtUtfall === "DELVIS_INNVILGET" ||
                valgtUtfall === "AVSLAG") && (
                <Textarea
                  {...register("begrunnelse", {
                    maxLength: begrunnelseMaxLength,
                    required: texts.begrunnelse.missing,
                  })}
                  value={watch("begrunnelse")}
                  label={texts.begrunnelse.label}
                  description={texts.begrunnelse.description}
                  error={errors.begrunnelse?.message}
                  size="small"
                  minRows={6}
                  maxLength={begrunnelseMaxLength}
                />
              )}
              <div className="flex flex-row gap-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    valgtUtfall === "DELVIS_INNVILGET" &&
                    avslattePerioder.length === 0
                  }
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
              <ForhandsvisningModal
                contentLabel={texts.buttons.previewContentLabel}
                isOpen={visSendForhandsvisning}
                handleClose={() => setVisSendForhandsvisning(false)}
                getDocumentComponents={() => vedtakDocument}
                action={{
                  text: texts.buttons.confirmButton,
                  onClick: handleSubmit((values) =>
                    submit(utenlandsoppholdSoknad.soknadId, values),
                  ),
                  loading: mutateIsPending,
                }}
              />
            </form>
          </FormProvider>
        )}
      </div>
    </Box>
  );
}
