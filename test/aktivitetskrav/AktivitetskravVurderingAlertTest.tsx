import {
  avventVurdering,
  avventVurderingUtenFrist,
  createAktivitetskravVurdering,
  expiredForhandsvarselVurdering,
  forhandsvarselVurdering,
} from "../testDataUtils";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { formatDateWithMonthName, formatNumericDate } from "@/utils/datoUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";

import { AktivitetskravVurderingAlert } from "@/sider/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

const renderAktivitetskravVurderingAlert = (
  vurdering: AktivitetskravVurderingDTO,
) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AktivitetskravVurderingAlert vurdering={vurdering} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
  );
};

function getHeading(text: string) {
  return screen.getByRole("heading", {
    name: (name) => name.endsWith(text),
    level: 2,
  });
}

describe("AktivitetskravVurderingAlert", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser advarsel med frist når siste aktivitetskrav-vurdering er AVVENT med frist", () => {
    renderAktivitetskravVurderingAlert(avventVurdering);

    expect(getHeading(`Avventer til ${formatDateWithMonthName(new Date())}`)).to
      .exist;
  });
  it("viser advarsel uten frist når siste aktivitetskrav-vurdering er AVVENT uten frist", () => {
    renderAktivitetskravVurderingAlert(avventVurderingUtenFrist);

    expect(getHeading("Avventer")).to.exist;
  });
  it("viser beskrivelse og årsaker når siste aktivitetskrav-vurdering er AVVENT", () => {
    const beskrivelse = "Avventer litt";
    const vurdering = createAktivitetskravVurdering(
      AktivitetskravStatus.AVVENT,
      [
        AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
        AvventVurderingArsak.DROFTES_MED_ROL,
        AvventVurderingArsak.DROFTES_INTERNT,
      ],
      beskrivelse,
    );
    renderAktivitetskravVurderingAlert(vurdering);

    expect(screen.getByText(beskrivelse)).to.exist;
    expect(screen.getByText("Har bedt om oppfølgingsplan fra arbeidsgiver")).to
      .exist;
    expect(screen.getByText("Har bedt om mer informasjon fra behandler")).to
      .exist;
  });
  it("viser info når siste aktivitetskrav-vurdering er ikke-utløpt FORHANDSVARSEL", () => {
    renderAktivitetskravVurderingAlert(forhandsvarselVurdering);

    expect(
      getHeading(
        `Forhåndsvarsel er sendt ${formatNumericDate(
          forhandsvarselVurdering.createdAt,
        )}`,
      ),
    ).to.exist;
  });
  it("viser warning når siste aktivitetskrav-vurdering er utløpt FORHANDSVARSEL", () => {
    renderAktivitetskravVurderingAlert(expiredForhandsvarselVurdering);

    expect(getHeading("Aktivitetskravet må vurderes")).to.exist;
  });
});
