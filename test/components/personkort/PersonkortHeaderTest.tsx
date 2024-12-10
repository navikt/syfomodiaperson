import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  queryClientWithAktivBruker,
  setQueryDataWithPersonkortdata,
} from "../../testQueryClient";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  brukerinfoMock,
  maksdato,
  maksdatoMock,
} from "@/mocks/syfoperson/persondataMock";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { daysFromToday } from "../../testUtils";
import dayjs from "dayjs";
import { underArbeidsrettetOppfolgingQueryKeys } from "@/data/veilarboppfolging/useUnderArbeidsrettetOppfolgingQuery";
import { UnderArbeidsrettetOppfolgingResponseDTO } from "@/data/veilarboppfolging/veilarboppfolgingTypes";
import { PersonkortHeader } from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { maksdatoQueryKeys } from "@/data/maksdato/useMaksdatoQuery";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { addDays } from "@/utils/datoUtils";

let queryClient: any;

const renderPersonkortHeader = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetProvider>
        <PersonkortHeader />
      </ValgtEnhetProvider>
    </QueryClientProvider>
  );

describe("PersonkortHeader", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    setQueryDataWithPersonkortdata(queryClient);
  });

  it("viser 'Egenansatt' når isEgenansatt er true fra API", () => {
    queryClient.setQueryData(
      egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
      () => true
    );
    renderPersonkortHeader();

    expect(screen.getByText("Egenansatt")).to.exist;
  });

  it("viser ikke 'Egenansatt' når isEgenansatt er false fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Egenansatt")).not.to.exist;
  });

  it("viser 'Kode 6' når diskresjonskode er 6 fra API", () => {
    queryClient.setQueryData(
      diskresjonskodeQueryKeys.diskresjonskode(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => "6"
    );
    renderPersonkortHeader();

    expect(screen.getByText("Kode 6")).to.exist;
  });

  it("viser 'Kode 7' når diskresjonskode er 7 fra API", () => {
    queryClient.setQueryData(
      diskresjonskodeQueryKeys.diskresjonskode(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => "7"
    );
    renderPersonkortHeader();

    expect(screen.getByText("Kode 7")).to.exist;
  });

  it("viser ingen diskresjonskode når diskresjonskode er tom fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Kode")).not.to.exist;
  });

  it("viser ikke tegnspråktolk eller talespråktolk når tilrettelagtKommunikasjon er null fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Talespråktolk")).to.not.exist;
    expect(screen.queryByText("Tegnspråktolk")).to.not.exist;
  });

  it("viser talespråktolk, men ikke tegnspråktolk", () => {
    const tilrettelagtKommunikasjon = {
      talesprakTolk: {
        value: "NO",
      },
      tegnsprakTolk: null,
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          tilrettelagtKommunikasjon,
        };
      }
    );

    renderPersonkortHeader();

    expect(screen.getByText("Talespråktolk: NO")).to.exist;
    expect(screen.queryByText("Tegnspråktolk")).to.not.exist;
  });

  it("viser talespråktolk og tegnspråktolk samtidig", () => {
    const tilrettelagtKommunikasjon = {
      talesprakTolk: {
        value: "NO",
      },
      tegnsprakTolk: {
        value: "EN",
      },
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          tilrettelagtKommunikasjon,
        };
      }
    );

    renderPersonkortHeader();

    expect(screen.getByText("Talespråktolk: NO")).to.exist;
    expect(screen.getByText("Tegnspråktolk: EN")).to.exist;
  });

  it("viser dødsdato når dato finnes i brukerinfo", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          dodsdato: "2023-02-01",
        };
      }
    );
    renderPersonkortHeader();

    expect(screen.getByText("Død 01.02.2023")).to.exist;
  });

  it("viser ikke dødsdato når det ikke finnes i brukerinfo", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Død")).not.to.exist;
  });

  it("viser maksdato og utbetalt tom fra API", () => {
    renderPersonkortHeader();

    expect(screen.getByText("Maksdato:")).to.exist;
    expect(screen.getByText(dayjs(maksdato).format("DD.MM.YYYY"))).to.exist;
    expect(screen.getByText("Utbetalt tom:")).to.exist;
    expect(screen.getByText("01.07.2024")).to.exist;
  });

  describe("Utbetalingsinfo warning", () => {
    const startDate = addDays(new Date(), -10);
    const endDate = addDays(new Date(), 10);

    const oppfolgingstilfelle = {
      ...oppfolgingstilfellePersonMock,
      oppfolgingstilfelleList: [
        oppfolgingstilfellePersonMock.oppfolgingstilfelleList[0],
        oppfolgingstilfellePersonMock.oppfolgingstilfelleList[1],
        {
          ...oppfolgingstilfellePersonMock.oppfolgingstilfelleList[2],
          start: startDate,
          end: endDate,
        },
      ],
    };

    const utebetalingsinfo = (opprettet: Date) => ({
      ...maksdatoMock,
      maxDate: {
        ...maksdatoMock.maxDate,
        opprettet: opprettet,
      },
    });

    it("viser en infoboks hvis maksdato gjelder et annet oppfølgingstilfelle", () => {
      const opprettet = addDays(new Date(), -20);

      queryClient.setQueryData(
        maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
        () => utebetalingsinfo(opprettet)
      );
      queryClient.setQueryData(
        oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => oppfolgingstilfelle
      );
      renderPersonkortHeader();

      expect(
        screen.getByText(
          "Maksdatoen kan gjelde et tidligere oppfølgingstilfelle."
        )
      ).to.exist;
    });

    it("viser ikke en infoboks hvis maksdato gjelder nåværende oppfølgingstilfelle", () => {
      const opprettet = new Date();

      queryClient.setQueryData(
        maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
        () => utebetalingsinfo(opprettet)
      );
      queryClient.setQueryData(
        oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => oppfolgingstilfelle
      );
      renderPersonkortHeader();

      expect(
        screen.queryByText(
          "Maksdatoen kan gjelde et tidligere oppfølgingstilfelle."
        )
      ).to.not.exist;
    });
  });

  it("viser ikke sikkerhetstiltak-tag når bruker mangler sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [],
      })
    );
    renderPersonkortHeader();

    expect(screen.queryByText("Sikkerhetstiltak")).to.not.exist;
  });

  it("viser sikkerhetstiltak-tag når bruker har sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [
          {
            type: "FYUS",
            beskrivelse: "Fysisk utestengelse",
            gyldigFom: daysFromToday(-10),
            gyldigTom: daysFromToday(10),
          },
        ],
      })
    );
    renderPersonkortHeader();

    expect(screen.getByText("Sikkerhetstiltak")).to.exist;
  });

  it("viser under-arbeidsrettet-oppfølging tag når under arbeidsrettet oppfølging", () => {
    const underArbeidsrettetOppfolging: UnderArbeidsrettetOppfolgingResponseDTO =
      {
        underOppfolging: true,
      };
    queryClient.setQueryData(
      underArbeidsrettetOppfolgingQueryKeys.underArbeidsrettetOppfolging(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => underArbeidsrettetOppfolging
    );
    renderPersonkortHeader();

    expect(screen.getByText("Under arbeidsrettet oppfølging")).to.exist;
  });
});
