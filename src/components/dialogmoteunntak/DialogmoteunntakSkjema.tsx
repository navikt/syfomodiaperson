import React from "react";
import { Navigate } from "react-router-dom";
import Panel from "nav-frontend-paneler";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  CreateUnntakDTO,
  UnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteunntak } from "@/data/dialogmotekandidat/useSettDialogmoteunntak";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { validerTekst } from "@/utils/valideringUtils";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Radio, RadioGroup, Textarea } from "@navikt/ds-react";
import DialogmoteunntakSkjemaStatistikk from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaStatistikk";

export const texts = {
  noBrev: "Det blir ikke sendt ut brev ved unntak.",
  infoKandidatlist: `Når du setter unntak fra dialogmøte vil arbeidstakeren bli fjernet fra kandidatlisten. Dersom du på et senere tidspunkt vurderer at det likevel er nødvendig med et dialogmøte, kan du kalle inn til dialogmøte ved å søke deg frem til denne arbeidstakeren.`,
  arsakLegend: "Årsak til unntak (obligatorisk)",
  arsakErrorMessage: "Vennligst angi årsak",
  beskrivelseLabel: "Beskrivelse (valgfri)",
  send: "Sett unntak",
  avbryt: "Avbryt",
};

export interface UnntakArsakText {
  arsak: UnntakArsak;
  text: string;
}
export const unntakArsakTexts: UnntakArsakText[] = [
  {
    arsak: UnntakArsak.MEDISINSKE_GRUNNER,
    text: "Medisinske grunner",
  },
  {
    arsak: UnntakArsak.INNLEGGELSE_INSTITUSJON,
    text: "Innleggelse i helseinstitusjon",
  },
  {
    arsak: UnntakArsak.FRISKMELDT,
    text: "Friskmeldt",
  },
  {
    arsak: UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
    text: "Forventet friskmelding innen 28 ukers sykmelding",
  },
  {
    arsak: UnntakArsak.DOKUMENTERT_TILTAK_FRISKMELDING,
    text: "Tiltak som sannsynligvis vil føre til en friskmelding",
  },
  {
    arsak: UnntakArsak.ARBEIDSFORHOLD_OPPHORT,
    text: "Arbeidsforholdet er opphørt",
  },
];

export const dialogmoteunntakSkjemaBeskrivelseMaxLength = 2000;

const style = {
  panel: {
    padding: "2em",
  },
  formField: {
    marginBottom: "2em",
  },
  buttonRow: {
    marginRight: "1em",
  },
};

export interface DialogmoteunntakSkjemaValues {
  arsak: UnntakArsak;
  beskrivelse?: string;
  weather: string;
}

const DialogmoteunntakSkjema = () => {
  const personIdent = useValgtPersonident();
  const { isKandidat } = useDialogmotekandidat();
  const settDialogmoteunntak = useSettDialogmoteunntak();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DialogmoteunntakSkjemaValues>();

  if (!isKandidat || settDialogmoteunntak.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const isArsakStatistikkVisible =
    watch("arsak") === UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER;

  const validateBeskrivelse = (value) => {
    return validerTekst({
      value: value,
      maxLength: dialogmoteunntakSkjemaBeskrivelseMaxLength,
    });
  };
  const onSubmit: SubmitHandler<DialogmoteunntakSkjemaValues> = (values) => {
    const newUnntak: CreateUnntakDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
      beskrivelse: values.beskrivelse,
    };
    settDialogmoteunntak.mutate(newUnntak);
  };

  const ArsakRadioGroup = () => {
    return (
      <RadioGroup
        legend={texts.arsakLegend}
        error={errors.arsak && texts.arsakErrorMessage}
        name={"arsak"}
        style={style.formField}
      >
        {unntakArsakTexts.map((unntakArsakText, index) => (
          <Radio
            key={index}
            value={unntakArsakText.arsak}
            {...register("arsak", { required: true })}
          >
            {unntakArsakText.text}
          </Radio>
        ))}
      </RadioGroup>
    );
  };

  return (
    <Panel style={style.panel}>
      <AlertStripeInfo>{texts.noBrev}</AlertStripeInfo>
      <p>{texts.infoKandidatlist}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ArsakRadioGroup />
        {isArsakStatistikkVisible && <DialogmoteunntakSkjemaStatistikk />}
        <Textarea
          label={texts.beskrivelseLabel}
          maxLength={dialogmoteunntakSkjemaBeskrivelseMaxLength}
          {...register("beskrivelse", {
            validate: (value) => validateBeskrivelse(value),
          })}
          style={style.formField}
        />

        <Button
          type="submit"
          variant="primary"
          loading={settDialogmoteunntak.isLoading}
          style={style.buttonRow}
        >
          {texts.send}
        </Button>
        <Button as="a" variant="secondary" href={"moteoversiktRoutePath"}>
          {texts.avbryt}
        </Button>
        {settDialogmoteunntak.isError && (
          <SkjemaInnsendingFeil error={settDialogmoteunntak.error} />
        )}
      </form>
    </Panel>
  );
};

export default DialogmoteunntakSkjema;
