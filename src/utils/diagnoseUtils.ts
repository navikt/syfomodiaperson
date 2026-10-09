import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO.ts";
import {
  SykmeldingDiagnose,
  sykmeldingerSortertNyestTilEldstPeriode,
  SykmeldingOldFormat,
} from "@/data/sykmelding/types/SykmeldingOldFormat.ts";
import {
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils.ts";

export function getDiagnoseFromLatestSykmelding(
  sykmeldinger: SykmeldingOldFormat[],
): SykmeldingDiagnose | undefined {
  const latestSykmelding =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger)[0];
  return latestSykmelding?.diagnose?.hoveddiagnose;
}

export function getDiagnoseFromTilfelle(
  tilfelle: OppfolgingstilfelleDTO,
  sykmeldinger: SykmeldingOldFormat[],
) {
  const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(newAndUsedSykmeldinger, tilfelle);

  return getDiagnoseFromLatestSykmelding(sykmeldingerIOppfolgingstilfellet);
}
