import React, { ReactElement } from "react";
import Panel from "nav-frontend-paneler";
import DialogmoteInnkallingVelgArbeidsgiver from "./DialogmoteInnkallingVelgArbeidsgiver";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import DialogmoteInnkallingTekster from "./DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import {
  validerArbeidsgiver,
  validerInnkallingFritekster,
  validerSted,
  validerTidspunkt,
  validerVideoLink,
} from "@/utils/valideringUtils";
import { DialogmoteInnkallingDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { genererDato } from "../../mote/utils";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useNavEnhet } from "@/hooks/useNavEnhet";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { FlexRow } from "../../Layout";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import {
  ForhandsvisInnkallingGenerator,
  useForhandsvisInnkalling,
} from "@/hooks/dialogmote/useForhandsvisInnkalling";
import { useOpprettInnkallingDialogmote } from "@/data/dialogmote/useOpprettInnkallingDialogmote";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import DialogmoteInnkallingBehandler from "@/components/dialogmote/innkalling/DialogmoteInnkallingBehandler";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { behandlerNavn } from "@/utils/behandlerUtils";

export interface DialogmoteInnkallingSkjemaValues {
  arbeidsgiver: string;
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
  fritekstArbeidsgiver?: string;
  fritekstArbeidstaker?: string;
  fritekstBehandler?: string;
}

interface DialogmoteInnkallingSkjemaProps {
  pageTitle: string;
}

export interface DialogmoteInnkallingRouteStateProps {
  valgtBehandler?: BehandlerDialogmeldingDTO;
}

type DialogmoteInnkallingSkjemaFeil = Partial<
  Pick<
    DialogmoteInnkallingSkjemaValues,
    "arbeidsgiver" | "sted" | "klokkeslett" | "dato" | "videoLink"
  >
>;

const texts = {
  send: "Send innkallingene",
  cancel: "Avbryt",
};

const toInnkalling = (
  values: DialogmoteInnkallingSkjemaValues,
  fnr: string,
  navEnhet: string,
  innkallingDocumentGenerator: ForhandsvisInnkallingGenerator,
  valgtBehandler: BehandlerDialogmeldingDTO | undefined
): DialogmoteInnkallingDTO => {
  const innkalling: DialogmoteInnkallingDTO = {
    tildeltEnhet: navEnhet,
    arbeidsgiver: {
      virksomhetsnummer: values.arbeidsgiver,
      fritekstInnkalling: values.fritekstArbeidsgiver,
      innkalling: innkallingDocumentGenerator.generateArbeidsgiverInnkallingDocument(
        values
      ),
    },
    arbeidstaker: {
      personIdent: fnr,
      fritekstInnkalling: values.fritekstArbeidstaker,
      innkalling: innkallingDocumentGenerator.generateArbeidstakerInnkallingDocument(
        values
      ),
    },
    tidSted: {
      sted: values.sted,
      videoLink: values.videoLink,
      tid: genererDato(values.dato, values.klokkeslett),
    },
  };

  if (valgtBehandler) {
    innkalling.behandler = {
      behandlerRef: valgtBehandler.behandlerRef,
      behandlerNavn: behandlerNavn(valgtBehandler),
      behandlerKontor: valgtBehandler.kontor ?? "",
      fritekstInnkalling: values.fritekstBehandler,
      innkalling: innkallingDocumentGenerator.generateBehandlerInnkallingDocument(
        values
      ),
    };
  }

  return innkalling;
};

const DialogmoteInnkallingSkjema = ({
  pageTitle,
}: DialogmoteInnkallingSkjemaProps): ReactElement => {
  const initialValues: Partial<DialogmoteInnkallingSkjemaValues> = {};
  const fnr = useValgtPersonident();
  const navEnhet = useNavEnhet();
  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const innkallingDocumentGenerator = useForhandsvisInnkalling();
  const opprettInnkalling = useOpprettInnkallingDialogmote(fnr);

  const validate = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DialogmoteInnkallingSkjemaFeil => {
    const feilmeldinger: DialogmoteInnkallingSkjemaFeil = {
      arbeidsgiver: validerArbeidsgiver(values.arbeidsgiver),
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      ...validerInnkallingFritekster({
        fritekstArbeidstaker: values.fritekstArbeidstaker,
        fritekstArbeidsgiver: values.fritekstArbeidsgiver,
      }),
      videoLink: validerVideoLink(values.videoLink),
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const submit = (values: DialogmoteInnkallingSkjemaValues) => {
    const dialogmoteInnkalling = toInnkalling(
      values,
      fnr,
      navEnhet,
      innkallingDocumentGenerator,
      valgtBehandler
    );
    opprettInnkalling.mutate(dialogmoteInnkalling);
  };

  const location = useLocation<DialogmoteInnkallingRouteStateProps>();

  const valgtBehandler = location.state?.valgtBehandler;

  if (opprettInnkalling.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  return (
    <Panel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            {!!valgtBehandler && (
              <DialogmoteInnkallingBehandler behandler={valgtBehandler} />
            )}
            <DialogmoteInnkallingVelgArbeidsgiver />
            <DialogmoteTidOgSted />
            <DialogmoteInnkallingTekster />
            {opprettInnkalling.isError && (
              <SkjemaInnsendingFeil error={opprettInnkalling.error} />
            )}
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <TrackedHovedknapp
                context={pageTitle}
                onClick={resetFeilUtbedret}
                spinner={opprettInnkalling.isLoading}
                autoDisableVedSpinner
                htmlType="submit"
              >
                {texts.send}
              </TrackedHovedknapp>
              <Link to={moteoversiktRoutePath}>
                <TrackedFlatknapp context={pageTitle} htmlType="button">
                  {texts.cancel}
                </TrackedFlatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </Panel>
  );
};

export default DialogmoteInnkallingSkjema;
