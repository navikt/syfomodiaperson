import React from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";

import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import Panel from "nav-frontend-paneler";
import { FlexRow } from "../../Layout";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Form } from "react-final-form";
import {
  validerBegrunnelser,
  validerSted,
  validerTidspunkt,
  validerVideoLink,
} from "@/utils/valideringUtils";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import EndreDialogmoteTekster, {
  MAX_LENGTH_ENDRE_BEGRUNNELSE,
} from "./EndreDialogmoteTekster";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { genererDato } from "../../mote/utils";
import { useForhandsvisTidSted } from "@/hooks/dialogmote/useForhandsvisTidSted";
import {
  DialogmoteDTO,
  EndreTidStedDialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useEndreTidStedDialogmote } from "@/data/dialogmote/useEndreTidStedDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  send: "Lagre endringer",
  avbryt: "Avbryt",
};

const EndrePanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(TrackedHovedknapp)`
  margin-right: 0.5rem;
`;

export interface EndreTidStedSkjemaValues {
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
}

type EndreTidStedDialogmoteSkjemaFeil = Partial<
  Pick<
    EndreTidStedSkjemaValues,
    | "sted"
    | "klokkeslett"
    | "dato"
    | "begrunnelseArbeidsgiver"
    | "begrunnelseArbeidstaker"
    | "videoLink"
  >
>;

interface Props {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

const EndreDialogmoteSkjema = ({ dialogmote, pageTitle }: Props) => {
  const fnr = useValgtPersonident();

  const dato = dialogmote.tid.split("T")[0];
  const klokkeslett = dialogmote.tid.split("T")[1].substr(0, 5);

  const initialValues: Partial<EndreTidStedSkjemaValues> = {
    dato,
    klokkeslett,
    sted: dialogmote.sted,
    videoLink: dialogmote.videoLink,
  };

  const endreTidStedDialogmote = useEndreTidStedDialogmote(
    fnr,
    dialogmote.uuid
  );

  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();

  const forhandsvisEndreTidStedGenerator = useForhandsvisTidSted();

  const validate = (
    values: Partial<EndreTidStedSkjemaValues>
  ): EndreTidStedDialogmoteSkjemaFeil => {
    const feilmeldinger: EndreTidStedDialogmoteSkjemaFeil = {
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      videoLink: validerVideoLink(values.videoLink),
      ...validerBegrunnelser({ ...values }, MAX_LENGTH_ENDRE_BEGRUNNELSE),
    };
    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const toEndreTidSted = (
    values: EndreTidStedSkjemaValues
  ): EndreTidStedDialogmoteDTO => ({
    sted: values.sted,
    tid: genererDato(values.dato, values.klokkeslett),
    videoLink: values.videoLink,
    arbeidstaker: {
      begrunnelse: values.begrunnelseArbeidstaker,
      endringsdokument: forhandsvisEndreTidStedGenerator.generateArbeidstakerTidStedDocument(
        values,
        dialogmote.tid
      ),
    },
    arbeidsgiver: {
      begrunnelse: values.begrunnelseArbeidsgiver,
      endringsdokument: forhandsvisEndreTidStedGenerator.generateArbeidsgiverTidStedDocument(
        values,
        dialogmote.tid
      ),
    },
  });

  const submit = (values: EndreTidStedSkjemaValues) => {
    const dialogmoteEndring = toEndreTidSted(values);
    endreTidStedDialogmote.mutate(dialogmoteEndring);
  };

  if (endreTidStedDialogmote.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  return (
    <EndrePanel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteTidOgSted />
            <EndreDialogmoteTekster opprinneligTid={dialogmote.tid} />
            {endreTidStedDialogmote.isError && (
              <SkjemaInnsendingFeil error={endreTidStedDialogmote.error} />
            )}
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                data-cy="sendEndringKnapp"
                context={pageTitle}
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={endreTidStedDialogmote.isLoading}
                autoDisableVedSpinner
              >
                {texts.send}
              </SendButton>
              <Link to={moteoversiktRoutePath}>
                <TrackedFlatknapp context={pageTitle} htmlType="button">
                  {texts.avbryt}
                </TrackedFlatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </EndrePanel>
  );
};

export default EndreDialogmoteSkjema;
