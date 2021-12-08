import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useLedere } from "@/hooks/useLedere";
import { FlexColumn, FlexRow } from "@/components/Layout";
import { MinusCircleFilled } from "@navikt/ds-icons";
import navFarger from "nav-frontend-core";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { Element, Normaltekst } from "nav-frontend-typografi";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

const texts = {
  naermesteLeder: "Nærmeste leder:",
  arbeidstaker: "Arbeidstakeren:",
  harAapnetInnkalling: "åpnet innkallingen",
  harIkkeAapnetInnkalling: "har ikke åpnet innkallingen",
  harAapnetEndring: "åpnet endringen",
  harIkkeAapnetEndring: "har ikke åpnet endringen",
  harIkkeSvar: "Har ikke gitt svar",
  harIkkeSvarDetaljer: "Ingen detaljer er tilgjengelig.",
};

const getHarAapnetTekst = (
  latestVarsel?: Pick<
    DialogmotedeltakerArbeidsgiverVarselDTO,
    "varselType" | "lestDato"
  >
): string => {
  const aapnetDatoTekst = latestVarsel?.lestDato
    ? `${tilLesbarDatoMedArUtenManedNavn(latestVarsel.lestDato)}`
    : "";

  if (latestVarsel?.varselType === MotedeltakerVarselType.INNKALT) {
    return latestVarsel?.lestDato
      ? `${texts.harAapnetInnkalling} ${aapnetDatoTekst} - ${texts.harIkkeSvar}`
      : texts.harIkkeAapnetInnkalling;
  } else if (
    latestVarsel?.varselType === MotedeltakerVarselType.NYTT_TID_STED
  ) {
    return latestVarsel?.lestDato
      ? `${texts.harAapnetEndring} ${aapnetDatoTekst} - ${texts.harIkkeSvar}`
      : texts.harIkkeAapnetEndring;
  } else {
    return "";
  }
};

const DeltakerSvarIcon = () => {
  // TODO: Avhengig av svar
  return (
    <MinusCircleFilled
      color={navFarger.navGra40}
      aria-label="Minus sirkel"
      role="img"
      focusable="false"
    />
  );
};

const DeltakerLabel = styled(Element)`
  margin-left: 0.5em;
`;

const TittelTekst = styled(Normaltekst)`
  margin-left: 0.5em;
`;

const DetaljerTekst = styled.div`
  margin-top: 1em;
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  margin-bottom: 1em;
  border: 1px solid ${navFarger.navGra60};
`;

interface DeltakerSvarPanelProps {
  deltakerLabel: string;
  deltakerNavn: string;
  varsler: (
    | DialogmotedeltakerArbeidstakerVarselDTO
    | DialogmotedeltakerArbeidsgiverVarselDTO
  )[];
}

const DeltakerSvarPanel = ({
  varsler,
  deltakerLabel,
  deltakerNavn,
}: DeltakerSvarPanelProps) => {
  const harAapnetTekst = getHarAapnetTekst(varsler[0]);

  return (
    <StyledEkspanderbartpanel
      tittel={
        <FlexRow>
          <DeltakerSvarIcon />
          <DeltakerLabel>{deltakerLabel}</DeltakerLabel>
          <TittelTekst>{`${deltakerNavn}, ${harAapnetTekst}`}</TittelTekst>
        </FlexRow>
      }
    >
      <DetaljerTekst>{texts.harIkkeSvarDetaljer}</DetaljerTekst>
    </StyledEkspanderbartpanel>
  );
};

const StyledColumn = styled(FlexColumn)`
  width: 100%;
`;

interface DeltakereSvarInfoProps {
  dialogmote: DialogmoteDTO;
}

export const DeltakereSvarInfo = ({ dialogmote }: DeltakereSvarInfoProps) => {
  const bruker = useNavBrukerData();
  const { getCurrentNarmesteLeder } = useLedere();
  const narmesteLederNavn = getCurrentNarmesteLeder(
    dialogmote.arbeidsgiver.virksomhetsnummer
  )?.narmesteLederNavn;

  return (
    <StyledColumn>
      <DeltakerSvarPanel
        deltakerLabel={texts.naermesteLeder}
        deltakerNavn={narmesteLederNavn ?? ""}
        varsler={dialogmote.arbeidsgiver.varselList}
      />
      <DeltakerSvarPanel
        deltakerLabel={texts.arbeidstaker}
        deltakerNavn={bruker.navn}
        varsler={dialogmote.arbeidstaker.varselList}
      />
    </StyledColumn>
  );
};
