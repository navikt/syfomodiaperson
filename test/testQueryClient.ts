import { QueryClient } from "@tanstack/react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import {
  AKTIV_BRUKER_DEFAULT,
  ANNEN_VEILEDER,
  ANNEN_VEILEDER_IDENT,
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { mockUnleashResponse } from "@/mocks/unleashMocks";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import {
  behandlerByBehandlerRefMock,
  behandlereDialogmeldingMock,
  behandlerRefDoktorLegesen,
} from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { behandlerdialogMock } from "@/mocks/isbehandlerdialog/behandlerdialogMock";
import {
  brukerinfoMock,
  diskresjonskodeMock,
  isEgenansattMock,
  maksdatoMock,
} from "@/mocks/syfoperson/persondataMock";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import { personinfoQueryKeys } from "@/data/personinfo/personAdresseQueryHooks";
import { personAdresseMock } from "@/mocks/syfoperson/personAdresseMock";
import { maksdatoQueryKeys } from "@/data/maksdato/useMaksdatoQuery";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { senOppfolgingKandidatMock } from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { navEnhet } from "./dialogmote/testData";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { kartleggingssporsmalQueryKeys } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";

export const testQueryClient = (): QueryClient => {
  return new QueryClient();
};

export const queryClientWithAktivBruker = (): QueryClient => {
  const queryClient = testQueryClient();
  queryClient.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );

  return queryClient;
};

export const setQueryDataWithPersonkortdata = (
  existingClient: QueryClient
): void => {
  existingClient.setQueryData(
    brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => brukerinfoMock
  );
  existingClient.setQueryData(
    diskresjonskodeQueryKeys.diskresjonskode(ARBEIDSTAKER_DEFAULT.personIdent),
    () => diskresjonskodeMock
  );
  existingClient.setQueryData(
    egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
    () => isEgenansattMock
  );
  existingClient.setQueryData(
    personinfoQueryKeys.personadresse(ARBEIDSTAKER_DEFAULT.personIdent),
    () => personAdresseMock
  );
  existingClient.setQueryData(
    maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
    () => maksdatoMock
  );
};

export const queryClientWithMockData = (): QueryClient => {
  const queryClient = queryClientWithAktivBruker();
  setQueryDataWithPersonkortdata(queryClient);

  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfo,
    () => VEILEDER_DEFAULT
  );
  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
    () => VEILEDER_DEFAULT
  );
  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfoByIdent(ANNEN_VEILEDER_IDENT),
    () => ANNEN_VEILEDER
  );
  queryClient.setQueryData(
    behandlendeEnhetQueryKeys.behandlendeEnhet(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => BEHANDLENDE_ENHET_DEFAULT
  );
  queryClient.setQueryData(
    tilgangQueryKeys.tilgang(ARBEIDSTAKER_DEFAULT.personIdent),
    () => tilgangBrukerMock
  );
  queryClient.setQueryData(
    ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => LEDERE_DEFAULT
  );
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonMock
  );
  queryClient.setQueryData(
    unleashQueryKeys.toggles(
      BEHANDLENDE_ENHET_DEFAULT.enhetId,
      VEILEDER_IDENT_DEFAULT
    ),
    () => mockUnleashResponse
  );

  queryClient.setQueryData(
    behandlereQueryKeys.behandlere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => behandlereDialogmeldingMock
  );

  queryClient.setQueryData(
    behandlerdialogQueryKeys.behandlerdialog(ARBEIDSTAKER_DEFAULT.personIdent),
    () => behandlerdialogMock
  );

  queryClient.setQueryData(
    behandlereQueryKeys.behandlerRef(behandlerRefDoktorLegesen),
    () => behandlerByBehandlerRefMock
  );

  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmeldingerMock.slice(0, 2)
  );

  queryClient.setQueryData(
    senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => senOppfolgingKandidatMock
  );
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => null
  );
  return queryClient;
};

export function setEmptyQueryData(existingClient: QueryClient): void {
  existingClient.setQueryData(
    oppfolgingsplanQueryKeys.oppfolgingsplaner(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  existingClient.setQueryData(
    oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  existingClient.setQueryData(
    personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  existingClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  existingClient.setQueryData(
    aktivitetskravQueryKeys.aktivitetskrav(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  existingClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  existingClient.setQueryData(
    senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  existingClient.setQueryData(
    vedtakQueryKeys.vedtak(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  existingClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  existingClient.setQueryData(
    unleashQueryKeys.toggles(navEnhet.id, ""),
    () => mockUnleashResponse
  );
  existingClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => null
  );
}
