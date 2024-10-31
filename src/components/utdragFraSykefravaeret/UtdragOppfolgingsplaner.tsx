import React from "react";
import styled from "styled-components";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Alert, Heading, Link, Loader } from "@navikt/ds-react";

const texts = {
  header: "Oppfølgingsplan",
  ingenPlanerDelt: "Ingen planer er delt med Nav",
  pending: "Henter oppfølgingsplaner...",
  error:
    "Noe gikk galt ved henting av oppfølgingsplaner. Vennligst prøv igjen senere.",
};

interface AktivePlanerProps {
  aktivePlaner: OppfolgingsplanDTO[];
}

const AktivPlan = styled.div`
  margin-top: 0.5em;
  margin-bottom: 1em;

  a {
    text-transform: capitalize;
  }
`;

interface AktivPlanLenkeProps {
  aktivPlan: OppfolgingsplanDTO;
}

const AktivPlanLenke = ({ aktivPlan }: AktivPlanLenkeProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(
    aktivPlan.virksomhet.virksomhetsnummer
  );
  return (
    <span>
      <Link href={`/sykefravaer/oppfoelgingsplaner/${aktivPlan.id}`}>
        {virksomhetsnavn && virksomhetsnavn.length > 0
          ? virksomhetsnavn.toLowerCase()
          : aktivPlan.virksomhet.virksomhetsnummer}
      </Link>
    </span>
  );
};

const AktivePlaner = ({ aktivePlaner }: AktivePlanerProps) => (
  <>
    {aktivePlaner.map((plan, index) => (
      <AktivPlan key={index}>
        <AktivPlanLenke aktivPlan={plan} />
        <span className="ml-8">
          {tilLesbarPeriodeMedArstall(
            plan.godkjentPlan.gyldighetstidspunkt.fom,
            plan.godkjentPlan.gyldighetstidspunkt.tom
          )}
        </span>
      </AktivPlan>
    ))}
  </>
);

interface LpsPlanLenkeProps {
  lpsPlan: OppfolgingsplanLPS;
}

const LpsPlanLenke = ({ lpsPlan }: LpsPlanLenkeProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(lpsPlan.virksomhetsnummer);
  const virksomhetsNavn = virksomhetsnavn || lpsPlan.virksomhetsnummer;
  return (
    <a
      className="lenke"
      href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${lpsPlan.uuid}`}
      target="_blank"
      rel="noopener noreferrer"
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
  aktivePlaner: OppfolgingsplanDTO[];
  lpsPlaner: OppfolgingsplanLPS[];
}

const Oppfolgingsplaner = ({
  aktivePlaner,
  lpsPlaner,
}: OppfolgingsplanerProps) => {
  const anyActivePlaner = aktivePlaner.length > 0 || lpsPlaner.length > 0;

  return anyActivePlaner ? (
    <div>
      <AktivePlaner aktivePlaner={aktivePlaner} />
      <LpsPlaner lpsPlaner={lpsPlaner} />
    </div>
  ) : (
    <p>{texts.ingenPlanerDelt}</p>
  );
};

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const UtdragOppfolgingsplaner = ({
  selectedOppfolgingstilfelle,
}: Props) => {
  const {
    aktivePlaner,
    isPending: henterOppfolgingsplaner,
    isError: henterOppfolgingsplanerFeilet,
  } = useOppfolgingsplanerQuery();
  const {
    data: oppfolgingsplanerLPS,
    isPending: henterOppfolgingsplanerLPS,
    isError: henterOppfolgingsplanerLPSFeilet,
  } = useOppfolgingsplanerLPSQuery();

  const activeLpsPlaner = lpsPlanerWithActiveTilfelle(
    oppfolgingsplanerLPS,
    selectedOppfolgingstilfelle
  );
  const showLoader = henterOppfolgingsplaner && henterOppfolgingsplanerLPS;
  const showError =
    henterOppfolgingsplanerFeilet && henterOppfolgingsplanerLPSFeilet;

  return (
    <div>
      <Heading size="small" level="3">
        {texts.header}
      </Heading>
      {showLoader ? (
        <Loader size="large" title={texts.pending} />
      ) : showError ? (
        <Alert size="small" inline variant="error">
          {texts.error}
        </Alert>
      ) : (
        <Oppfolgingsplaner
          aktivePlaner={aktivePlaner}
          lpsPlaner={activeLpsPlaner}
        />
      )}
    </div>
  );
};
