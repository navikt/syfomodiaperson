import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Periode,
  PeriodeDTO,
  Soknad,
  SoknadDTO,
  SoknaderRequestDTO,
  SoknaderResponseDTO,
  Vedtak,
  VedtakDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";

export const utenlandsoppholdQueryKeys = {
  soknader: (personident: string) => ["utenlandsoppholdSoknader", personident],
};

/**
 * Henter søknader på § 8-9 utenlandsopphold for en person.
 * Endepunktet er en POST på personident, men brukes som en GET.
 */
export const useSoknaderQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`;
  const requestDTO: SoknaderRequestDTO = { personident };
  const fetchSoknader = () => post<SoknaderResponseDTO>(path, requestDTO);

  return useQuery({
    queryKey: utenlandsoppholdQueryKeys.soknader(personident),
    queryFn: fetchSoknader,
    enabled: !!personident,
    select: (data) => ({
      soknader: data.soknader.map(parseSoknad),
    }),
  });
};

const parsePeriode = (periode: PeriodeDTO): Periode => ({
  ...periode,
  fom: new Date(periode.fom),
  tom: new Date(periode.tom),
});

const parseVedtak = (vedtak: VedtakDTO): Vedtak => ({
  ...vedtak,
  innvilgetePerioder: vedtak.innvilgetePerioder.map(parsePeriode),
  fattetTidspunkt: new Date(vedtak.fattetTidspunkt),
});

const parseSoknad = (soknad: SoknadDTO): Soknad => ({
  ...soknad,
  innsendtTidspunkt: new Date(soknad.innsendtTidspunkt),
  soktePerioder: soknad.soktePerioder.map(parsePeriode),
  vedtak: soknad.vedtak ? parseVedtak(soknad.vedtak) : null,
});
