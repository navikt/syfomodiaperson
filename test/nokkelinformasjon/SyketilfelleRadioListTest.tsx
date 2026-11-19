import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SyketilfelleRadioList from "@/sider/nokkelinformasjon/sykmeldingsgrad/SyketilfelleRadioList";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { formatNumericDateRange } from "@/utils/datoUtils";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { useState } from "react";

const filterLabel =
  "Vis bare sykefraværstilfeller med varighet utover arbeidsgiverperioden";

let queryClient: QueryClient;

function createTilfelle(
  index: number,
  antallSykedager: number,
  calendarDays = 2,
): OppfolgingstilfelleDTO {
  const start = new Date(2024, 0, 25 - index);
  const end = new Date(start);
  end.setDate(end.getDate() + calendarDays - 1);
  return {
    arbeidstakerAtTilfelleEnd: true,
    start,
    end,
    antallSykedager,
    varighetUker: Math.ceil(antallSykedager / 5),
    virksomhetsnummerList: ["123456789"],
  };
}

function setQueryData(tilfeller: OppfolgingstilfelleDTO[]) {
  const personData: OppfolgingstilfellePersonDTO = {
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    hasGjentakendeSykefravar: false,
    oppfolgingstilfelleList: tilfeller,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent,
    ),
    () => personData,
  );
  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => [],
  );
}

function renderList(
  setSelectedTilfelle: (tilfelle: OppfolgingstilfelleDTO) => void = vi.fn(),
  initialSelectedTilfelle?: OppfolgingstilfelleDTO,
) {
  function TestList() {
    const [selectedTilfelle, setSelectedTilfelleState] = useState(
      initialSelectedTilfelle,
    );

    return (
      <SyketilfelleRadioList
        selectedTilfelle={selectedTilfelle}
        setSelectedTilfelle={(tilfelle) => {
          setSelectedTilfelleState(tilfelle);
          setSelectedTilfelle(tilfelle);
        }}
      />
    );
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <TestList />
    </QueryClientProvider>,
  );
}

function getDateLabel(tilfelle: OppfolgingstilfelleDTO) {
  return formatNumericDateRange(tilfelle.start, tilfelle.end);
}

