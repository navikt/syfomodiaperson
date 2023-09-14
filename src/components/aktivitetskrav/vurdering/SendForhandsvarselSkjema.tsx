import React from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { Form } from "react-final-form";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Heading, Label } from "@navikt/ds-react";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import styled from "styled-components";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Beskrivelse (obligatorisk)",
};

const VarselbrevContent = styled.div`
  > * {
    margin-bottom: ${PaddingSize.SM};

    &:last-child {
      margin-bottom: ${PaddingSize.MD};
    }
  }
`;

const StyledForm = styled.form`
  max-width: 50em;
`;

const StyledForhandsvisning = styled.div`
  border: 1px solid black;
  padding: 1em;
`;

const getFristForForhandsvarsel = (isFysiskUtsending = true) => {
  return isFysiskUtsending ? addWeeks(new Date(), 3) : addWeeks(new Date(), 2);
};

interface SendForhandsvarselSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
}

export const SendForhandsvarselSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { validateBeskrivelseField } = useAktivitetskravVurderingSkjema(
    AktivitetskravStatus.FORHANDSVARSEL
  );
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();
  const frist = getFristForForhandsvarsel();

  const validate = (values: Partial<SendForhandsvarselSkjemaValues>) => ({
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  const submit = (values: SendForhandsvarselSkjemaValues) => {
    // TODO: Implement post-call
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit, values }) => (
        <StyledForm onSubmit={handleSubmit}>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <Heading level="2" size="large">
              {texts.title}
            </Heading>
          </FlexRow>
          <VarselbrevContent>
            <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
            <Label>Forhåndsvisning</Label>
            <StyledForhandsvisning>
              {getForhandsvarselDocument(values.beskrivelse, frist).map(
                (component, index) => (
                  <DocumentComponentVisning
                    documentComponent={component}
                    key={index}
                  />
                )
              )}
            </StyledForhandsvisning>
          </VarselbrevContent>
          {/*{vurderAktivitetskrav.isError && (*/}
          {/*  <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />*/}
          {/*)}*/}
          <VurderAktivitetskravSkjemaButtons
            onAvbrytClick={() => props.setModalOpen(false)}
            showLagreSpinner={false} // TODO: Use isLoading from post-call
          />
        </StyledForm>
      )}
    </Form>
  );
};
