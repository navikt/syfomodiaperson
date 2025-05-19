import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { InfoOmTolk } from "@/sider/dialogmoter/motebehov/InfoOmTolk";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../../testQueryClient";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import {
  defaultFormValue,
  svartJaMotebehovArbeidstakerUbehandletMock,
  svartNeiMotebehovArbeidsgiverUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";
import { currentOppfolgingstilfelle } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { addWeeks } from "@/utils/datoUtils";

let queryClient: QueryClient;

const renderInfoOmTolk = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <InfoOmTolk />
    </QueryClientProvider>
  );
};

function mockMotebehov(
  motebehov: MotebehovVeilederDTO[],
  brukerinfo: BrukerinfoDTO
) {
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => motebehov
  );
  queryClient.setQueryData(
    brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => brukerinfo
  );
}

const harIkkeTolkIPdl: BrukerinfoDTO = {
  ...brukerinfoMock,
  tilrettelagtKommunikasjon: null,
};

const harIkkeTolkIPdl2: BrukerinfoDTO = {
  ...brukerinfoMock,
  tilrettelagtKommunikasjon: {
    talesprakTolk: null,
    tegnsprakTolk: null,
  },
};

const harTolkIPdl: BrukerinfoDTO = {
  ...brukerinfoMock,
  tilrettelagtKommunikasjon: {
    talesprakTolk: {
      value: "EN",
    },
    tegnsprakTolk: {
      value: "EN",
    },
  },
};

const harTolkIPdl2: BrukerinfoDTO = {
  ...brukerinfoMock,
  tilrettelagtKommunikasjon: {
    talesprakTolk: {
      value: "EN",
    },
    tegnsprakTolk: null,
  },
};

const harTolkIPdl3: BrukerinfoDTO = {
  ...brukerinfoMock,
  tilrettelagtKommunikasjon: {
    talesprakTolk: null,
    tegnsprakTolk: {
      value: "EN",
    },
  },
};

const arbeidstakerOnskerTolkInnenforTilfelle: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: true,
  },
};

const arbeidsgiverOnskerTolkInnenforTilfelle: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: true,
  },
};

const arbeidstakerOnskerIkkeTolkInnenforTilfelle: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: false,
  },
};

const arbeidsgiverOnskerIkkeTolkInnenforTilfelle: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: false,
  },
};

const arbeidstakerOnskerTolkUtenforTilfelle: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  opprettetDato: addWeeks(currentOppfolgingstilfelle.start, -2),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: true,
  },
};

const arbeidsgiverOnskerTolkUtenforTilfelle: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
  opprettetDato: addWeeks(currentOppfolgingstilfelle.start, -2),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: true,
  },
};

const arbeidstakerOnskerIkkeTolkUtenforTilfelle: MotebehovVeilederDTO = {
  ...svartJaMotebehovArbeidstakerUbehandletMock,
  opprettetDato: addWeeks(currentOppfolgingstilfelle.start, -2),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: false,
  },
};

const arbeidsgiverOnskerIkkeTolkUtenforTilfelle: MotebehovVeilederDTO = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(),
  opprettetDato: addWeeks(currentOppfolgingstilfelle.start, -2),
  formValues: {
    ...defaultFormValue,
    harMotebehov: true,
    onskerTolk: false,
  },
};

