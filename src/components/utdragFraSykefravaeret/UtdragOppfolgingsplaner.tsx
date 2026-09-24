import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  restdatoTilLesbarDato,
  tilLesbarDatoMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
} from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import {
  OppfolgingsplanV2DTO,
  partitionOppfolgingsplanerByActiveTilfelle,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Alert, BodyShort, Box, Heading, Link, Loader } from "@navikt/ds-react";
import { useOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/useOppfolgingsplaner";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  header: "Oppfølgingsplan",
  ingenPlanerDelt: "Ingen planer er delt med Nav",
  pending: "Henter oppfølgingsplaner...",
  error:
    "Noe gikk galt ved henting av oppfølgingsplaner. Vennligst prøv igjen senere.",
  virksomhet: "Virksomhet:",
  apne: "Åpne planen",
};

interface OppfolgingsplanLenkeProps {
  virksomhetsnummer: string;
  href: string;
}

function OppfolgingsplanLenke({
  virksomhetsnummer,
  href,
}: OppfolgingsplanLenkeProps) {
  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);
  return (
    <BodyShort size="small" className="col-span-2 grid grid-cols-subgrid">
      <span>
        {texts.virksomhet} {virksomhetsnavn || virksomhetsnummer}.
      </span>
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {texts.apne}
      </Link>
    </BodyShort>
  );
}

interface LpsPlanerProps {
  lpsPlaner: OppfolgingsplanLPS[];
}

function LPSPlaner({ lpsPlaner }: LpsPlanerProps) {
  return (
    <>
      {lpsPlaner.map((plan, index) => {
        const lesbarDato = tilLesbarDatoMedArstall(plan.opprettet);
        return (
          <Box key={index} className="col-span-2 grid grid-cols-subgrid">
            <OppfolgingsplanLenke
              virksomhetsnummer={plan.virksomhetsnummer}
              href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${plan.uuid}`}
            />
            <BodyShort size="small" className="col-span-2">
              {`Innsendt ${lesbarDato}.`}
            </BodyShort>
          </Box>
        );
      })}
    </>
  );
}

interface AktivPlanV2Props {
  aktivPlan: OppfolgingsplanV2DTO;
}

function AktivPlanV2({ aktivPlan }: AktivPlanV2Props) {
  const deltMedNav = restdatoTilLesbarDato(aktivPlan.deltMedNavTidspunkt);
  return (
    <div className="col-span-2 grid grid-cols-subgrid">
      <OppfolgingsplanLenke
        virksomhetsnummer={aktivPlan.virksomhetsnummer}
        href={`${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/${aktivPlan.uuid}`}
      />
      <BodyShort size="small" className="col-span-2">
        {`Delt med Nav ${deltMedNav}.`}
      </BodyShort>
    </div>
  );
}

interface AktivePlanerV2Props {
  aktivePlaner: OppfolgingsplanV2DTO[];
}

function AktivePlanerV2({ aktivePlaner }: AktivePlanerV2Props) {
  return (
    <>
      {aktivePlaner.map((plan, index) => (
        <AktivPlanV2 key={index} aktivPlan={plan} />
      ))}
    </>
  );
}

interface OppfolgingsplanerProps {
  planerV2: OppfolgingsplanV2DTO[];
  lpsPlaner: OppfolgingsplanLPS[];
}

function Oppfolgingsplaner({ planerV2, lpsPlaner }: OppfolgingsplanerProps) {
  const anyActivePlaner = planerV2.length > 0 || lpsPlaner.length > 0;

  return anyActivePlaner ? (
    <Box className="grid grid-cols-[max-content_max-content] gap-x-4 gap-y-4">
      <AktivePlanerV2 aktivePlaner={planerV2} />
      <LPSPlaner lpsPlaner={lpsPlaner} />
    </Box>
  ) : (
    <BodyShort size="small">{texts.ingenPlanerDelt}</BodyShort>
  );
}

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export default function UtdragOppfolgingsplaner({
  selectedOppfolgingstilfelle,
}: Props) {
  const { allePlanerV2, lpsPlaner, isLoading, isError } =
    useOppfolgingsplaner();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const isLatestTilfelle =
    selectedOppfolgingstilfelle !== undefined &&
    latestOppfolgingstilfelle !== undefined &&
    new Date(selectedOppfolgingstilfelle.start).getTime() ===
      new Date(latestOppfolgingstilfelle.start).getTime() &&
    new Date(selectedOppfolgingstilfelle.end).getTime() ===
      new Date(latestOppfolgingstilfelle.end).getTime();

  const lpsPlanerByOppfolgingstilfelle = lpsPlanerWithActiveTilfelle(
    lpsPlaner,
    selectedOppfolgingstilfelle,
    isLatestTilfelle,
  );
  const [planerV2ByOppfolgingstilfelle] = selectedOppfolgingstilfelle
    ? partitionOppfolgingsplanerByActiveTilfelle(
        allePlanerV2,
        selectedOppfolgingstilfelle,
        isLatestTilfelle,
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
          planerV2={planerV2ByOppfolgingstilfelle}
          lpsPlaner={lpsPlanerByOppfolgingstilfelle}
        />
      )}
    </div>
  );
}
