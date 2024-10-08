import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { getWeeksBetween } from "@/utils/datoUtils";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { QueryClient } from "@tanstack/react-query";

export function createOppfolgingstilfelleFromSykmelding(
  sykmelding?: any[]
): OppfolgingstilfelleDTO[] {
  return sykmelding
    ? [
        {
          ...oppfolgingstilfellePersonMock.oppfolgingstilfelleList[0],
          start: sykmelding[0].sykmeldingsperioder[0].fom,
          end: sykmelding[0].sykmeldingsperioder[0].tom,
          varighetUker: getWeeksBetween(
            sykmelding[0].sykmeldingsperioder[0].fom,
            sykmelding[0].sykmeldingsperioder[0].tom
          ),
        },
      ]
    : [];
}

export function createOppfolgingstilfellePersonDTO(
  fom: Date,
  tom: Date
): OppfolgingstilfellePersonDTO {
  return {
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    oppfolgingstilfelleList: [
      {
        ...oppfolgingstilfellePersonMock.oppfolgingstilfelleList[0],
        start: fom,
        end: tom,
        varighetUker: getWeeksBetween(fom, tom),
      },
    ],
  };
}

export function setSykmeldingDataFromOppfolgingstilfelle(
  sykmeldinger: any[],
  oppfolgingstilfelle: OppfolgingstilfelleDTO[],
  queryClient: QueryClient
) {
  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmeldinger
  );

  const oppfolgingstilfellePersonDTO: OppfolgingstilfellePersonDTO = {
    ...oppfolgingstilfellePersonMock,
    oppfolgingstilfelleList: oppfolgingstilfelle,
  };

  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonDTO
  );
}
