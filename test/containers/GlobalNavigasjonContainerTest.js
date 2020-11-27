import { expect } from "chai";
import { mapStateToProps } from "../../src/containers/GlobalNavigasjonContainer";

describe("GlobalNavigasjonContainer", () => {
  describe("mapStateToProps", () => {
    const state = {
      navbruker: {
        data: {
          kontaktinfo: {
            fnr: "887766",
          },
          harTilgang: true,
        },
      },
      motebehov: {
        data: [],
      },
    };

    it("Skal returnere fnr", () => {
      const ownProps = {
        fnr: "887766",
      };
      const props = mapStateToProps(state, ownProps);
      expect(props.fnr).to.equal("887766");
    });

    it("Skal returnere aktivtMenypunkt", () => {
      const ownProps = {
        fnr: "887766",
        aktivtMenypunkt: "OLSEN",
      };
      const props = mapStateToProps(state, ownProps);
      expect(props.aktivtMenypunkt).to.equal("OLSEN");
    });
  });
});
