import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../../testQueryClient";
import React from "react";
import MotebehovKvittering from "@/sider/dialogmoter/motebehov/MotebehovKvittering";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import {
  svartNeiMotebehovArbeidsgiverUbehandletMock,
  meldtMotebehovArbeidstakerBehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";
import {
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { addDays, addWeeks } from "@/utils/datoUtils";

let queryClient: QueryClient;

const renderMotebehovKvittering = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MotebehovKvittering />
    </QueryClientProvider>
  );
};

function mockMotebehov(motebehov: MotebehovVeilederDTO[]) {
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => motebehov
  );
}

const motebehovArbeidstakerInTilfelleUbehandletMock: MotebehovVeilederDTO = {
  ...meldtMotebehovArbeidstakerBehandletMock,
  opprettetDato: addDays(new Date(), -25),
  formValues: {
    harMotebehov: true,
    begrunnelse: "Jeg, arbeidstaker, har behov for møte.",
    onskerSykmelderDeltar: null,
    onskerSykmelderDeltarBegrunnelse: null,
    onskerTolk: null,
    tolkSprak: null,
  },
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
};

const motebehovArbeidsgiverInTilfelleUbehandletMock: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock,
  opprettetDato: addDays(new Date(), -25),
  formValues: {
    harMotebehov: true,
    begrunnelse: "Jeg, arbeidsgiver, har behov for møte.",
    onskerSykmelderDeltar: null,
    onskerSykmelderDeltarBegrunnelse: null,
    onskerTolk: null,
    tolkSprak: null,
  },
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
};

const motebehovArbeidstakerInTilfelleSvartJaUbehandletMock: MotebehovVeilederDTO =
  {
    ...meldtMotebehovArbeidstakerBehandletMock,
    opprettetDato: addDays(new Date(), -25),
    formValues: {
      harMotebehov: true,
      begrunnelse: "Jeg, arbeidstaker, svarer ja til møte.",
      onskerSykmelderDeltar: null,
      onskerSykmelderDeltarBegrunnelse: null,
      onskerTolk: null,
      tolkSprak: null,
    },
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
  };

const motebehovArbeidsgiverInTilfelleSvartNeiUbehandletMock: MotebehovVeilederDTO =
  {
    ...svartNeiMotebehovArbeidsgiverUbehandletMock,
    opprettetDato: addDays(new Date(), -25),
    formValues: {
      harMotebehov: false,
      begrunnelse: "Jeg, arbeidsgiver, svarer nei til møte.",
      onskerSykmelderDeltar: null,
      onskerSykmelderDeltarBegrunnelse: null,
      onskerTolk: null,
      tolkSprak: null,
    },
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
  };

function createMotebehovBehandlet(motebehov: MotebehovVeilederDTO) {
  return {
    ...motebehov,
    behandletTidspunkt: addDays(new Date(), -1),
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  };
}

function createMotebehovUtenforTilfelle(motebehov: MotebehovVeilederDTO) {
  return {
    ...motebehov,
    opprettetDato: addWeeks(new Date(), -50),
  };
}

