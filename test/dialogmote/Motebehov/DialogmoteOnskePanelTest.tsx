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
  meldtMotebehovArbeidsgiverBehandletMock,
  meldtMotebehovArbeidstakerBehandletMock,
  svartJaMotebehovArbeidstakerUbehandletMock,
  svartNeiMotebehovArbeidsgiverUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { addDays, addWeeks, toDatePrettyPrint } from "@/utils/datoUtils";
import { UtropstegnImage } from "../../../img/ImageComponents";
import MotebehovKvittering from "@/sider/dialogmoter/motebehov/MotebehovKvittering";
import BehandleMotebehovKnapp from "@/components/motebehov/BehandleMotebehovKnapp";
import DialogmotePanel from "@/sider/dialogmoter/components/DialogmotePanel";

let queryClient: QueryClient;

const renderDialogmoteOnskePanel = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DialogmotePanel icon={UtropstegnImage} header={"Behov for dialogmøte"}>
        <MotebehovKvittering />
        <BehandleMotebehovKnapp />
      </DialogmotePanel>{" "}
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
  },
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

  describe("Visning av hjelpetekst ved meldt behov", () => {
    const arbeidstakerMeldtBehovBehandletInnenfor = {
      ...meldtMotebehovArbeidstakerBehandletMock(),
      opprettetDato: datoInnenforOppfolgingstilfelle,
    };

    const arbeidstakerMeldtBehovBehandletUtenfor = {
      ...meldtMotebehovArbeidstakerBehandletMock(),
      opprettetDato: datoUtenforOppfolgingstilfelle,
    };

    const arbeidstakerMeldtBehovUbehandletUtenfor = {
      ...meldtMotebehovArbeidstakerBehandletMock(),
      opprettetDato: datoUtenforOppfolgingstilfelle,
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    const arbeidstakerMeldtBehovUbehandletInnenfor = {
      ...meldtMotebehovArbeidstakerBehandletMock(),
      opprettetDato: datoInnenforOppfolgingstilfelle,
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    const arbeidsgiverMeldtBehovBehandletInnenfor = {
      ...meldtMotebehovArbeidsgiverBehandletMock,
      opprettetDato: datoInnenforOppfolgingstilfelle,
    };

    const arbeidsgiverMeldtBehovBehandletUtenfor = {
      ...meldtMotebehovArbeidsgiverBehandletMock,
      opprettetDato: datoUtenforOppfolgingstilfelle,
    };

    const arbeidsgiverMeldtBehovUbehandletUtenfor = {
      ...meldtMotebehovArbeidsgiverBehandletMock,
      opprettetDato: datoUtenforOppfolgingstilfelle,
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    const arbeidsgiverMeldtBehovUbehandletInnenfor = {
      ...meldtMotebehovArbeidsgiverBehandletMock,
      opprettetDato: datoInnenforOppfolgingstilfelle,
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    it.each<MotebehovVeilederDTO>([
      arbeidstakerMeldtBehovBehandletInnenfor,
      arbeidsgiverMeldtBehovBehandletInnenfor,
    ])(
      "Behandlet meldt behov fra $innmelderType innenfor oppfølgingstilfelle - vise hjelpetekst",
      (motebehov: MotebehovVeilederDTO) => {
        mockMotebehov([motebehov]);

        renderDialogmoteOnskePanel();

        expect(
          screen.getByText("Les her om tidspunkt og plikt for dialogmøte 2")
        ).to.exist;
      }
    );

    it.each<MotebehovVeilederDTO>([
      arbeidstakerMeldtBehovBehandletUtenfor,
      arbeidsgiverMeldtBehovBehandletUtenfor,
    ])(
      `Behandlet meldt behov fra $innmelderType utenfor oppfølgingstilfelle - ikke vise hjelpetekst`,
      (motebehov: MotebehovVeilederDTO) => {
        mockMotebehov([motebehov]);

        renderDialogmoteOnskePanel();

        expect(
          screen.queryByText("Les her om tidspunkt og plikt for dialogmøte 2")
        ).to.not.exist;
      }
    );

    describe.each<MotebehovVeilederDTO>([
      arbeidstakerMeldtBehovUbehandletUtenfor,
      arbeidstakerMeldtBehovUbehandletInnenfor,
      arbeidsgiverMeldtBehovUbehandletUtenfor,
      arbeidsgiverMeldtBehovUbehandletInnenfor,
    ])(
      "Ubehandlet meldt behov - vise hjelpetekst",
      (motebehov: MotebehovVeilederDTO) => {
        it(`Ubehandlet meldt behov fra ${motebehov.innmelderType} ${
          motebehov.opprettetDato === datoInnenforOppfolgingstilfelle
            ? "innenfor"
            : "utenfor"
        } oppfølgingstilfelle - vise hjelpetekst`, () => {
          mockMotebehov([motebehov]);

          renderDialogmoteOnskePanel();

          expect(
            screen.getByText("Les her om tidspunkt og plikt for dialogmøte 2")
          ).to.exist;
        });
      }
    );

    it("Ingen har meldt behov - ikke vise hjelpetekst", () => {
      mockMotebehov([]);

      renderDialogmoteOnskePanel();

      expect(
        screen.queryByText("Les her om tidspunkt og plikt for dialogmøte 2")
      ).to.not.exist;
    });
  });
});
