import { describe, expect, it } from "vitest";
import {
  oppfolgingsplanerLPSOpprettetIdag,
  toOppfolgingsplanLPSMedPersonoppgave,
} from "@/utils/oppfolgingsplanerUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";

describe("oppfolgingsplanerUtils", () => {
  describe("oppfolgingsplanerLPSOpprettetIdag", () => {
    it("Gives the plan created last, if more than one from a virksomhet", () => {
      const planOne: OppfolgingsplanLPS = {
        uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: new Date().toISOString(),
        sistEndret: new Date().toISOString(),
      };
      const planMedPersonoppgaveOne = toOppfolgingsplanLPSMedPersonoppgave(
        planOne,
        [],
      );

      const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const planTwo: OppfolgingsplanLPS = {
        uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: yesterdayDate.toISOString(),
        sistEndret: yesterdayDate.toISOString(),
      };
      const planMedPersonoppgaveTwo = toOppfolgingsplanLPSMedPersonoppgave(
        planTwo,
        [],
      );

      const planer = [planMedPersonoppgaveOne, planMedPersonoppgaveTwo];

      const aktiveLPSPlaner = oppfolgingsplanerLPSOpprettetIdag(planer);

      expect(aktiveLPSPlaner.length).to.be.equal(1);
      expect(aktiveLPSPlaner[0]).to.deep.equal(planMedPersonoppgaveOne);
    });
  });
});
