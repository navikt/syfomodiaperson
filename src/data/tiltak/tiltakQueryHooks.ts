import { useQuery } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import {
  TiltakDTO,
  TiltakRequestDTO,
  TiltakResponseDTO,
} from "@/data/tiltak/tiltakTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/utils";

export const tiltakQueryKeys = {
  aktiveTiltak(personident: string) {
    return ["aktiveTiltak", personident];
  },
};

/**
 * Fjerner tiltak med lik tiltakstype, slik at hver tiltakstype bare vises én gang.
 */
export function uniqueTiltakByTiltakstype(tiltak: TiltakDTO[]): TiltakDTO[] {
  const seenTiltakstyper = new Set<string>();
  return tiltak.filter(({ tiltakstypeNavn }) => {
    if (seenTiltakstyper.has(tiltakstypeNavn)) {
      return false;
    }
    seenTiltakstyper.add(tiltakstypeNavn);
    return true;
  });
}

/**
 * Henter aktive arbeidsmarkedstiltak for valgt person, uten duplikater.
 */
export function useAktiveTiltakQuery() {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/tiltak/query`;
  const requestDTO: TiltakRequestDTO = { personident };

  function fetchAktiveTiltak() {
    return post<TiltakResponseDTO>(path, requestDTO);
  }

  return useQuery({
    queryKey: tiltakQueryKeys.aktiveTiltak(personident),
    queryFn: fetchAktiveTiltak,
    enabled: !!personident,
    staleTime: minutesToMillis(60 * 12),
    select: (data) => uniqueTiltakByTiltakstype(data.tiltak),
  });
}
