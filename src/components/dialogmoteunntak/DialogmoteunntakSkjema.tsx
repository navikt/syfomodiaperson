import React from "react";
import { Form } from "react-final-form";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  CreateUnntakDTO,
  UnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import DialogmoteunntakSkjemaArsakVelger, {
  DialogmoteunntakSkjemaArsakVelgerFieldName,
} from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaArsakVelger";
import { TrackedHovedknapp } from "@/components/buttons/TrackedHovedknapp";
import { TrackedFlatknapp } from "@/components/buttons/TrackedFlatknapp";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteunntak } from "@/data/dialogmotekandidat/useSettDialogmoteunntak";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  noBrev: "Det blir ikke sendt ut brev ved unntak.",
  send: "Sett unntak",
  avbryt: "Avbryt",
};

const StyledPanel = styled(Panel)`
  margin-bottom: 2em;
  padding: 2em;
`;

interface DialogmoteunntakSkjemaValues {
  arsak: UnntakArsak;
}

const DialogmoteunntakSkjema = () => {
  const personIdent = useValgtPersonident();
  const { isKandidat } = useDialogmotekandidat();
  const settDialogmoteunntak = useSettDialogmoteunntak();

  if (!isKandidat || settDialogmoteunntak.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  const validate = (values: Partial<DialogmoteunntakSkjemaValues>) => {
    return (
      (!values.arsak && {
        [DialogmoteunntakSkjemaArsakVelgerFieldName]: "Vennligst angi årsak",
      }) ||
      {}
    );
  };

  const submit = (values: DialogmoteunntakSkjemaValues) => {
    const newUnntak: CreateUnntakDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
    };
    settDialogmoteunntak.mutate(newUnntak);
  };

  return (
    <StyledPanel>
      <AlertStripeInfo>{texts.noBrev}</AlertStripeInfo>
      <Form onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteunntakSkjemaArsakVelger
              submitFailed={submitFailed}
              errors={errors}
            />
            {settDialogmoteunntak.isError && (
              <SkjemaInnsendingFeil error={settDialogmoteunntak.error} />
            )}
            <FlexRow columnGap={FlexGapSize.SM}>
              <TrackedHovedknapp
                context={texts.send}
                spinner={settDialogmoteunntak.isLoading}
                autoDisableVedSpinner
                htmlType="submit"
              >
                {texts.send}
              </TrackedHovedknapp>
              <Link to={moteoversiktRoutePath}>
                <TrackedFlatknapp context={texts.avbryt}>
                  {texts.avbryt}
                </TrackedFlatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </StyledPanel>
  );
};

export default DialogmoteunntakSkjema;
