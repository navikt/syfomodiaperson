import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  SvarType,
  VarselSvarDTO,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  ENHET_GRUNERLOKKA,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { MoteSvarHistorikk } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikk";
import { queryClientWithMockData } from "../testQueryClient";
import { expect, describe, it, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;

type InnkallingSvar = Pick<VarselSvarDTO, "svarType" | "svarTekst">;
const varselAT = (
  svar: InnkallingSvar,
  varselType: MotedeltakerVarselType
): DialogmotedeltakerArbeidstakerVarselDTO => ({
  uuid: "123",
  createdAt: "2021-05-26T12:56:26.271381",
  varselType,
  digitalt: true,
  lestDato: "2021-05-26T12:56:26.271381",
  fritekst: "Ipsum lorum arbeidstaker",
  document: [],
  svar: {
    ...svar,
    svarTidspunkt: "2021-05-26T12:56:26.271381",
  },
});
const varselAG = (
  svar: InnkallingSvar,
  varselType: MotedeltakerVarselType
): DialogmotedeltakerArbeidsgiverVarselDTO => ({
  uuid: "456",
  createdAt: "2021-05-26T12:56:26.282386",
  varselType,
  lestDato: "2021-05-26T12:56:26.271381",
  fritekst: "Ipsum lorum arbeidsgiver",
  document: [],
  status: "Status",
  svar: {
    ...svar,
    svarTidspunkt: "2021-05-26T12:56:26.271381",
  },
});
const ferdigstiltMote: DialogmoteDTO = {
  uuid: "1",
  createdAt: "2021-05-26T12:56:26.238385",
  updatedAt: "2021-05-26T12:56:26.238385",
  status: DialogmoteStatus.FERDIGSTILT,
  opprettetAv: VEILEDER_IDENT_DEFAULT,
  tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  arbeidstaker: {
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    type: "ARBEIDSTAKER",
    varselList: [
      varselAT(
        {
          svarType: SvarType.KOMMER,
        },
        MotedeltakerVarselType.INNKALT
      ),
      varselAT(
        {
          svarType: SvarType.KOMMER,
        },
        MotedeltakerVarselType.NYTT_TID_STED
      ),
    ],
  },
  arbeidsgiver: {
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: "ARBEIDSGIVER",
    varselList: [
      varselAG(
        {
          svarType: SvarType.NYTT_TID_STED,
        },
        MotedeltakerVarselType.INNKALT
      ),
      varselAG(
        {
          svarType: SvarType.KOMMER,
        },
        MotedeltakerVarselType.NYTT_TID_STED
      ),
    ],
  },
  sted: "Sted",
  tid: "2021-01-15T11:52:13.539843",
  referatList: [],
};
const avlystMote: DialogmoteDTO = {
  uuid: "10",
  createdAt: "2020-05-26T12:56:26.238385",
  updatedAt: "2020-05-26T12:56:26.238385",
  status: DialogmoteStatus.AVLYST,
  opprettetAv: VEILEDER_IDENT_DEFAULT,
  tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  arbeidstaker: {
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    type: "ARBEIDSTAKER",
    varselList: [
      varselAT(
        {
          svarType: SvarType.KOMMER_IKKE,
          svarTekst: "Syk",
        },
        MotedeltakerVarselType.INNKALT
      ),
      {
        uuid: "abc",
        createdAt: "2021-05-26T12:56:26.271381",
        varselType: MotedeltakerVarselType.AVLYST,
        digitalt: true,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidstaker",
        document: [],
      },
    ],
  },
  arbeidsgiver: {
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: "ARBEIDSGIVER",
    varselList: [
      varselAG(
        {
          svarType: SvarType.KOMMER,
        },
        MotedeltakerVarselType.INNKALT
      ),
      {
        uuid: "def",
        createdAt: "2021-05-26T12:56:26.282386",
        varselType: MotedeltakerVarselType.AVLYST,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidsgiver",
        document: [],
        status: "Status",
      },
    ],
  },
  sted: "Sted",
  tid: "2020-03-22T11:52:13.539843",
  referatList: [],
};

const renderMoteSvarHistorikk = (historiskeMoter: DialogmoteDTO[]) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MoteSvarHistorikk historiskeMoter={historiskeMoter} />
    </QueryClientProvider>
  );
};

describe("MoteSvarHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("viser accordion for hvert møte", () => {
    renderMoteSvarHistorikk([ferdigstiltMote, avlystMote]);

    const accordions = screen.getAllByRole("button");
    expect(accordions.length).to.equal(2);
    expect(accordions[0].textContent).to.contain("Møte 15. januar 2021");
    expect(accordions[1].textContent).to.contain("Avlyst møte 22. mars 2020");
  });
  it("viser sted og veileder for møte", async () => {
    renderMoteSvarHistorikk([ferdigstiltMote]);

    const accordion = screen.getByRole("button", {
      name: "Møte 15. januar 2021",
    });
    await userEvent.click(accordion);

    expect(screen.getByText("Sted: Sted")).to.exist;
    expect(screen.getByText(`Innkalt av: ${VEILEDER_DEFAULT.fulltNavn()}`)).to
      .exist;
  });
  it("viser innkalling og endring med svar for ferdigstilt møte", async () => {
    renderMoteSvarHistorikk([ferdigstiltMote]);

    const accordion = screen.getByRole("button");
    await userEvent.click(accordion);

    expect(screen.getByText("Innkalling sendt 26. mai 2021 - svar:")).to.exist;
    expect(screen.getByText("Endret tid/sted sendt 26. mai 2021 - svar:")).to
      .exist;

    assertExpandableWithHeader(
      `${ARBEIDSTAKER_DEFAULT_FULL_NAME}, kommer - Svar mottatt 26.05.2021`,
      2
    );
    assertExpandableWithHeader(
      `${NARMESTE_LEDER_DEFAULT.navn}, kommer - Svar mottatt 26.05.2021`
    );
    assertExpandableWithHeader(
      `${NARMESTE_LEDER_DEFAULT.navn}, ønsker å endre tidspunkt eller sted - Svar mottatt 26.05.2021`
    );
  });
  it("viser innkalling med svar for avlyst møte", async () => {
    renderMoteSvarHistorikk([avlystMote]);

    const accordion = screen.getByRole("button");
    await userEvent.click(accordion);

    assertExpandableWithHeader(
      `${NARMESTE_LEDER_DEFAULT.navn}, kommer - Svar mottatt 26.05.2021`
    );
    assertExpandableWithHeader(
      `${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ønsker å avlyse - Svar mottatt 26.05.2021`
    );
    expect(screen.getByText("Begrunnelse")).to.exist;
    expect(screen.getByText("Syk")).to.exist;
  });
});

const assertExpandableWithHeader = (header: string, count = 1) => {
  expect(screen.getAllByRole("region", { name: header })).to.have.length(count);
};
