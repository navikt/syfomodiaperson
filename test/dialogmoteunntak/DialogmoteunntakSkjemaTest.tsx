import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { dialogmoteUnntakRoutePath } from "@/routers/AppRouter";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { arbeidstaker, navEnhet } from "../dialogmote/testData";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import DialogmoteunntakSkjema, {
  dialogmoteunntakSkjemaBeskrivelseMaxLength,
  texts as unntakSkjemaTexts,
} from "../../src/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";
import {
  createUnntakArsakTexts,
  CreateUnntakDTO,
  ValidUnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { renderWithRouter } from "../testRouterUtils";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

let queryClient: QueryClient;

describe("DialogmoteunntakSkjema", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
      () => dialogmotekandidatMock
    );
    queryClient.setQueryData(
      dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );
    stubFeatureTogglesApi();
  });

  const submitButtonText = "Sett unntak";

  it("viser informasjonstekster", () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getByText(unntakSkjemaTexts.noBrev)).to.not.be.empty;
    expect(screen.getByText(unntakSkjemaTexts.infoKandidatlist)).to.not.be
      .empty;
  });

  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderDialogmoteunntakSkjema();
    await clickButton(submitButtonText);

    expect(await screen.findByText(unntakSkjemaTexts.arsakErrorMessage)).to.not
      .be.empty;

    const tooLongBeskrivelse = getTooLongText(
      dialogmoteunntakSkjemaBeskrivelseMaxLength
    );
    const beskrivelseInput = getTextInput(unntakSkjemaTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, tooLongBeskrivelse);
    const maxLengthErrorMsg = "1 tegn for mye";
    expect(screen.getAllByText(maxLengthErrorMsg)).to.not.be.empty;

    passSkjemaInput(
      ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
      "beskrivelse"
    );

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryAllByText(unntakSkjemaTexts.arsakErrorMessage)).to.be
        .empty;
    });
    await waitFor(() => {
      expect(screen.queryAllByText(maxLengthErrorMsg)).to.be.empty;
    });

    await clickButton(submitButtonText);
  });

  it("sett unntak med kun med obligatorisk verdier fra skjema", async () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(4);

    passSkjemaInput(ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER);

    await clickButton(submitButtonText);
    await waitFor(() => {
      const unntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateUnntakDTO: CreateUnntakDTO = {
        personIdent: arbeidstaker.personident,
        arsak: ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
        beskrivelse: "",
      };

      expect(unntakMutation.state.variables).to.deep.equal(
        expectedCreateUnntakDTO
      );
    });
  });

  it("sett unntak med alle verdier fra skjema", async () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(4);

    const beskrivelse = "Dette er en begrunnelse";

    passSkjemaInput(
      ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
      beskrivelse
    );

    await clickButton(submitButtonText);

    await waitFor(() => {
      const unntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateUnntakDTO: CreateUnntakDTO = {
        personIdent: arbeidstaker.personident,
        arsak: ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
        beskrivelse,
      };

      expect(unntakMutation.state.variables).to.deep.equal(
        expectedCreateUnntakDTO
      );
    });
  });
});

const renderDialogmoteunntakSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteunntakSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteUnntakRoutePath,
    [dialogmoteUnntakRoutePath]
  );
};

const passSkjemaInput = (arsak: ValidUnntakArsak, beskrivelse?: string) => {
  const arsakRadioButton = screen.getByText(createUnntakArsakTexts[arsak]);
  fireEvent.click(arsakRadioButton);

  if (beskrivelse) {
    const beskrivelseInput = getTextInput(unntakSkjemaTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, beskrivelse);
  }
};
