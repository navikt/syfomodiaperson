import React, { useState } from "react";
import Panel from "nav-frontend-paneler";
import DialogmoteInnkallingVelgArbeidsgiver from "./DialogmoteInnkallingVelgArbeidsgiver";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import DialogmoteInnkallingTekster, {
  MAX_LENGTH_INNKALLING_FRITEKST,
} from "./DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import {
  validerArbeidsgiver,
  validerSkjemaTekster,
  validerSted,
  validerTidspunkt,
  validerVideoLink,
} from "@/utils/valideringUtils";
import { DialogmoteInnkallingDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { genererDato } from "../../mote/utils";
import { Link, Redirect } from "react-router-dom";
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
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import styled from "styled-components";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useTrackOnClick } from "@/data/logging/loggingHooks";

interface DialogmoteInnkallingSkjemaTekster {
  fritekstArbeidsgiver: string;
  fritekstArbeidstaker: string;
  fritekstBehandler?: string;
}

export interface DialogmoteInnkallingSkjemaValues
  extends DialogmoteInnkallingSkjemaTekster {
  arbeidsgiver: string;
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
}

interface DialogmoteInnkallingSkjemaProps {
  pageTitle: string;
}

const StyledPanel = styled(Panel)`
  margin-bottom: 2em;
  padding: 2em;
`;

type DialogmoteInnkallingSkjemaFeil = Partial<
  Pick<
    DialogmoteInnkallingSkjemaValues,
    "arbeidsgiver" | "sted" | "klokkeslett" | "dato" | "videoLink"
  >
>;

const texts = {
  send: "Send innkallingene",
  cancel: "Avbryt",
  behandler: "Behandler",
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
        values,
        valgtBehandler
      ),
    },
    arbeidstaker: {
      personIdent: fnr,
      fritekstInnkalling: values.fritekstArbeidstaker,
      innkalling: innkallingDocumentGenerator.generateArbeidstakerInnkallingDocument(
        values,
        valgtBehandler
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
      personIdent: valgtBehandler.fnr,
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
}: DialogmoteInnkallingSkjemaProps) => {
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
    const friteksterFeil = validerSkjemaTekster<DialogmoteInnkallingSkjemaTekster>(
      {
        fritekstArbeidsgiver: {
          maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
          value: values.fritekstArbeidsgiver || "",
        },
        fritekstArbeidstaker: {
          maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
          value: values.fritekstArbeidstaker || "",
        },
        ...(selectedBehandler
          ? {
              fritekstBehandler: {
                maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
                value: values.fritekstBehandler || "",
              },
            }
          : {}),
      }
    );

    const feilmeldinger: DialogmoteInnkallingSkjemaFeil = {
      arbeidsgiver: validerArbeidsgiver(values.arbeidsgiver),
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      ...friteksterFeil,
      videoLink: validerVideoLink(values.videoLink),
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };
  const trackOnClick = useTrackOnClick();

  const { isDm2InnkallingFastlegeEnabled } = useDM2FeatureToggles();

  const [
    selectedBehandler,
    setSelectedBehandler,
  ] = useState<BehandlerDialogmeldingDTO>();

  if (opprettInnkalling.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  const submit = (values: DialogmoteInnkallingSkjemaValues) => {
    trackOnClick(texts.behandler, selectedBehandler?.type || "ingen behandler");
    const dialogmoteInnkalling = toInnkalling(
      values,
      fnr,
      navEnhet,
      innkallingDocumentGenerator,
      selectedBehandler
    );
    opprettInnkalling.mutate(dialogmoteInnkalling);
  };

  return (
    <StyledPanel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInnkallingVelgArbeidsgiver />
            {isDm2InnkallingFastlegeEnabled && (
              <DialogmoteInnkallingBehandler
                setSelectedBehandler={setSelectedBehandler}
              />
            )}
            <DialogmoteTidOgSted />
            <DialogmoteInnkallingTekster
              selectedBehandler={selectedBehandler}
            />
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
    </StyledPanel>
  );
};

export default DialogmoteInnkallingSkjema;
