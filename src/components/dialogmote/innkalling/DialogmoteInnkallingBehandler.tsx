import React, { ReactElement } from "react";
import { Field } from "react-final-form";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import DialogmoteInnkallingSkjemaSeksjon from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjemaSeksjon";
import AppSpinner from "@/components/AppSpinner";
import BehandlerRadioGruppe from "@/components/dialogmote/innkalling/BehandlerRadioGruppe";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { SkjemaelementFeilmelding } from "nav-frontend-skjema";

const BehandlerTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

export const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
};

interface DialogmoteInnkallingBehandlerProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  selectedbehandler?: BehandlerDTO;
}

const DialogmoteInnkallingBehandler = ({
  setSelectedBehandler,
  selectedbehandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  const { data: behandlere, isInitialLoading } = useBehandlereQuery();
  const field = "behandlerRef";

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <BehandlerTittel>{texts.title}</BehandlerTittel>
      <Field<string> name={field}>
        {({ input, meta }) => {
          return (
            <>
              {isInitialLoading ? (
                <AppSpinner />
              ) : (
                <BehandlerRadioGruppe
                  id={field}
                  input={input}
                  selectedBehandler={selectedbehandler}
                  behandlere={behandlere}
                  setSelectedBehandler={setSelectedBehandler}
                />
              )}
              <SkjemaelementFeilmelding>
                {meta.submitFailed && meta.error}
              </SkjemaelementFeilmelding>
            </>
          );
        }}
      </Field>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingBehandler;
