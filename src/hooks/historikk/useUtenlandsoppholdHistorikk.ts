import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useUtenlandsoppholdSoknanderQuery } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks.ts";
import {
  Behandling,
  Periode,
  Soknad,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { statusTexts } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { ikkeAktuellArsakTexts } from "@/sider/utenlandsopphold/ikkeAktuellTexts.ts";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils.ts";

function tilInnvilgedePerioderText(perioder: Periode[]): string {
  return perioder.length > 0
    ? `\n\nInnvilgede perioder: ${perioder
        .map((periode) =>
          tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom),
        )
        .join(", ")}`
    : "";
}

function toExpandableContent(behandling: Behandling): string {
  const vedtakText = `Behandlet som ${statusTexts[behandling.utfall].toLocaleLowerCase()}.`;

  switch (behandling.utfall) {
    case "INNVILGET":
      return `${vedtakText}${tilInnvilgedePerioderText(behandling.innvilgedePerioder)}`;
    case "DELVIS_INNVILGET":
      return `${vedtakText}${tilInnvilgedePerioderText(behandling.innvilgedePerioder)}\n\nBegrunnelse: ${behandling.begrunnelse}`;
    case "AVSLAG":
    case "HENLAGT":
      return `${vedtakText}\n\nBegrunnelse: ${behandling.begrunnelse}`;
    case "IKKE_AKTUELL":
      return `${vedtakText}\n\nGrunn: ${ikkeAktuellArsakTexts[behandling.ikkeAktuellArsak]}`;
  }
}

function createEventsFromSoknad(soknad: Soknad, person: BrukerinfoDTO) {
  const events: HistorikkEvent[] = [];
  if (soknad.innsendtTidspunkt) {
    events.push({
      tekst: `${person.navn} søkte om sykepenger under opphold utenfor EU/EØS`,
      tidspunkt: new Date(soknad.innsendtTidspunkt),
      kilde: "UTENLANDSOPPHOLD",
    });
  }
  const { behandling } = soknad;
  if (behandling) {
    events.push({
      tekst: `${behandling.behandletAv} behandlet søknad om sykepenger under opphold utenfor EU/EØS`,
      tidspunkt: new Date(behandling.behandletTidspunkt),
      kilde: "UTENLANDSOPPHOLD",
      expandableContent: toExpandableContent(behandling),
    });
  }
  return events;
}

export function useUtenlandsoppholdHistorikk(): HistorikkEvents {
  const { data, isLoading, isError } = useUtenlandsoppholdSoknanderQuery();
  const { brukerinfo: person } = useBrukerinfoQuery();

  const soknader = data?.soknader || [];
  const events = soknader
    .map((soknad) => createEventsFromSoknad(soknad, person))
    .flat();

  return {
    isLoading,
    isError,
    events,
  };
}
