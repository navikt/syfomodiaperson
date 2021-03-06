import React, { ReactElement } from "react";
import { Input, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import ArbeidsgiverDropdown from "../../mote/skjema/ArbeidsgiverDropdown";
import styled from "styled-components";
import DialogmoteInnkallingSkjemaSeksjon from "./DialogmoteInnkallingSkjemaSeksjon";
import { useLedere } from "../../../hooks/useLedere";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { Innholdstittel } from "nav-frontend-typografi";

const texts = {
  title: "Arbeidsgiver",
  selectLabel: "Arbeidsgiver",
  navnLabel: "Nærmeste leder",
  epostLabel: "Epost",
};

const LederNavnColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

const ArbeidsgiverTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

const DialogmoteInnkallingVelgArbeidsgiver = (): ReactElement => {
  const { currentLedere } = useLedere();
  const field = "arbeidsgiver";
  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <ArbeidsgiverTittel>{texts.title}</ArbeidsgiverTittel>
      <Field<string> name={field}>
        {({ input, meta }) => {
          const valgtLeder = currentLedere.find(
            (l) => l.orgnummer === input.value
          );

          return (
            <>
              <ArbeidsgiverDropdown
                id={field}
                velgArbeidsgiver={input.onChange}
                ledere={currentLedere}
                label={texts.selectLabel}
              />
              <SkjemaelementFeilmelding>
                {meta.submitFailed && meta.error}
              </SkjemaelementFeilmelding>
              {valgtLeder && (
                <FlexRow topPadding={PaddingSize.MD}>
                  <LederNavnColumn flex={0.2}>
                    <Input
                      bredde="L"
                      label={texts.navnLabel}
                      disabled
                      value={valgtLeder.navn}
                    />
                  </LederNavnColumn>
                  <FlexColumn flex={1}>
                    <Input
                      bredde="L"
                      label={texts.epostLabel}
                      disabled
                      value={valgtLeder.epost}
                    />
                  </FlexColumn>
                </FlexRow>
              )}
            </>
          );
        }}
      </Field>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};
export default DialogmoteInnkallingVelgArbeidsgiver;
