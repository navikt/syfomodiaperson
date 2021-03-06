import { expect } from "chai";
import { mapStateToProps } from "../../../src/components/mote/container/MotebookingSkjemaContainer";

describe("MotebookingSkjemaContainer", () => {
  describe("mapStateToProps", () => {
    let state;
    let ownProps;

    beforeEach(() => {
      ownProps = {
        fnr: "fnr",
      };
      state = {
        ledere: {
          currentLedere: [
            {
              navn: "Ole",
              erOppgitt: true,
            },
            {
              navn: "Per",
              erOppgitt: false,
            },
          ],
          henter: false,
          hentingFeilet: false,
        },
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

    it("Skal returnere ledere som er oppgitt", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.ledere).to.deep.equal([
        {
          navn: "Ole",
          erOppgitt: true,
        },
      ]);
    });

    it("Skal returnere hentingFeilet når henting av ledere feiler", () => {
      state.ledere.currentLedere = [];
      state.ledere.hentingFeilet = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.hentLedereFeiletBool).to.be.equal(true);
    });

    it("Skal returnere hentingFeilet når henting av ledere ikke feiler", () => {
      state.ledere.currentLedere = [];
      state.ledere.hentingFeilet = false;
      const props = mapStateToProps(state, ownProps);
      expect(props.hentLedereFeiletBool).to.be.equal(false);
    });

    it("Skal returnere henter når det hentes ledere", () => {
      state.moter.data = [
        {
          id: 1,
        },
      ];
      state.moter.henter = false;
      state.ledere.henter = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.henter).to.be.equal(true);
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
