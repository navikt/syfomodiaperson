import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SyketilfelleList } from "@/components/syketilfelleList/SyketilfelleList.tsx";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import {
  mockSykmeldinger,
  mockSykmeldingId,
} from "../mockdata/sykmeldinger/mockSykmeldinger";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";

function createTilfelle(
  varighetUker: number,
  start: Date,
  end: Date,
): OppfolgingstilfelleDTO {
  return {
    arbeidstakerAtTilfelleEnd: true,
    start,
    end,
    antallSykedager: 7,
    varighetUker,
    virksomhetsnummerList: ["123456789"],
  };
}

function getRowByPeriod(periodText: string): HTMLElement {
  const row = screen.getByText(periodText).closest("div");
  expect(row).to.exist;
  return row as HTMLElement;
}

function mockQueryData(
  queryClient: QueryClient,
  oppfolgingstilfeller: OppfolgingstilfelleDTO[],
  sykmeldinger: SykmeldingNewFormatDTO[],
) {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    hasGjentakendeSykefravar: false,
    oppfolgingstilfelleList: oppfolgingstilfeller,
  };

  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent,
    ),
    () => oppfolgingstilfellePerson,
  );
  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmeldinger,
  );
}

function renderSyketilfelleList(queryClient: QueryClient) {
  render(
    <QueryClientProvider client={queryClient}>
      <SyketilfelleList />
    </QueryClientProvider>,
  );
}

describe("SyketilfelleList", () => {
  it("viser fem tilfeller som standard og kan utvide/folde sammen listen", async () => {
    const user = userEvent.setup();
    const queryClient = queryClientWithAktivBruker();
    const oppfolgingstilfeller = [
      createTilfelle(6, new Date("2024-01-06"), new Date("2024-01-13")),
      createTilfelle(5, new Date("2024-01-05"), new Date("2024-01-12")),
      createTilfelle(4, new Date("2024-01-04"), new Date("2024-01-11")),
      createTilfelle(3, new Date("2024-01-03"), new Date("2024-01-10")),
      createTilfelle(2, new Date("2024-01-02"), new Date("2024-01-09")),
      createTilfelle(1, new Date("2024-01-01"), new Date("2024-01-08")),
    ];
    mockQueryData(queryClient, oppfolgingstilfeller, []);
    renderSyketilfelleList(queryClient);

    const firstRow = getRowByPeriod("06.01.2024 - 13.01.2024");
    expect(within(firstRow).getByText("(6 uker)")).to.exist;
    const secondRow = getRowByPeriod("05.01.2024 - 12.01.2024");
    expect(within(secondRow).getByText("(5 uker)")).to.exist;
    const thirdRow = getRowByPeriod("04.01.2024 - 11.01.2024");
    expect(within(thirdRow).getByText("(4 uker)")).to.exist;
    const fourthRow = getRowByPeriod("03.01.2024 - 10.01.2024");
    expect(within(fourthRow).getByText("(3 uker)")).to.exist;
    const fifthRow = getRowByPeriod("02.01.2024 - 09.01.2024");
    expect(within(fifthRow).getByText("(2 uker)")).to.exist;
    expect(screen.queryByText("01.01.2024 - 08.01.2024")).to.not.exist;
    expect(screen.getByRole("button", { name: "Vis alle" })).to.exist;

    await user.click(screen.getByRole("button", { name: "Vis alle" }));

    const sixthRow = getRowByPeriod("01.01.2024 - 08.01.2024");
    expect(within(sixthRow).getByText("(1 uker)")).to.exist;
    expect(screen.getByRole("button", { name: "Vis færre" })).to.exist;

    await user.click(screen.getByRole("button", { name: "Vis færre" }));

    expect(screen.queryByText("01.01.2024 - 08.01.2024")).to.not.exist;
    expect(screen.getByText("02.01.2024 - 09.01.2024")).to.exist;
    expect(screen.getByRole("button", { name: "Vis alle" })).to.exist;
  });

  it("viser diagnosekode kun for tilfeller med diagnose", () => {
    const queryClient = queryClientWithAktivBruker();
    const oppfolgingstilfeller = [
      createTilfelle(1, new Date("2020-01-01"), new Date("2020-06-01")),
      createTilfelle(2, new Date("2021-01-01"), new Date("2021-02-01")),
    ];
    const sykmeldinger: SykmeldingNewFormatDTO[] = [
      {
        ...mockSykmeldinger[0],
        id: mockSykmeldingId,
        sykmeldingsperioder: [
          {
            ...mockSykmeldinger[0].sykmeldingsperioder[0],
            fom: "2020-01-22",
            tom: "2020-05-22",
          },
        ],
        medisinskVurdering: {
          ...mockSykmeldinger[0].medisinskVurdering,
          hovedDiagnose: {
            kode: "R28",
            system: "ICD-10",
          },
          biDiagnoser: [],
          svangerskap: false,
          yrkesskade: false,
        },
      },
    ];
    mockQueryData(queryClient, oppfolgingstilfeller, sykmeldinger);
    renderSyketilfelleList(queryClient);

    const firstRow = getRowByPeriod("01.01.2021 - 01.02.2021");
    expect(within(firstRow).getByText("(2 uker)")).to.exist;
    const firstDiagnoseCell = firstRow.nextElementSibling as HTMLElement;
    expect(firstDiagnoseCell).to.exist;
    expect(within(firstDiagnoseCell).queryByText("R28")).to.not.exist;
    expect(within(firstDiagnoseCell).queryByAltText("Medisinskrin")).to.not
      .exist;

    const secondRow = getRowByPeriod("01.01.2020 - 01.06.2020");
    expect(within(secondRow).getByText("(1 uker)")).to.exist;
    const secondDiagnoseCell = secondRow.nextElementSibling as HTMLElement;
    expect(secondDiagnoseCell).to.exist;
    expect(within(secondDiagnoseCell).getByText("R28")).to.exist;
    expect(within(secondDiagnoseCell).getByAltText("Medisinskrin")).to.exist;
  });
});
