import {
  DialogmotedeltakerBehandlerDTO,
  DialogmotedeltakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
  VarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { FlexColumn, FlexRow } from "@/components/Layout";
import {
  ErrorFilled,
  MinusCircleFilled,
  SuccessFilled,
  WarningFilled,
} from "@navikt/ds-icons";
import navFarger from "nav-frontend-core";
import React, { ReactElement } from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { Element, Normaltekst } from "nav-frontend-typografi";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useLedere } from "@/hooks/useLedere";

const texts = {
  naermesteLeder: "Nærmeste leder:",
  arbeidstaker: "Arbeidstakeren:",
  behandler: "Behandleren:",
  harAapnetInnkalling: "åpnet innkallingen",
  harIkkeAapnetInnkalling: "har ikke åpnet innkallingen",
  harAapnetEndring: "åpnet endringen",
  harIkkeAapnetEndring: "har ikke åpnet endringen",
  svarMottatt: "Svar mottatt",
  svarIkkeMottatt: "Har ikke gitt svar",
  oppdateringMottatt: "Oppdatering mottatt",
  begrunnelseHeader: "Begrunnelse",
  begrunnelseMottattHeader: "Begrunnelse mottatt",
  harIkkeBegrunnelse: "Ingen detaljer er tilgjengelig.",
  svarKommer: "kommer",
  svarNyttTidSted: "ønsker å endre tidspunkt eller sted",
  svarKommerIkke: "ønsker å avlyse",
};

const getHarAapnetTekst = (
  varselType: MotedeltakerVarselType | undefined,
  lestDato: string | undefined
): string => {
  if (varselType === MotedeltakerVarselType.INNKALT) {
    return lestDato
      ? `${texts.harAapnetInnkalling} ${tilLesbarDatoMedArUtenManedNavn(
          lestDato
        )}`
      : texts.harIkkeAapnetInnkalling;
  } else if (varselType === MotedeltakerVarselType.NYTT_TID_STED) {
    return lestDato
      ? `${texts.harAapnetEndring} ${tilLesbarDatoMedArUtenManedNavn(lestDato)}`
      : texts.harIkkeAapnetEndring;
  } else {
    return "";
  }
};

const getSvarTekst = (svar: VarselSvarDTO, antallSvar = 1) => {
  const mottattPrefiks =
    antallSvar > 1 ? texts.oppdateringMottatt : texts.svarMottatt;
  const mottattTekst = `${mottattPrefiks} ${tilLesbarDatoMedArUtenManedNavn(
    svar.createdAt
  )}`;
  switch (svar.svarType) {
    case SvarType.KOMMER:
      return `${texts.svarKommer} - ${mottattTekst}`;
    case SvarType.NYTT_TID_STED:
      return `${texts.svarNyttTidSted} - ${mottattTekst}`;
    case SvarType.KOMMER_IKKE:
      return `${texts.svarKommerIkke} - ${mottattTekst}`;
  }
};

interface DeltakerSvarIconProps {
  svar: VarselSvarDTO | undefined;
}

const DeltakerSvarIcon = ({ svar }: DeltakerSvarIconProps): ReactElement => {
  switch (svar?.svarType) {
    case SvarType.KOMMER:
      return (
        <SuccessFilled
          color={navFarger.navGronn}
          aria-label="suksess-ikon"
          role="img"
          focusable="false"
        />
      );
    case SvarType.NYTT_TID_STED:
      return (
        <WarningFilled
          color={navFarger.navOransje}
          aria-label="advarsel-ikon"
          role="img"
          focusable="false"
        />
      );
    case SvarType.KOMMER_IKKE:
      return (
        <ErrorFilled
          color={navFarger.navRod}
          aria-label="feil-ikon"
          role="img"
          focusable="false"
        />
      );
    default:
      return (
        <MinusCircleFilled
          color={navFarger.navGra40}
          aria-label="minus-sirkel-ikon"
          role="img"
          focusable="false"
        />
      );
  }
};

interface SvarDetaljerTekstProps {
  header: string;
  tekst: string;
}

const SvarDetaljerTekst = ({ header, tekst }: SvarDetaljerTekstProps) => (
  <DetaljerTekst>
    <Element>{header}</Element>
    <Normaltekst>{tekst}</Normaltekst>
  </DetaljerTekst>
);

interface DeltakerBehandlerSvarDetaljerProps {
  svarList: VarselSvarDTO[];
}

