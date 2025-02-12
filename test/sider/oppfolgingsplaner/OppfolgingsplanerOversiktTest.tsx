import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../../testQueryClient";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../dialogmote/testData";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ANNEN_LEDER_AKTIV,
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
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
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { generateUUID } from "@/utils/utils";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { generateOppfolgingstilfelle } from "../../testDataUtils";
import { daysFromToday } from "../../testUtils";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";

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
          oppfolgingsplanerLPS={oppfolgingsplanerLPS}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("OppfolgingsplanerOversikt", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("Oppfølgingsplaner visning", () => {
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
      expect(within(oppfolgingsplanerLPS[0]).getByText("Marker som behandlet"))
        .to.exist;
      expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
      expect(within(oppfolgingsplanerLPS[1]).getByText("Marker som behandlet"))
        .to.exist;
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
      expect(
        within(oppfolgingsplanerLPS[0]).queryByText("Marker som behandlet")
      ).to.be.null;
      expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
      expect(
        within(oppfolgingsplanerLPS[1]).queryByText("Marker som behandlet")
      ).to.be.null;
    });
  });

  describe("Be om oppfølgingsplan", () => {
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

      expect(screen.queryByText("Be om oppfølgingsplan")).to.not.exist;
      expect(screen.queryByRole("button", { name: "Send forespørsel" })).to.not
        .exist;
    });
    it("Viser be om oppfølgingsplan funksjonalitet om sykmeldt har en arbeidsgiver", () => {
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(screen.getByText("Be om oppfølgingsplan")).to.exist;
      expect(screen.getByRole("button", { name: "Send forespørsel" })).to.exist;
    });
    it("Viser be om oppfølgingsplan funksjonalitet om sykmeldt har flere arbeidsgivere", () => {
      queryClient.setQueryData(
        ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [...LEDERE_DEFAULT, ANNEN_LEDER_AKTIV]
      );
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(screen.getByText("Be om oppfølgingsplan")).to.exist;
      expect(screen.getByRole("button", { name: "Send forespørsel" })).to.exist;
    });
    it("Viser be om oppfølgingsplan funksjonalitet om det ikke finnes en aktiv oppfølgingsplan", () => {
      renderOppfolgingsplanerOversikt([]);

      expect(screen.getByText("Det er ingen aktive oppfølgingsplaner")).to
        .exist;
      expect(screen.getByText("Be om oppfølgingsplan")).to.exist;
      expect(screen.getByText("Nærmeste leder vil motta et varsel på e-post."))
        .to.exist;
      expect(
        screen.queryByRole("button", {
          name: "Dette får nærmeste leder tilsendt i e-posten fra Nav",
        })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send forespørsel" })).to.exist;
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
