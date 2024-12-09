import React from "react";
import { describe, expect, it } from "vitest";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { toDateWithoutNullCheck } from "@/utils/datoUtils";
import { render, screen } from "@testing-library/react";
import { PeriodeListe } from "@/sider/sykmeldinger/sykmeldinger/SykmeldingLinkPanel";

const arbeidsgiver = "Arne Arbeidsgiver";
const periodeFlereDager: SykmeldingPeriodeDTO = {
  fom: toDateWithoutNullCheck("2021-06-01"),
  tom: toDateWithoutNullCheck("2021-06-10"),
};
const periodeEnDag: SykmeldingPeriodeDTO = {
  fom: toDateWithoutNullCheck("2021-06-01"),
  tom: toDateWithoutNullCheck("2021-06-01"),
};

describe("SykmeldingPeriodeInfo", () => {
  it("viser tekst med antall dager når sykmeldt flere dager", () => {
    render(
      <PeriodeListe
        perioder={[periodeFlereDager]}
        arbeidsgiver={arbeidsgiver}
      />
    );

    expect(screen.getByText(`Sykmeldt fra ${arbeidsgiver} i 10 dager`)).to
      .exist;
  });

  it("viser tekst med én dag når sykmeldt én dag", () => {
    render(
      <PeriodeListe perioder={[periodeEnDag]} arbeidsgiver={arbeidsgiver} />
    );

    expect(screen.getByText(`Sykmeldt fra ${arbeidsgiver} i 1 dag`)).to.exist;
  });

  it("viser tekst med behandlingsdag når sykmeldt én dag, ingen gradering, med behandlingsdag", () => {
    const perioder: SykmeldingPeriodeDTO[] = [
      {
        ...periodeEnDag,
        behandlingsdager: 1,
      },
    ];
    render(<PeriodeListe perioder={perioder} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`1 behandlingsdag i løpet av 1 dag`)).to.exist;
  });

  it("viser tekst med behandlingsdager når sykmeldt én dag, ingen gradering, med behandlingsdager", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      behandlingsdager: 3,
    };
    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`3 behandlingsdager`)).to.exist;
  });

  it("viser tekst med behandlingsdager når sykmeldt flere dager med behandlingsdager", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      behandlingsdager: 3,
    };
    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`3 behandlingsdager i løpet av 10 dager`)).to.exist;
  });

  it("viser tekst med reisetilskudd hvis sykmeldt én dag, ingen gradering med reisetilskudd", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      reisetilskudd: true,
    };

    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`Reisetilskudd i 1 dag`)).to.exist;
  });

  it("viser tekst med reisetilskudd hvis sykmeldt flere dager med reisetilskudd", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      reisetilskudd: true,
    };

    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`Reisetilskudd i 10 dager`)).to.exist;
  });

  it("viser tekst med reisetilskudd hvis gradert sykmeldt flere dager med reisetilskudd", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      reisetilskudd: true,
      grad: 80,
    };

    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(screen.getByText(`80 % sykmelding med reisetilskudd i 10 dager`)).to
      .exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt én dag", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      avventende: "Avventende",
    };

    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(
      screen.getByText(`Avventende sykmelding fra ${arbeidsgiver} i 1 dag`)
    ).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt flere dager", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      avventende: "Avventende",
    };

    render(<PeriodeListe perioder={[perioder]} arbeidsgiver={arbeidsgiver} />);

    expect(
      screen.getByText(`Avventende sykmelding fra ${arbeidsgiver} i 10 dager`)
    ).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt flere dager uten arbeidsgiver", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      avventende: "Avventende",
    };

    render(<PeriodeListe perioder={[perioder]} />);

    expect(screen.getByText(`Avventende sykemelding i 10 dager`)).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt én dag uten arbeidsgiver", () => {
    const perioder: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      avventende: "Avventende",
    };

    render(<PeriodeListe perioder={[perioder]} />);

    expect(screen.getByText(`Avventende sykemelding i 1 dag`)).to.exist;
  });
});
