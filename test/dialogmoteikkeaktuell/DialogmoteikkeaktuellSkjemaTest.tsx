import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { dialogmoteIkkeAktuellRoutePath } from "@/routers/AppRouter";
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
import DialogmoteIkkeAktuellSkjema, {
  skjemaBeskrivelseMaxLength,
  texts as ikkeaktuellSkjemaTexts,
} from "@/sider/dialogmoter/components/ikkeaktuell/DialogmoteIkkeAktuellSkjema";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";
import {
  CreateIkkeAktuellDTO,
  IkkeAktuellArsak,
  ikkeAktuellArsakTexts,
} from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { renderWithRouter } from "../testRouterUtils";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

let queryClient: QueryClient;

describe("DialogmoteikkeaktuellSkjema", () => {
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

  const submitButtonText = "Sett ikke aktuell";

  it("viser informasjonstekster", () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getByText(ikkeaktuellSkjemaTexts.noBrev)).to.not.be.empty;
    expect(screen.getByText(ikkeaktuellSkjemaTexts.infoKandidatlist)).to.not.be
      .empty;
  });

  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderDialogmoteikkeaktuellSkjema();
    await clickButton(submitButtonText);

    expect(await screen.findByText(ikkeaktuellSkjemaTexts.arsakErrorMessage)).to
      .not.be.empty;

    const tooLongBeskrivelse = getTooLongText(skjemaBeskrivelseMaxLength);
    const beskrivelseInput = getTextInput(
      ikkeaktuellSkjemaTexts.beskrivelseLabel
    );
    changeTextInput(beskrivelseInput, tooLongBeskrivelse);
    const maxLengthErrorMsg = "1 tegn for mye";
    expect(screen.getAllByText(maxLengthErrorMsg)).to.not.be.empty;

    passSkjemaInput(IkkeAktuellArsak.DIALOGMOTE_AVHOLDT, "beskrivelse");

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryAllByText(ikkeaktuellSkjemaTexts.arsakErrorMessage)).to
        .be.empty;
    });
    await waitFor(() => {
      expect(screen.queryAllByText(maxLengthErrorMsg)).to.be.empty;
    });

    await clickButton(submitButtonText);
  });

  it("sett ikke aktuell med kun med obligatorisk verdier fra skjema", async () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(5);

    passSkjemaInput(IkkeAktuellArsak.DIALOGMOTE_AVHOLDT);

    await clickButton(submitButtonText);
    await waitFor(() => {
      const ikkeaktuellMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateIkkeAktuellDTO: CreateIkkeAktuellDTO = {
        personIdent: arbeidstaker.personident,
        arsak: IkkeAktuellArsak.DIALOGMOTE_AVHOLDT,
        beskrivelse: "",
      };

      expect(ikkeaktuellMutation.state.variables).to.deep.equal(
        expectedCreateIkkeAktuellDTO
      );
    });
  });

  it("sett ikke aktuell med alle verdier fra skjema", async () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(5);

    const beskrivelse = "Dette er en begrunnelse";

    passSkjemaInput(IkkeAktuellArsak.DIALOGMOTE_AVHOLDT, beskrivelse);

    await clickButton(submitButtonText);

    await waitFor(() => {
      const ikkeaktuellMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateIkkeAktuellDTO: CreateIkkeAktuellDTO = {
        personIdent: arbeidstaker.personident,
        arsak: IkkeAktuellArsak.DIALOGMOTE_AVHOLDT,
        beskrivelse,
      };

      expect(ikkeaktuellMutation.state.variables).to.deep.equal(
        expectedCreateIkkeAktuellDTO
      );
    });
  });
});

const renderDialogmoteikkeaktuellSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteIkkeAktuellSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteIkkeAktuellRoutePath,
    [dialogmoteIkkeAktuellRoutePath]
  );
};

const passSkjemaInput = (
  ikkeaktuellArsak: IkkeAktuellArsak,
  beskrivelse?: string
) => {
  const arsakRadioButton = screen.getByText(
    ikkeAktuellArsakTexts[ikkeaktuellArsak]
  );
  fireEvent.click(arsakRadioButton);

  if (beskrivelse) {
    const beskrivelseInput = getTextInput(
      ikkeaktuellSkjemaTexts.beskrivelseLabel
    );
    changeTextInput(beskrivelseInput, beskrivelse);
  }
};
