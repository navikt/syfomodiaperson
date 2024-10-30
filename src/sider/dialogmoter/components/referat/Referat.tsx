import React, { ReactElement, useEffect, useState } from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useReferatDocument } from "@/hooks/dialogmote/document/useReferatDocument";
import {
  getReferatTexts,
  StandardtekstKey,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  NewDialogmotedeltakerAnnenDTO,
  NewDialogmoteReferatDTO,
} from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { useFerdigstillDialogmote } from "@/data/dialogmote/useFerdigstillDialogmote";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMellomlagreReferat } from "@/data/dialogmote/useMellomlagreReferat";
import { useInitialValuesReferat } from "@/hooks/dialogmote/useInitialValuesReferat";
import { useEndreReferat } from "@/data/dialogmote/useEndreReferat";
import dayjs, { Dayjs } from "dayjs";
import { useDebouncedCallback } from "use-debounce";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Link,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { MalformRadioGroup } from "@/components/MalformRadioGroup";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { Malform, useMalform } from "@/context/malform/MalformContext";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import {
  showTimeIncludingSeconds,
  tilDatoMedManedNavn,
} from "@/utils/datoUtils";
import { SaveFile } from "../../../../../img/ImageComponents";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import ReferatTextArea from "@/sider/dialogmoter/components/referat/ReferatTextArea";
import { ReferatInfoBox } from "@/sider/dialogmoter/components/referat/ReferatInfoBox";
import { DeltakerArbeidstakerHeading } from "@/sider/dialogmoter/components/referat/DeltakerArbeidstakerHeading";
import { DeltakerNavHeading } from "@/sider/dialogmoter/components/referat/DeltakerNavHeading";
import { DeltakerBehandlerHeading } from "@/sider/dialogmoter/components/referat/DeltakerBehandlerHeading";
import { DeltakerArbeidsgiverHeading } from "@/sider/dialogmoter/components/referat/DeltakerArbeidsgiverHeading";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { ExpansionCardFormField } from "@/components/ExpansionCardFormField";
import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";

export const MAX_LENGTH_SITUASJON = 6500;
export const MAX_LENGTH_KONKLUSJON = 1500;
export const MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE = 600;
export const MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE = 600;
export const MAX_LENGTH_BEHANDLERS_OPPGAVE = 600;
export const MAX_LENGTH_VEILEDERS_OPPGAVE = 600;
export const MAX_LENGTH_BEGRUNNELSE_ENDRING = 500;

