import deepFreeze from "deep-freeze";
import { expect } from "chai";
import * as actions from "../../src/actions/diskresjonskode_actions";
import {
  DISKRESJONSKODE_HENTET,
  HENT_DISKRESJONSKODE_FEILET,
  HENTER_DISKRESJONSKODE,
} from "../../src/actions/diskresjonskode_actions";
import diskresjonskode from "../../src/reducers/diskresjonskode";

describe("diskresjonskode", () => {
  describe("henter", () => {
    const initialState = deepFreeze({
      henter: false,
      hentet: false,
      hentingFeilet: false,
      data: {},
    });

    it(`håndterer ${HENTER_DISKRESJONSKODE}`, () => {
      const action = actions.henterDiskresjonskode();
      const nextState = diskresjonskode(initialState, action);
      expect(nextState).to.deep.equal({
        henter: true,
        hentet: false,
        hentingFeilet: false,
        data: {},
      });
    });

    it(`håndterer ${DISKRESJONSKODE_HENTET}`, () => {
      const data = "7";
      const action = actions.diskresjonskodeHentet(data);
      const nextState = diskresjonskode(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: true,
        hentingFeilet: false,
        data: {
          diskresjonskode: data,
        },
      });
    });

    it(`håndterer ${HENT_DISKRESJONSKODE_FEILET}`, () => {
      const action = actions.hentDiskresjonskodeFeilet();
      const nextState = diskresjonskode(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: false,
        hentingFeilet: true,
        data: {},
      });
    });
  });
});
