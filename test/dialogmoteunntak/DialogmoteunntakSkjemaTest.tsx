import React from "react";
import { expect } from "chai";
import { MemoryRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { QueryClientProvider } from "react-query";
import configureStore from "redux-mock-store";
import { fireEvent, render, screen } from "@testing-library/react";
import { rootReducer } from "@/data/rootState";
import { dialogmoteUnntakRoutePath } from "@/routers/AppRouter";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { apiMock } from "../stubs/stubApi";
import { arbeidstaker, mockState, navEnhet } from "../dialogmote/testData";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { stubVeilederinfoApi } from "../stubs/stubSyfoveileder";
import {
  UnntakArsakText,
  unntakArsakTexts,
} from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaArsakVelger";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import {
  texts as beksrivelseTexts,
  dialogmoteunntakSkjemaBeskrivelseMaxLength,
} from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaBeskrivelse";
import { CreateUnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
let queryClient;

describe("DialogmoteunntakSkjema", () => {
  const apiMockScope = apiMock();

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
      () => dialogmotekandidatMock
    );
    stubVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
  });

  const submitButtonText = "Sett unntak";

  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderDialogmoteunntakSkjema();
    clickButton(submitButtonText);

    const arsakErrorText = "Vennligst angi årsak";
    expect(screen.getAllByText(arsakErrorText)).to.not.be.empty;

    const tooLongBeskrivelse = getTooLongText(
      dialogmoteunntakSkjemaBeskrivelseMaxLength
    );
    const beskrivelseInput = getTextInput(beksrivelseTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, tooLongBeskrivelse);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      dialogmoteunntakSkjemaBeskrivelseMaxLength
    );
    expect(screen.getAllByText(maxLengthErrorMsg)).to.not.be.empty;

    passSkjemaInput(unntakArsakTexts[0], "beskrivelse");

    // Feilmeldinger forsvinner
    expect(screen.queryAllByText(arsakErrorText)).to.be.empty;
    expect(screen.queryAllByText(maxLengthErrorMsg)).to.be.empty;

    clickButton(submitButtonText);
  });

  it("sett unntak med kun med obligatorisk verdier fra skjema", () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(5);

    const unntakArsakText = unntakArsakTexts[0];

    passSkjemaInput(unntakArsakText);

    clickButton(submitButtonText);

    const unntakMutation = queryClient.getMutationCache().getAll()[0];
    const expectedCreateUnntakDTO: CreateUnntakDTO = {
      personIdent: arbeidstaker.personident,
      arsak: unntakArsakText.arsak,
      beskrivelse: undefined,
    };

    expect(unntakMutation.options.variables).to.deep.equal(
      expectedCreateUnntakDTO
    );
  });

  it("sett unntak med alle verdier fra skjema", () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(5);

    const beskrivelse = "Dette er en begrunnelse";
    const unntakArsakText = unntakArsakTexts[0];

    passSkjemaInput(unntakArsakText, beskrivelse);

    clickButton(submitButtonText);

    const unntakMutation = queryClient.getMutationCache().getAll()[0];
    const expectedCreateUnntakDTO: CreateUnntakDTO = {
      personIdent: arbeidstaker.personident,
      arsak: unntakArsakText.arsak,
      beskrivelse,
    };

    expect(unntakMutation.options.variables).to.deep.equal(
      expectedCreateUnntakDTO
    );
  });
});

const renderDialogmoteunntakSkjema = () => {
  return render(
    <MemoryRouter initialEntries={[dialogmoteUnntakRoutePath]}>
      <Route path={dialogmoteUnntakRoutePath}>
        <QueryClientProvider client={queryClient}>
          <ValgtEnhetContext.Provider
            value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
          >
            <Provider store={store({ ...realState, ...mockState })}>
              <DialogmoteunntakSkjema />
            </Provider>
          </ValgtEnhetContext.Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const passSkjemaInput = (
  unntakArsakText: UnntakArsakText,
  beskrivelse?: string
) => {
  const arsakRadioButton = screen.getByText(unntakArsakText.text);
  fireEvent.click(arsakRadioButton);

  if (beskrivelse) {
    const beskrivelseInput = getTextInput(beksrivelseTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, beskrivelse);
  }
};
