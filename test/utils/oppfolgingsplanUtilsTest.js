import { expect } from "chai";
import { leggTilDagerPaDato } from "../../mock/util/dateUtil";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import { customOppfolgingstilfelleperioder } from "../mockdata/mockOppfolgingstilfelleperioder";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";

describe("oppfolgingsplanUtils", () => {
  describe("lpsPlanerWithActiveTilfelle", () => {
    const today = new Date();
    const defaultLpsplan = {
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      opprettet: leggTilDagerPaDato(today, -1).toJSON(),
      sistEndret: leggTilDagerPaDato(today, -1).toJSON(),
    };

    const defaultActiveTilfelleMapState = {
      [VIRKSOMHET_PONTYPANDY.virksomhetsnummer]: {
        data: [
          {
            orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
            fom: leggTilDagerPaDato(today, -10),
            tom: leggTilDagerPaDato(today, 10),
            grad: 100,
            aktivitet: "aktivitet",
          },
        ],
      },
    };

    it("should return 1 plan if inside an active tilfelle", () => {
      const planer = [defaultLpsplan];
      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        defaultActiveTilfelleMapState
      );

      expect(activePlaner.length).to.be.equal(1);
    });

    it("should return an empty list if plan is before active tilfelle", () => {
      const tilfelleFom = leggTilDagerPaDato(today, -1);
      const tilfelleTom = leggTilDagerPaDato(today, 1);

      const activeTilfelle = customOppfolgingstilfelleperioder(
        tilfelleFom,
        tilfelleTom
      );
      const lpsPlanWithOpprettetBeforeTilfelleFom = {
        ...defaultLpsplan,
        opprettet: leggTilDagerPaDato(tilfelleFom, -5),
      };

      const planer = [lpsPlanWithOpprettetBeforeTilfelleFom];

      const activePlaner = lpsPlanerWithActiveTilfelle(planer, activeTilfelle);

      expect(activePlaner.length).to.be.equal(0);
    });

    it("should return an empty list if tilfelle is not active, even if plan was sent within that tilfelle", () => {
      const tilfelleFom = leggTilDagerPaDato(today, -10);
      const tilfelleTom = leggTilDagerPaDato(today, -4);

      const inactiveTilfelle = customOppfolgingstilfelleperioder(
        tilfelleFom,
        tilfelleTom
      );
      const lpsPlanWithinOldTilfelle = {
        ...defaultLpsplan,
        opprettet: leggTilDagerPaDato(tilfelleFom, -5),
      };

      const planer = [lpsPlanWithinOldTilfelle];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        inactiveTilfelle
      );

      expect(activePlaner.length).to.be.equal(0);
    });

    it("should return newest plan if more than one is sent in active tilfelle", () => {
      const tilfelleFom = leggTilDagerPaDato(today, -10);

      const oldestLpsPlan = {
        ...defaultLpsplan,
        uuid: "old",
        opprettet: leggTilDagerPaDato(tilfelleFom, -9),
      };

      const newestLpsPlan = {
        ...defaultLpsplan,
        uuid: "new",
      };

      const planer = [oldestLpsPlan, newestLpsPlan];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        defaultActiveTilfelleMapState
      );

      expect(activePlaner.length).to.be.equal(1);
      expect(activePlaner[0]).to.deep.equal(newestLpsPlan);
    });

    it("should return 2 planer for different virksomheter if both are within combined tilfelle", () => {
      const allTilfeller = {
        [VIRKSOMHET_PONTYPANDY.virksomhetsnummer]: {
          ...defaultActiveTilfelleMapState[
            VIRKSOMHET_PONTYPANDY.virksomhetsnummer
          ],
        },
        123456789: {
          ...defaultActiveTilfelleMapState[
            VIRKSOMHET_PONTYPANDY.virksomhetsnummer
          ],
          orgnummer: "123456789",
        },
      };

      const plan1 = {
        ...defaultLpsplan,
      };

      const plan2 = {
        ...defaultLpsplan,
        virksomhetsnummer: "123456789",
      };

      const planer = [plan1, plan2];

      const activePlaner = lpsPlanerWithActiveTilfelle(planer, allTilfeller);

      expect(activePlaner.length).to.be.equal(2);
      expect(activePlaner[0].virksomhetsnummer).to.be.not.equal(
        activePlaner[1].virksomhetsnummer
      );
    });

    it("should return plan if sent within newest active tilfelle, even if there's no tilfelle for the plans virksomhet", () => {
      const activePlanFromRandomVirksomhet = {
        ...defaultLpsplan,
        virksomhetsnummer: "gibberish",
      };

      const planer = [activePlanFromRandomVirksomhet];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        defaultActiveTilfelleMapState
      );

      expect(activePlaner.length).to.be.equal(1);
      expect(activePlaner[0]).to.deep.equal(activePlanFromRandomVirksomhet);
    });
  });
});
