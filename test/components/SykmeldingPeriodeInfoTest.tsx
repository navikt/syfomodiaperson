import React from "react";
import { expect } from "chai";
import SykmeldingPeriodeInfo from "../../src/components/speiling/sykmeldinger/sykmeldinger/SykmeldingPeriodeInfo";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { toDateWithoutNullCheck } from "@/utils/datoUtils";
import { render } from "@testing-library/react";

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
    const wrapper = render(
      <SykmeldingPeriodeInfo
        periode={periodeFlereDager}
        arbeidsgiver={arbeidsgiver}
      />
    );

    expect(wrapper.getByText(`Sykmeldt fra ${arbeidsgiver} i 10 dager`)).to
      .exist;
  });

  it("viser tekst med én dag når sykmeldt én dag", () => {
    const wrapper = render(
      <SykmeldingPeriodeInfo
        periode={periodeEnDag}
        arbeidsgiver={arbeidsgiver}
      />
    );

    expect(wrapper.getByText(`Sykmeldt fra ${arbeidsgiver} i 1 dag`)).to.exist;
  });

  it("viser tekst med behandlingsdag når sykmeldt én dag, ingen gradering, med behandlingsdag", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      behandlingsdager: 1,
    };
    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`1 behandlingsdag i løpet av 1 dag`)).to.exist;
  });

  it("viser tekst med behandlingsdager når sykmeldt én dag, ingen gradering, med behandlingsdager", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      behandlingsdager: 3,
    };
    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`3 behandlingsdager`)).to.exist;
  });

  it("viser tekst med behandlingsdager når sykmeldt flere dager med behandlingsdager", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      behandlingsdager: 3,
    };
    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`3 behandlingsdager i løpet av 10 dager`)).to
      .exist;
  });

  it("viser tekst med reisetilskudd hvis sykmeldt én dag, ingen gradering med reisetilskudd", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      reisetilskudd: true,
    };

    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`Reisetilskudd i 1 dag`)).to.exist;
  });

  it("viser tekst med reisetilskudd hvis sykmeldt flere dager med reisetilskudd", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      reisetilskudd: true,
    };

    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`Reisetilskudd i 10 dager`)).to.exist;
  });

  it("viser tekst med reisetilskudd hvis gradert sykmeldt flere dager med reisetilskudd", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      reisetilskudd: true,
      grad: 80,
    };

    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(wrapper.getByText(`80 % sykmelding med reisetilskudd i 10 dager`)).to
      .exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt én dag", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      avventende: "Avventende",
    };

    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(
      wrapper.getByText(`Avventende sykmelding fra ${arbeidsgiver} i 1 dag`)
    ).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt flere dager", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      avventende: "Avventende",
    };

    const wrapper = render(
      <SykmeldingPeriodeInfo periode={periode} arbeidsgiver={arbeidsgiver} />
    );

    expect(
      wrapper.getByText(`Avventende sykmelding fra ${arbeidsgiver} i 10 dager`)
    ).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt flere dager uten arbeidsgiver", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeFlereDager,
      avventende: "Avventende",
    };

    const wrapper = render(<SykmeldingPeriodeInfo periode={periode} />);

    expect(wrapper.getByText(`Avventende sykemelding i 10 dager`)).to.exist;
  });

  it("viser tekst avventende hvis avventende sykmeldt én dag uten arbeidsgiver", () => {
    const periode: SykmeldingPeriodeDTO = {
      ...periodeEnDag,
      avventende: "Avventende",
    };

    const wrapper = render(<SykmeldingPeriodeInfo periode={periode} />);

    expect(wrapper.getByText(`Avventende sykemelding i 1 dag`)).to.exist;
  });
});
