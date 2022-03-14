import React, { ReactElement, useState } from "react";
import { Form, FormSpy } from "react-final-form";
import arrayMutators from "final-form-arrays";
import Panel from "nav-frontend-paneler";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import Deltakere from "./Deltakere";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import ReferatButtons from "./ReferatButtons";
import { Innholdstittel } from "nav-frontend-typografi";
import styled from "styled-components";
import {
  validerReferatDeltakere,
  validerSkjemaTekster,
} from "@/utils/valideringUtils";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Forhandsvisning } from "../Forhandsvisning";
import { useForhandsvisReferat } from "@/hooks/dialogmote/useForhandsvisReferat";
import { StandardTekst } from "@/data/dialogmote/dialogmoteTexts";
import {
  NewDialogmotedeltakerAnnenDTO,
  NewDialogmoteReferatDTO,
} from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { useFerdigstillDialogmote } from "@/data/dialogmote/useFerdigstillDialogmote";
import { Redirect } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMellomlagreReferat } from "@/data/dialogmote/useMellomlagreReferat";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Knapp } from "nav-frontend-knapper";
import { useInitialValuesReferat } from "@/hooks/dialogmote/useInitialValuesReferat";
import {
  MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
  MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
  MAX_LENGTH_BEHANDLERS_OPPGAVE,
  MAX_LENGTH_KONKLUSJON,
  MAX_LENGTH_SITUASJON,
  MAX_LENGTH_VEILEDERS_OPPGAVE,
  ReferatFritekster,
} from "@/components/dialogmote/referat/ReferatFritekster";
import { StandardTekster } from "@/components/dialogmote/referat/StandardTekster";

export const texts = {
  digitalReferat:
    "Referatet formidles her på nav.no. Det er bare de arbeidstakerne som har reservert seg mot digital kommunikasjon, som vil få referatet i posten.",
  personvern:
    "Du må aldri skrive sensitive opplysninger om helse, diagnose, behandling, og prognose. Dette gjelder også hvis arbeidstakeren er åpen om helsen og snakket om den i møtet.",
  forhandsvisningSubtitle: "Referat fra dialogmøte",
  forhandsvisningContentLabel: "Forhåndsvis referat fra dialogmøte",
  preview: "Se forhåndsvisning",
  referatSaved: "Referatet er lagret",
};

export const valideringsTexts = {
  situasjonMissing: "Vennligst angi situasjon og muligheter",
  konklusjonMissing: "Vennligst angi konklusjon",
  arbeidstakersOppgaveMissing: "Vennligst angi arbeidstakerens oppgave",
  arbeidsgiversOppgaveMissing: "Vennligst angi arbeidsgiverens oppgave",
};

interface ReferatSkjemaTekster {
  situasjon: string;
  konklusjon: string;
  arbeidstakersOppgave: string;
  arbeidsgiversOppgave: string;
  behandlersOppgave?: string;
  veiledersOppgave: string;
}

