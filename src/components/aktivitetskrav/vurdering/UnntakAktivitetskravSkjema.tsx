import React from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  vurderAktivitetskravArsakFieldName,
  VurderAktivitetskravArsakRadioGruppe,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import { unntakVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
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
  title: "Sett unntak fra aktivitetskravet",
};

interface UnntakAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: UnntakVurderingArsak;
}

export const UnntakAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);

  const submit = (values: UnntakAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.UNNTAK,
      arsaker: [values.arsak],
      beskrivelse: values.beskrivelse,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };
  const { validateArsakField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema();

  const validate = (values: Partial<UnntakAktivitetskravSkjemaValues>) => ({
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
              arsakTexts={unntakVurderingArsakTexts}
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
