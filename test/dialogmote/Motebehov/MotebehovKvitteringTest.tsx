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
  createFormValues,
  defaultFormValue,
  meldtMotebehovArbeidstakerBehandletMock,
  svartJaMotebehovArbeidstakerUbehandletMock,
  svartNeiMotebehovArbeidsgiverUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";
import {
  MotebehovInnmelder,
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
  ...meldtMotebehovArbeidstakerBehandletMock(),
  opprettetDato: addDays(new Date(), -25),
  formValues: createFormValues(
    {
      ...defaultFormValue,
      harMotebehov: true,
      begrunnelse: "Jeg, arbeidstaker, har behov for møte.",
    },
    MotebehovSkjemaType.MELD_BEHOV,
    MotebehovInnmelder.ARBEIDSTAKER
  ),
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
};

const motebehovArbeidsgiverInTilfelleUbehandletMock: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
  opprettetDato: addDays(new Date(), -25),
  formValues: createFormValues(
    {
      ...defaultFormValue,
      harMotebehov: true,
      begrunnelse: "Jeg, arbeidsgiver, har behov for møte.",
    },
    MotebehovSkjemaType.MELD_BEHOV,
    MotebehovInnmelder.ARBEIDSGIVER
  ),
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
};

const motebehovArbeidstakerInTilfelleSvartJaUbehandletMock: MotebehovVeilederDTO =
  {
    ...meldtMotebehovArbeidstakerBehandletMock(),
    opprettetDato: addDays(new Date(), -25),
    formValues: createFormValues(
      {
        ...defaultFormValue,
        harMotebehov: true,
        begrunnelse: "Møter er bra!",
      },
      MotebehovSkjemaType.SVAR_BEHOV,
      MotebehovInnmelder.ARBEIDSTAKER
    ),
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
  };

