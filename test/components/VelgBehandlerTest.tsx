import { fireEvent, render, screen } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import React, { useState } from "react";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { FormProvider, useForm } from "react-hook-form";
import { navEnhet } from "../dialogmote/testData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { Button } from "@navikt/ds-react";
import { changeTextInput, clickButton } from "../testUtils";
import {
  behandlereDialogmeldingMock,
  behandlerRefLegoLasLegesen,
  behandlerSokDialogmeldingMock,
} from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import userEvent from "@testing-library/user-event";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

let queryClient: QueryClient;
const mockBehandler = behandlereDialogmeldingMock[0];

const renderVelgBehandler = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VelgBehandlerWrapper />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

const submitText = "Submit";
const searchBehandlerOptionText = "Søk etter behandler";

describe("VelgBehandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser radiobuttons med behandlervalg", async () => {
    renderVelgBehandler();

    expect(screen.getByRole("group", { name: "Velg behandler" })).to.exist;
    expect(screen.getByRole("radio", { name: /Fastlege/ })).to.exist;
    expect(screen.getByRole("radio", { name: "Søk etter behandler" })).to.exist;
    expect(screen.queryByRole("searchbox")).to.not.exist;
  });

  it("Viser behandlersøk ved klikk på radiobutton 'Søk etter behandler'", () => {
    renderVelgBehandler();

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);

    expect(screen.getByRole("searchbox")).to.exist;
  });

  it("viser valideringsfeil når man ikke har valgt behandler", async () => {
    renderVelgBehandler();

    await clickButton(submitText);

    expect(await screen.findByText("Vennligst velg behandler")).to.exist;
  });

  it("viser valideringsfeil når man har valgt søk etter behandler uten å ha søkt opp behandler", async () => {
    renderVelgBehandler();

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);
    await clickButton(submitText);

    expect(await screen.findByText("Vennligst velg behandler")).to.exist;
  });

  it("kan velge behandler fra radioknapper", async () => {
    renderVelgBehandler();

    const velgFastlegeOption = screen.getByRole("radio", { name: /Fastlege/ });
    await userEvent.click(velgFastlegeOption);

    expect(screen.getByText(mockBehandler.fnr)).to.exist;
    expect(screen.getByText(behandlerRefLegoLasLegesen)).to.exist;
  });

  it("kan velge behandler fra søk", async () => {
    mockServer.use(
      http.get(`*${ISDIALOGMELDING_ROOT}/behandler/search`, () =>
        HttpResponse.json(behandlerSokDialogmeldingMock)
      )
    );
    renderVelgBehandler();
    const behandlerSearchResultMock = behandlerSokDialogmeldingMock[1];

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);

    const searchbox = screen.getByRole("searchbox");
    changeTextInput(searchbox, "Baker");

    const searchResult = await screen.findByRole("button", {
      name: /Baker/,
    });
    await userEvent.click(searchResult);

    expect(screen.getByText(behandlerSearchResultMock.fnr)).to.exist;
    expect(screen.getByText(behandlerSearchResultMock.behandlerRef)).to.exist;
  });
});

const VelgBehandlerWrapper = () => {
  const [behandler, setBehandler] = useState<BehandlerDTO>();
  const formMethods = useForm<{ behandlerRef: string }>();
  const submit = ({}) => {
    /* noop */
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submit)}>
        <VelgBehandler
          legend="Velg behandler"
          onBehandlerSelected={setBehandler}
        />
        <p>{behandler?.fnr}</p>
        <p>{formMethods.watch("behandlerRef")}</p>
        <Button type="submit">{submitText}</Button>
      </form>
    </FormProvider>
  );
};
