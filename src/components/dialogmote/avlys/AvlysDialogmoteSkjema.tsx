import Panel from "nav-frontend-paneler";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { FlexRow } from "../../Layout";
import { Form } from "react-final-form";
import DialogmoteInfo from "./DialogmoteInfo";
import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { validerBegrunnelser } from "@/utils/valideringUtils";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { useForhandsvisAvlysning } from "@/hooks/dialogmote/useForhandsvisAvlysning";
import { Forhandsvisning } from "../Forhandsvisning";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useAvlysDialogmote } from "@/data/dialogmote/useAvlysDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";

export const MAX_LENGTH_AVLYS_BEGRUNNELSE = 200;

export const texts = {
  begrunnelseArbeidstakerLabel: "Begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverLabel: "Begrunnelse til nærmeste leder",
  begrunnelseBehandlerLabel: "Begrunnelse til behandler",
  send: "Send avlysning",
  avbryt: "Avbryt",
  alert:
    "Hvis årsaken til avlysning er at arbeidstakeren ikke møtte opp, bør du vurdere om sykepengene skal stanses.",
  forhandsvisningTitle: "Avlysning av dialogmøte",
  forhandsvisningArbeidstakerSubtitle: "(brev til arbeidstakeren)",
  forhandsvisningArbeidsgiverSubtitle: "(brev til nærmeste leder)",
  forhandsvisningBehandlerSubtitle: "(brev til behandler)",
  forhandsvisningArbeidstakerContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerContentlabel:
    "Forhåndsvis avlysning av dialogmøte behandler",
};

interface AvlysDialogmoteSkjemaProps {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

export interface AvlysDialogmoteSkjemaValues {
  begrunnelseArbeidstaker: string;
  begrunnelseArbeidsgiver: string;
  begrunnelseBehandler?: string;
}

const AvlysPanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(TrackedHovedknapp)`
  margin-right: 0.5rem;
`;

const AvlysningAlertStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 4em;
`;

const AvlysDialogmoteSkjema = ({
  dialogmote,
  pageTitle,
}: AvlysDialogmoteSkjemaProps): ReactElement => {
  const fnr = useValgtPersonident();
  const avlysDialogmote = useAvlysDialogmote(fnr, dialogmote.uuid);
  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const [
    displayAvlysningArbeidstakerPreview,
    setDisplayAvlysningArbeidstakerPreview,
  ] = useState(false);
  const [
    displayAvlysningArbeidsgiverPreview,
    setDisplayAvlysningArbeidsgiverPreview,
  ] = useState(false);
  const [
    displayAvlysningBehandlerPreview,
    setDisplayAvlysningBehandlerPreview,
  ] = useState(false);
  const {
    generateAvlysningArbeidstakerDocument,
    generateAvlysningArbeidsgiverDocument,
    generateAvlysningBehandlerDocument,
  } = useForhandsvisAvlysning(dialogmote.tid);

  const validate = (
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): Partial<AvlysDialogmoteSkjemaValues> => {
    const begrunnelserFeil = validerBegrunnelser(
      values,
      MAX_LENGTH_AVLYS_BEGRUNNELSE,
      !!dialogmote.behandler
    );
    updateFeilUtbedret(begrunnelserFeil);

    return begrunnelserFeil;
  };

  const submit = (values: AvlysDialogmoteSkjemaValues) => {
    const avlysDto: AvlysDialogmoteDTO = {
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        avlysning: generateAvlysningArbeidstakerDocument(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        avlysning: generateAvlysningArbeidsgiverDocument(values),
      },
    };

    if (dialogmote.behandler) {
      avlysDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        avlysning: generateAvlysningBehandlerDocument(values),
      };
    }

    avlysDialogmote.mutate(avlysDto);
  };

  if (avlysDialogmote.isSuccess) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  return (
    <AvlysPanel>
      <Form initialValues={{}} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors, values }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInfo dialogmote={dialogmote} />
            <FritekstSeksjon
              fieldName="begrunnelseArbeidstaker"
              label={texts.begrunnelseArbeidstakerLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidstakerPreview(true)
              }
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <Forhandsvisning
              title={texts.forhandsvisningTitle}
              subtitle={texts.forhandsvisningArbeidstakerSubtitle}
              contentLabel={texts.forhandsvisningArbeidstakerContentlabel}
              isOpen={displayAvlysningArbeidstakerPreview}
              handleClose={() => setDisplayAvlysningArbeidstakerPreview(false)}
              getDocumentComponents={() =>
                generateAvlysningArbeidstakerDocument(values)
              }
            />
            <FritekstSeksjon
              fieldName="begrunnelseArbeidsgiver"
              label={texts.begrunnelseArbeidsgiverLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidsgiverPreview(true)
              }
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <Forhandsvisning
              title={texts.forhandsvisningTitle}
              subtitle={texts.forhandsvisningArbeidsgiverSubtitle}
              contentLabel={texts.forhandsvisningArbeidsgiverContentlabel}
              isOpen={displayAvlysningArbeidsgiverPreview}
              handleClose={() => setDisplayAvlysningArbeidsgiverPreview(false)}
              getDocumentComponents={() =>
                generateAvlysningArbeidsgiverDocument(values)
              }
            />
            {dialogmote.behandler && (
              <>
                <FritekstSeksjon
                  fieldName="begrunnelseBehandler"
                  label={texts.begrunnelseBehandlerLabel}
                  handlePreviewClick={() =>
                    setDisplayAvlysningBehandlerPreview(true)
                  }
                  maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
                />
                <Forhandsvisning
                  title={texts.forhandsvisningTitle}
                  subtitle={texts.forhandsvisningBehandlerSubtitle}
                  contentLabel={texts.forhandsvisningBehandlerContentlabel}
                  isOpen={displayAvlysningBehandlerPreview}
                  handleClose={() => setDisplayAvlysningBehandlerPreview(false)}
                  getDocumentComponents={() =>
                    generateAvlysningBehandlerDocument(values)
                  }
                />
              </>
            )}
            {avlysDialogmote.isError && (
              <SkjemaInnsendingFeil error={avlysDialogmote.error} />
            )}
            <AvlysningAlertStripe type="advarsel">
              {texts.alert}
            </AvlysningAlertStripe>
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                data-cy="sendAvlysningKnapp"
                context={pageTitle}
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={avlysDialogmote.isLoading}
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
    </AvlysPanel>
  );
};

export default AvlysDialogmoteSkjema;