const motebehovArbeidsgiverInTilfelleSvartNeiUbehandletMock: MotebehovVeilederDTO =
  {
    ...svartNeiMotebehovArbeidsgiverUbehandletMock(
      MotebehovSkjemaType.SVAR_BEHOV
    ),
    opprettetDato: addDays(new Date(), -25),
    formValues: createFormValues(
      {
        ...defaultFormValue,
        harMotebehov: false,
        begrunnelse: "Jeg, arbeidsgiver, svarer nei til møte.",
      },
      MotebehovSkjemaType.SVAR_BEHOV,
      MotebehovInnmelder.ARBEIDSGIVER
    ),
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
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
    expect(screen.getByText("Møter er bra!")).to.exist;

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

  describe("MotebehovKvittering visning av readonly skjema", () => {
    describe("Meld behov", () => {
      it("Arbeidstaker har meldt inn behov for møte", () => {
        const arbeidstaker = {
          ...meldtMotebehovArbeidstakerBehandletMock(),
        };

        mockMotebehov([arbeidstaker]);

        renderMotebehovKvittering();

        expect(
          screen.getByText("Samuel Sam Jones, har meldt behov", {
            exact: false,
          })
        ).to.exist;
        expect(screen.getByText("Begrunnelse")).to.exist;
        expect(screen.getByText("Møter er bra!")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })
        ).to.exist;
        expect(
          screen.getByText(
            "Hvorfor ønsker du at lege/behandler deltar i møtet?"
          )
        ).to.exist;
        expect(screen.getByText("Ønsker at legen min er tilstede")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: true,
          })
        ).to.exist;
        expect(screen.getByText("Hva slags tolk har dere behov for?")).to.exist;
        expect(screen.getByText("Har behov for svensk tolk")).to.exist;
        expect(
          screen.getByText("Tatten Tattover, har ikke meldt behov", {
            exact: false,
          })
        ).to.exist;
      });
    });

    describe("Svar behov", () => {
      it("Arbeidsgiver og arbeidstaker har svart på alle spørsmål ifm. møtebehov (dialogmøte 2)", () => {
        const arbeidstaker = {
          ...svartJaMotebehovArbeidstakerUbehandletMock,
          skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: true,
              begrunnelse: "Møter er bra!",
              onskerSykmelderDeltar: true,
              onskerSykmelderDeltarBegrunnelse:
                "Ønsker at legen min er tilstede",
              onskerTolk: true,
              tolkSprak: "Har behov for svensk tolk",
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSTAKER
          ),
        };

        const arbeidsgiver = {
          ...svartNeiMotebehovArbeidsgiverUbehandletMock(
            MotebehovSkjemaType.SVAR_BEHOV
          ),
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: true,
              begrunnelse: "Jeg liker ikke møte!!",
              onskerSykmelderDeltar: true,
              onskerSykmelderDeltarBegrunnelse: "Ønsker lege tilstede",
              onskerTolk: true,
              tolkSprak: "Svensk",
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSGIVER
          ),
        };

        mockMotebehov([arbeidsgiver, arbeidstaker]);

        renderMotebehovKvittering();

        expect(
          screen.getByText("Samuel Sam Jones, har svart JA", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[0]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: true,
          })[0]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
          })[0]
        ).to.exist;
        expect(screen.getAllByText("Begrunnelse")[0]).to.exist;
        expect(screen.getByText("Møter er bra!")).to.exist;
        expect(
          screen.getAllByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })[0]
        ).to.exist;
        expect(
          screen.getAllByText(
            "Hvorfor ønsker du at lege/behandler deltar i møtet?"
          )[0]
        ).to.exist;
        expect(screen.getByText("Ønsker at legen min er tilstede")).to.exist;
        expect(
          screen.getAllByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: true,
          })[0]
        ).to.exist;
        expect(screen.getAllByText("Hva slags tolk har dere behov for?")[0]).to
          .exist;
        expect(screen.getByText("Har behov for svensk tolk")).to.exist;

        expect(
          screen.getByText("Are Arbeidsgiver, har svart JA", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[1]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: true,
          })[1]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
          })[1]
        ).to.exist;
        expect(screen.getAllByText("Begrunnelse")[1]).to.exist;
        expect(screen.getByText("Jeg liker ikke møte!!")).to.exist;
        expect(
          screen.getAllByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })[1]
        ).to.exist;
        expect(
          screen.getAllByText(
            "Hvorfor ønsker du at lege/behandler deltar i møtet?"
          )[1]
        ).to.exist;
        expect(screen.getByText("Ønsker lege tilstede")).to.exist;
        expect(
          screen.getAllByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: true,
          })[1]
        ).to.exist;
        expect(screen.getAllByText("Hva slags tolk har dere behov for?")[1]).to
          .exist;
        expect(screen.getByText("Svensk")).to.exist;
      });

      it("Arbeidsgiver og arbeidstaker har svart variende på spørsmål møtebehov (dialogmøte 2)", () => {
        const arbeidstaker = {
          ...svartJaMotebehovArbeidstakerUbehandletMock,
          skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: true,
              begrunnelse: "Møter er bra!",
              onskerSykmelderDeltar: true,
              onskerSykmelderDeltarBegrunnelse:
                "Ønsker at legen min er tilstede",
              onskerTolk: false,
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSTAKER
          ),
        };

        const arbeidsgiver = {
          ...svartNeiMotebehovArbeidsgiverUbehandletMock(
            MotebehovSkjemaType.SVAR_BEHOV
          ),
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: true,
              begrunnelse: "Jeg liker ikke møte!!",
              onskerSykmelderDeltar: false,
              onskerTolk: true,
              tolkSprak: "Svensk",
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSGIVER
          ),
        };

        mockMotebehov([arbeidsgiver, arbeidstaker]);

        renderMotebehovKvittering();

        expect(
          screen.getByText("Samuel Sam Jones, har svart JA", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[0]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: true,
          })[0]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
          })[0]
        ).to.exist;
        expect(screen.getAllByText("Begrunnelse")[0]).to.exist;
        expect(screen.getByText("Møter er bra!")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })
        ).to.exist;
        expect(
          screen.getByText(
            "Hvorfor ønsker du at lege/behandler deltar i møtet?"
          )
        ).to.exist;
        expect(screen.getByText("Ønsker at legen min er tilstede")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: false,
          })
        ).to.exist;

        expect(
          screen.getByText("Are Arbeidsgiver, har svart JA", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[1]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: true,
          })[1]
        ).to.exist;
        expect(
          screen.getAllByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
          })[1]
        ).to.exist;
        expect(screen.getAllByText("Begrunnelse")[1]).to.exist;
        expect(screen.getByText("Jeg liker ikke møte!!")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })
        ).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: true,
          })
        ).to.exist;
        expect(screen.getByText("Hva slags tolk har dere behov for?")).to.exist;
        expect(screen.getByText("Svensk")).to.exist;
      });

      it("Arbeidstaker har svart ja på sykmelder tilstede uten begrunnelse", () => {
        const arbeidstaker = {
          ...svartJaMotebehovArbeidstakerUbehandletMock,
          skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: true,
              begrunnelse: "Møter er bra!",
              onskerSykmelderDeltar: true,
              onskerTolk: false,
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSTAKER
          ),
        };

        const arbeidsgiver = {
          ...svartNeiMotebehovArbeidsgiverUbehandletMock(
            MotebehovSkjemaType.SVAR_BEHOV
          ),
          formValues: createFormValues(
            {
              ...defaultFormValue,
              harMotebehov: false,
            },
            MotebehovSkjemaType.SVAR_BEHOV,
            MotebehovInnmelder.ARBEIDSGIVER
          ),
        };

        mockMotebehov([arbeidsgiver, arbeidstaker]);

        renderMotebehovKvittering();

        expect(
          screen.getByText("Samuel Sam Jones, har svart JA", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[0]
        ).to.exist;
        expect(
          screen.getByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: true,
          })
        ).to.exist;
        expect(
          screen.getByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
            checked: false,
          })
        ).to.exist;
        expect(screen.getByText("Begrunnelse")).to.exist;
        expect(screen.getByText("Møter er bra!")).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp(
              "Jeg ønsker at sykmelder \\(lege/behandler\\) også deltar i møtet\\."
            ),
            checked: true,
          })
        ).to.exist;
        expect(
          screen.getByRole("checkbox", {
            name: RegExp("Vi har behov for tolk."),
            checked: false,
          })
        ).to.exist;

        expect(
          screen.getByText("Are Arbeidsgiver, har svart NEI", {
            exact: false,
          })
        ).to.exist;
        expect(
          screen.getAllByRole("group", {
            name: RegExp("Har dere behov for et dialogmøte med NAV?"),
          })[1]
        ).to.exist;
        expect(
          screen.getByRole("radio", {
            name: "Ja, vi har behov for et dialogmøte.",
            checked: false,
          })
        ).to.exist;
        expect(
          screen.getByRole("radio", {
            name: "Nei, vi har ikke behov for et dialogmøte nå.",
            checked: true,
          })
        ).to.exist;
      });
    });
  });
});
