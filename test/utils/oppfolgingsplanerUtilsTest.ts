import { describe, expect, it } from "vitest";
import {
  mockAvbruttActiveOppfolgingsplan,
  mockAvbruttInactiveOppfolgingsplan,
  mockValidActiveOppfolgingsplan,
  mockValidActiveOppfolgingsplanWithDifferentVirksomhet,
} from "../mockdata/mockOppfolgingsplaner";
import {
  oppfolgingsplanerLPSOpprettetIdag,
  toOppfolgingsplanLPSMedPersonoppgave,
} from "@/utils/oppfolgingsplanerUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { aktiveOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";

describe("oppfolgingsplanerUtils", () => {
  describe("aktiveOppfolgingsplaner", () => {
    it("Gives a list of one plan, when one is active", () => {
      const planer = [mockValidActiveOppfolgingsplan];

      const actualPlaner = aktiveOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
    });

    it("Gives a list of one plan, when one is active and avbrutt", () => {
      const planer = [mockAvbruttActiveOppfolgingsplan];

      const actualPlaner = aktiveOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
    });

    it("Gives empty list if all plans are invalid", () => {
      const planer = [mockAvbruttInactiveOppfolgingsplan];

      const actualPlaner = aktiveOppfolgingsplaner(planer);
      expect(actualPlaner.length).to.be.equal(0);
    });

    it("Gives two plans if the are from different virksomheter", () => {
      const planer = [
        mockValidActiveOppfolgingsplanWithDifferentVirksomhet,
        mockValidActiveOppfolgingsplan,
      ];

      const actualPlaner = aktiveOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
      expect(actualPlaner[1]).to.deep.equal(planer[1]);
    });

    it("Gives the plan shared latest, if more than one from a virksomhet", () => {
      const planer = [
        mockAvbruttActiveOppfolgingsplan,
        mockValidActiveOppfolgingsplan,
      ];

      const expectedPlan = mockValidActiveOppfolgingsplan;

      const actualPlaner = aktiveOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(1);
      expect(actualPlaner[0]).to.deep.equal(expectedPlan);
    });
  });

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
        []
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
        []
      );

      const planer = [planMedPersonoppgaveOne, planMedPersonoppgaveTwo];

      const aktiveLPSPlaner = oppfolgingsplanerLPSOpprettetIdag(planer);

      expect(aktiveLPSPlaner.length).to.be.equal(1);
      expect(aktiveLPSPlaner[0]).to.deep.equal(planMedPersonoppgaveOne);
    });
  });
});
