import { expect } from "chai";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import {
  InnkallingDialogmotePanel,
  texts as innkallingDialmotePanelTexts,
} from "../../src/components/mote/components/innkalling/InnkallingDialogmotePanel";
import { texts as brukerKanIkkeVarslesPapirpostTexts } from "../../src/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { brukerKanIkkeVarslesTekst } from "@/components/BrukerKanIkkeVarslesText";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { QueryClient, QueryClientProvider } from "react-query";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const queryClient = new QueryClient();
queryClient.setQueryData(
  behandlereDialogmeldingQueryKeys.behandleredialogmelding(fnr),
  () => []
);

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const brukerKanVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: true,
    },
  },
};
const brukerKanIkkeVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: false,
    },
  },
};

const renderInnkallingDialogmotePanel = (mockState, navbruker) => {
  return render(
    <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
      <Route path="/sykefravaer/moteoversikt">
        <QueryClientProvider client={queryClient}>
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: navbruker,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

describe("InnkallingDialogmotePanel med dm2 enabled og dm2 fysisk brev disabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: false,
        [ToggleNames.dm2InnkallingFastlege]: false,
      },
    },
  };

  it("viser advarsel når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(brukerKanIkkeVarslesTekst)).to.exist;
    expect(
      screen.getByText(innkallingDialmotePanelTexts.arenaDialogmoteInnkalling)
    ).to.exist;
  });
  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    const link = screen.getByRole("link", { name: "Nytt dialogmøte" });
    expect(link.getAttribute("href")).to.equal("/sykefravaer/mote");
    userEvent.click(button);
    expect(
      screen.queryByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.not.exist;
  });
  it("viser ingen advarsel når bruker kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
    expect(screen.queryByRole(brukerKanIkkeVarslesTekst)).to.not.exist;
  });
  it("Nytt dialogmøte-knapp viser modaler når bruker kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    expect(screen.queryByRole("link", { name: "Nytt dialogmøte" })).to.not
      .exist;
    userEvent.click(button);
    expect(
      screen.getByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.exist;
  });
});

describe("InnkallingDialogmotePanel med dm2 enabled og dm2 fysisk brev enabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: true,
        [ToggleNames.dm2InnkallingFastlege]: false,
      },
    },
  };

  it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(brukerKanIkkeVarslesTekst)).to.exist;
    expect(
      screen.getByText(brukerKanIkkeVarslesPapirpostTexts.papirpostDialogmote)
    ).to.exist;
  });
  it("Nytt dialogmøte-knapp viser modaler når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    expect(screen.queryByRole("link", { name: "Nytt dialogmøte" })).to.not
      .exist;
    userEvent.click(button);
    expect(
      screen.getByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.exist;
  });

  it("viser ingen advarsel når bruker kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
    expect(screen.queryByRole(brukerKanIkkeVarslesTekst)).to.not.exist;
  });
  it("Nytt dialogmøte-knapp viser modal når bruker kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    expect(screen.queryByRole("link", { name: "Nytt dialogmøte" })).to.not
      .exist;
    userEvent.click(button);
    expect(
      screen.getByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.exist;
  });
});

describe("InnkallingDialogmotePanel with dm2, fysisk brev, and innkalling fastlege enabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: true,
        [ToggleNames.dm2InnkallingFastlege]: true,
      },
    },
  };

  it("Nytt dialogmøte-knapp viser modal ", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    const nyttDialogmoteKnapp = screen.getByRole("button", {
      name: "Nytt dialogmøte",
    });
    userEvent.click(nyttDialogmoteKnapp);
    expect(
      screen.getByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.exist;
  });
});

describe("InnkallingDialogmotePanel with dm2 and innkalling fastlege enabled, but fysisk brev disabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: false,
        [ToggleNames.dm2InnkallingFastlege]: true,
      },
    },
  };

  it("viser advarsel når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(brukerKanIkkeVarslesTekst)).to.exist;
    expect(
      screen.getByText(innkallingDialmotePanelTexts.arenaDialogmoteInnkalling)
    ).to.exist;
  });

  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren uten modaler når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    const link = screen.getByRole("link", { name: "Nytt dialogmøte" });
    expect(link.getAttribute("href")).to.equal("/sykefravaer/mote");
    userEvent.click(button);
    expect(
      screen.queryByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.not.exist;
  });
});

describe("InnkallingDialogmotePanel med dm2 disabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: false,
      },
    },
  };

  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren når bruker ikke kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanIkkeVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    const link = screen.getByRole("link", { name: "Nytt dialogmøte" });
    expect(link.getAttribute("href")).to.equal("/sykefravaer/mote");
    userEvent.click(button);
    expect(
      screen.queryByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.not.exist;
  });
  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren når bruker kan varsles", () => {
    renderInnkallingDialogmotePanel(mockState, brukerKanVarsles);

    const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
    expect(button).to.exist;
    const link = screen.getByRole("link", { name: "Nytt dialogmøte" });
    expect(link.getAttribute("href")).to.equal("/sykefravaer/mote");
    userEvent.click(button);
    expect(
      screen.queryByRole("dialog", {
        name: "Ny løsning for innkalling til Dialogmøte",
      })
    ).to.not.exist;
  });
});
