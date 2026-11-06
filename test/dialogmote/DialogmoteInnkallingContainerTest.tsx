import { screen } from "@testing-library/react";

import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { beforeEach, describe, expect, it } from "vitest";
import { navEnhet } from "./testData";
import { MalformProvider } from "@/context/malform/MalformContext";
import {
  getAbsoluteCalendarDaysBetween,
  daysFromToday,
} from "@/utils/datoUtils";
import DialogmoteInnkallingContainer from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingContainer";
import { renderWithRouter } from "../testRouterUtils";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { kontaktinformasjonMock } from "@/mocks/syfoperson/persondataMock";
import { KontaktinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { mockServer } from "../setup";
import { delay, http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;

const mockOppfolgingstilfellePerson = (
  oppfolgingstilfeller: OppfolgingstilfelleDTO[],
) => {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: fnr,
    oppfolgingstilfelleList: oppfolgingstilfeller,
    hasGjentakendeSykefravar: false,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
    () => oppfolgingstilfellePerson,
  );
};

const createOppfolgingstilfelle = (end: Date): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    arbeidstakerAtTilfelleEnd: true,
    end,
    start: daysFromToday(-10),
    antallSykedager:
      getAbsoluteCalendarDaysBetween(daysFromToday(-10), end) + 1,
    varighetUker: 1,
  };
};

const mockKontaktinfo = (kontaktinfo: KontaktinfoDTO) => {
  queryClient.setQueryData(brukerQueryKeys.kontaktinfo(fnr), () => kontaktinfo);
};

const renderDialogmoteInnkallingContainer = () =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MalformProvider>
          <DialogmoteInnkallingContainer />
        </MalformProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    "*",
  );

describe("DialogmoteInnkallingContainer", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    mockKontaktinfo({ ...kontaktinformasjonMock, skalHaVarsel: true });
  });

  it("viser skjema når det er mindre enn 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-15)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser skjema når det er 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-16)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser skjema med alert når det er mer enn 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-17)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(
      screen.getByText(
        "Bruker har ikke digital sykmelding. Arbeidsgiver vil derfor ikke få varsel på nav.no, men en kopi av innkallingen i Altinn. Vurder å varsle arbeidsgiver om møtet på annen måte i tillegg.",
      ),
    ).to.exist;

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });

  it("venter med å vise skjema til kontaktinformasjon er hentet", () => {
    queryClient.removeQueries({ queryKey: brukerQueryKeys.kontaktinfo(fnr) });
    mockServer.use(
      http.get(`*${SYFOPERSON_ROOT}/person/kontaktinformasjon`, async () => {
        await delay("infinite");
        return HttpResponse.json(kontaktinformasjonMock);
      }),
    );
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-15)),
    ]);

    renderDialogmoteInnkallingContainer();

    expect(screen.queryByRole("button", { name: "Send innkallingene" })).to.not
      .exist;
  });

  it("viser advarsel om papirpost sammen med skjema når innbygger ikke kan varsles digitalt", () => {
    mockKontaktinfo({ ...kontaktinformasjonMock, skalHaVarsel: false });
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-15)),
    ]);

    renderDialogmoteInnkallingContainer();

    expect(
      screen.getByRole("heading", {
        name: "Innbyggeren kan ikke varsles digitalt",
      }),
    ).to.exist;
    expect(screen.getByRole("button", { name: "Send innkallingene" })).to.exist;
  });

  it("don't show a no virksomhet alert in schema when innbygger has no oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([]);
    renderDialogmoteInnkallingContainer();

    expect(
      screen.queryByText(/Denne arbeidstakeren har ingen aktiv sykemelding,/),
    ).to.not.exist;
  });
});
