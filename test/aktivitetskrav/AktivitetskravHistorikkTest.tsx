import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { AktivitetskravHistorikk } from "@/sider/aktivitetskrav/historikk/AktivitetskravHistorikk";
import {
  AktivitetskravStatus,
  AktivitetskravVarselDTO,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { daysFromToday, getButton } from "../testUtils";
import userEvent from "@testing-library/user-event";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  createAktivitetskrav,
  createAktivitetskravVurdering,
} from "../testDataUtils";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import {
  StatusEndring,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";
import { defaultStatusEndring } from "@/mocks/ispengestopp/pengestoppStatusMock";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const today = new Date();
const dayInThePast = daysFromToday(-500);
const enBeskrivelse = "Her er en beskrivelse";
const friskmeldtBeskrivelse = "Arbeidstaker er friskmeldt";
const friskmeldtArsak = "Friskmeldt";
const arsakTitle = "Årsak";
const beskrivelseTitle = "Begrunnelse";
const vurdertAvTitle = "Vurdert av";

const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT,
  [OppfyltVurderingArsak.FRISKMELDT],
  friskmeldtBeskrivelse,
  today
);
const oppfyltVurderingWithoutBeskrivelse: AktivitetskravVurderingDTO = {
  ...oppfyltVurdering,
  beskrivelse: undefined,
};
const ikkeOppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.IKKE_OPPFYLT
);
const unntakVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.UNNTAK,
  [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
  enBeskrivelse,
  dayInThePast
);
const stansVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.INNSTILLING_OM_STANS
);
const varsel: AktivitetskravVarselDTO = {
  uuid: "123",
  createdAt: today,
  svarfrist: daysFromToday(21),
  document: [
    {
      type: DocumentComponentType.HEADER_H1,
      texts: [enBeskrivelse],
    },
  ],
};

const forhandsvarselVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.FORHANDSVARSEL,
  [],
  enBeskrivelse,
  today,
  undefined,
  daysFromToday(21),
  varsel
);

