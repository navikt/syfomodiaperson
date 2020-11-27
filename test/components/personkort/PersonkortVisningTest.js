import React from "react";
import { expect } from "chai";
import { mount } from "enzyme";
import Alertstripe from "nav-frontend-alertstriper";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "../../../src/konstanter";
import PersonkortElement from "../../../src/components/personkort/PersonkortElement";
import PersonkortInformasjon from "../../../src/components/personkort/PersonkortInformasjon";
import PersonkortLedere from "../../../src/components/personkort/ledere/PersonkortLedere";
import PersonKortVirksomhetHeader from "../../../src/components/personkort/ledere/PersonKortVirksomhetHeader";
import PersonKortVirksomhetLedere from "../../../src/components/personkort/ledere/PersonKortVirksomhetLedere";
import PersonkortSykmeldt from "../../../src/components/personkort/PersonkortSykmeldt";
import PersonkortEnhet from "../../../src/components/personkort/PersonkortEnhet";
import PersonkortLege, {
  TidligereLeger,
} from "../../../src/components/personkort/PersonkortLege";
import mockSykmeldinger from "../../mockdata/sykmeldinger/mockSykmeldinger";
import { newSMFormat2OldFormat } from "../../../src/utils/sykmeldinger/sykmeldingParser";
import { leggTilDagerPaDato } from "../../../src/utils/datoUtils";