describe("SyketilfelleRadioList", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
  });

  it("viser ti tilfeller som standard og lar brukeren utvide og folde sammen", async () => {
    const user = userEvent.setup();
    const tilfeller = Array.from({ length: 12 }, (_, index) =>
      createTilfelle(index, 17),
    );
    setQueryData(tilfeller);
    renderList();

    expect(screen.getAllByRole("radio")).to.have.length(10);
    expect(
      screen
        .getByRole("button", { name: "Vis alle" })
        .getAttribute("aria-expanded"),
    ).to.equal("false");
    expect(screen.queryByRole("radio", { name: getDateLabel(tilfeller[10]) }))
      .to.not.exist;

    await user.click(screen.getByRole("button", { name: "Vis alle" }));

    expect(screen.getAllByRole("radio")).to.have.length(12);
    expect(screen.getByRole("radio", { name: getDateLabel(tilfeller[10]) })).to
      .exist;
    expect(
      screen
        .getByRole("button", { name: "Vis færre" })
        .getAttribute("aria-expanded"),
    ).to.equal("true");

    await user.click(screen.getByRole("button", { name: "Vis færre" }));

    expect(screen.getAllByRole("radio")).to.have.length(10);
    expect(screen.queryByRole("radio", { name: getDateLabel(tilfeller[10]) }))
      .to.not.exist;
  });

  it("filtrerer på antall sykedager før visning av ti og kan utvide filtrerte tilfeller", async () => {
    const user = userEvent.setup();
    const tilfeller = Array.from({ length: 25 }, (_, index) =>
      createTilfelle(index, index < 10 ? 16 : 17, index < 10 ? 120 : 2),
    );
    setQueryData(tilfeller);
    renderList();

    expect(screen.getByRole("radio", { name: getDateLabel(tilfeller[0]) })).to
      .exist;
    expect(screen.queryByRole("button", { name: "Vis alle" })).to.exist;

    await user.click(screen.getByRole("checkbox", { name: filterLabel }));

    expect(screen.queryByRole("radio", { name: getDateLabel(tilfeller[0]) })).to
      .not.exist;
    expect(screen.getByRole("radio", { name: getDateLabel(tilfeller[10]) })).to
      .exist;
    expect(screen.getAllByRole("radio")).to.have.length(10);
    expect(screen.getByRole("button", { name: "Vis alle" })).to.exist;

    await user.click(screen.getByRole("button", { name: "Vis alle" }));

    expect(screen.getAllByRole("radio")).to.have.length(15);
    expect(screen.getByRole("radio", { name: getDateLabel(tilfeller[24]) })).to
      .exist;
  });

  it("viser ingen knapp når det er ti eller færre tilfeller", () => {
    setQueryData(
      Array.from({ length: 10 }, (_, index) => createTilfelle(index, 17)),
    );
    renderList();

    expect(screen.getAllByRole("radio")).to.have.length(10);
    expect(screen.queryByRole("button", { name: "Vis alle" })).to.not.exist;
  });

  it("viser tom melding når filteret ikke finner treff, og viser tilfellene igjen når filteret fjernes", async () => {
    const user = userEvent.setup();
    const tilfeller = [createTilfelle(0, 16), createTilfelle(1, 0, 120)];
    const setSelectedTilfelle = vi.fn();
    setQueryData(tilfeller);
    renderList(setSelectedTilfelle, tilfeller[0]);

    await user.click(screen.getByRole("checkbox", { name: filterLabel }));

    expect(
      screen.getByText(
        "Ingen sykefraværstilfeller varer utover arbeidsgiverperioden.",
      ),
    ).to.exist;
    expect(screen.queryAllByRole("radio")).to.have.length(0);
    expect(screen.queryByRole("button", { name: "Vis alle" })).to.not.exist;

    await user.click(screen.getByRole("checkbox", { name: filterLabel }));

    expect(
      screen.queryByText(
        "Ingen sykefraværstilfeller varer utover arbeidsgiverperioden.",
      ),
    ).to.not.exist;
    expect(screen.getAllByRole("radio")).to.have.length(2);
    expect(
      screen.getByRole<HTMLInputElement>("radio", {
        name: getDateLabel(tilfeller[0]),
      }).checked,
    ).to.be.true;
    expect(setSelectedTilfelle).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "velger første treff når filteret skjuler valgt tilfelle (utvidet: %s)",
    async (isExpanded) => {
      const user = userEvent.setup();
      const tilfeller = Array.from({ length: 12 }, (_, index) =>
        createTilfelle(index, index === 0 ? 16 : 17),
      );
      const setSelectedTilfelle = vi.fn();
      setQueryData(tilfeller);
      renderList(setSelectedTilfelle);

      if (isExpanded) {
        await user.click(screen.getByRole("button", { name: "Vis alle" }));
      }
      await user.click(screen.getByRole("checkbox", { name: filterLabel }));

      expect(setSelectedTilfelle).toHaveBeenCalledExactlyOnceWith(tilfeller[1]);
      expect(
        screen.getByRole<HTMLInputElement>("radio", {
          name: getDateLabel(tilfeller[1]),
        }).checked,
      ).to.be.true;
      expect(
        screen.getByRole("button", {
          name: isExpanded ? "Vis færre" : "Vis alle",
        }),
      ).to.exist;

      await user.click(screen.getByRole("checkbox", { name: filterLabel }));

      expect(setSelectedTilfelle).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole<HTMLInputElement>("radio", {
          name: getDateLabel(tilfeller[1]),
        }).checked,
      ).to.be.true;
    },
  );

  it("beholder et valgt tilfelle som matcher filteret, selv når Vis færre skjuler det", async () => {
    const user = userEvent.setup();
    const tilfeller = Array.from({ length: 12 }, (_, index) =>
      createTilfelle(index, 17),
    );
    const setSelectedTilfelle = vi.fn();
    setQueryData(tilfeller);
    renderList(setSelectedTilfelle);

    await user.click(screen.getByRole("button", { name: "Vis alle" }));
    await user.click(
      screen.getByRole("radio", { name: getDateLabel(tilfeller[11]) }),
    );
    setSelectedTilfelle.mockClear();
    await user.click(screen.getByRole("button", { name: "Vis færre" }));
    await user.click(screen.getByRole("checkbox", { name: filterLabel }));

    expect(setSelectedTilfelle).not.toHaveBeenCalled();
    expect(screen.queryByRole("radio", { name: getDateLabel(tilfeller[11]) }))
      .to.not.exist;

    await user.click(screen.getByRole("checkbox", { name: filterLabel }));
    await user.click(screen.getByRole("button", { name: "Vis alle" }));

    expect(
      screen.getByRole<HTMLInputElement>("radio", {
        name: getDateLabel(tilfeller[11]),
      }).checked,
    ).to.be.true;
    expect(screen.getByRole("button", { name: "Vis færre" })).to.exist;
    expect(setSelectedTilfelle).not.toHaveBeenCalled();
  });
});
