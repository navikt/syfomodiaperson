import React from "react";
import {
  AktivitetskravStatus,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { Form } from "react-final-form";
import { ButtonRow, FlexRow, PaddingSize } from "@/components/Layout";
import { Alert, Button, Heading, Label, Panel } from "@navikt/ds-react";
import styled from "styled-components";
import { useSendForhandsvarsel } from "@/data/aktivitetskrav/useSendForhandsvarsel";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Beskrivelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  warning:
    "Husk å utrede saken tilstrekkelig før du sender forhåndsvarsel om stans av sykepengene.",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
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
export const getFristForForhandsvarsel = (isFysiskUtsending = true) => {
  return isFysiskUtsending ? addWeeks(new Date(), 3) : addWeeks(new Date(), 2);
};

interface SendForhandsvarselSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
}
export const SendForhandsvarselSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const sendForhandsvarsel = useSendForhandsvarsel(aktivitetskravUuid);
  const { validateBeskrivelseField } = useAktivitetskravVurderingSkjema(
    AktivitetskravStatus.FORHANDSVARSEL
  );
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();
  const frist = getFristForForhandsvarsel();

  const validate = (values: Partial<SendForhandsvarselSkjemaValues>) => ({
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  const submit = (values: SendForhandsvarselSkjemaValues) => {
    const forhandsvarselDTO: SendForhandsvarselDTO = {
      fritekst: values.beskrivelse,
      document: getForhandsvarselDocument(values.beskrivelse, frist),
    };
    if (aktivitetskravUuid) {
      sendForhandsvarsel.mutate(forhandsvarselDTO, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const SendVarselButton = () => {
    return (
      <Button loading={sendForhandsvarsel.isLoading} type="submit">
        {texts.sendVarselButtonText}
      </Button>
    );
  };

  const AvbrytButton = () => {
    return (
      <Button variant="tertiary" onClick={() => setModalOpen(false)}>
        {texts.avbrytButtonText}
      </Button>
    );
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
            <Alert variant={"warning"}>{texts.warning}</Alert>
            <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
            <Label size="small">{texts.forhandsvisning}</Label>
            <Panel border>
              {getForhandsvarselDocument(values.beskrivelse, frist).map(
                (component, index) => (
                  <DocumentComponentVisning
                    documentComponent={component}
                    key={index}
                  />
                )
              )}
            </Panel>
          </VarselbrevContent>
          {sendForhandsvarsel.isError && (
            <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
          )}
          <ButtonRow>
            <SendVarselButton />
            <AvbrytButton />
          </ButtonRow>
        </StyledForm>
      )}
    </Form>
  );
};
