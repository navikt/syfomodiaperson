import React from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import {
  vurderAktivitetskravArsakFieldName,
  VurderAktivitetskravArsakRadioGruppe,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { Form } from "react-final-form";
import { VurderAktivitetskravSkjemaHeading } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { VurderAktivitetskravSkjemaFieldContainer } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaFieldContainer";

const texts = {
  title: "Er i aktivitet",
};

interface OppfyltAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: OppfyltVurderingArsak;
}

export const OppfyltAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.OPPFYLT,
      arsaker: [values.arsak],
      beskrivelse: values.beskrivelse,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  const { validateArsakField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema();

  const validate = (values: Partial<OppfyltAktivitetskravSkjemaValues>) => ({
    ...validateArsakField(values.arsak),
    ...validateBeskrivelseField(values.beskrivelse, false),
  });

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <VurderAktivitetskravSkjemaHeading title={texts.title} />
          <VurderAktivitetskravSkjemaFieldContainer>
            <VurderAktivitetskravArsakRadioGruppe
              arsakTexts={oppfyltVurderingArsakTexts}
            />
            <VurderAktivitetskravBeskrivelse />
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