describe("PersonkortVisning", () => {
  let ledere;
  let navbruker;
  let behandlendeEnhet;
  let fastleger;
  let komponent;
  let sykmeldinger;
  let personadresse;

  const today = new Date();

  const sykmeldignOldFormat = newSMFormat2OldFormat({
    ...mockSykmeldinger[0],
    sykmeldingsperioder: [
      {
        fom: "2020-01-22",
        tom: leggTilDagerPaDato(today, 1),
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: null,
      },
    ],
  });

  beforeEach(() => {
    ledere = [
      {
        navn: "Station Officer Steele",
        orgnummer: "000999000",
        erOppgitt: true,
      },
      {
        navn: "Are Arbeidsgiver",
        orgnummer: "000999001",
        erOppgitt: false,
      },
    ];
    behandlendeEnhet = {
      navn: "NAV Drammen",
      enhetId: "1234",
    };
    fastleger = {
      henter: false,
      hentingFeilet: false,
      hentet: false,
      data: [{}, {}, {}],
      aktiv: {
        fastlegekontor: {},
        pasientforhold: {
          fom: "",
          tom: "",
        },
      },
      tidligere: [
        {
          fastlegekontor: {},
          pasientforhold: {
            fom: "",
            tom: "",
          },
        },
        {
          fastlegekontor: {},
          pasientforhold: {
            fom: "",
            tom: "",
          },
        },
      ],
    };
    navbruker = {
      navn: "Knut",
      kontaktinfo: {
        fnr: "1234",
      },
    };
    personadresse = {};
    sykmeldinger = [sykmeldignOldFormat];

    komponent = mount(
      <PersonkortVisning
        visning={""}
        ledere={ledere}
        fastleger={fastleger}
        navbruker={navbruker}
        personadresse={personadresse}
        behandlendeEnhet={behandlendeEnhet}
      />
    );
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    expect(komponent.find(PersonkortSykmeldt)).to.have.length(1);
  });

  it("Skal vise PersonkortLedere, dersom visning for leder er valgt", () => {
    komponent = mount(
      <PersonkortVisning
        visning={PERSONKORTVISNING_TYPE.LEDER}
        ledere={ledere}
        fastleger={fastleger}
        navbruker={navbruker}
        personadresse={personadresse}
        behandlendeEnhet={behandlendeEnhet}
        sykmeldinger={sykmeldinger}
      />
    );
    expect(komponent.find(PersonkortLedere)).to.have.length(1);
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", () => {
    komponent = mount(
      <PersonkortVisning
        visning={PERSONKORTVISNING_TYPE.LEGE}
        ledere={ledere}
        fastleger={fastleger}
        navbruker={navbruker}
        personadresse={personadresse}
        behandlendeEnhet={behandlendeEnhet}
      />
    );
    expect(komponent.find(PersonkortLege)).to.have.length(1);
  });

  it("Skal vise VisningEnhet, dersom visning for lege er valgt", () => {
    komponent = mount(
      <PersonkortVisning
        visning={PERSONKORTVISNING_TYPE.ENHET}
        ledere={ledere}
        fastleger={fastleger}
        navbruker={navbruker}
        personadresse={personadresse}
        behandlendeEnhet={behandlendeEnhet}
      />
    );
    expect(komponent.find(PersonkortEnhet)).to.have.length(1);
  });

  describe("PersonkortSykmeldt", () => {
    beforeEach(() => {
      komponent = mount(
        <PersonkortSykmeldt
          navbruker={navbruker}
          personadresse={personadresse}
        />
      );
    });

    it("Skal vise PersonkortElement", () => {
      expect(komponent.find(PersonkortElement)).to.have.length(1);
    });

    it("Skal vise PersonkortInformasjon", () => {
      expect(komponent.find(PersonkortInformasjon)).to.have.length(1);
    });
  });

  describe("PersonkortLedere", () => {
    beforeEach(() => {
      komponent = mount(
        <PersonkortLedere ledere={ledere} sykmeldinger={sykmeldinger} />
      );
    });

    it("Skal vise antall PersonKortLedereVirksomhet lik antall unike virksomheter med innmeldt leder", () => {
      expect(komponent.find(PersonKortVirksomhetLedere)).to.have.length(2);
    });

    it("Skal vise antall PersonKortVirksomhetHeader lik antall virksomheter med leder pluss de med aktive sykmeldinger uten leder", () => {
      expect(komponent.find(PersonKortVirksomhetHeader)).to.have.length(3);
    });

    it("Skal vise PersonkortElement med feilmelding, dersom bruker ikke har noen ledere ", () => {
      komponent = mount(
        <PersonkortLedere ledere={[]} sykmeldinger={sykmeldinger} />
      );
      expect(komponent.find(Alertstripe)).to.have.length(1);
    });
  });

  describe("PersonkortLege", () => {
    beforeEach(() => {
      komponent = mount(
        <PersonkortLege fastleger={fastleger} sykmeldtNavn={navbruker.navn} />
      );
    });

    it("Skal vise feilmelding, fastleger ikke ble funnet", () => {
      komponent = mount(
        <PersonkortLege
          fastleger={Object.assign({}, fastleger, {
            ikkeFunnet: true,
          })}
          sykmeldtNavn={navbruker.navn}
        />
      );
      expect(komponent.find(Alertstripe)).to.have.length(1);
    });

    it("Skal vise PersonkortElement", () => {
      expect(komponent.find(PersonkortElement)).to.have.length(2);
    });

    it("Skal vise PersonkortInformasjon", () => {
      expect(komponent.find(PersonkortInformasjon)).to.have.length(1);
    });

    it("Skal vise TidligereLeger", () => {
      expect(komponent.find(TidligereLeger)).to.have.length(1);
    });

    it("Skal ikke tidligere leger dersom det ikke er tidligere fastleger", () => {
      komponent = mount(
        <PersonkortLege
          fastleger={Object.assign({}, fastleger, {
            tidligere: [],
          })}
          sykmeldtNavn={navbruker.navn}
        />
      );
      expect(komponent.find(TidligereLeger)).to.have.length(1);
      expect(komponent.find(TidligereLeger).html()).to.equal(null);
    });
  });

  describe("TidligereLeger", () => {
    beforeEach(() => {
      komponent = mount(
        <TidligereLeger tidligereFastleger={fastleger.tidligere} />
      );
    });

    it("Skal vise en liste med antall element lik antall tidligere fastleger", () => {
      expect(komponent.find("li")).to.have.length(fastleger.tidligere.length);
    });
  });
});
