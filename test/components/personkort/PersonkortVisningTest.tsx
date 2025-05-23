import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { QueryClientProvider } from "@tanstack/react-query";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { fastlegerMock } from "@/mocks/fastlegerest/fastlegerMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import { daysFromToday } from "../../testUtils";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { behandlendeEnhetMockResponse } from "@/mocks/syfobehandlendeenhet/behandlendeEnhetMock";

let queryClient: any;

describe("PersonkortVisning", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    stubFastlegerApi();
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={""} />
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", async () => {
    const expectedLegeNavn = `${fastlegerMock[0].fornavn} ${fastlegerMock[0].etternavn}`;
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={PERSONKORTVISNING_TYPE.LEGE} />
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: expectedLegeNavn })).to
      .exist;
  });

  it("Skal vise VisningEnhet, dersom visning for enhet er valgt", async () => {
    const enhetNavn = "NAV Oppfølging utland";
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => behandlendeEnhetMockResponse
    );
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={PERSONKORTVISNING_TYPE.ENHET} />
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: enhetNavn })).to.exist;
  });

  it("Viser sikkerhetstiltak med beskrivelse og gyldighet dersom visning for Sikkerhetstiltak er valgt", () => {
    const tenDaysAgo = daysFromToday(-10);
    const inTenDays = daysFromToday(10);
    const expectedGyldighetText = `Gyldig: ${tilLesbarPeriodeMedArUtenManednavn(
      tenDaysAgo,
      inTenDays
    )}`;

    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [
          {
            type: "FYUS",
            beskrivelse: "Fysisk utestengelse",
            gyldigFom: tenDaysAgo,
            gyldigTom: inTenDays,
          },
        ],
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={PERSONKORTVISNING_TYPE.SIKKERHETSTILTAK} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Fysisk utestengelse")).to.exist;
    expect(screen.getByText(expectedGyldighetText)).to.exist;
  });
});