describe("MotebehovKvittering", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("Ingen møtebehov", () => {
    mockMotebehov([]);

    renderMotebehovKvittering();
    expect(screen.getByText("Ingen tidligere møtebehov")).to.exist;
  });
  it("viser meldt møtebehov fra arbeidsgiver og sykmeldt innenfor tilfelle", () => {
    mockMotebehov([
      motebehovArbeidstakerInTilfelleUbehandletMock,
      motebehovArbeidsgiverInTilfelleUbehandletMock,
    ]);

    renderMotebehovKvittering();

    expect(screen.getByAltText("Sykmeldt Meldt behov.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidstaker, har behov for møte.")).to.exist;

    expect(screen.getByAltText("Arbeidsgiver Are Arbeidsgiver Meldt behov.")).to
      .exist;
    expect(
      screen.getByText("Are Arbeidsgiver, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidsgiver, har behov for møte.")).to.exist;
  });
  it("viser meldt møtebehov fra arbeidsgiver og sykmeldt når kun sykmeldt har meldt behov innenfor tilfelle", () => {
    mockMotebehov([motebehovArbeidstakerInTilfelleUbehandletMock]);

    renderMotebehovKvittering();
    expect(screen.getByAltText("Sykmeldt Meldt behov.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidstaker, har behov for møte.")).to.exist;

    expect(
      screen.getByAltText("Arbeidsgiver Tatten Tattover Ikke meldt behov.")
    ).to.exist;
    expect(
      screen.getByText("Tatten Tattover, har ikke meldt behov", {
        exact: false,
      })
    ).to.exist;
  });
  it("viser meldt møtebehov fra arbeidsgiver og sykmeldt når kun arbeidsgiver har meldt behov innenfor tilfelle", () => {
    mockMotebehov([motebehovArbeidsgiverInTilfelleUbehandletMock]);

    renderMotebehovKvittering();
    expect(screen.getByAltText("Sykmeldt Ikke meldt behov.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har ikke meldt behov", {
        exact: false,
      })
    ).to.exist;

    expect(screen.getByAltText("Arbeidsgiver Are Arbeidsgiver Meldt behov.")).to
      .exist;
    expect(
      screen.getByText("Are Arbeidsgiver, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidsgiver, har behov for møte.")).to.exist;
  });
  it("viser ingen møtebehov når ingen ubehandlede behov utenfor tilfelle", () => {
    const motebehovArbeidstakerInTilfelleBehandlet = createMotebehovBehandlet(
      motebehovArbeidstakerInTilfelleUbehandletMock
    );
    const motebehovArbeidstakerUtenforTilfelleBehandlet =
      createMotebehovUtenforTilfelle(motebehovArbeidstakerInTilfelleBehandlet);

    const motebehovArbeidsgiverInTilfelleBehandlet = createMotebehovBehandlet(
      motebehovArbeidsgiverInTilfelleUbehandletMock
    );
    const motebehovArbeidsgiverUtenforTilfelleBehandlet =
      createMotebehovUtenforTilfelle(motebehovArbeidsgiverInTilfelleBehandlet);

    mockMotebehov([
      motebehovArbeidstakerUtenforTilfelleBehandlet,
      motebehovArbeidsgiverUtenforTilfelleBehandlet,
    ]);

    renderMotebehovKvittering();
    expect(
      screen.getByText(
        "Alle tidligere møtebehov er behandlet, se møtebehovhistorikken for flere detaljer."
      )
    ).to.exist;
  });
  it("viser ubehandlede møtebehov når det finnes ubehandlede behov utenfor tilfelle", () => {
    const motebehovArbeidstakerUtenforTilfelleUbehandlet =
      createMotebehovUtenforTilfelle(
        motebehovArbeidstakerInTilfelleUbehandletMock
      );
    const motebehovArbeidsgiverUtenforTilfelleUbehandlet =
      createMotebehovUtenforTilfelle(
        motebehovArbeidsgiverInTilfelleUbehandletMock
      );

    mockMotebehov([
      motebehovArbeidstakerUtenforTilfelleUbehandlet,
      motebehovArbeidsgiverUtenforTilfelleUbehandlet,
    ]);

    renderMotebehovKvittering();
    expect(screen.getByAltText("Sykmeldt Meldt behov.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidstaker, har behov for møte.")).to.exist;

    expect(screen.getByAltText("Arbeidsgiver Are Arbeidsgiver Meldt behov.")).to
      .exist;
    expect(
      screen.getByText("Are Arbeidsgiver, har meldt behov", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidsgiver, har behov for møte.")).to.exist;
  });
  it("viser svar møtebehov fra arbeidsgiver og sykmeldt når kun sykmeldt har svart behov innenfor tilfelle", () => {
    mockMotebehov([motebehovArbeidstakerInTilfelleSvartJaUbehandletMock]);

    renderMotebehovKvittering();
    expect(screen.getByAltText("Sykmeldt Svart ja.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har svart JA", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidstaker, svarer ja til møte.")).to.exist;

    expect(screen.getByAltText("Arbeidsgiver Tatten Tattover Ikke svart.")).to
      .exist;
    expect(
      screen.getByText("Tatten Tattover, har ikke svart", {
        exact: false,
      })
    ).to.exist;
  });
  it("viser svar møtebehov fra arbeidsgiver og sykmeldt når kun arbeidsgiver har svart behov innenfor tilfelle", () => {
    mockMotebehov([motebehovArbeidsgiverInTilfelleSvartNeiUbehandletMock]);

    renderMotebehovKvittering();
    expect(screen.getByAltText("Sykmeldt Ikke svart.")).to.exist;
    expect(
      screen.getByText("Samuel Sam Jones, har ikke svart", {
        exact: false,
      })
    ).to.exist;

    expect(screen.getByAltText("Arbeidsgiver Are Arbeidsgiver Svart nei.")).to
      .exist;
    expect(
      screen.getByText("Are Arbeidsgiver, har svart NEI", {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText("Jeg, arbeidsgiver, svarer nei til møte.")).to
      .exist;
  });
  it("viser ingen møtebehov når nei-svar utenfor tilfelle, fordi disse kan ikke behandles", () => {
    const motebehovArbeidsgiverUtenforTilfelleUbehandlet =
      createMotebehovUtenforTilfelle(
        motebehovArbeidsgiverInTilfelleSvartNeiUbehandletMock
      );

    mockMotebehov([motebehovArbeidsgiverUtenforTilfelleUbehandlet]);

    renderMotebehovKvittering();
    expect(
      screen.getByText(
        "Alle tidligere møtebehov er behandlet, se møtebehovhistorikken for flere detaljer."
      )
    ).to.exist;
  });
});
