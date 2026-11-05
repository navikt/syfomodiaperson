import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import BistandsbehovHistorikk from "@/sider/sykmeldinger/historikk/BistandsbehovHistorikk";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

function makePersonOppgave({
  uuid,
  type = PersonOppgaveType.BEHANDLER_BER_OM_BISTAND,
  opprettet,
  behandletTidspunkt = null,
  behandletVeilederIdent = null,
}: {
  uuid: string;
  type?: PersonOppgaveType;
  opprettet: Date;
  behandletTidspunkt?: Date | null;
  behandletVeilederIdent?: string | null;
}): PersonOppgave {
  return {
    uuid,
    referanseUuid: uuid,
    fnr: "123",
    virksomhetsnummer: "123456789",
    type,
    opprettet,
    behandletTidspunkt,
    behandletVeilederIdent,
    duplikatReferanseUuid: null,
  };
}

function renderHistorikk(
  oppgaver: PersonOppgave[],
  isLoading = false,
  isError = false,
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BistandsbehovHistorikk
        oppgaver={oppgaver}
        isLoading={isLoading}
        isError={isError}
      />
    </QueryClientProvider>,
  );
}

describe("BistandsbehovHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser tom historikk når det ikke finnes oppgaver", () => {
    renderHistorikk([]);

    expect(screen.getByText("Det finnes ingen tidligere bistandsbehov.")).to
      .exist;
    expect(screen.queryByRole("button")).to.not.exist;
  });

  it("viser oppgaver sortert etter mottatt dato og utelater andre oppgavetyper", async () => {
    const behandletDato = new Date("2025-01-10T00:00:00.000Z");
    const opprettetEldst = new Date("2025-01-03T00:00:00.000Z");
    const opprettetNyest = new Date("2025-02-01T00:00:00.000Z");
    const annenOppgave = makePersonOppgave({
      uuid: "annen",
      type: PersonOppgaveType.DIALOGMOTESVAR,
      opprettet: new Date("2025-03-01T00:00:00.000Z"),
    });
    const behandletOppgave = makePersonOppgave({
      uuid: "behandlet",
      opprettet: opprettetEldst,
      behandletTidspunkt: behandletDato,
      behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
    });
    const ubehandletOppgave = makePersonOppgave({
      uuid: "ubehandlet",
      opprettet: opprettetNyest,
    });

    renderHistorikk([behandletOppgave, annenOppgave, ubehandletOppgave]);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).to.equal(
      `Bistandsbehov - ${formatDateWithMonthName(opprettetNyest)}`,
    );
    expect(buttons[1].textContent).to.equal(
      `Bistandsbehov - ${formatDateWithMonthName(opprettetEldst)}`,
    );
    expect(screen.queryByText(formatDateWithMonthName(annenOppgave.opprettet)))
      .to.not.exist;

    await userEvent.click(buttons[0]);
    expect(screen.getByText("Ubehandlet")).to.exist;
    expect(screen.getByText(formatDateWithMonthName(opprettetNyest))).to.exist;

    await userEvent.click(buttons[1]);
    expect(screen.getByText("Behandlet", { selector: "p" })).to.exist;
    expect(screen.getByText(formatDateWithMonthName(behandletDato))).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });

  it("viser ikke tom historikk mens oppgavene lastes eller ved feil", () => {
    const { rerender } = renderHistorikk([], true);

    expect(screen.getByText("Laster historikk …")).to.exist;
    expect(screen.queryByText("Det finnes ingen tidligere bistandsbehov.")).to
      .not.exist;

    rerender(
      <QueryClientProvider client={queryClient}>
        <BistandsbehovHistorikk oppgaver={[]} isLoading={false} isError />
      </QueryClientProvider>,
    );
    expect(screen.getByText("Kunne ikke hente historikken.")).to.exist;
    expect(screen.queryByText("Det finnes ingen tidligere bistandsbehov.")).to
      .not.exist;
  });
});
