import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { expect } from "chai";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { queryClientWithMockData } from "../testQueryClient";
import { defaultMelding } from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { clickButton, getButton } from "../testUtils";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  personOppgaveBehandletBehandlerdialogUbesvartMelding,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import { expectedPaminnelseDocument } from "./testDataDocuments";

let queryClient: QueryClient;

const renderMeldingerISamtale = (meldinger: MeldingDTO[]) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MeldingerISamtale meldinger={meldinger} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const meldingTilBehandler = {
  ...defaultMelding,
  tidspunkt: new Date(),
};
const buttonText = "Send påminnelse til behandler";

describe("Melding til behandler påminnelse", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("render no paminnelse button when no meldinger", () => {
    renderMeldingerISamtale([]);

    expect(screen.queryByRole("button", { name: buttonText })).to.not.exist;
  });
  it("render no paminnelse button when no ubesvart melding-oppgave", () => {
    renderMeldingerISamtale([meldingTilBehandler]);

    expect(screen.queryByRole("button", { name: buttonText })).to.not.exist;
  });
  it("render no paminnelse button for melding til behandler med behandlet ubesvart melding-oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
          referanseUuid: meldingTilBehandler.uuid,
        },
      ]
    );
    renderMeldingerISamtale([meldingTilBehandler]);

    expect(screen.queryByRole("button", { name: buttonText })).to.not.exist;
  });
  it("render paminnelse button for melding til behandler med ubehandlet ubesvart melding-oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
          referanseUuid: meldingTilBehandler.uuid,
        },
      ]
    );

    renderMeldingerISamtale([meldingTilBehandler]);

    expect(getButton(buttonText)).to.exist;
  });
  it("click button sends paminnelse with expected values", () => {
    const expectedPaminnelseDTO: PaminnelseDTO = {
      document: expectedPaminnelseDocument(meldingTilBehandler),
    };

    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
          referanseUuid: meldingTilBehandler.uuid,
        },
      ]
    );
    renderMeldingerISamtale([meldingTilBehandler]);

    clickButton(buttonText);

    const paminnelseMutation = queryClient.getMutationCache().getAll()[0];

    expect(paminnelseMutation.options.variables).to.deep.equal(
      expectedPaminnelseDTO
    );
  });
});