import React, { useEffect, useState } from "react";
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
import {
  DialogmoteInnkallingDTO,
  TidStedDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { FlexRow } from "../../Layout";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import {
  IInnkallingDocument,
  useInnkallingDocument,
} from "@/hooks/dialogmote/document/useInnkallingDocument";
import { useOpprettInnkallingDialogmote } from "@/data/dialogmote/useOpprettInnkallingDialogmote";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import DialogmoteInnkallingBehandler from "@/components/dialogmote/innkalling/DialogmoteInnkallingBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useTrackOnClick } from "@/data/logging/loggingHooks";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

interface DialogmoteInnkallingSkjemaTekster {
  fritekstArbeidsgiver: string;
  fritekstArbeidstaker: string;
  fritekstBehandler?: string;
}

export interface DialogmoteInnkallingSkjemaValues
  extends DialogmoteInnkallingSkjemaTekster,
    TidStedSkjemaValues {
  arbeidsgiver: string;
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
  tidStedDto: TidStedDto,
  fnr: string,
  innkallingDocument: IInnkallingDocument,
  valgtBehandler: BehandlerDTO | undefined
): DialogmoteInnkallingDTO => {
  const innkalling: DialogmoteInnkallingDTO = {
    arbeidsgiver: {
      virksomhetsnummer: values.arbeidsgiver,
      fritekstInnkalling: values.fritekstArbeidsgiver,
      innkalling: innkallingDocument.getInnkallingDocumentArbeidsgiver(
        values,
        valgtBehandler
      ),
    },
    arbeidstaker: {
      personIdent: fnr,
      fritekstInnkalling: values.fritekstArbeidstaker,
      innkalling: innkallingDocument.getInnkallingDocumentArbeidstaker(
        values,
        valgtBehandler
      ),
    },
    tidSted: tidStedDto,
  };

  if (valgtBehandler) {
    innkalling.behandler = {
      personIdent: valgtBehandler.fnr,
      behandlerRef: valgtBehandler.behandlerRef,
      behandlerNavn: behandlerNavn(valgtBehandler),
      behandlerKontor: valgtBehandler.kontor ?? "",
      fritekstInnkalling: values.fritekstBehandler,
      innkalling: innkallingDocument.getInnkallingDocumentBehandler(values),
    };
  }

  return innkalling;
};

const DialogmoteInnkallingSkjema = ({
  pageTitle,
}: DialogmoteInnkallingSkjemaProps) => {
  const initialValues: Partial<DialogmoteInnkallingSkjemaValues> = {};
  const fnr = useValgtPersonident();
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();

  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const { isFeatureEnabled } = useFeatureToggles(
    selectedBehandler?.behandlerRef
  );
  const [visAlternativBehandlertekst, setVisAlternativBehandlertekst] =
    useState<boolean>(false);

  const innkallingDocument = useInnkallingDocument(visAlternativBehandlertekst);

  useEffect(() => {
    if (
      selectedBehandler?.behandlerRef &&
      isFeatureEnabled(ToggleNames.behandlertekst)
    ) {
      setVisAlternativBehandlertekst(true);
    } else {
      setVisAlternativBehandlertekst(false);
    }
  }, [selectedBehandler, isFeatureEnabled]);

  const { toTidStedDto } = useSkjemaValuesToDto();
  const opprettInnkalling = useOpprettInnkallingDialogmote(fnr);

  const validate = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DialogmoteInnkallingSkjemaFeil => {
    const friteksterFeil =
      validerSkjemaTekster<DialogmoteInnkallingSkjemaTekster>({
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
      });

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

  if (opprettInnkalling.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const submit = (values: DialogmoteInnkallingSkjemaValues) => {
    trackOnClick(texts.behandler, selectedBehandler?.type || "ingen behandler");
    const dialogmoteInnkalling = toInnkalling(
      values,
      toTidStedDto(values),
      fnr,
      innkallingDocument,
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
            <DialogmoteInnkallingBehandler
              setSelectedBehandler={setSelectedBehandler}
            />
            <DialogmoteTidOgSted />
            <DialogmoteInnkallingTekster
              selectedBehandler={selectedBehandler}
              visAlternativTekst={visAlternativBehandlertekst}
            />
            {opprettInnkalling.isError && (
              <SkjemaInnsendingFeil error={opprettInnkalling.error} />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
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
