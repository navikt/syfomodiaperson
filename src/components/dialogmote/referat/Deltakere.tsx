import React, { ReactElement } from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Element } from "nav-frontend-typografi";
import { Field } from "react-final-form";
import styled from "styled-components";
import { Input } from "nav-frontend-skjema";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { AndreDeltakere } from "./AndreDeltakere";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { behandlerDeltakerTekst } from "@/utils/behandlerUtils";

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

interface DeltakereProps {
  behandler: DialogmotedeltakerBehandlerDTO | undefined;
}

const Deltakere = ({ behandler }: DeltakereProps): ReactElement => {
  const navbruker = useNavBrukerData();
  const { data: veilederinfo } = useVeilederinfoQuery();

  return (
    <DeltakereBoks>
      <Header>{texts.title}</Header>
      <ul>
        <li>{`Fra NAV: ${veilederinfo?.navn}`}</li>
        <li>{`Arbeidstaker: ${navbruker?.navn}`}</li>
        {behandler && (
          <li>{behandlerDeltakerTekst("Behandler:", behandler)}</li>
        )}
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
