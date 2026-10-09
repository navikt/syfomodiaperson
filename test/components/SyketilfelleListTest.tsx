import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SyketilfelleList } from "@/components/syketilfelleList/SyketilfelleList.tsx";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { mockOldSykmeldinger } from "../mockdata/sykmeldinger/mockSykmeldinger";

function createTilfelle(
  index: number,
  start = new Date(2024, 0, index + 1),
  end = new Date(2024, 0, index + 8),
): OppfolgingstilfelleDTO {
  return {
    arbeidstakerAtTilfelleEnd: true,
    start,
    end,
    antallSykedager: 7,
    varighetUker: index + 1,
    virksomhetsnummerList: ["123456789"],
  };
}

describe("SyketilfelleList", () => {
  it("viser fem tilfeller som standard og kan utvide/folde sammen listen", async () => {
    const user = userEvent.setup();
    const oppfolgingstilfeller = Array.from({ length: 6 }, (_, index) =>
      createTilfelle(index),
    );
    const sykmeldinger: SykmeldingOldFormat[] = [];

    render(
      <SyketilfelleList
        oppfolgingstilfeller={oppfolgingstilfeller}
        sykmeldinger={sykmeldinger}
      />,
    );

    expect(screen.getAllByText(/\(\d+ uker\)/).length).to.equal(5);
    expect(screen.getByRole("button", { name: "Vis alle" })).to.exist;

    await user.click(screen.getByRole("button", { name: "Vis alle" }));

    expect(screen.getAllByText(/\(\d+ uker\)/).length).to.equal(6);
    expect(screen.getByRole("button", { name: "Vis færre" })).to.exist;

    await user.click(screen.getByRole("button", { name: "Vis færre" }));

    expect(screen.getAllByText(/\(\d+ uker\)/).length).to.equal(5);
    expect(screen.getByRole("button", { name: "Vis alle" })).to.exist;
  });

  it("viser diagnosekode kun for tilfeller med diagnose", () => {
    const oppfolgingstilfeller = [
      createTilfelle(0, new Date("2020-01-01"), new Date("2020-06-01")),
      createTilfelle(1, new Date("2021-01-01"), new Date("2021-02-01")),
    ];
    const sykmeldinger: SykmeldingOldFormat[] = [
      {
        ...mockOldSykmeldinger[0],
        diagnose: {
          ...mockOldSykmeldinger[0].diagnose,
          hoveddiagnose: {
            diagnosekode: "R28",
            diagnose: "Testdiagnose",
            diagnosesystem: "ICD-10",
          },
        },
      },
    ];

    render(
      <SyketilfelleList
        oppfolgingstilfeller={oppfolgingstilfeller}
        sykmeldinger={sykmeldinger}
      />,
    );

    expect(screen.getByText("R28")).to.exist;
    expect(screen.getAllByAltText("Medisinskrin").length).to.equal(1);
  });
});
