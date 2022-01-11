import { render, screen } from "@testing-library/react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import { expect } from "chai";
import React from "react";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";

const navbruker: Brukerinfo = {
  arbeidssituasjon: "",
  navn: "Knut",
  kontaktinfo: {
    fnr: "1234",
  },
};

describe("PersonkortSykmeldt", () => {
  it("Skal vise PersonkortElement", () => {
    render(<PersonkortSykmeldt navbruker={navbruker} personadresse={{}} />);
    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
    expect(screen.getByRole("img", { name: "Bilde av person" })).to.exist;
  });

  it("Skal vise PersonkortInformasjon", () => {
    render(<PersonkortSykmeldt navbruker={navbruker} personadresse={{}} />);
    expect(screen.getByText("F.nummer")).to.exist;
    expect(screen.getByText("Telefon")).to.exist;
    expect(screen.getByText("E-post")).to.exist;
    expect(screen.getByText("Bostedsadresse")).to.exist;
    expect(screen.getByText("Kontaktadresse")).to.exist;
    expect(screen.getByText("Oppholdsadresse")).to.exist;
  });
});
