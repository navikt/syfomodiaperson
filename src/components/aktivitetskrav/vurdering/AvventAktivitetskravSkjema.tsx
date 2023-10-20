import React from "react";
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  AvventArsakerCheckboxGruppe,
  vurderAktivitetskravArsakerFieldName,
} from "@/components/aktivitetskrav/vurdering/AvventArsakerCheckboxGruppe";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import {
  avventerFristDatoField,
  AvventFristDato,
} from "@/components/aktivitetskrav/vurdering/AvventFristDato";
import { Form } from "react-final-form";
import { VurderAktivitetskravSkjemaHeading } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { VurderAktivitetskravSkjemaFieldContainer } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaFieldContainer";

const texts = {
  title: "Avventer",
  subtitle1:
    "Informasjonen du oppgir her vil kun brukes til videre saksbehandling.",
  subtitle2: "Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
};

interface AvventAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakerFieldName]: AvventVurderingArsak[];
  [avventerFristDatoField]?: string;
}

export const AvventAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const submit = (values: AvventAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.AVVENT,
      arsaker: values.arsaker,
      beskrivelse: values.beskrivelse,
      frist: values.fristDato,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };
  const { validateArsakerField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema();

  const validate = (values: Partial<AvventAktivitetskravSkjemaValues>) => ({
    ...validateArsakerField(values.arsaker),
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <VurderAktivitetskravSkjemaHeading
            title={texts.title}
            subtitles={[texts.subtitle1, texts.subtitle2]}
          />
          <VurderAktivitetskravSkjemaFieldContainer>
            <AvventArsakerCheckboxGruppe />
            <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
            <AvventFristDato />
          </VurderAktivitetskravSkjemaFieldContainer>
          {vurderAktivitetskrav.isError && (
            <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
          )}
          <VurderAktivitetskravSkjemaButtons
            isSubmitting={vurderAktivitetskrav.isLoading}
            handleClose={() => setModalOpen(false)}
          />
        </form>
      )}
    </Form>
  );
};
