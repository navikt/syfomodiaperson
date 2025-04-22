import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../../testQueryClient";
import React from "react";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import {
  defaultFormValue,
  svartJaMotebehovArbeidstakerUbehandletMock,
  svartNeiMotebehovArbeidsgiverUbehandletMock
} from "@/mocks/syfomotebehov/motebehovMock";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { addDays, addWeeks, toDatePrettyPrint } from "@/utils/datoUtils";
import { DialogmoteOnskePanel } from "@/sider/dialogmoter/motebehov/DialogmoteOnskePanel";

let queryClient: QueryClient;

const renderDialogmoteOnskePanel = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DialogmoteOnskePanel />
    </QueryClientProvider>
  );
};

function mockMotebehov(motebehov: MotebehovVeilederDTO[]) {
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => motebehov
  );
}

const datoUtenforOppfolgingstilfelle = addWeeks(new Date(), -150);
const datoInnenforOppfolgingstilfelle = addDays(new Date(), -10);

const arbeidstakerSvarJaBehandlet: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  opprettetDato: datoUtenforOppfolgingstilfelle,
  behandletTidspunkt: datoUtenforOppfolgingstilfelle,
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
};

const tidligereOppfolgingstilfelle = {
  arbeidstakerSvarJa: arbeidstakerSvarJaBehandlet,
  arbeidsgiverSvarNeiUbehandlet: {
    ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
    opprettetDato: datoUtenforOppfolgingstilfelle,
  },
};

const arbeidstakerSvarNeiUbehandlet: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  opprettetDato: datoInnenforOppfolgingstilfelle,
  formValues: {
    ...defaultFormValue,
    harMotebehov: false,
    begrunnelse: "Trenger ikke møte",
  }
};

const nyttOppfolgingstilfelle = {
  arbeidstakerSvarNei: {
    ...arbeidstakerSvarNeiUbehandlet,
    behandletTidspunkt: addDays(new Date(), -2),
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  },
  arbeidsgiverSvarNeiUbehandlet: {
    ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
    opprettetDato: datoInnenforOppfolgingstilfelle,
  },
};

describe("DialogmoteOnskePanel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Tidligere behandlet møtebehov utenfor oppfølgingstilfelle", () => {
    mockMotebehov([
      tidligereOppfolgingstilfelle.arbeidstakerSvarJa,
      tidligereOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
    ]);

    renderDialogmoteOnskePanel();

    expect(
      screen.getByText(
        "Alle tidligere møtebehov er behandlet, se møtebehovhistorikken for flere detaljer."
      )
    ).to.exist;
    expect(
      screen.queryByText(
        `Møtebehovet ble behandlet av Z990000 den ${toDatePrettyPrint(
          datoUtenforOppfolgingstilfelle
        )}.`
      )
    ).to.not.exist;
  });

  it("Tidligere ubehandlet møtebehov utenfor oppfølgingstilfelle", () => {
    mockMotebehov([
      {
        ...tidligereOppfolgingstilfelle.arbeidstakerSvarJa,
        behandletTidspunkt: null,
        behandletVeilederIdent: null,
      },
      tidligereOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
    ]);

    renderDialogmoteOnskePanel();

    expect(
      screen.getByText(
        "Ubehandlede møtebehov fra tidligere oppfølgingstilfelle:"
      )
    ).to.exist;
    expect(
      screen.getByText(
        `Samuel Sam Jones, har svart JA - ${toDatePrettyPrint(
          datoUtenforOppfolgingstilfelle
        )}`
      )
    ).to.exist;
    expect(screen.getByText("Vurder møtebehov og fjern oppgaven")).to.exist;
  });

  it("Et tidligere behandlet møtebehov utenfor oppfølgingstilfelle og et behandlet innenfor oppfølgingstilfelle", () => {
    const behandlingsdatoInnenforOppfolgingstilfelle = addDays(new Date(), -2);

    mockMotebehov([
      tidligereOppfolgingstilfelle.arbeidstakerSvarJa,
      tidligereOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
      nyttOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
      {
        ...nyttOppfolgingstilfelle.arbeidstakerSvarNei,
        behandletTidspunkt: behandlingsdatoInnenforOppfolgingstilfelle,
      },
    ]);

    renderDialogmoteOnskePanel();

    expect(
      screen.getByText(
        `Samuel Sam Jones, har svart NEI - ${toDatePrettyPrint(
          datoInnenforOppfolgingstilfelle
        )}`
      )
    ).to.exist;
    expect(
      screen.getByText(
        `Are Arbeidsgiver, har svart NEI - ${toDatePrettyPrint(
          datoInnenforOppfolgingstilfelle
        )}`
      )
    ).to.exist;
    expect(
      screen.getByText(
        `Møtebehovet ble behandlet av Z990000 den ${toDatePrettyPrint(
          behandlingsdatoInnenforOppfolgingstilfelle
        )}.`
      )
    ).to.exist;
  });

  it("Et tidligere behandlet møtebehov utenfor oppfølgingstilfelle og neisvar fra arbeidstaker og arbeidsgiver", () => {
    mockMotebehov([
      tidligereOppfolgingstilfelle.arbeidstakerSvarJa,
      tidligereOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
      arbeidstakerSvarNeiUbehandlet,
      nyttOppfolgingstilfelle.arbeidsgiverSvarNeiUbehandlet,
    ]);

    renderDialogmoteOnskePanel();

    expect(
      screen.getByText(
        `Samuel Sam Jones, har svart NEI - ${toDatePrettyPrint(
          datoInnenforOppfolgingstilfelle
        )}`
      )
    ).to.exist;
    expect(
      screen.getByText(
        `Are Arbeidsgiver, har svart NEI - ${toDatePrettyPrint(
          datoInnenforOppfolgingstilfelle
        )}`
      )
    ).to.exist;
    expect(
      screen.queryByText(
        `Møtebehovet ble behandlet av Z990000 den ${toDatePrettyPrint(
          datoUtenforOppfolgingstilfelle
        )}.`
      )
    ).to.not.exist;
    expect(screen.queryByText("Vurder møtebehov og fjern oppgaven")).to.not
      .exist;
  });
});
