import { beforeEach, describe, it, expect } from "vitest";
import { queryClientWithMockData } from "../../testQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import SykepengesoknaderSide from "@/sider/sykepengsoknader/SykepengesoknaderSide";
import { MemoryRouter } from "react-router-dom";
import { sykepengesoknaderQueryKeys } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import {
  harIkkeJobbetSoknadMock,
  harJobbetSoknadMock,
  soknaderMock,
} from "@/mocks/sykepengesoknad/soknaderMock";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";

let queryClient: any;

function renderSykepengesoknaderSide() {
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <MemoryRouter>
            <SykepengesoknaderSide />
          </MemoryRouter>
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
}

describe("SykepengesoknaderSideTest", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser 'Har jobbet' tag når sykmeldt opplyser om at han har jobbet på søknad", () => {
    queryClient.setQueryData(
      sykepengesoknaderQueryKeys.sykepengesoknader(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => soknaderMock.concat([harJobbetSoknadMock])
    );
    renderSykepengesoknaderSide();

    expect(screen.getByText("Har jobbet")).to.exist;
  });

  it("Viser ikke 'Har jobbet' tag når sykmeldt opplyser om at han ikke har jobbet på søknad", () => {
    queryClient.setQueryData(
      sykepengesoknaderQueryKeys.sykepengesoknader(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => soknaderMock.concat([harIkkeJobbetSoknadMock])
    );
    renderSykepengesoknaderSide();

    expect(screen.queryByText("Har jobbet")).to.not.exist;
  });
});
