import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SenOppfolgingHistorikk } from "@/sider/senoppfolging/historikk/SenOppfolgingHistorikk";
import { ferdigbehandletKandidatMock } from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import React from "react";
import { generateUUID } from "@/utils/uuidUtils";
import { addWeeks, toDatePrettyPrint } from "@/utils/datoUtils";
import {
  OnskerOppfolging,
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { queryClientWithMockData } from "../testQueryClient";

const kandidatSvartOgVarsletMock = ferdigbehandletKandidatMock;
const enBegrunnelse = "Tatt telefon";
const kandidatSvartIkkeVarsletMock = {
  ...ferdigbehandletKandidatMock,
  uuid: generateUUID(),
  varselAt: undefined,
  svar: {
    onskerOppfolging: OnskerOppfolging.NEI,
    svarAt: addWeeks(new Date(), -59),
  },
  vurderinger: [
    {
      uuid: generateUUID(),
      begrunnelse: enBegrunnelse,
      createdAt: addWeeks(new Date(), -60),
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      veilederident: VEILEDER_IDENT_DEFAULT,
    },
  ],
};

let queryClient: QueryClient;

const renderSenOppfolgingHistorikk = (
  historikk: SenOppfolgingKandidatResponseDTO[]
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <SenOppfolgingHistorikk historikk={historikk} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("SenOppfolgingHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("renders accordions for each kandidat", () => {
    renderSenOppfolgingHistorikk([
      kandidatSvartOgVarsletMock,
      kandidatSvartIkkeVarsletMock,
    ]);

    expect(
      screen.getByRole("button", {
        name: `Sykmeldte fikk varsel ${toDatePrettyPrint(
          kandidatSvartOgVarsletMock.varselAt
        )}`,
      })
    ).to.exist;
    expect(
      screen.getByRole("button", {
        name: `Sykmeldte svarte ${toDatePrettyPrint(
          kandidatSvartIkkeVarsletMock.svar?.svarAt
        )}`,
      })
    ).to.exist;
  });

  it("renders varsel, svar and vurdering in accordion", async () => {
    const varselAt = kandidatSvartOgVarsletMock.varselAt;
    const svarAt = kandidatSvartOgVarsletMock.svar?.svarAt;
    const vurdering = kandidatSvartOgVarsletMock.vurderinger[0];

    renderSenOppfolgingHistorikk([kandidatSvartOgVarsletMock]);

    expect(
      screen.getAllByText(
        `Sykmeldte fikk varsel ${toDatePrettyPrint(varselAt)}`
      )
    ).to.not.be.empty;
    expect(
      screen.getByText(
        `Sykmeldte svarte ${toDatePrettyPrint(svarAt)}: Ønsker oppfølging`
      )
    ).to.exist;
    expect(
      screen.getByText(
        `Vurdert av ${VEILEDER_DEFAULT.fulltNavn()} ${toDatePrettyPrint(
          vurdering.createdAt
        )}`
      )
    );
    expect(screen.getByText("Begrunnelse mangler")).to.exist;
  });

  it("renders begrunnelse in accordion", async () => {
    renderSenOppfolgingHistorikk([kandidatSvartIkkeVarsletMock]);

    expect(screen.getByText(enBegrunnelse)).to.exist;
  });
});
