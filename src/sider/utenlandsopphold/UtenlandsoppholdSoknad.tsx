import React, { useState } from "react";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  InlineMessage,
  Loader,
  Radio,
  RadioGroup,
  Skeleton,
  Textarea,
  VStack,
} from "@navikt/ds-react";
import { DelvisInnvilgelsePeriodeDatepicker } from "@/sider/utenlandsopphold/DelvisInnvilgelsePeriodeDatepicker.tsx";
import {
  useUtenlandsoppholdSoknanderQuery,
  useVedtakMutation,
} from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  tilLesbarDatoMedArUtenManedNavn,
  tilLesbarPeriodeMedArUtenManednavn,
} from "@/utils/datoUtils.ts";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import Oppsummeringsvisning from "@/sider/sykepengsoknader/soknad-felles-oppsummering/Oppsummeringsvisning";
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
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { harPerioderUtenforOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

import { useDebouncedCallback } from "use-debounce";
import {
  DraftTextDTO,
  useDeleteDraft,
  useDraftQuery,
  useSaveDraft,
} from "@/hooks/useDraftQuery";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";
import { tilLesbarPeriodeDatoerOgDager } from "./utils";

const AVSLAG_CATEGORY = "utenlandsopphold-avslag";
const DELVIS_INNVILGET_CATEGORY = "utenlandsopphold-delvis-innvilget";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  didNotFindSoknad: "Fant ikke søknaden",
  headerSoknadInnhold: "Søknadens innhold",
  errorHenteInnholdISoknad:
    "Noe gikk galt med å hente innholdet i søknaden. Venligst prøv igjen senere.",
  labelSoknadInnsendtTidspunkt: "Søknaden ble innsendt",
  labelSoktPeriodeSingular: "Perioden det er søkt om",
  labelSoktePerioderPlural: "Periodene det er søkt om",
  perioderUtenforTilfelleWarning:
    "En eller flere av periodene det er søkt om ligger utenfor sykmeldingsperioden.",
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
    "Sykepenger er ikke utbetalt. Ved innvilgelse eller delvis innvilgelse blir vedtaket sendt med et forbehold om at vedtaket kun gjelder dersom sykmeldt får innvilget sykepenger. Åpne forhåndsvisningen av vedtaket for å se forbeholdet.",
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

interface Props {
  draftDebouncedMs?: number;
}

export function UtenlandsoppholdSoknad({ draftDebouncedMs = 750 }: Props) {
  // Utenlandsopphold-søknader fra vår backend
  const {
    data: utenlandsoppholdSoknader,
    isPending: isLoadingUtenlandsoppholdSoknader,
    isError: isErrorUtenlandsoppholdSoknader,
  } = useUtenlandsoppholdSoknanderQuery();

  // Sykepengesøknader fra Flex, blant annet utenlandsopphold-søknader
  const {
    data: sykepengeSoknaderFlex,
    isLoading: isLoadingSykepengesoknaderFlex,
  } = useSykepengesoknaderQuery();

  const getMaksdato = useMaksdatoQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelleStart = latestOppfolgingstilfelle?.start;
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
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();

  const avslagDraftQuery = useDraftQuery<DraftTextDTO>(AVSLAG_CATEGORY);
  const saveAvslagDraft = useSaveDraft<DraftTextDTO>(AVSLAG_CATEGORY);
  const deleteAvslagDraft = useDeleteDraft(AVSLAG_CATEGORY);

  const delvisInnvilgetDraftQuery = useDraftQuery<DraftTextDTO>(
    DELVIS_INNVILGET_CATEGORY,
  );
  const saveDelvisInnvilgetDraft = useSaveDraft<DraftTextDTO>(
    DELVIS_INNVILGET_CATEGORY,
  );
  const deleteDelvisInnvilgetDraft = useDeleteDraft(DELVIS_INNVILGET_CATEGORY);

  const draftByUtfall = {
    AVSLAG: { query: avslagDraftQuery, save: saveAvslagDraft },
    DELVIS_INNVILGET: {
      query: delvisInnvilgetDraftQuery,
      save: saveDelvisInnvilgetDraft,
    },
  };

  const activeDraft =
    valgtUtfall === "AVSLAG" || valgtUtfall === "DELVIS_INNVILGET"
      ? draftByUtfall[valgtUtfall]
      : null;

  const isDraftPending = activeDraft?.query.isPending ?? false;
  const activeDraftSave = activeDraft?.save;

  const debouncedAutoSaveDraft = useDebouncedCallback(
    (begrunnelse: string, save) => {
      save.mutate(
        { begrunnelse },
        {
          onSuccess: () => setUtkastSavedTime(new Date()),
          onError: () => setUtkastSavedTime(undefined),
        },
      );
    },
    draftDebouncedMs,
  );

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
      // Resetter innvilgede perioder for DELVIS_INNVILGET eller AVSLAG
      setValue("innvilgedePerioder", []);

      if (utfall === "AVSLAG") {
        setValue("begrunnelse", avslagDraftQuery.data?.begrunnelse ?? "");
      } else if (utfall === "DELVIS_INNVILGET") {
        setValue(
          "begrunnelse",
          delvisInnvilgetDraftQuery.data?.begrunnelse ?? "",
        );
      }
    }
    setUtkastSavedTime(undefined);
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
        setUtkastSavedTime(undefined);
        debouncedAutoSaveDraft.cancel();
        deleteAvslagDraft.mutate(undefined);
        deleteDelvisInnvilgetDraft.mutate(undefined);
        navigate(`${utenlandsoppholdPath}`);
      },
    });
  }

  const { utenlandsoppholdSoknadId } = useParams<{
    utenlandsoppholdSoknadId: string;
  }>();

  const utenlandsoppholdSoknad = utenlandsoppholdSoknader?.soknader.find(
    (soknad) =>
      soknad.soknadId === utenlandsoppholdSoknadId ||
      soknad.eksternId === utenlandsoppholdSoknadId,
  );

  if (!utenlandsoppholdSoknad) {
    return (
      <Box background="default" padding="space-16" className="flex flex-col">
        {isLoadingUtenlandsoppholdSoknader ? (
          <Loader size="xlarge" title={texts.pending} />
        ) : isErrorUtenlandsoppholdSoknader ? (
          <Alert size="small" variant="error">
            {texts.error}
          </Alert>
        ) : (
          <BodyShort>{texts.didNotFindSoknad}</BodyShort>
        )}
      </Box>
    );
  }

  const sykepengesoknadFlex = sykepengeSoknaderFlex.find(
    (soknad) => soknad.id === utenlandsoppholdSoknad.eksternId,
  );

  const soknadBehandlet =
    utenlandsoppholdSoknad.status !== SoknadStatusDTO.MOTTATT;
  const soktePerioder = utenlandsoppholdSoknad.soktePerioder;
  const labelSoktePerioder =
    soktePerioder.length > 1
      ? texts.labelSoktePerioderPlural
      : texts.labelSoktPeriodeSingular;
  const harPerioderUtenforTilfelle = harPerioderUtenforOppfolgingstilfelle(
    soktePerioder,
    latestOppfolgingstilfelle,
  );
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
      <VStack gap="space-20">
        {/* Nokkelinfo i soknaden */}
        <VStack gap="space-8">
          <HStack gap="space-8">
            <BodyShort weight="semibold">
              {texts.labelSoknadInnsendtTidspunkt}:
            </BodyShort>

            <BodyShort>
              {tilLesbarDatoMedArUtenManedNavn(
                utenlandsoppholdSoknad.innsendtTidspunkt,
              )}
            </BodyShort>
          </HStack>

          <Box>
            <BodyShort weight="semibold">{labelSoktePerioder}:</BodyShort>

            {utenlandsoppholdSoknad.soktePerioder.map((periode, index) => (
              <BodyShort key={index} size="small">
                {tilLesbarPeriodeDatoerOgDager(periode)}
              </BodyShort>
            ))}
          </Box>

          {harPerioderUtenforTilfelle && (
            <Alert variant="warning" size="small" className="w-fit">
              {texts.perioderUtenforTilfelleWarning}
            </Alert>
          )}
        </VStack>

        {/* Visning av soknaden */}
        <Box
          borderWidth="1"
          borderColor="neutral-strong"
          borderRadius="12"
          paddingInline="space-20"
          paddingBlock="space-16"
        >
          <Heading size="small" spacing>
            {texts.headerSoknadInnhold}
          </Heading>

          {isLoadingSykepengesoknaderFlex ? (
            <Loader size="medium" title={texts.pending} />
          ) : sykepengesoknadFlex ? (
            <Oppsummeringsvisning soknad={sykepengesoknadFlex} />
          ) : (
            <Alert size="small" variant="error">
              {texts.errorHenteInnholdISoknad}
            </Alert>
          )}
        </Box>

        {/* Soknaden er behandlet */}
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

        {/* Behandling av soknaden */}
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
                legend="Velg utfall"
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
                valgtUtfall === "AVSLAG") &&
                (isDraftPending ? (
                  <Skeleton variant="rounded" height={150} />
                ) : (
                  <>
                    <Textarea
                      {...register("begrunnelse", {
                        maxLength: begrunnelseMaxLength,
                        required: texts.begrunnelse.missing,
                        onChange: (e) => {
                          debouncedAutoSaveDraft(
                            e.target.value,
                            activeDraftSave,
                          );
                        },
                      })}
                      value={watch("begrunnelse")}
                      label={texts.begrunnelse.label}
                      description={texts.begrunnelse.description}
                      error={errors.begrunnelse?.message}
                      size="small"
                      minRows={6}
                      maxLength={begrunnelseMaxLength}
                    />
                    <DraftSaveStatus
                      isSaveError={activeDraftSave?.isError ?? false}
                      savedTime={utkastSavedTime}
                    />
                  </>
                ))}
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
      </VStack>
    </Box>
  );
}