const DeltakerBehandlerSvarDetaljer = ({
  svarList,
}: DeltakerBehandlerSvarDetaljerProps) => {
  const begrunnelseHeaderTekst = (svar: VarselSvarDTO) =>
    `${texts.begrunnelseMottattHeader} ${tilLesbarDatoMedArUtenManedNavn(
      svar.createdAt
    )}`;

  if (svarList.length === 0) {
    return <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>;
  }

  if (svarList.length === 1) {
    const svar = svarList[0];
    return svar.tekst ? (
      <SvarDetaljerTekst
        header={begrunnelseHeaderTekst(svar)}
        tekst={svar.tekst}
      />
    ) : (
      <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>
    );
  }

  return (
    <>
      {svarList
        .filter((svar) => svar.tekst)
        .map((svar, idx) => (
          <SvarDetaljerTekst
            key={idx}
            header={begrunnelseHeaderTekst(svar)}
            tekst={svar.tekst ?? ""}
          />
        ))}
    </>
  );
};

interface DeltakerBehandlerSvarPanelProps {
  behandler: DialogmotedeltakerBehandlerDTO;
}

const DeltakerBehandlerSvarPanel = ({
  behandler,
}: DeltakerBehandlerSvarPanelProps) => {
  const svarList = behandler.varselList[0]?.svar || [];
  const latestSvar: VarselSvarDTO | undefined = svarList[0];
  const svarTekst = !latestSvar
    ? texts.svarIkkeMottatt.toLowerCase()
    : getSvarTekst(latestSvar, svarList.length);

  return (
    <EkspanderbartSvarPanel
      icon={<DeltakerSvarIcon svar={latestSvar} />}
      deltaker={texts.behandler}
      tittel={`${behandler.behandlerNavn}, ${svarTekst}`}
    >
      <DeltakerBehandlerSvarDetaljer svarList={svarList} />
    </EkspanderbartSvarPanel>
  );
};

const DeltakerLabel = styled(Element)`
  margin-left: 0.5em;
`;

const TittelTekst = styled(Normaltekst)`
  margin-left: 0.5em;
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  margin-bottom: 1em;
  border: 1px solid ${navFarger.navGra60};
`;

interface EkspanderbartSvarPanelProps {
  deltaker: string;
  tittel: string;
  icon: ReactElement;
  children: ReactElement;
}

const EkspanderbartSvarPanel = ({
  icon,
  deltaker,
  tittel,
  children,
}: EkspanderbartSvarPanelProps) => (
  <StyledEkspanderbartpanel
    renderContentWhenClosed
    tittel={
      <FlexRow>
        {icon}
        <DeltakerLabel>{deltaker}</DeltakerLabel>
        <TittelTekst>{tittel}</TittelTekst>
      </FlexRow>
    }
  >
    {children}
  </StyledEkspanderbartpanel>
);

const DetaljerTekst = styled.div`
  margin-top: 0.5em;
`;

interface DeltakerSvarPanelProps {
  deltakerLabel: string;
  deltakerNavn: string;
  varsel: DialogmotedeltakerVarselDTO | undefined;
}

const DeltakerSvarPanel = ({
  varsel,
  deltakerLabel,
  deltakerNavn,
}: DeltakerSvarPanelProps) => {
  const harAapnetTekst = getHarAapnetTekst(
    varsel?.varselType,
    varsel?.lestDato
  );

  return (
    <EkspanderbartSvarPanel
      // TODO: Kan bruke <DeltakerSvarIcon svar={<svar fra varsel>}> når vi støtter svar fra AT/NL
      icon={
        varsel?.lestDato ? (
          <SuccessFilled
            color={navFarger.navGronn}
            aria-label="suksess-ikon"
            role="img"
            focusable="false"
          />
        ) : (
          <MinusCircleFilled
            color={navFarger.navGra40}
            aria-label="minus-sirkel-ikon"
            role="img"
            focusable="false"
          />
        )
      }
      deltaker={deltakerLabel}
      tittel={`${deltakerNavn}, ${harAapnetTekst}`}
    >
      <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>
    </EkspanderbartSvarPanel>
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
        varsel={dialogmote.arbeidsgiver.varselList[0]}
      />
      <DeltakerSvarPanel
        deltakerLabel={texts.arbeidstaker}
        deltakerNavn={bruker.navn}
        varsel={dialogmote.arbeidstaker.varselList[0]}
      />
      {dialogmote.behandler && (
        <DeltakerBehandlerSvarPanel behandler={dialogmote.behandler} />
      )}
    </StyledColumn>
  );
};