export const texts = {
  save: "Lagre",
  send: "Lagre og send",
  abort: "Avbryt",
  digitalReferat:
    "Referatet formidles her på nav.no. Det er bare de arbeidstakerne som har reservert seg mot digital kommunikasjon, som vil få referatet i posten.",
  personvern:
    "Du må aldri skrive sensitive opplysninger om helse, diagnose, behandling og prognose. Dette gjelder også hvis arbeidstakeren er åpen om helsen og snakket om den i møtet. Se artikkel 9, Lov om behandling av personopplysninger. ",
  personvernLenketekst:
    "Du kan også lese mer om dette på Navet (åpnes i ny fane).",
  forhandsvisningContentLabel: "Forhåndsvis referat fra dialogmøte",
  referatSaved: "Referatet er lagret",
  fritekster: {
    situasjon: {
      label: "Situasjon og muligheter",
      description: "Skriv hva deltakerne forteller om situasjonen",
      infoboks: {
        eksempler: "Eksempler:",
        jobb: "Hvordan har det gått å prøve seg i jobb?",
        tilrettelegging: "Hvordan har tilretteleggingen fungert?",
        mer: "Er det noe mer som kan gjøres?",
        framover: "Hva ser man for seg framover?",
        husk: "Husk å skrive i du-form, referatet er rettet mot arbeidstakeren selv om det går til flere.",
      },
    },
    konklusjon: {
      label: "Konklusjon",
      description: "Gi en kort oppsummering",
      infoboks:
        "Konklusjonen og oppgavene nedenfor vil vises øverst i referatet.",
    },
    arbeidstaker: {
      label: "Arbeidstakerens oppgave:",
      description: "Hva avtalte dere at arbeidstakeren skal gjøre?",
      infoboks: "Husk å skrive i du-form i feltet om arbeidstakerens oppgave.",
    },
    arbeidsgiver: {
      label: "Arbeidsgiverens oppgave:",
      description: "Hva avtalte dere at arbeidsgiveren skal gjøre?",
    },
    begrunnelseEndring: {
      label: "Årsaken til at referatet må endres",
      description: "Fortell hva som er årsaken til at referatet må endres",
      infoboks:
        "Det er viktig å oppgi årsak til endringen slik at alle møtedeltakerne blir informert. Det er også viktig i videre oppfølging.",
    },
    veileder: {
      label: "Veilederens oppgave (valgfri):",
      description: "Hva avtalte dere at du skal gjøre?",
    },
    behandler: {
      label: "Behandlerens oppgave (valgfri):",
      description: "Hva avtalte dere at behandleren skal gjøre?",
    },
  },
  standardtekster: {
    label: "Dette informerte Nav om i møtet",
    description: "Velg bare de alternativene du faktisk informerte om i møtet.",
    info: "Det blir hentet opp standardtekster i referatet avhengig av hva du velger.",
  },
  deltakere: {
    title: "Deltakere i møtet",
    buttonText: "Legg til en deltaker",
    andreDeltakereMissingFunksjon: "Vennligst angi funksjon på deltaker",
    andreDeltakereMissingNavn: "Vennligst angi navn på deltaker",
    arbeidsgiverLabel: "Navn",
    arbeidsgiverTekst:
      "Referatet sendes alltid ut til personen som er registrert som nærmeste leder i Altinn, uavhengig av hvem som deltok i møtet.",
    arbeidsgiverDeltakerMissing: "Minst én person må delta fra arbeidsgiver",
    behandlerTekst:
      "Behandler var innkalt til dette møtet, men hvis behandler likevel ikke møtte opp bør det nevnes i referatet slik at deltakerlisten blir riktig.",
    behandlerDeltokLabel: "Behandleren deltok i møtet",
    behandlerMottaReferatLabel: "Behandleren skal motta referatet",
    behandlerReferatSamtykke:
      "Dersom behandleren ikke deltok i møtet, men likevel ønsker å motta referat, krever det et samtykke fra arbeidstakeren.",
  },
};

const personvernUrl =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-arbeidsrettet-brukeroppfolging/SitePages/Sykmeldt-med-arbeidsgiver-%E2%80%93-avholde-dialogm%C3%B8te.aspx";

export const valideringsTexts = {
  situasjonMissing: "Vennligst angi situasjon og muligheter",
  konklusjonMissing: "Vennligst angi konklusjon",
  arbeidstakersOppgaveMissing: "Vennligst angi arbeidstakerens oppgave",
  arbeidsgiversOppgaveMissing: "Vennligst angi arbeidsgiverens oppgave",
  begrunnelseEndringMissing:
    "Vennligst angi årsaken til at referatet må endres",
};

export enum ReferatMode {
  NYTT,
  ENDRET,
}

