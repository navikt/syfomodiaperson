import React from "react";
import { Link, Navigate } from "react-router-dom";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Radio, RadioGroup, Textarea } from "@navikt/ds-react";
import DialogmoteunntakSkjemaStatistikk from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaStatistikk";

export const texts = {
  noBrev: "Det blir ikke sendt ut brev ved unntak.",
  infoKandidatlist: `Når du setter unntak fra dialogmøte vil arbeidstakeren bli fjernet fra kandidatlisten. Dersom du på et senere tidspunkt vurderer at det likevel er nødvendig med et dialogmøte, kan du kalle inn til dialogmøte ved å søke deg frem til denne arbeidstakeren.`,
  arsakLegend: "Årsak til unntak (obligatorisk)",
  arsakErrorMessage: "Vennligst angi årsak.",
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

  const onSubmit: SubmitHandler<DialogmoteunntakSkjemaValues> = (values) => {
    const newUnntak: CreateUnntakDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
      beskrivelse: values.beskrivelse,
    };
    settDialogmoteunntak.mutate(newUnntak);
  };

  return (
    <Panel style={style.panel}>
      <AlertStripeInfo>{texts.noBrev}</AlertStripeInfo>
      <p>{texts.infoKandidatlist}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup
          legend={texts.arsakLegend}
          name="arsak"
          error={errors.arsak && "Vennligst angi årsak."}
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

        {isArsakStatistikkVisible && <DialogmoteunntakSkjemaStatistikk />}
        <Textarea
          label={texts.beskrivelseLabel}
          value={watch("beskrivelse")}
          {...register("beskrivelse", {
            maxLength: dialogmoteunntakSkjemaBeskrivelseMaxLength,
          })}
          maxLength={dialogmoteunntakSkjemaBeskrivelseMaxLength}
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
        <Link to={moteoversiktRoutePath}>
          <Button variant="secondary">{texts.avbryt}</Button>
        </Link>
        {settDialogmoteunntak.isError && (
          <SkjemaInnsendingFeil error={settDialogmoteunntak.error} />
        )}
      </form>
    </Panel>
  );
};

export default DialogmoteunntakSkjema;
