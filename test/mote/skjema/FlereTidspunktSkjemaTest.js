import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";
import {
  validate,
  FlereTidspunktSkjema,
  getData,
  dekorerMedSted,
} from "../../../src/mote/skjema/FlereTidspunktSkjema";
import Tidspunkter from "../../../src/mote/skjema/Tidspunkter";

describe("FlereTidspunktSkjemaTest", () => {
  describe("FlereTidspunktSkjema", () => {
    let component;
    let handleSubmit;

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = shallow(
        <FlereTidspunktSkjema
          antallNyeTidspunkt={2}
          handleSubmit={handleSubmit}
        />
      );
    });

    it("Inneholder Tidspunkter", () => {
      expect(component.find(Tidspunkter)).to.have.length(1);
      expect(
        component.find(Tidspunkter).prop("antallNyeTidspunkt")
      ).to.deep.equal(2);
    });

    it("Skal sende riktig skjemanavn videre til Tidspunkter", () => {
      expect(component.find(Tidspunkter)).to.have.length(1);
      expect(component.find(Tidspunkter).prop("skjemanavn")).to.equal(
        "flereAlternativ"
      );
    });
  });

  describe("Transformering av data før sending til server", () => {
    let values;

    beforeEach(() => {
      values = {
        tidspunkter: [
          {
            dato: "20.02.2012",
            klokkeslett: "10.20",
          },
          {
            dato: "20.02.2013",
            klokkeslett: "10.30",
          },
        ],
      };
    });

    it("getData skal mappe values om til riktig format", () => {
      expect(getData(values)).to.deep.equal([
        {
          tid: "2012-02-20T10:20:00",
          valgt: false,
        },
        {
          tid: "2013-02-20T10:30:00",
          valgt: false,
        },
      ]);
    });

    it("dekorerMedSted skal legge til sted på data", () => {
      const data = getData(values);
      const res = dekorerMedSted(data, "Oslo");
      expect(res).to.deep.equal([
        {
          tid: "2012-02-20T10:20:00",
          valgt: false,
          sted: "Oslo",
        },
        {
          tid: "2013-02-20T10:30:00",
          valgt: false,
          sted: "Oslo",
        },
      ]);
    });
  });

  describe("validate", () => {
    let values;
    let props;

    beforeEach(() => {
      values = {
        tidspunkter: [
          {
            dato: null,
            klokkeslett: null,
          },
          {
            dato: "27.02.17",
            klokkeslett: "09.00",
          },
        ],
      };
      props = {
        antallNyeTidspunkt: 2,
      };
    });

    it("Viser feilmelding dersom tidspunkter ikke er fylt ut", () => {
      const res = validate(values, props);
      expect(res.tidspunkter[0].dato).to.equal("Vennligst angi dato");
      expect(res.tidspunkter[0].klokkeslett).to.equal(
        "Vennligst angi klokkeslett"
      );
    });

    it("Viser feilmelding på riktig tidspunkt", () => {
      values = {
        tidspunkter: [
          {
            dato: "27.02.17",
            klokkeslett: "09.00",
          },
          {
            dato: null,
            klokkeslett: null,
          },
        ],
      };
      const res = validate(values, props);
      expect(res.tidspunkter[1].dato).to.equal("Vennligst angi dato");
      expect(res.tidspunkter[1].klokkeslett).to.equal(
        "Vennligst angi klokkeslett"
      );
    });

    it("Viser feilmelding på hvis feil format", () => {
      values = {
        tidspunkter: [
          {
            dato: "27.13.17",
            klokkeslett: "25.00",
          },
        ],
      };
      const res = validate(values, props);
      expect(res.tidspunkter[0].dato).to.equal(
        "Vennligst angi riktig datoformat; dd.mm.åååå"
      );
      expect(res.tidspunkter[0].klokkeslett).to.equal(
        "Vennligst angi riktig format; f.eks. 13.00"
      );
    });
  });
});
