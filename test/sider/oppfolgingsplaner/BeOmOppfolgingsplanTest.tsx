import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../dialogmote/testData";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import BeOmOppfolgingsplan from "@/sider/oppfolgingsplan/oppfolgingsplaner/BeOmOppfolgingsplan";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { queryClientWithMockData } from "../../testQueryClient";
import {
  NewOppfolgingsplanForesporselDTO,
  oppfolgingsplanForesporselQueryKeys,
  OppfolgingsplanForesporselResponse,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanForesporselHooks";
import {
  ANNEN_LEDER_AKTIV,
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { mockServer } from "../../setup";
import { http, HttpResponse } from "msw";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import { clickButton } from "../../testUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { getExpectedForesporselDocument } from "./oppfolgingsplanTestdata";
import { generateUUID } from "@/utils/utils";
import { currentOppfolgingstilfelle } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import userEvent from "@testing-library/user-event";
import { virksomhetQueryKeys } from "@/data/virksomhet/virksomhetQueryHooks";
import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";

let queryClient: QueryClient;

const singleNarmesteLeder =
  LEDERE_DEFAULT as unknown as NarmesteLederRelasjonDTO[];
const multipleNarmesteLeder = [
  ...LEDERE_DEFAULT,
  ANNEN_LEDER_AKTIV,
] as unknown as NarmesteLederRelasjonDTO[];

const renderBeOmOppfolgingsplan = (
  narmesteledere: NarmesteLederRelasjonDTO[] = singleNarmesteLeder,
  tilfelle: OppfolgingstilfelleDTO = currentOppfolgingstilfelle
) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <BeOmOppfolgingsplan
          activeNarmesteLedere={narmesteledere}
          currentOppfolgingstilfelle={tilfelle}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const foresporselDocument = getExpectedForesporselDocument({
  narmesteLeder: LEDERE_DEFAULT[0].narmesteLederNavn,
  virksomhetNavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
});

const existingForesporsel: OppfolgingsplanForesporselResponse = {
  uuid: generateUUID(),
  createdAt: new Date(),
  arbeidstakerPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
  veilederident: VEILEDER_DEFAULT.ident,
  virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  narmestelederPersonident: NARMESTE_LEDER_DEFAULT.personident,
  document: foresporselDocument,
};

describe("BeOmOppfolgingsplan", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("Viser bekreftelse når bruker sender forespørsel om oppfølgingsplan", async () => {
    queryClient.setQueryData(
      oppfolgingsplanForesporselQueryKeys.foresporsel(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => []
    );
    renderBeOmOppfolgingsplan();
    mockServer.use(
      http.post(
        `*${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`,
        () => new HttpResponse(null, { status: 200 })
      )
    );

    await clickButton("Send forespørsel");

    expect(await screen.findByText("Forespørsel om oppfølgingsplan sendt")).to
      .exist;
    expect(screen.queryByText("Send forespørsel")).to.not.exist;
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
    renderBeOmOppfolgingsplan();
    expect(screen.getByRole("button", { name: "Send forespørsel" })).to.exist;
    const beOmOppfolgingsplanButton = screen.getByRole("button", {
      name: "Send forespørsel",
    });

    await userEvent.click(beOmOppfolgingsplanButton);
    expect(
      await screen.findByText(
        "Det skjedde en uventet feil. Vennligst prøv igjen senere"
      )
    ).to.exist;
  });
  it("Viser bekreftelse på at det er forespurt om oppfølgingsplan tidligere i oppfølgingstilfellet", async () => {
    queryClient.setQueryData(
      oppfolgingsplanForesporselQueryKeys.foresporsel(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [existingForesporsel]
    );
    const virksomhetResponse: EregOrganisasjonResponseDTO = {
      navn: {
        navnelinje1: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      },
    };
    queryClient.setQueryData(
      virksomhetQueryKeys.virksomhet(VIRKSOMHET_PONTYPANDY.virksomhetsnummer),
      () => virksomhetResponse
    );
    renderBeOmOppfolgingsplan();

    expect(
      screen.getByText(
        `Obs! Det ble bedt om oppfølgingsplan fra ${
          VIRKSOMHET_PONTYPANDY.virksomhetsnavn
        } ${tilLesbarDatoMedArUtenManedNavn(existingForesporsel.createdAt)}`
      )
    ).to.exist;
    expect(screen.getByText("Be om oppfølgingsplan")).to.exist;
    expect(screen.getByRole("button", { name: "Send forespørsel" })).to.exist;
  });
  it("Sender forespørsel om oppfølgingsplan med document", async () => {
    renderBeOmOppfolgingsplan();

    await clickButton("Send forespørsel");

    const expectedForesporselRequest: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      narmestelederPersonident:
        LEDERE_DEFAULT[0].narmesteLederPersonIdentNumber,
      document: getExpectedForesporselDocument({
        narmesteLeder: LEDERE_DEFAULT[0].narmesteLederNavn,
        virksomhetNavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      }),
    };

    await waitFor(() => {
      const foresporselMutation = queryClient.getMutationCache().getAll().pop();
      expect(foresporselMutation?.state.variables).to.deep.equal(
        expectedForesporselRequest
      );
    });
  });
  it("Viser navn på virksomhet og nærmeste leder når kun en nærmeste leder", () => {
    renderBeOmOppfolgingsplan();

    expect(screen.getByText("Virksomhet:")).to.exist;
    expect(screen.getByText("Nærmeste leder:")).to.exist;
    expect(screen.getByText(VIRKSOMHET_PONTYPANDY.virksomhetsnavn)).to.exist;
    expect(screen.getByText(LEDERE_DEFAULT[0].narmesteLederNavn)).to.exist;
  });

  it("Validerer valgt arbeidsgiver når flere nærmeste ledere", async () => {
    renderBeOmOppfolgingsplan(multipleNarmesteLeder);

    await clickButton("Send forespørsel");

    expect(await screen.findByText("Vennligst velg arbeidsgiver")).to.exist;
  });

  it("Viser navn på virksomhet og nærmeste leder når arbeidsgiver valgt", () => {
    renderBeOmOppfolgingsplan(multipleNarmesteLeder);

    expect(screen.queryByText("Virksomhet:")).to.not.exist;
    expect(screen.queryByText("Nærmeste leder:")).to.not.exist;

    const virksomhetRadiobutton = screen.getByText(
      VIRKSOMHET_PONTYPANDY.virksomhetsnavn
    );
    fireEvent.click(virksomhetRadiobutton);

    expect(screen.getByText("Virksomhet:")).to.exist;
    expect(screen.getByText("Nærmeste leder:")).to.exist;
  });

  it("Sender forespørsel om oppfølgingsplan med valgt arbeidsgiver", async () => {
    renderBeOmOppfolgingsplan(multipleNarmesteLeder);

    const virksomhetRadiobutton = screen.getByText(
      VIRKSOMHET_BRANNOGBIL.virksomhetsnavn
    );
    fireEvent.click(virksomhetRadiobutton);

    await clickButton("Send forespørsel");

    const expectedForesporselRequest: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      narmestelederPersonident:
        ANNEN_LEDER_AKTIV.narmesteLederPersonIdentNumber,
      document: getExpectedForesporselDocument({
        narmesteLeder: ANNEN_LEDER_AKTIV.narmesteLederNavn,
        virksomhetNavn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn,
      }),
    };

    await waitFor(() => {
      const foresporselMutation = queryClient.getMutationCache().getAll().pop();
      expect(foresporselMutation?.state.variables).to.deep.equal(
        expectedForesporselRequest
      );
    });
  });
});
