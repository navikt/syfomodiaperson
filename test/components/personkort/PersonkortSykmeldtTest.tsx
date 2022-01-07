import { render } from "@testing-library/react";
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
    const komponent = render(
      <PersonkortSykmeldt navbruker={navbruker} personadresse={{}} />
    );
    expect(komponent.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
    expect(komponent.getByRole("img", { name: "Bilde av person" })).to.exist;
  });

  it("Skal vise PersonkortInformasjon", () => {
    const komponent = render(
      <PersonkortSykmeldt navbruker={navbruker} personadresse={{}} />
    );
    expect(komponent.getByText("F.nummer")).to.exist;
    expect(komponent.getByText("Telefon")).to.exist;
    expect(komponent.getByText("E-post")).to.exist;
    expect(komponent.getByText("Bostedsadresse")).to.exist;
    expect(komponent.getByText("Kontaktadresse")).to.exist;
    expect(komponent.getByText("Oppholdsadresse")).to.exist;
  });
});