describe("InfoOmTolk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Ingen møtebehov", () => {
    it.each<BrukerinfoDTO>([
      harTolkIPdl,
      harTolkIPdl2,
      harTolkIPdl3,
      harIkkeTolkIPdl,
      harIkkeTolkIPdl2,
    ])(
      "Ingen møtebehov og med følgende informasjon i pdl: (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
      (brukerinfo: BrukerinfoDTO) => {
        mockMotebehov([], brukerinfo);

        renderInfoOmTolk();

        expect(
          screen.queryByText(
            "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
          )
        ).to.not.exist;
      }
    );
  });

  describe("Noen har møtebehov innenfor aktivt oppfølgingstilfelle", () => {
    describe("Arbeidsgiver", () => {
      it.each<BrukerinfoDTO>([harTolkIPdl, harTolkIPdl2, harTolkIPdl3])(
        "Arbeidsgiver har ønske om tolk og pdl har denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidsgiverOnskerTolkInnenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([harIkkeTolkIPdl, harIkkeTolkIPdl2])(
        "Arbeidsgiver har ønske om tolk og pdl har ikke denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidsgiverOnskerTolkInnenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.getByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere.",
              {
                exact: false,
              }
            )
          ).to.exist;
        }
      );

      it.each<BrukerinfoDTO>([
        harTolkIPdl,
        harTolkIPdl2,
        harTolkIPdl3,
        harIkkeTolkIPdl,
        harIkkeTolkIPdl2,
      ])(
        "Arbeidstaker har ikke ønske om tolk og pdl har følgende informasjon: (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [arbeidsgiverOnskerIkkeTolkInnenforTilfelle],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );
    });

    describe("Arbeidstaker", () => {
      it.each<BrukerinfoDTO>([harTolkIPdl, harTolkIPdl2, harTolkIPdl3])(
        "Arbeidstaker har ønske om tolk og pdl har denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidstakerOnskerTolkInnenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([harIkkeTolkIPdl, harIkkeTolkIPdl2])(
        "Arbeidstaker har ønske om tolk og pdl har ikke denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidstakerOnskerTolkInnenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.getByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere.",
              {
                exact: false,
              }
            )
          ).to.exist;
        }
      );

      it.each<BrukerinfoDTO>([
        harTolkIPdl,
        harTolkIPdl2,
        harTolkIPdl3,
        harIkkeTolkIPdl,
        harIkkeTolkIPdl2,
      ])(
        "Arbeidstaker har ikke ønske om tolk og pdl har følgende informasjon: (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [arbeidstakerOnskerIkkeTolkInnenforTilfelle],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );
    });

    describe("Arbeidsgiver og arbeidstaker ", () => {
      it.each<BrukerinfoDTO>([harTolkIPdl, harTolkIPdl2, harTolkIPdl3])(
        "Arbeidsgiver og arbeidstaker har ønske om tolk og pdl har denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [
              arbeidsgiverOnskerTolkInnenforTilfelle,
              arbeidstakerOnskerTolkInnenforTilfelle,
            ],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([harIkkeTolkIPdl, harIkkeTolkIPdl2])(
        "Arbeidsgiver og arbeidstaker har ønske om tolk og pdl har ikke denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [
              arbeidsgiverOnskerTolkInnenforTilfelle,
              arbeidstakerOnskerTolkInnenforTilfelle,
            ],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.getByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere.",
              {
                exact: false,
              }
            )
          ).to.exist;
        }
      );
    });
  });

  describe(`Noen har møtebehov utenfor aktivt oppfølgingstilfelle`, () => {
    describe(`Arbeidstaker`, () => {
      it.each<BrukerinfoDTO>([harTolkIPdl, harTolkIPdl2, harTolkIPdl3])(
        "Arbeidstaker har ønske om tolk og pdl har denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidstakerOnskerTolkUtenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([harIkkeTolkIPdl, harIkkeTolkIPdl2])(
        "Arbeidstaker har ønske om tolk og pdl har ikke denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [arbeidstakerOnskerIkkeTolkUtenforTilfelle],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([
        harTolkIPdl,
        harTolkIPdl2,
        harTolkIPdl3,
        harIkkeTolkIPdl,
        harIkkeTolkIPdl2,
      ])(
        "Arbeidstaker har ikke ønske om tolk og pdl har følgende informasjon: (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidstakerOnskerTolkUtenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );
    });

    describe(`Arbeidsgiver`, () => {
      it.each<BrukerinfoDTO>([harTolkIPdl, harTolkIPdl2, harTolkIPdl3])(
        "Arbeidsgiver har ønske om tolk og pdl har denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidsgiverOnskerTolkUtenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([harIkkeTolkIPdl, harIkkeTolkIPdl2])(
        "Arbeidsgiver har ønske om tolk og pdl har ikke denne informasjonen (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [arbeidsgiverOnskerIkkeTolkUtenforTilfelle],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );

      it.each<BrukerinfoDTO>([
        harTolkIPdl,
        harTolkIPdl2,
        harTolkIPdl3,
        harIkkeTolkIPdl,
        harIkkeTolkIPdl2,
      ])(
        "Arbeidsgiver har ikke ønske om tolk og pdl har følgende informasjon: (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov([arbeidsgiverOnskerTolkUtenforTilfelle], brukerinfo);

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );
    });

    describe("Arbeidsgiver og arbeidstaker ", () => {
      it.each<BrukerinfoDTO>([
        harTolkIPdl,
        harTolkIPdl2,
        harTolkIPdl3,
        harIkkeTolkIPdl,
        harIkkeTolkIPdl2,
      ])(
        "Arbeidsgiver og arbeidstaker har ønske om tolk og pdl har følgende informasjon (talesprakTolk: $tilrettelagtKommunikasjon.talesprakTolk, tegnsprakTolk: $tilrettelagtKommunikasjon.tegnsprakTolk) - Ikke vis informasjon om tolk",
        (brukerinfo: BrukerinfoDTO) => {
          mockMotebehov(
            [
              arbeidsgiverOnskerTolkUtenforTilfelle,
              arbeidstakerOnskerTolkUtenforTilfelle,
            ],
            brukerinfo
          );

          renderInfoOmTolk();

          expect(
            screen.queryByText(
              "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere."
            )
          ).to.not.exist;
        }
      );
    });
  });
});
