import React from "react";
import sinon from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";
import AlertStripe from "nav-frontend-alertstriper";
import { genererDato } from "../../../src/mote/utils";
import KontaktInfoFeilmelding from "../../../src/mote/components/KontaktInfoFeilmelding";
import {
  MotebookingSkjema,
  validate,
  getData,
} from "../../../src/mote/skjema/MotebookingSkjema";
import Tidspunkter from "../../../src/mote/skjema/Tidspunkter";

describe("MotebookingSkjemaTest", () => {
  let arbeidstaker;

  describe("MotebookingSkjema", () => {
    let handleSubmit;

    beforeEach(() => {
      arbeidstaker = {
        kontaktinfo: {
          skalHaVarsel: true,
        },
      };
      handleSubmit = sinon.spy();
    });

    it("Skal inneholde tidspunkter", () => {
      const compo = shallow(
        <MotebookingSkjema
          ledere={[]}
          handleSubmit={handleSubmit}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(
        compo.contains(<Tidspunkter skjemanavn="opprettMote" />)
      ).to.be.equal(true);
    });

    it("Skal inneholde felt med mulighet for å skrive inn sted", () => {
      const compo = shallow(
        <MotebookingSkjema
          ledere={[]}
          handleSubmit={handleSubmit}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(compo.find("#sted").prop("name")).to.equal("sted");
    });

    it("Skal ikke vise feilmelding hvis sendingFeilet !== true", () => {
      const compo = shallow(
        <MotebookingSkjema
          ledere={[]}
          handleSubmit={handleSubmit}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(compo.text()).not.to.contain("Beklager");
    });

    it("Skal vise feilmelding hvis sendingFeilet", () => {
      const compo = shallow(
        <MotebookingSkjema
          ledere={[]}
          handleSubmit={handleSubmit}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
          sendingFeilet
        />
      );
      expect(compo.find(AlertStripe)).to.have.length(1);
    });

    describe("Visning av arbeidstakers opplysninger", () => {
      let ledere;

      beforeEach(() => {
        ledere = [];
        arbeidstaker = {
          navn: "Test Bestesen",
          kontaktinfo: {
            tlf: "+4799999999",
            epost: "tester.scrambling-script@fellesregistre.no",
            reservasjon: {
              skalHaVarsel: true,
            },
          },
          hendelser: [],
        };
      });

      describe("Dersom dersom kontaktinfo.skalHaVarsel === true", () => {
        beforeEach(() => {
          arbeidstaker.kontaktinfo.skalHaVarsel = true;
        });
        it("Skal ikke vise info om reservasjon", () => {
          const compo = shallow(
            <MotebookingSkjema
              arbeidstaker={arbeidstaker}
              ledere={ledere}
              handleSubmit={handleSubmit}
              valgtEnhet="0021"
            />
          );
          expect(compo.find(KontaktInfoFeilmelding)).to.have.length(0);
        });
      });
    });
  });

  describe("validate", () => {
    let values;
    let props;

    beforeEach(() => {
      values = {};
      props = {
        nullstillVirksomhet: Function,
        hentVirksomhet: Function,
        ledere: [],
        antallNyeTidspunkt: 2,
      };
    });

    it("Skal validere tidspunkter dersom ingen felt er angitt (1)", () => {
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {
          dato: "Vennligst angi dato",
          klokkeslett: "Vennligst angi klokkeslett",
        },
        {
          dato: "Vennligst angi dato",
          klokkeslett: "Vennligst angi klokkeslett",
        },
      ]);
    });

    it("Skal validere tidspunkter dersom ingen felt er angitt (2)", () => {
      values.tidspunkter = [];
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {
          dato: "Vennligst angi dato",
          klokkeslett: "Vennligst angi klokkeslett",
        },
        {
          dato: "Vennligst angi dato",
          klokkeslett: "Vennligst angi klokkeslett",
        },
      ]);
    });

    it("Skal validere tidspunkter dersom første felt mangler dato", () => {
      values.tidspunkter = [
        {
          klokkeslett: "12.15",
        },
        {
          dato: "22.01.2016",
          klokkeslett: "10.00",
        },
      ];
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {
          dato: "Vennligst angi dato",
        },
        {},
      ]);
    });

    it("Skal validere tidspunkter dersom dato er på feil format", () => {
      values.tidspunkter = [
        {
          dato: "A1.12.2016",
        },
        {},
      ];
      const res = validate(values, props);
      expect(res.tidspunkter[0].dato).to.equal(
        "Vennligst angi riktig datoformat; dd.mm.åååå"
      );
    });

    it("Skal validere tidspunkter dersom klokkeslett er på feil format", () => {
      values.tidspunkter = [
        {
          dato: "12.12.2016",
          klokkeslett: "A1.11",
        },
        {},
      ];
      const res = validate(values, props);
      expect(res.tidspunkter[0].klokkeslett).to.equal(
        "Vennligst angi riktig format; f.eks. 13.00"
      );
    });

    it("Skal validere tidspunkter dersom andre felt mangler dato", () => {
      values.tidspunkter = [
        {
          dato: "22.02.2016",
          klokkeslett: "12.15",
        },
        {
          klokkeslett: "10.00",
        },
      ];
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {},
        {
          dato: "Vennligst angi dato",
        },
      ]);
    });

    it("Skal validere tidspunkter dersom andre felt mangler klokkeslett", () => {
      values.tidspunkter = [
        {
          dato: "12.12.2016",
          klokkeslett: "10.00",
        },
        {
          dato: "22.01.2016",
        },
      ];
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {},
        {
          klokkeslett: "Vennligst angi klokkeslett",
        },
      ]);
    });

    it("Skal validere sted dersom sted ikke finnes", () => {
      const res = validate(values, props);
      expect(res.sted).to.equal("Vennligst angi møtested");
    });

    it("Skal validere sted dersom sted finnes", () => {
      values.sted = "Økernveien 94";
      const res = validate(values, props);
      expect(res.sted).to.be.equal(undefined);
    });

    it("Skal validere sted dersom sted er en tom streng (1)", () => {
      values.sted = " ";
      const res = validate(values, props);
      expect(res.sted).to.equal("Vennligst angi møtested");
    });

    it("Skal validere sted dersom sted er en tom streng (2)", () => {
      values.sted = "";
      const res = validate(values, props);
      expect(res.sted).to.equal("Vennligst angi møtested");
    });
  });

  describe("genererDato", () => {
    it("Skal returnere dato på riktig format når dato er dd.mm.åååå", () => {
      const klokkeslett = "12.15";
      const dato = "15.06.2017";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T12:15:00");
    });

    it("Skal returnere dato på riktig format når dato er dd.mm.åå", () => {
      const klokkeslett = "12.15";
      const dato = "15.06.17";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T12:15:00");
    });

    it("Skal returnere dato på riktig format", () => {
      const klokkeslett = "1.15";
      const dato = "15.06.2017";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T01:15:00");
    });
  });

  describe("getData", () => {
    it("Skal svare med data på riktig format", () => {
      const values = {
        tidspunkter: [
          {
            dato: "12.08.2016",
            klokkeslett: "15.00",
          },
          {
            dato: "13.08.2016",
            klokkeslett: "12.00",
          },
        ],
        sted: "Oslo",
      };
      const res = getData(values);
      expect(res).to.deep.equal({
        alternativer: [
          {
            sted: "Oslo",
            tid: "2016-08-12T15:00:00",
          },
          {
            sted: "Oslo",
            tid: "2016-08-13T12:00:00",
          },
        ],
      });
    });
  });
});