const renderAktivitetskravHistorikk = (
  vurderinger: AktivitetskravVurderingDTO[],
  statuser: StatusEndring[] = []
) => {
  const aktivitetskrav = createAktivitetskrav(
    daysFromToday(20),
    vurderinger[0].status,
    vurderinger
  );
  queryClient.setQueryData(aktivitetskravQueryKeys.aktivitetskrav(fnr), () => [
    aktivitetskrav,
  ]);
  queryClient.setQueryData(
    pengestoppStatusQueryKeys.pengestoppStatus(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => statuser
  );
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AktivitetskravHistorikk />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("AktivitetskravHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
      () => VEILEDER_DEFAULT
    );
  });
  it("viser klikkbar overskrift for hver vurdering, sortert etter dato - nyeste øverst", () => {
    renderAktivitetskravHistorikk([
      forhandsvarselVurdering,
      unntakVurdering,
      oppfyltVurdering,
    ]);

    const allButtons = screen.getAllByRole("button");
    const vurderingButtons = allButtons.filter(
      (button) => button.textContent !== "Se hele brevet"
    );
    expect(vurderingButtons[0].textContent).to.contain(
      `Forhåndsvarsel - ${tilDatoMedManedNavn(today)}`
    );
    expect(vurderingButtons[1].textContent).to.contain(
      `Oppfylt - ${tilDatoMedManedNavn(today)}`
    );
    expect(vurderingButtons[2].textContent).to.contain(
      `Unntak - ${tilDatoMedManedNavn(dayInThePast)}`
    );
  });
  it("klikk på overskrift viser årsak med tittel, beskrivelse med tittel og veileder-navn", async () => {
    renderAktivitetskravHistorikk([oppfyltVurdering]);

    const vurderingButton = screen.getByRole("button");
    await userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(screen.getByText(friskmeldtArsak)).to.exist;
    expect(screen.getByText(beskrivelseTitle)).to.exist;
    expect(screen.getByText(friskmeldtBeskrivelse)).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("klikk på overskrift viser årsak med tittel og veileder-navn, uten beskrivelse og tittel hvis beskrivelse mangler", async () => {
    renderAktivitetskravHistorikk([oppfyltVurderingWithoutBeskrivelse]);

    const vurderingButton = screen.getByRole("button");
    await userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(screen.getByText(friskmeldtArsak)).to.exist;
    expect(screen.queryByText(beskrivelseTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtBeskrivelse)).to.not.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("klikk på overskrift viser kun veiledernavn hvis årsak og beskrivelse mangler", async () => {
    renderAktivitetskravHistorikk([ikkeOppfyltVurdering]);

    const vurderingButton = screen.getByRole("button");
    await userEvent.click(vurderingButton);

    expect(screen.queryByText(arsakTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtArsak)).to.not.exist;
    expect(screen.queryByText(beskrivelseTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtBeskrivelse)).to.not.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("viser riktig overskrift for INNSTILLING_OM_STANS-vurdering", () => {
    renderAktivitetskravHistorikk([stansVurdering]);

    expect(getButton(`Innstilling om stans - ${tilDatoMedManedNavn(today)}`)).to
      .exist;
  });
  it("viser riktig overskrift for IKKE_OPPFYLT-vurdering", () => {
    renderAktivitetskravHistorikk([ikkeOppfyltVurdering]);

    expect(getButton(`Ikke oppfylt - ${tilDatoMedManedNavn(today)}`)).to.exist;
  });
  it("viser årsaker og beskrivelse for AVVENT-vurdering", async () => {
    const avventVurdering = createAktivitetskravVurdering(
      AktivitetskravStatus.AVVENT,
      [
        AvventVurderingArsak.DROFTES_MED_ROL,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
      ],
      "Avventer litt"
    );
    renderAktivitetskravHistorikk([avventVurdering]);

    const vurderingButton = screen.getByRole("button");
    await userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(
      screen.getByText(
        "Drøftes med ROL, Har bedt om mer informasjon fra behandler"
      )
    ).to.exist;
    expect(screen.getByText("Beskrivelse")).to.exist;
    expect(screen.getByText("Avventer litt")).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("Viser knapp for å se hele forhåndsvarsel-brevet dersom vurderingen var et forhåndsvarsel", async () => {
    renderAktivitetskravHistorikk([forhandsvarselVurdering]);

    const vurderingAccordion = screen.getByRole("button");
    await userEvent.click(vurderingAccordion);
    const button = screen.getByRole("button", { name: "Se hele brevet" });

    expect(screen.getByText(beskrivelseTitle)).to.exist;
    expect(screen.getByText(enBeskrivelse)).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
    expect(button).to.exist;

    await userEvent.click(button);

    const previewModal = screen.getByRole("dialog", { hidden: true });

    expect(
      within(previewModal).getByRole("heading", {
        name: enBeskrivelse,
        hidden: true,
      })
    ).to.exist;
  });
  describe("Har vurderinger og statusendringer", () => {
    it("Viser forekomster av vurderinger og statusendringer sortert på dato i synkende rekkefølge", () => {
      const statusendringer: StatusEndring[] = [
        {
          ...defaultStatusEndring,
          opprettet: "2025-02-21T08:00:00.000Z",
          arsakList: [{ type: ValidSykepengestoppArsakType.MEDISINSK_VILKAR }],
        },
        {
          ...defaultStatusEndring,
          opprettet: "2025-02-20T08:00:00.000Z",
          arsakList: [{ type: ValidSykepengestoppArsakType.AKTIVITETSKRAV }],
        },
      ];

      const vurderinger: AktivitetskravVurderingDTO[] = [
        {
          ...forhandsvarselVurdering,
          createdAt: new Date("2025-02-15T08:00:00.000Z"),
        },
        {
          ...stansVurdering,
          createdAt: new Date("2025-02-16T08:00:00.000Z"),
        },
        {
          ...forhandsvarselVurdering,
          createdAt: new Date("2025-02-21T08:00:00.000Z"),
        },
        {
          ...stansVurdering,
          createdAt: new Date("2025-02-22T08:00:00.000Z"),
        },
      ];

      renderAktivitetskravHistorikk(vurderinger, statusendringer);

      const accordionButtons = screen.getAllByRole("button");

      expect(accordionButtons.length).toBe(5);

      expect(accordionButtons[0].textContent).to.contain(
        "Innstilling om stans - 22. februar 2025"
      );
      expect(accordionButtons[1].textContent).to.contain(
        "Forhåndsvarsel - 21. februar 2025"
      );
      expect(accordionButtons[2].textContent).to.contain(
        "Automatisk utbetaling stanset - 20. februar 2025"
      );
      expect(accordionButtons[3].textContent).to.contain(
        "Innstilling om stans - 16. februar 2025"
      );
      expect(accordionButtons[4].textContent).to.contain(
        "Forhåndsvarsel - 15. februar 2025"
      );
    });
  });
});
