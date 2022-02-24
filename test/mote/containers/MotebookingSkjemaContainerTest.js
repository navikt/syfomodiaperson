import { expect } from "chai";
import { mapStateToProps } from "@/components/mote/container/MotebookingSkjemaContainer";

describe("MotebookingSkjemaContainer", () => {
  describe("mapStateToProps", () => {
    let state;
    let ownProps;

    beforeEach(() => {
      ownProps = {
        fnr: "fnr",
      };
      state = {
        moter: {},
        enhet: {
          valgtEnhet: "0021",
        },
      };
      state.navbruker = {
        data: {
          navn: "Ole",
        },
      };
    });

    it("Skal returnere arbeidstaker", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.arbeidstaker).to.deep.equal({
        navn: "Ole",
      });
    });

    it("Skal returnere henter når arbeidstaker hentes", () => {
      state.navbruker.henter = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.henter).to.be.equal(true);
    });

    it("Skal ikke returnere henter når arbeidstaker ikke hentes", () => {
      state.navbruker.henter = false;
      const props = mapStateToProps(state, ownProps);
      expect(props.henter).to.be.equal(false);
    });

    it("Skal returnere hentingFeilet når henting av arbeidstaker feiler", () => {
      state.navbruker.hentingFeilet = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.hentingFeilet).to.be.equal(true);
    });
  });
});
