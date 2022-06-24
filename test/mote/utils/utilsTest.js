import { expect } from "chai";
import sinon from "sinon";
import { genererDato } from "../../../src/components/mote/utils";

describe("utils", () => {
  let clock;
  let today = new Date("2017-02-01");

  beforeEach(() => {
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  describe("genererDato", () => {
    beforeEach(() => {
      today = new Date("2017-05-31");
      clock = sinon.useFakeTimers(today.getTime());
    });
    afterEach(() => {
      clock.restore();
    });

    it("31. Mai 10.00 blir riktig", () => {
      const s = genererDato("2017-05-31", "10:00");
      expect(s).to.equal("2017-05-31T10:00:00");
    });

    it("31. Mai 10.00 blir riktig", () => {
      const s = genererDato("2017-06-16", "10:00");
      expect(s).to.equal("2017-06-16T10:00:00");
    });
  });
});
