import React, { ReactElement } from "react";
import { Input, Label } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import KlokkeslettField from "../KlokkeslettField";
import Datovelger from "../Datovelger";
import DialogmoteInnkallingSkjemaSeksjon from "./innkalling/DialogmoteInnkallingSkjemaSeksjon";
import styled from "styled-components";
import { FlexColumn, FlexRow, PaddingSize } from "../Layout";
import { Innholdstittel } from "nav-frontend-typografi";

const texts = {
  title: "Tid og sted",
  stedLabel: "Sted",
  stedPlaceholder: "F.eks: På arbeidsplassen",
  datoLabel: "Dato",
  datoPlaceholder: "dd.mm.åååå",
  tidLabel: "Klokkeslett",
  videoLabel: "Lenke til videomøte (valgfritt)",
  videoPlaceholder: "https://",
};

const DatoColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

const TidOgStedTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

const DialogmoteTidOgSted = (): ReactElement => {
  const datoField = "dato";
  const klokkeslettField = "klokkeslett";
  const stedField = "sted";
  const videoLinkField = "videoLink";
  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <TidOgStedTittel>{texts.title}</TidOgStedTittel>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <DatoColumn>
          <Label htmlFor={datoField}>{texts.datoLabel}</Label>
          <Datovelger
            id={datoField}
            name={datoField}
            placeholder={texts.datoPlaceholder}
          />
        </DatoColumn>
        <FlexColumn flex={1}>
          <KlokkeslettField
            id={klokkeslettField}
            name={klokkeslettField}
            label={texts.tidLabel}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <FlexColumn flex={1}>
          <Field<string> name={stedField}>
            {({ input, meta }) => (
              <Input
                {...input}
                id={stedField}
                placeholder={texts.stedPlaceholder}
                label={texts.stedLabel}
                feil={meta.submitFailed && meta.error}
              />
            )}
          </Field>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn flex={1}>
          <Field<string> name={videoLinkField}>
            {({ input, meta }) => (
              <Input
                {...input}
                id={videoLinkField}
                label={texts.videoLabel}
                placeholder={texts.videoPlaceholder}
                feil={meta.submitFailed && meta.error}
              />
            )}
          </Field>
        </FlexColumn>
      </FlexRow>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteTidOgSted;
