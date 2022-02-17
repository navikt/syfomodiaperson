import React from "react";
import styled from "styled-components";
import Lenke from "nav-frontend-lenker";
import { useAppSelector } from "@/hooks/hooks";
import { OppfolgingstilfelleperioderMapState } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { H3NoMargins } from "../Layout";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { useOppfolgingsplanerLPSQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

const texts = {
  header: "Oppfølgingsplan",
  ingenPlanerDelt: "Ingen planer er delt med NAV",
};

interface AktiveDialogerProps {
  aktiveDialoger: OppfolgingsplanDTO[];
}

const AktivDialog = styled.div`
  margin-top: 0.5em;
  margin-bottom: 1em;

  a {
    text-transform: capitalize;
  }
`;

const Gyldighetsperiode = styled.span`
  margin-left: 2em;
`;

interface AktivDialogLenkeProps {
  aktivDialog: OppfolgingsplanDTO;
}

const AktivDialogLenke = ({ aktivDialog }: AktivDialogLenkeProps) => {
  const { data: virksomhet } = useVirksomhetQuery(
    aktivDialog.virksomhet.virksomhetsnummer
  );
  const virksomhetsNavn = virksomhet?.navn;
  return (
    <span>
      <Lenke
        className="lenke"
        href={`/sykefravaer/oppfoelgingsplaner/${aktivDialog.id}`}
      >
        {virksomhetsNavn && virksomhetsNavn.length > 0
          ? virksomhetsNavn.toLowerCase()
          : aktivDialog.virksomhet.virksomhetsnummer}
      </Lenke>
    </span>
  );
};

const AktiveDialoger = ({ aktiveDialoger }: AktiveDialogerProps) => (
  <>
    {aktiveDialoger.map((dialog, index) => (
      <AktivDialog key={index}>
        <AktivDialogLenke aktivDialog={dialog} />
        <Gyldighetsperiode>
          {tilLesbarPeriodeMedArstall(
            dialog.godkjentPlan.gyldighetstidspunkt.fom,
            dialog.godkjentPlan.gyldighetstidspunkt.tom
          )}
        </Gyldighetsperiode>
      </AktivDialog>
    ))}
  </>
);

interface LpsPlanLenkeProps {
  lpsPlan: OppfolgingsplanLPS;
}

const LpsPlanLenke = ({ lpsPlan }: LpsPlanLenkeProps) => {
  const { data: virksomhet } = useVirksomhetQuery(lpsPlan.virksomhetsnummer);
  const virksomhetsNavn = virksomhet?.navn || lpsPlan.virksomhetsnummer;
  return (
    <a
      className="lenke"
      href={`${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/lps/${lpsPlan.uuid}`}
      download="oppfølgingsplan"
    >
      {`${virksomhetsNavn} (pdf)`}
    </a>
  );
};

interface LpsPlanerProps {
  lpsPlaner: OppfolgingsplanLPS[];
}

const LpsPlaner = ({ lpsPlaner }: LpsPlanerProps) => (
  <>
    {lpsPlaner.map((plan, index) => {
      const lesbarDato = tilLesbarDatoMedArstall(plan.opprettet);
      return (
        <div key={index}>
          <LpsPlanLenke lpsPlan={plan} />
          <span>{` innsendt ${lesbarDato} (LPS)`}</span>
        </div>
      );
    })}
  </>
);

interface OppfolgingsplanerProps {
  aktiveDialoger: OppfolgingsplanDTO[];
  lpsPlaner: OppfolgingsplanLPS[];
}

const Oppfolgingsplaner = ({
  aktiveDialoger,
  lpsPlaner,
}: OppfolgingsplanerProps) => {
  return (
    <div>
      <AktiveDialoger aktiveDialoger={aktiveDialoger} />
      <LpsPlaner lpsPlaner={lpsPlaner} />
    </div>
  );
};

interface UtdragOppfolgingsplanerProps {
  aktiveDialoger: OppfolgingsplanDTO[];
}

const UtdragOppfolgingsplanerWrapper = styled.div`
  margin-bottom: 2.5em;

  h3 {
    margin-bottom: 0;
  }
`;

export const UtdragOppfolgingsplaner = ({
  aktiveDialoger,
}: UtdragOppfolgingsplanerProps) => {
  const { data: oppfolgingsplanerLPS } = useOppfolgingsplanerLPSQuery();

  const oppfolgingstilfelleperioderMapState: OppfolgingstilfelleperioderMapState = useAppSelector(
    (state) => state.oppfolgingstilfelleperioder
  );

  const activeLpsPlaner = lpsPlanerWithActiveTilfelle(
    oppfolgingsplanerLPS,
    oppfolgingstilfelleperioderMapState
  );

  const anyActivePlaner =
    aktiveDialoger?.length > 0 || activeLpsPlaner.length > 0;

  return (
    <UtdragOppfolgingsplanerWrapper>
      <H3NoMargins>{texts.header}</H3NoMargins>
      {anyActivePlaner ? (
        <Oppfolgingsplaner
          aktiveDialoger={aktiveDialoger}
          lpsPlaner={activeLpsPlaner}
        />
      ) : (
        <p>{texts.ingenPlanerDelt}</p>
      )}
    </UtdragOppfolgingsplanerWrapper>
  );
};
