import React from "react";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import UtdypendeOpplysninger from "../../../src/components/motebehov/UtdypendeOpplysninger";

describe("UtdypendeOpplysninger", () => {
  let komponent;
  let sykmelding;

  beforeEach(() => {
    sykmelding = {
      utdypendeOpplysninger: {
        grupper: [],
        henvisningUtredningBehandling: null,
        paavirkningArbeidsevne: null,
        resultatAvBehandling: null,
        sykehistorie: null,
        sykehistoriePunkt63: null,
        henvisningUtredningBehandlingPunkt63: null,
      },
    };
    komponent = shallow(<UtdypendeOpplysninger sykmelding={sykmelding} />);
  });

  it("Skal gi ingenting hvis ingen utdypendeOpplysninger", () => {
    komponent = mount(
      <UtdypendeOpplysninger sykmelding={sykmeldingUtenUtdypendeOpplysninger} />
    );
    expect(komponent.exists("div")).to.equal(false);
  });

  it("Skal gi elementer hvis de gamle punktene i sykmeldingen er utfylt", () => {
    komponent = mount(
      <UtdypendeOpplysninger sykmelding={sykmeldingMedGamlePunkter} />
    );
    expect(komponent.exists("div")).to.equal(true);
  });

  it("Skal gi elementer hvis de nye punktene i sykmeldingen er utfylt", () => {
    komponent = mount(
      <UtdypendeOpplysninger sykmelding={sykmeldingMedNyePunkter} />
    );
    expect(komponent.exists("div")).to.equal(true);
  });
});

const sykmeldingUtenUtdypendeOpplysninger = {
  utdypendeOpplysninger: {
    grupper: [],
    henvisningUtredningBehandling: null,
    paavirkningArbeidsevne: null,
    resultatAvBehandling: null,
    sykehistorie: null,
    sykehistoriePunkt63: null,
    henvisningUtredningBehandlingPunkt63: null,
  },
};

const sykmeldingMedGamlePunkter = {
  utdypendeOpplysninger: {
    grupper: [],
    henvisningUtredningBehandling: "Henvist til fysio",
    paavirkningArbeidsevne:
      "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket",
    resultatAvBehandling: "Nei",
    sykehistorie: "Langvarig korsryggsmerter. Ømhet og smerte",
    sykehistoriePunkt63: null,
    henvisningUtredningBehandlingPunkt63: null,
  },
};

const sykmeldingMedNyePunkter = {
  utdypendeOpplysninger: {
    grupper: [],
    henvisningUtredningBehandling: null,
    paavirkningArbeidsevne: null,
    resultatAvBehandling: null,
    sykehistorie: null,
    sykehistoriePunkt63:
      "Pkt. 6.3.1: Langvarig korsryggsmerter. Ømhet og smerte",
    henvisningUtredningBehandlingPunkt63:
      "Pkt. 6.3.2: Henvist til fysio, dette påvirker arbeidsevnen",
  },
};
