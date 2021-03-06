import React, { ReactElement } from "react";
import { useVeilederinfo } from "../../../hooks/useVeilederinfo";
import { useNavBrukerData } from "../../../data/navbruker/navbruker_hooks";
import { Element } from "nav-frontend-typografi";
import { Field } from "react-final-form";
import styled from "styled-components";
import { Input } from "nav-frontend-skjema";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { AndreDeltakere } from "./AndreDeltakere";

const texts = {
  title: "Deltakere i møtet",
  naermesteLederLabel: "Nærmeste leder",
};

const DeltakereBoks = styled.div`
  margin-bottom: 4em;
`;

const Header = styled(Element)`
  margin-bottom: 1em;
`;

const Deltakere = (): ReactElement => {
  const navbruker = useNavBrukerData();
  const { veilederinfo } = useVeilederinfo();

  return (
    <DeltakereBoks>
      <Header>{texts.title}</Header>
      <ul>
        <li>{`Fra NAV: ${veilederinfo?.navn}`}</li>
        <li>{`Arbeidstaker: ${navbruker?.navn}`}</li>
      </ul>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <FlexColumn flex={0.3}>
          <Field<string> name="naermesteLeder">
            {({ input, meta }) => (
              <Input
                {...input}
                id="naermesteLeder"
                label={texts.naermesteLederLabel}
                feil={meta.submitFailed && meta.error}
              />
            )}
          </Field>
        </FlexColumn>
      </FlexRow>
      <AndreDeltakere />
    </DeltakereBoks>
  );
};

export default Deltakere;