export interface ReferatSkjemaValues {
  situasjon: string;
  konklusjon: string;
  arbeidstakersOppgave: string;
  arbeidsgiversOppgave: string;
  behandlersOppgave?: string;
  veiledersOppgave: string;
  begrunnelseEndring?: string;
  naermesteLeder: string;
  standardtekster: StandardtekstKey[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
  behandlerDeltatt?: boolean;
  behandlerMottarReferat?: boolean;
}

interface ReferatProps {
  dialogmote: DialogmoteDTO;
  mode: ReferatMode;
}

const toNewReferat = (
  dialogmote: DialogmoteDTO,
  values: Partial<ReferatSkjemaValues>,
  getReferatDocument: (
    values: Partial<ReferatSkjemaValues>
  ) => DocumentComponentDto[]
): NewDialogmoteReferatDTO => ({
  narmesteLederNavn: values.naermesteLeder ?? "",
  situasjon: values.situasjon ?? "",
  konklusjon: values.konklusjon ?? "",
  arbeidsgiverOppgave: values.arbeidsgiversOppgave ?? "",
  arbeidstakerOppgave: values.arbeidstakersOppgave ?? "",
  ...(dialogmote.behandler
    ? {
        behandlerOppgave: values.behandlersOppgave,
        behandlerDeltatt: values.behandlerDeltatt,
        behandlerMottarReferat: values.behandlerMottarReferat,
      }
    : {}),
  ...(values.begrunnelseEndring
    ? {
        begrunnelseEndring: values.begrunnelseEndring,
      }
    : {}),
  veilederOppgave: values.veiledersOppgave,
  document: getReferatDocument(values),
  andreDeltakere: values.andreDeltakere || [],
});

const Referat = ({ dialogmote, mode }: ReferatProps): ReactElement => {
  const navbruker = useNavBrukerData();
  const ferdigstillDialogmote = useFerdigstillDialogmote(dialogmote.uuid);
  const mellomlagreReferat = useMellomlagreReferat(dialogmote.uuid);
  const endreReferat = useEndreReferat(dialogmote.uuid);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<Dayjs>(dayjs());
  const [uendretSidenMellomlagring, setUendretSidenMellomlagring] = useState<
    boolean | undefined
  >();

  const isEndringAvReferat = mode === ReferatMode.ENDRET;

  const { getReferatDocument } = useReferatDocument(dialogmote, mode);
  const initialValues = useInitialValuesReferat(dialogmote);
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const currentNarmesteLederNavn =
    getCurrentNarmesteLeder(dialogmote.arbeidsgiver.virksomhetsnummer)
      ?.narmesteLederNavn || "";
  const { malform } = useMalform();
  const { standardTekster: standardTeksterForVisning } = getReferatTexts(
    Malform.BOKMAL
  );
  const formMethods = useForm<ReferatSkjemaValues>({
    defaultValues: initialValues,
  });
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    reset,
  } = formMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "andreDeltakere",
  });

  useEffect(() => {
    if (currentNarmesteLederNavn) {
      reset({
        naermesteLeder: currentNarmesteLederNavn,
      });
    }
  }, [reset, currentNarmesteLederNavn]);

  const isSendingReferat = () => {
    return ferdigstillDialogmote.isPending || endreReferat.isPending;
  };

  const submit = (values: ReferatSkjemaValues) => {
    const newDialogmoteReferatDTO = toNewReferat(
      dialogmote,
      values,
      getReferatDocument
    );
    if (isEndringAvReferat) {
      endreReferat.mutate(newDialogmoteReferatDTO);
    } else {
      ferdigstillDialogmote.mutate(newDialogmoteReferatDTO);
    }
    Amplitude.logEvent({
      type: EventType.OptionSelected,
      data: {
        url: window.location.href,
        tekst: "Målform valgt",
        option: malform,
      },
    });
  };

  const isNullOrEmpty = (value?: string | undefined) => {
    return !value || value === "";
  };

  const isEmptyReferat = (values: ReferatSkjemaValues) => {
    return (
      (!values.standardtekster || values.standardtekster.length === 0) &&
      isNullOrEmpty(values.situasjon) &&
      isNullOrEmpty(values.konklusjon) &&
      isNullOrEmpty(values.arbeidstakersOppgave) &&
      isNullOrEmpty(values.arbeidsgiversOppgave) &&
      isNullOrEmpty(values.behandlersOppgave) &&
      isNullOrEmpty(values.veiledersOppgave) &&
      isNullOrEmpty(values.begrunnelseEndring)
    );
  };

  const mellomlagre = (values: ReferatSkjemaValues) => {
    mellomlagreReferat.mutate(
      toNewReferat(dialogmote, values, getReferatDocument),
      {
        onSuccess: () => {
          setUendretSidenMellomlagring(true);
          setShowToast(true);
          setLastSavedTime(dayjs());
        },
        onError: () => setShowToast(false),
      }
    );
  };

  const debouncedAutoSave = useDebouncedCallback(
    (values: ReferatSkjemaValues) => {
      if (!isSendingReferat() && !isEmptyReferat(values)) {
        mellomlagre(values);
      }
    },
    5000,
    { maxWait: 20000 }
  );
  const handleLagreClick = (values: ReferatSkjemaValues) => {
    debouncedAutoSave.cancel();
    mellomlagre(values);
  };
  const savedReferatText = (savedDate: Date) => {
    return `${texts.referatSaved} ${showTimeIncludingSeconds(savedDate)}`;
  };

  if (ferdigstillDialogmote.isSuccess || endreReferat.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const header = `${navbruker?.navn}, ${tilDatoMedManedNavn(dialogmote.tid)}, ${
    dialogmote.sted
  }`;
  const arbeidsgiverDeltakerHeading = `Fra arbeidsgiver: ${
    watch("naermesteLeder") || ""
  }`;
  const behandlerDeltakerHeading = (
    behandler: DialogmotedeltakerBehandlerDTO,
    deltatt: boolean | undefined
  ): string =>
    `Behandler: ${behandler.behandlerNavn}${
      deltatt === false ? ", deltok ikke" : ""
    }`;

  return (
    <Box background="surface-default" padding="4">
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(submit)}
          onChange={() => {
            setUendretSidenMellomlagring(false);
            debouncedAutoSave(getValues());
          }}
        >
          <Heading size="large" className="mb-8">
            {header}
          </Heading>
          <Alert variant="info" size="small" className="mb-8 [&>*]:max-w-fit">
            {texts.digitalReferat}
          </Alert>
          <VStack gap="4">
            <Heading size="medium">{texts.deltakere.title}</Heading>
            <DeltakerArbeidstakerHeading />
            <DeltakerNavHeading />
            <ExpansionCardFormField
              ariaLabel={arbeidsgiverDeltakerHeading}
              hasError={!!errors.naermesteLeder}
              heading={
                <DeltakerArbeidsgiverHeading>
                  {arbeidsgiverDeltakerHeading}
                </DeltakerArbeidsgiverHeading>
              }
            >
              <VStack gap="4">
                <TextField
                  className="w-2/4"
                  {...register("naermesteLeder", {
                    required: texts.deltakere.arbeidsgiverDeltakerMissing,
                  })}
                  error={errors.naermesteLeder?.message}
                  label={texts.deltakere.arbeidsgiverLabel}
                  type="text"
                  size="small"
                />
                <BodyLong size="small">
                  {texts.deltakere.arbeidsgiverTekst}
                </BodyLong>
              </VStack>
            </ExpansionCardFormField>
            {dialogmote.behandler && (
              <ExpansionCardFormField
                ariaLabel={behandlerDeltakerHeading(
                  dialogmote.behandler,
                  watch("behandlerDeltatt")
                )}
                heading={
                  <DeltakerBehandlerHeading>
                    {behandlerDeltakerHeading(
                      dialogmote.behandler,
                      watch("behandlerDeltatt")
                    )}
                  </DeltakerBehandlerHeading>
                }
              >
                <VStack gap="4">
                  <BodyLong size="small">
                    {texts.deltakere.behandlerTekst}
                  </BodyLong>
                  <Checkbox size="small" {...register("behandlerDeltatt")}>
                    {texts.deltakere.behandlerDeltokLabel}
                  </Checkbox>
                  <Checkbox
                    size="small"
                    {...register("behandlerMottarReferat")}
                  >
                    {texts.deltakere.behandlerMottaReferatLabel}
                  </Checkbox>
                  <BodyLong size="small">
                    {texts.deltakere.behandlerReferatSamtykke}
                  </BodyLong>
                </VStack>
              </ExpansionCardFormField>
            )}
            <VStack gap="4" align="start">
              {fields.map((field, index) => (
                <div key={field.id} className="flex w-full gap-2">
                  <TextField
                    className="flex-[0.3]"
                    {...register(`andreDeltakere.${index}.funksjon`, {
                      required: texts.deltakere.andreDeltakereMissingFunksjon,
                    })}
                    error={errors.andreDeltakere?.[index]?.funksjon?.message}
                    label="Funksjon"
                    type="text"
                    size="small"
                  />
                  <TextField
                    className="flex-[0.3]"
                    {...register(`andreDeltakere.${index}.navn`, {
                      required: texts.deltakere.andreDeltakereMissingNavn,
                    })}
                    error={errors.andreDeltakere?.[index]?.navn?.message}
                    label="Navn"
                    type="text"
                    size="small"
                  />
                  <Button
                    className="mt-7 self-start"
                    type="button"
                    variant="tertiary"
                    size="small"
                    icon={<TrashIcon title="Slett ikon" />}
                    onClick={() => remove(index)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                icon={<PlusIcon title="Pluss ikon" />}
                onClick={() => append({ funksjon: "", navn: "" })}
              >
                {texts.deltakere.buttonText}
              </Button>
            </VStack>
          </VStack>
          <Alert
            variant="warning"
            size="small"
            inline
            className="mt-16 mb-8 [&>*]:max-w-fit"
          >
            {texts.personvern}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={personvernUrl}
            >
              {texts.personvernLenketekst}
            </Link>
          </Alert>
          <MalformRadioGroup />
          {showToast && (
            <div className="mb-4 font-bold flex gap-2">
              <img src={SaveFile} alt="saved" />
              <span>{savedReferatText(lastSavedTime.toDate())}</span>
            </div>
          )}
          <VStack gap="8">
            {mode === ReferatMode.ENDRET && (
              <ReferatTextArea
                {...register("begrunnelseEndring", {
                  maxLength: MAX_LENGTH_BEGRUNNELSE_ENDRING,
                  required: valideringsTexts.begrunnelseEndringMissing,
                })}
                label={texts.fritekster.begrunnelseEndring.label}
                description={texts.fritekster.begrunnelseEndring.description}
                maxLength={MAX_LENGTH_BEGRUNNELSE_ENDRING}
                minRows={8}
                infoBox={texts.fritekster.begrunnelseEndring.infoboks}
                value={watch("begrunnelseEndring")}
                error={errors.begrunnelseEndring?.message}
              />
            )}
            <ReferatTextArea
              {...register("situasjon", {
                maxLength: MAX_LENGTH_SITUASJON,
                required: valideringsTexts.situasjonMissing,
              })}
              label={texts.fritekster.situasjon.label}
              description={texts.fritekster.situasjon.description}
              maxLength={MAX_LENGTH_SITUASJON}
              minRows={12}
              value={watch("situasjon")}
              error={errors.situasjon?.message}
              infoBox={Object.values(texts.fritekster.situasjon.infoboks).map(
                (text, index) => (
                  <BodyShort key={index} size="small">
                    {text}
                  </BodyShort>
                )
              )}
            />
            <ReferatTextArea
              {...register("konklusjon", {
                maxLength: MAX_LENGTH_KONKLUSJON,
                required: valideringsTexts.konklusjonMissing,
              })}
              label={texts.fritekster.konklusjon.label}
              description={texts.fritekster.konklusjon.description}
              maxLength={MAX_LENGTH_KONKLUSJON}
              minRows={8}
              infoBox={texts.fritekster.konklusjon.infoboks}
              value={watch("konklusjon")}
              error={errors.konklusjon?.message}
            />
            <ReferatTextArea
              {...register("arbeidstakersOppgave", {
                maxLength: MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
                required: valideringsTexts.arbeidstakersOppgaveMissing,
              })}
              label={texts.fritekster.arbeidstaker.label}
              description={texts.fritekster.arbeidstaker.description}
              maxLength={MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE}
              minRows={4}
              infoBox={texts.fritekster.arbeidstaker.infoboks}
              value={watch("arbeidstakersOppgave")}
              error={errors.arbeidstakersOppgave?.message}
            />
            <ReferatTextArea
              {...register("arbeidsgiversOppgave", {
                maxLength: MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
                required: valideringsTexts.arbeidsgiversOppgaveMissing,
              })}
              label={texts.fritekster.arbeidsgiver.label}
              description={texts.fritekster.arbeidsgiver.description}
              maxLength={MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE}
              minRows={4}
              value={watch("arbeidsgiversOppgave")}
              error={errors.arbeidsgiversOppgave?.message}
            />
            {dialogmote.behandler && (
              <ReferatTextArea
                {...register("behandlersOppgave", {
                  maxLength: MAX_LENGTH_BEHANDLERS_OPPGAVE,
                })}
                label={texts.fritekster.behandler.label}
                description={texts.fritekster.behandler.description}
                maxLength={MAX_LENGTH_BEHANDLERS_OPPGAVE}
                minRows={4}
                value={watch("behandlersOppgave")}
                error={errors.behandlersOppgave?.message}
              />
            )}
            <ReferatTextArea
              {...register("veiledersOppgave", {
                maxLength: MAX_LENGTH_VEILEDERS_OPPGAVE,
              })}
              label={texts.fritekster.veileder.label}
              description={texts.fritekster.veileder.description}
              maxLength={MAX_LENGTH_VEILEDERS_OPPGAVE}
              minRows={4}
              value={watch("veiledersOppgave")}
              error={errors.veiledersOppgave?.message}
            />
            <div className="flex">
              <div className="flex-1">
                <CheckboxGroup
                  size="small"
                  legend={texts.standardtekster.label}
                  description={texts.standardtekster.description}
                >
                  {Object.entries(standardTeksterForVisning).map(
                    ([key, standardtekst], index) => (
                      <Checkbox
                        key={index}
                        size="small"
                        value={key}
                        defaultChecked={initialValues.standardtekster?.includes(
                          key as StandardtekstKey
                        )}
                        {...register("standardtekster")}
                      >
                        {standardtekst.label}
                      </Checkbox>
                    )
                  )}
                </CheckboxGroup>
              </div>
              <div className="flex-[0.5]">
                <ReferatInfoBox>{texts.standardtekster.info}</ReferatInfoBox>
              </div>
            </div>
          </VStack>
          <div className="my-8">
            <Forhandsvisning
              contentLabel={texts.forhandsvisningContentLabel}
              getDocumentComponents={() => getReferatDocument(getValues())}
            />
          </div>
          {ferdigstillDialogmote.isError && (
            <SkjemaInnsendingFeil error={ferdigstillDialogmote.error} />
          )}
          {endreReferat.isError && (
            <SkjemaInnsendingFeil error={endreReferat.error} />
          )}
          {mellomlagreReferat.isError && (
            <SkjemaInnsendingFeil error={mellomlagreReferat.error} />
          )}
          {mellomlagreReferat.isSuccess && uendretSidenMellomlagring && (
            <Alert variant="success" size="small">
              {savedReferatText(lastSavedTime.toDate())}
            </Alert>
          )}
          <HStack gap="4" className="mt-8">
            <Button
              type="button"
              variant="secondary"
              loading={mellomlagreReferat.isPending}
              onClick={() => handleLagreClick(getValues())}
            >
              {texts.save}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSendingReferat()}
              onClick={() => debouncedAutoSave.cancel()}
            >
              {texts.send}
            </Button>
            <Button
              as={RouterLink}
              type="button"
              variant="tertiary"
              to={moteoversiktRoutePath}
            >
              {texts.abort}
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Referat;
