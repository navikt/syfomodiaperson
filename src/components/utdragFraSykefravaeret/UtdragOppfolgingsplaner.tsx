import React from "react";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  restdatoTilLesbarDato,
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
} from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import {
  OppfolgingsplanV2DTO,
  partitionOppfolgingsplanerByActiveTilfelle,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Alert, Heading, Link, Loader } from "@navikt/ds-react";
import { useOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/useOppfolgingsplaner";

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

function AktivPlan({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 mb-4 [&_a]:capitalize">{children}</div>;
}

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

function LPSPlaner({ lpsPlaner }: LpsPlanerProps) {
  return (
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
}

interface AktivPlanV2LenkeProps {
  aktivPlan: OppfolgingsplanV2DTO;
}

function AktivPlanV2Lenke({ aktivPlan }: AktivPlanV2LenkeProps) {
  const { virksomhetsnavn } = useVirksomhetQuery(aktivPlan.virksomhetsnummer);
  const deltMedNav = restdatoTilLesbarDato(aktivPlan.deltMedNavTidspunkt);
  return (
    <AktivPlan>
      <a
        className="lenke"
        href={`${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/${aktivPlan.uuid}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {virksomhetsnavn && virksomhetsnavn.length > 0
          ? virksomhetsnavn.toLowerCase()
          : aktivPlan.virksomhetsnummer}
      </a>
      <span className="ml-8">{`delt med Nav ${deltMedNav}`}</span>
    </AktivPlan>
  );
}

interface AktivePlanerV2Props {
  aktivePlaner: OppfolgingsplanV2DTO[];
}

function AktivePlanerV2({ aktivePlaner }: AktivePlanerV2Props) {
  return (
    <>
      {aktivePlaner.map((plan, index) => (
        <AktivPlanV2Lenke key={index} aktivPlan={plan} />
      ))}
    </>
  );
}

interface OppfolgingsplanerProps {
  aktivePlaner: OppfolgingsplanDTO[];
  aktivePlanerV2: OppfolgingsplanV2DTO[];
  lpsPlaner: OppfolgingsplanLPS[];
}

function Oppfolgingsplaner({
  aktivePlaner,
  aktivePlanerV2,
  lpsPlaner,
}: OppfolgingsplanerProps) {
  const anyActivePlaner =
    aktivePlaner.length > 0 ||
    aktivePlanerV2.length > 0 ||
    lpsPlaner.length > 0;

  return anyActivePlaner ? (
    <div>
      <AktivePlaner aktivePlaner={aktivePlaner} />
      <AktivePlanerV2 aktivePlaner={aktivePlanerV2} />
      <LPSPlaner lpsPlaner={lpsPlaner} />
    </div>
  ) : (
    <p>{texts.ingenPlanerDelt}</p>
  );
}

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export default function UtdragOppfolgingsplaner({
  selectedOppfolgingstilfelle,
}: Props) {
  const { aktivePlaner, allePlanerV2, lpsPlaner, isLoading, isError } =
    useOppfolgingsplaner();

  const activeLpsPlaner = lpsPlanerWithActiveTilfelle(
    lpsPlaner,
    selectedOppfolgingstilfelle
  );
  const [aktiveOppfolgingsplanerV2] = selectedOppfolgingstilfelle
    ? partitionOppfolgingsplanerByActiveTilfelle(
        allePlanerV2,
        selectedOppfolgingstilfelle
      )
    : [[]];

  return (
    <div>
      <Heading size="small" level="3">
        {texts.header}
      </Heading>
      {isLoading ? (
        <Loader size="large" title={texts.pending} />
      ) : isError ? (
        <Alert size="small" inline variant="error">
          {texts.error}
        </Alert>
      ) : (
        <Oppfolgingsplaner
          aktivePlaner={aktivePlaner}
          aktivePlanerV2={aktiveOppfolgingsplanerV2}
          lpsPlaner={activeLpsPlaner}
        />
      )}
    </div>
  );
}
