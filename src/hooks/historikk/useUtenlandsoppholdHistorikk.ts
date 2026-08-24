import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useSoknaderQuery } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks.ts";
import { Soknad } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { statusTexts } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils.ts";

function toExpandableContent(vedtak: Soknad["vedtak"]): string {
  if (!vedtak) return "";

  const vedtakText = `Vedtaket ble ${statusTexts[vedtak.utfall].toLocaleLowerCase()}.`;
  const periodeText =
    vedtak.innvilgedePerioder.length > 0
      ? `\n\nInnvilgede perioder: ${vedtak.innvilgedePerioder.map((periode) => tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)).join(", ")}`
      : "";
  const begrunnelseText = vedtak.begrunnelse
    ? `\n\nBegrunnelse: ${vedtak.begrunnelse}`
    : "";
  return `${vedtakText}${periodeText}${begrunnelseText}`;
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
  if (soknad.vedtak) {
    events.push({
      tekst: `${soknad.vedtak.fattetAv} fattet vedtak om sykepenger under opphold utenfor EU/EØS`,
      tidspunkt: new Date(soknad.vedtak.fattetTidspunkt),
      kilde: "UTENLANDSOPPHOLD",
      expandableContent: toExpandableContent(soknad.vedtak),
    });
  }
  return events;
}

export function useUtenlandsoppholdHistorikk(): HistorikkEvents {
  const { data, isLoading, isError } = useSoknaderQuery();
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
