import React, { ReactElement, useState } from "react";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import Panel from "nav-frontend-paneler";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import Deltakere from "./Deltakere";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import ReferatButtons from "./ReferatButtons";
import { Innholdstittel } from "nav-frontend-typografi";
import styled from "styled-components";
import { Situasjon } from "./Situasjon";
import { Konklusjon } from "./Konklusjon";
import { ArbeidstakersOppgave } from "./ArbeidstakersOppgave";
import { ArbeidsgiversOppgave } from "./ArbeidsgiversOppgave";
import { VeiledersOppgave } from "./VeiledersOppgave";
import { StandardTekster } from "./StandardTekster";
import {
  validerReferatDeltakere,
  validerReferatTekster,
} from "@/utils/valideringUtils";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Forhandsvisning } from "../Forhandsvisning";
import { useForhandsvisReferat } from "@/hooks/dialogmote/useForhandsvisReferat";
import { StandardTekst } from "@/data/dialogmote/dialogmoteTexts";
import { NewDialogmotedeltakerAnnenDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { useLedere } from "@/hooks/useLedere";
import { useFerdigstillDialogmote } from "@/data/dialogmote/useFerdigstillDialogmote";
import { Redirect } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { BehandlersOppgave } from "@/components/dialogmote/referat/BehandlersOppgave";

export const texts = {
  digitalReferat:
    "Referatet formidles her på nav.no. Det er bare de arbeidstakerne som har reservert seg mot digital kommunikasjon, som vil få referatet i posten.",
  personvern:
    "Du må aldri skrive sensitive opplysninger om helse, diagnose, behandling, og prognose. Dette gjelder også hvis arbeidstakeren er åpen om helsen og snakket om den i møtet.",
  forhandsvisningTitle: "Referat fra dialogmøte",
  forhandsvisningContentLabel: "Forhåndsvis referat fra dialogmøte",
};

export interface ReferatSkjemaValues {
  naermesteLeder: string;
  situasjon: string;
  konklusjon: string;
  arbeidstakersOppgave: string;
  arbeidsgiversOppgave: string;
  behandlersOppgave?: string;
  veiledersOppgave?: string;
  standardtekster: StandardTekst[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
}

const ReferatTittel = styled(Innholdstittel)`
  margin-bottom: 2em;
`;

const ReferatWarningAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 4em;
`;

interface ReferatProps {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

const Referat = ({ dialogmote, pageTitle }: ReferatProps): ReactElement => {
  const fnr = useValgtPersonident();
  const ferdigstillDialogmote = useFerdigstillDialogmote(fnr, dialogmote.uuid);

  const navbruker = useNavBrukerData();
  const { getCurrentNarmesteLeder } = useLedere();
  const [displayReferatPreview, setDisplayReferatPreview] = useState(false);

  const dateAndTimeForMeeting = tilDatoMedManedNavn(dialogmote.tid);
  const header = `${navbruker?.navn}, ${dateAndTimeForMeeting}, ${dialogmote.sted}`;

  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const { generateReferatDocument } = useForhandsvisReferat(dialogmote);

  const validate = (values: Partial<ReferatSkjemaValues>) => {
    const feilmeldinger = {
      ...validerReferatDeltakere(values),
      ...validerReferatTekster(values),
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const submit = (values: ReferatSkjemaValues) => {
    ferdigstillDialogmote.mutate({
      narmesteLederNavn: values.naermesteLeder,
      situasjon: values.situasjon,
      konklusjon: values.konklusjon,
      arbeidsgiverOppgave: values.arbeidsgiversOppgave,
      arbeidstakerOppgave: values.arbeidstakersOppgave,
      ...(dialogmote.behandler
        ? { behandlerOppgave: values.behandlersOppgave }
        : {}),
      veilederOppgave: values.veiledersOppgave,
      document: generateReferatDocument(values),
      andreDeltakere: values.andreDeltakere || [],
    });
  };

  const initialValues: Partial<ReferatSkjemaValues> = {
    naermesteLeder: getCurrentNarmesteLeder(
      dialogmote.arbeidsgiver.virksomhetsnummer
    )?.narmesteLederNavn,
  };

  if (ferdigstillDialogmote.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  return (
    <Panel>
      <Form
        onSubmit={submit}
        validate={validate}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
      >
        {({ handleSubmit, submitFailed, errors, values }) => (
          <form onSubmit={handleSubmit}>
            <ReferatTittel>{header}</ReferatTittel>
            <ReferatWarningAlert type="advarsel">
              {texts.digitalReferat}
            </ReferatWarningAlert>
            <Deltakere behandler={dialogmote.behandler} />
            <ReferatWarningAlert type="advarsel">
              {texts.personvern}
            </ReferatWarningAlert>
            <Situasjon />
            <Konklusjon />
            <ArbeidstakersOppgave />
            <ArbeidsgiversOppgave />
            {dialogmote.behandler && <BehandlersOppgave />}
            <VeiledersOppgave />
            <StandardTekster />
            {ferdigstillDialogmote.isError && (
              <SkjemaInnsendingFeil error={ferdigstillDialogmote.error} />
            )}
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <ReferatButtons
              pageTitle={pageTitle}
              onSendClick={resetFeilUtbedret}
              onPreviewClick={() => setDisplayReferatPreview(true)}
              showSendSpinner={ferdigstillDialogmote.isLoading}
            />
            <Forhandsvisning
              title={texts.forhandsvisningTitle}
              contentLabel={texts.forhandsvisningContentLabel}
              isOpen={displayReferatPreview}
              handleClose={() => setDisplayReferatPreview(false)}
              getDocumentComponents={() => generateReferatDocument(values)}
            />
          </form>
        )}
      </Form>
    </Panel>
  );
};

export default Referat;
