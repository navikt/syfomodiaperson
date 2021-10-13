import React from "react";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import AlertStripe from "nav-frontend-alertstriper";
import { genererDato } from "@/components/mote/utils";
import KontaktInfoAdvarsel from "../../../src/components/mote/components/KontaktInfoAdvarsel";
import {
  MotebookingSkjema,
  validate,
  getData,
} from "@/components/mote/skjema/MotebookingSkjema";
import Tidspunkter from "../../../src/components/mote/skjema/Tidspunkter";
import { Field } from "react-final-form";
import sinon from "sinon";

describe("MotebookingSkjemaTest", () => {
  let arbeidstaker;

  describe("MotebookingSkjema", () => {
    beforeEach(() => {
      arbeidstaker = {
        kontaktinfo: {
          skalHaVarsel: true,
        },
      };
    });

    it("Skal inneholde tidspunkter", () => {
      const compo = mount(
        <MotebookingSkjema
          ledere={[]}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(compo.contains(<Tidspunkter />)).to.be.equal(true);
    });

    it("Skal inneholde felt med mulighet for å skrive inn sted", () => {
      const compo = mount(
        <MotebookingSkjema
          ledere={[]}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(compo.find(Field).last().prop("name")).to.equal("sted");
    });

    it("Skal ikke vise feilmelding hvis sendingFeilet !== true", () => {
      const compo = mount(
        <MotebookingSkjema
          ledere={[]}
          valgtEnhet="0021"
          arbeidstaker={arbeidstaker}
        />
      );
      expect(compo.text()).not.to.contain("Beklager");
    });

    it("Skal vise feilmelding hvis sendingFeilet", () => {
      const compo = mount(
        <MotebookingSkjema
          ledere={[]}
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
              valgtEnhet="0021"
            />
          );
          expect(compo.find(KontaktInfoAdvarsel)).to.have.length(0);
        });
      });
    });
  });

  describe("validate", () => {
    let values;
    let props;

    let clock;
    const today = new Date("2016-01-01");

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime()); // 16. januar 2017
      values = {};
      props = {
        nullstillVirksomhet: Function,
        hentVirksomhet: Function,
        ledere: [],
        antallNyeTidspunkt: 2,
      };
    });

    afterEach(() => {
      clock.restore();
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
          klokkeslett: "12:15",
        },
        {
          dato: "2016-01-22",
          klokkeslett: "10:00",
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

    it("Skal validere tidspunkter dersom andre felt mangler dato", () => {
      values.tidspunkter = [
        {
          dato: "2016-02-22",
          klokkeslett: "12:15",
        },
        {
          klokkeslett: "10:00",
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
          dato: "2016-12-12",
          klokkeslett: "10:00",
        },
        {
          dato: "2016-01-22",
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

    it("Skal validere tidspunkt og dato dersom tidspunkt har passert", () => {
      values.tidspunkter = [
        {
          dato: "2016-12-12",
          klokkeslett: "10:00",
        },
        {
          dato: "2015-12-12",
          klokkeslett: "10:00",
        },
      ];
      const res = validate(values, props);
      expect(res.tidspunkter).to.deep.equal([
        {},
        {
          klokkeslett: "Tidspunktet har passert",
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
      const klokkeslett = "12:15";
      const dato = "2017-06-15";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T12:15:00");
    });

    it("Skal returnere dato på riktig format når dato er dd.mm.åå", () => {
      const klokkeslett = "12:15";
      const dato = "17-06-15";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T12:15:00");
    });

    it("Skal returnere dato på riktig format", () => {
      const klokkeslett = "1:15";
      const dato = "2017-06-15";
      expect(genererDato(dato, klokkeslett)).to.equal("2017-06-15T01:15:00");
    });
  });

  describe("getData", () => {
    it("Skal svare med data på riktig format", () => {
      const values = {
        tidspunkter: [
          {
            dato: "2016-08-12",
            klokkeslett: "15:00",
          },
          {
            dato: "2016-08-13",
            klokkeslett: "12:00",
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
