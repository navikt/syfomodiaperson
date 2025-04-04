import React from "react";
import { Link, Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  createUnntakArsakTexts,
  CreateUnntakDTO,
  ValidUnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteunntak } from "@/data/dialogmotekandidat/useSettDialogmoteunntak";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";

export const texts = {
  noBrev: "Det blir ikke sendt ut varsel eller brev til den sykmeldte.",
  infoKandidatlist: `Når du setter unntak fra dialogmøte vil arbeidstakeren bli fjernet fra kandidatlisten. Dersom du på et senere tidspunkt vurderer at det likevel er nødvendig med et dialogmøte, kan du kalle inn til dialogmøte ved å søke deg frem til denne arbeidstakeren.`,
  arsakLegend: "Årsak til unntak (obligatorisk)",
  arsakErrorMessage: "Vennligst angi årsak.",
  beskrivelseLabel: "Beskrivelse (valgfri)",
  send: "Sett unntak",
  avbryt: "Avbryt",
};

export const dialogmoteunntakSkjemaBeskrivelseMaxLength = 2000;

export interface DialogmoteunntakSkjemaValues {
  arsak: ValidUnntakArsak;
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

  const onSubmit: SubmitHandler<DialogmoteunntakSkjemaValues> = (values) => {
    const newUnntak: CreateUnntakDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
      beskrivelse: values.beskrivelse,
    };
    settDialogmoteunntak.mutate(newUnntak);
  };

  return (
    <Box background="surface-default" padding="6">
      <Alert variant="info" size="small" className="p-4 mb-4">
        {texts.noBrev}
      </Alert>
      <p>{texts.infoKandidatlist}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {settDialogmoteunntak.isError && (
          <SkjemaInnsendingFeil error={settDialogmoteunntak.error} />
        )}
        <RadioGroup
          className="mb-4"
          legend={texts.arsakLegend}
          name="arsak"
          size="small"
          error={errors.arsak && texts.arsakErrorMessage}
        >
          {Object.entries(createUnntakArsakTexts).map(([key, tekst], index) => (
            <Radio
              key={index}
              value={key}
              {...register("arsak", { required: true })}
            >
              {tekst}
            </Radio>
          ))}
        </RadioGroup>
        <Textarea
          className="mb-4"
          label={texts.beskrivelseLabel}
          size="small"
          value={watch("beskrivelse")}
          {...register("beskrivelse", {
            maxLength: dialogmoteunntakSkjemaBeskrivelseMaxLength,
          })}
          maxLength={dialogmoteunntakSkjemaBeskrivelseMaxLength}
        />

        <Button
          className="mr-4"
          type="submit"
          variant="primary"
          loading={settDialogmoteunntak.isPending}
        >
          {texts.send}
        </Button>

        <Button as={Link} to={moteoversiktRoutePath} variant="secondary">
          {texts.avbryt}
        </Button>
      </form>
    </Box>
  );
};

export default DialogmoteunntakSkjema;
