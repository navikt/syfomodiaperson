import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../../dialogmote/testData";
import React, { createRef } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../../../testQueryClient";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMockResponse } from "@/mocks/syfobehandlendeenhet/behandlendeEnhetMock";
import userEvent from "@testing-library/user-event";
import TildelOppfolgingsenhetModal from "@/components/personkort/tildele/oppfolgingsenhet/TildelOppfolgingsenhetModal";
import { mockServer } from "../../../setup";
import { mockGetMuligeTildelinger } from "@/mocks/syfobehandlendeenhet/mockSyfobehandlendeenhet";
import { virksomhetQueryKeys } from "@/data/virksomhet/virksomhetQueryHooks";

let queryClient: QueryClient;

const renderTildelOppfolgingsenhetModal = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <TildelOppfolgingsenhetModal
            modalRef={createRef<HTMLDialogElement>()}
            setTildeltNotification={() => void 0}
          />
        </ValgtEnhetContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );

const stubTildelOppfolgingsenhet = () => {
  mockServer.use(mockGetMuligeTildelinger());
};

describe("TildelOppfolgingsenhetModal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => []
    );
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [LEDERE_DEFAULT[0]]
    );
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => behandlendeEnhetMockResponse
    );
    queryClient.setQueryData(
      virksomhetQueryKeys.virksomhet(undefined),
      () => undefined
    );
  });

  it("Skal vise modal", async () => {
    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    const modal = await screen.findByRole("dialog", { hidden: true });
    expect(await screen.findByText("Endre oppfølgingsenhet")).to.exist;

    expect(
      within(modal).getByRole("heading", {
        name: "Endre oppfølgingsenhet",
        hidden: true,
      })
    ).to.exist;
    expect(
      within(modal).getByText(
        "Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk."
      )
    ).to.exist;
  });

  it("Skal vise bekreftende informasjon om sykmeldt (uten virksomhet) når man har valgt enhet å tildele til", async () => {
    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    const modal = await screen.findByRole("dialog", { hidden: true });
    expect(await screen.findByText("Endre oppfølgingsenhet")).to.exist;

    expect(
      within(modal).getByRole("heading", {
        name: "Endre oppfølgingsenhet",
        hidden: true,
      })
    ).to.exist;

    const option = screen.getByRole("option", {
      name: "Nav Fredrikstad (0106)",
      hidden: true,
    });

    await userEvent.click(option);

    expect(
      screen.getByText(
        /Du tildeler nå Samuel Sam Jones \(19026900010\) uten virksomhet til Nav Fredrikstad \(0106\)./
      )
    ).to.exist;
  });

  it("Skal vise bekreftende informasjon om sykmeldt (med virksomhet) når man har valgt enhet å tildele til", async () => {
    queryClient.setQueryData(
      virksomhetQueryKeys.virksomhet(VIRKSOMHET_PONTYPANDY.virksomhetsnummer),
      () => ({
        navn: {
          navnelinje1: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
          redigertnavn: undefined,
        },
      })
    );

    stubTildelOppfolgingsenhet();
    renderTildelOppfolgingsenhetModal();

    const modal = await screen.findByRole("dialog", { hidden: true });
    expect(await screen.findByText("Endre oppfølgingsenhet")).to.exist;

    expect(
      within(modal).getByRole("heading", {
        name: "Endre oppfølgingsenhet",
        hidden: true,
      })
    ).to.exist;

    const option = screen.getByRole("option", {
      name: "Nav Fredrikstad (0106)",
      hidden: true,
    });

    await userEvent.click(option);

    expect(
      screen.getByText(
        /Du tildeler nå Samuel Sam Jones \(19026900010\) ved PONTYPANDY FIRE SERVICE til Nav Fredrikstad \(0106\)./
      )
    ).to.exist;
  });
});
