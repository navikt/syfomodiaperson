import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  queryClientWithAktivBruker,
  queryClientWithMockData,
} from "../../testQueryClient";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../dialogmote/testData";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import dayjs from "dayjs";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import OppfolgingsplanerOversikt from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanerOversikt";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import {
  restdatoTilLesbarDato,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import { generateUUID } from "@/utils/utils";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { generateOppfolgingstilfelle } from "../../testDataUtils";
import { clickButton, daysFromToday } from "../../testUtils";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import userEvent from "@testing-library/user-event";
import {
  oppfolgingsplanForesporselQueryKeys,
  OppfolgingsplanForesporselResponse,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { mockServer } from "../../setup";
import { http, HttpResponse } from "msw";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";

let queryClient: QueryClient;

const renderOppfolgingsplanerOversikt = (
  oppfolgingsplanerLPS: OppfolgingsplanLPS[]
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <OppfolgingsplanerOversikt
          aktivePlaner={[]}
          inaktivePlaner={[]}
          fnr={ARBEIDSTAKER_DEFAULT.personIdent}
          oppfolgingsplanerLPS={oppfolgingsplanerLPS}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("Oppfølgingsplaner visning", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
  });

  it("Sorterer ubehandlede oppfølgingsplan-LPSer etter opprettet dato", () => {
    const olderOppfolgingsplan = createOppfolgingsplanLps(90, false);
    const newerOppfolgingsplan = createOppfolgingsplanLps(10, false);

    renderOppfolgingsplanerOversikt([
      olderOppfolgingsplan,
      newerOppfolgingsplan,
    ]);

    const olderDate = restdatoTilLesbarDato(olderOppfolgingsplan.opprettet);
    const newerDate = restdatoTilLesbarDato(newerOppfolgingsplan.opprettet);

    const oppfolgingsplanerLPS = screen.getAllByTestId("oppfolgingsplan-lps");

    expect(oppfolgingsplanerLPS.length).to.equal(2);
    expect(oppfolgingsplanerLPS[0].textContent).to.contain(newerDate);
    expect(within(oppfolgingsplanerLPS[0]).getByText("Marker som behandlet")).to
      .exist;
    expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
    expect(within(oppfolgingsplanerLPS[1]).getByText("Marker som behandlet")).to
      .exist;
  });

  it("Sorterer behandlede oppfølgingsplan-LPSer etter opprettet dato", () => {
    const olderOppfolgingsplan = createOppfolgingsplanLps(90, true);
    const newerOppfolgingsplan = createOppfolgingsplanLps(10, true);

    renderOppfolgingsplanerOversikt([
      olderOppfolgingsplan,
      newerOppfolgingsplan,
    ]);

    const olderDate = restdatoTilLesbarDato(olderOppfolgingsplan.opprettet);
    const newerDate = restdatoTilLesbarDato(newerOppfolgingsplan.opprettet);

    const oppfolgingsplanerLPS = screen.getAllByTestId("oppfolgingsplan-lps");

    expect(oppfolgingsplanerLPS.length).to.equal(2);
    expect(oppfolgingsplanerLPS[0].textContent).to.contain(newerDate);
    expect(within(oppfolgingsplanerLPS[0]).queryByText("Marker som behandlet"))
      .to.be.null;
    expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
    expect(within(oppfolgingsplanerLPS[1]).queryByText("Marker som behandlet"))
      .to.be.null;
  });

  describe("Be om oppfølgingsplan", () => {
    beforeEach(() => {
      queryClient = queryClientWithMockData();
    });

    const existingForesporsel: OppfolgingsplanForesporselResponse = {
      uuid: generateUUID(),
      createdAt: new Date(),
      arbeidstakerPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
      veilederident: VEILEDER_DEFAULT.ident,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      narmestelederPersonident: NARMESTE_LEDER_DEFAULT.personident,
    };

    it("Viser ikke be om oppfølgingsplan funksjonalitet om sykmeldt ikke har aktivt oppfølgingstilfelle", () => {
      queryClient.setQueryData(
        oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => ({
          personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
          oppfolgingstilfelleList: [
            generateOppfolgingstilfelle(daysFromToday(-30), daysFromToday(-20)),
          ],
        })
      );
      renderOppfolgingsplanerOversikt([]);

      expect(screen.queryByText("Be om oppfølgingsplan fra arbeidsgiver")).to
        .not.exist;
      expect(screen.queryByRole("button", { name: "Be om oppfølgingsplan" })).to
        .not.exist;
    });
    it("Viser ikke be om oppfølgingsplan funksjonalitet om sykmeldt har flere arbeidsgivere", () => {
      queryClient.setQueryData(
        ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
        () => LEDERE_DEFAULT.concat(LEDERE_DEFAULT)
      );
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(screen.queryByText("Be om oppfølgingsplan fra arbeidsgiver")).to
        .not.exist;
      expect(screen.queryByRole("button", { name: "Be om oppfølgingsplan" })).to
        .not.exist;
    });
    it("Viser be om oppfølgingsplan funksjonalitet om det ikke finnes en aktiv oppfølgingsplan", () => {
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(screen.getByText("Be om oppfølgingsplan fra arbeidsgiver")).to
        .exist;
      expect(screen.getByRole("button", { name: "Be om oppfølgingsplan" })).to
        .exist;
    });
    it("Viser bekreftelse når bruker sender forespørsel om oppfølgingsplan", async () => {
      queryClient.setQueryData(
        oppfolgingsplanForesporselQueryKeys.foresporsel(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );
      renderOppfolgingsplanerOversikt([]);
      mockServer.use(
        http.post(
          `*${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`,
          () => new HttpResponse(null, { status: 200 })
        )
      );

      await clickButton("Be om oppfølgingsplan");

      await waitFor(() => {
        const oppfolgingspolanForesporselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        expect(
          oppfolgingspolanForesporselMutation.state.variables
        ).to.deep.equal({
          arbeidstakerPersonident: "19026900010",
          virksomhetsnummer: "110110110",
          narmestelederPersonident: "02690001009",
          document: [],
        });
      });
      await waitFor(() => {
        expect(screen.getByText("Forespørsel om oppfølgingsplan sendt")).to
          .exist;
      });
    });
    it("Viser feilmelding når forespørsel om oppfølgingsplan feiler", async () => {
      mockServer.use(
        http.post(
          `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`,
          () => {
            HttpResponse.json(
              { error: "Internal server error" },
              { status: 500 }
            );
          }
        )
      );
      renderOppfolgingsplanerOversikt([]);
      expect(screen.getByRole("button", { name: "Be om oppfølgingsplan" })).to
        .exist;
      const beOmOppfolgingsplanButton = screen.getByRole("button", {
        name: "Be om oppfølgingsplan",
      });

      await userEvent.click(beOmOppfolgingsplanButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Det skjedde en uventet feil. Vennligst prøv igjen senere"
          )
        ).to.exist;
      });
    });
    it("Viser bekreftelse på at det er forespurt om oppfølgingsplan tidligere i oppfølgingstilfellet", async () => {
      queryClient.setQueryData(
        oppfolgingsplanForesporselQueryKeys.foresporsel(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [existingForesporsel]
      );
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(
        screen.getByText(
          `Obs! Det ble bedt om oppfølgingsplan fra denne arbeidsgiveren ${tilLesbarDatoMedArUtenManedNavn(
            existingForesporsel.createdAt
          )}`
        )
      ).to.exist;
      expect(screen.getByText("Be om oppfølgingsplan fra arbeidsgiver")).to
        .exist;

      expect(screen.getByRole("button", { name: "Be om oppfølgingsplan" })).to
        .exist;
    });
  });
});

const createOppfolgingsplanLps = (
  daysSinceOpprettet: number,
  behandlet: boolean
): OppfolgingsplanLPS => {
  const oppfolgingsplanLPS = {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: dayjs().subtract(daysSinceOpprettet, "days").toJSON(),
    sistEndret: new Date().toDateString(),
  };

  const existingPersonOppgaver =
    queryClient.getQueryData<PersonOppgave[]>(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent)
    ) || [];
  queryClient.setQueryData(
    personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
    () => [
      ...existingPersonOppgaver,
      createOppfolgingsplanLpsPersonoppgave(oppfolgingsplanLPS.uuid, behandlet),
    ]
  );

  return oppfolgingsplanLPS;
};

const createOppfolgingsplanLpsPersonoppgave = (
  referanseUuid: string,
  behandlet: boolean
): PersonOppgave => {
  return {
    uuid: generateUUID(),
    referanseUuid: referanseUuid,
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: PersonOppgaveType.OPPFOLGINGSPLANLPS,
    behandletTidspunkt: behandlet
      ? dayjs().subtract(10, "days").toDate()
      : null,
    behandletVeilederIdent: behandlet ? "Veilederident" : null,
    opprettet: new Date(),
    duplikatReferanseUuid: null,
  };
};