export interface ReferatSkjemaValues extends ReferatSkjemaTekster {
  naermesteLeder: string;
  standardtekster: StandardTekst[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
  behandlerDeltatt?: boolean;
  behandlerMottarReferat?: boolean;
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

const toNewReferat = (
  dialogmote: DialogmoteDTO,
  values: Partial<ReferatSkjemaValues>,
  generateDocument: (
    values: Partial<ReferatSkjemaValues>
  ) => DocumentComponentDto[]
): NewDialogmoteReferatDTO => ({
  narmesteLederNavn: values.naermesteLeder ?? "",
  situasjon: values.situasjon ?? "",
  konklusjon: values.konklusjon ?? "",
  arbeidsgiverOppgave: values.arbeidsgiversOppgave ?? "",
  arbeidstakerOppgave: values.arbeidstakersOppgave ?? "",
  ...(dialogmote.behandler
    ? {
        behandlerOppgave: values.behandlersOppgave,
        behandlerDeltatt: values.behandlerDeltatt,
        behandlerMottarReferat: values.behandlerMottarReferat,
      }
    : {}),
  veilederOppgave: values.veiledersOppgave,
  document: generateDocument(values),
  andreDeltakere: values.andreDeltakere || [],
});

const Referat = ({ dialogmote, pageTitle }: ReferatProps): ReactElement => {
  const fnr = useValgtPersonident();
  const ferdigstillDialogmote = useFerdigstillDialogmote(fnr, dialogmote.uuid);
  const mellomlagreReferat = useMellomlagreReferat(fnr, dialogmote.uuid);
  const [uendretSidenMellomlagring, setUendretSidenMellomlagring] = useState<
    boolean | undefined
  >();

  const navbruker = useNavBrukerData();
  const [displayReferatPreview, setDisplayReferatPreview] = useState(false);

  const dateAndTimeForMeeting = tilDatoMedManedNavn(dialogmote.tid);
  const header = `${navbruker?.navn}, ${dateAndTimeForMeeting}, ${dialogmote.sted}`;

  const {
    harIkkeUtbedretFeil,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const { generateReferatDocument } = useForhandsvisReferat(dialogmote);

  const validate = (values: Partial<ReferatSkjemaValues>) => {
    const friteksterFeil = validerSkjemaTekster<ReferatSkjemaTekster>({
      situasjon: {
        value: values.situasjon || "",
        maxLength: MAX_LENGTH_SITUASJON,
        missingRequiredMessage: valideringsTexts.situasjonMissing,
      },
      konklusjon: {
        value: values.konklusjon || "",
        maxLength: MAX_LENGTH_KONKLUSJON,
        missingRequiredMessage: valideringsTexts.konklusjonMissing,
      },
      arbeidstakersOppgave: {
        value: values.arbeidstakersOppgave || "",
        maxLength: MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
        missingRequiredMessage: valideringsTexts.arbeidstakersOppgaveMissing,
      },
      arbeidsgiversOppgave: {
        value: values.arbeidsgiversOppgave || "",
        maxLength: MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
        missingRequiredMessage: valideringsTexts.arbeidsgiversOppgaveMissing,
      },
      ...(dialogmote.behandler
        ? {
            behandlersOppgave: {
              value: values.behandlersOppgave || "",
              maxLength: MAX_LENGTH_BEHANDLERS_OPPGAVE,
            },
          }
        : {}),
      veiledersOppgave: {
        value: values.veiledersOppgave || "",
        maxLength: MAX_LENGTH_VEILEDERS_OPPGAVE,
      },
    });

    const feilmeldinger = {
      ...validerReferatDeltakere(values),
      ...friteksterFeil,
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const submit = (values: ReferatSkjemaValues) => {
    ferdigstillDialogmote.mutate(
      toNewReferat(dialogmote, values, generateReferatDocument)
    );
  };

  const mellomlagre = (values: ReferatSkjemaValues) => {
    mellomlagreReferat.mutate(
      toNewReferat(dialogmote, values, generateReferatDocument),
      { onSuccess: () => setUendretSidenMellomlagring(true) }
    );
  };

  const initialValues = useInitialValuesReferat(dialogmote);

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
            <FormSpy
              subscription={{ values: true }}
              onChange={() => {
                if (uendretSidenMellomlagring) {
                  setUendretSidenMellomlagring(false);
                }
              }}
            />
            <ReferatTittel>{header}</ReferatTittel>
            <ReferatWarningAlert type="advarsel">
              {texts.digitalReferat}
            </ReferatWarningAlert>
            <Deltakere behandler={dialogmote.behandler} />
            <ReferatWarningAlert type="advarsel" form="inline">
              {texts.personvern}
            </ReferatWarningAlert>
            <ReferatFritekster dialogmote={dialogmote} />
            <StandardTekster />
            <FlexRow topPadding={PaddingSize.SM} bottomPadding={PaddingSize.MD}>
              <Knapp
                htmlType="button"
                onClick={() => setDisplayReferatPreview(true)}
              >
                {texts.preview}
              </Knapp>
            </FlexRow>
            {ferdigstillDialogmote.isError && (
              <SkjemaInnsendingFeil error={ferdigstillDialogmote.error} />
            )}
            {mellomlagreReferat.isError && (
              <SkjemaInnsendingFeil error={mellomlagreReferat.error} />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            {mellomlagreReferat.isSuccess && uendretSidenMellomlagring && (
              <AlertstripeFullbredde type="suksess">
                {texts.referatSaved}
              </AlertstripeFullbredde>
            )}
            <ReferatButtons
              pageTitle={pageTitle}
              onSaveClick={() => mellomlagre(values)}
              onSendClick={resetFeilUtbedret}
              showSaveSpinner={mellomlagreReferat.isLoading}
              showSendSpinner={ferdigstillDialogmote.isLoading}
            />
            <Forhandsvisning
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
