import { describe, expect, it } from "vitest";
import {
  getVarselSvarfrist,
  isVarselUbesvart,
} from "@/utils/senOppfolgingUtils";
import {
  OnskerOppfolging,
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { addDays } from "@/utils/datoUtils";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";

describe("senOppfolgingUtils", () => {
  describe("isVarselUbesvart", () => {
    it("is true if no svar and ten days since varsel", () => {
      const kandidat: SenOppfolgingKandidatResponseDTO = {
        status: SenOppfolgingStatus.KANDIDAT,
        uuid: "1",
        createdAt: new Date(),
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        varselAt: addDays(new Date(), -10),
        svar: undefined,
        vurderinger: [],
      };
      expect(isVarselUbesvart(kandidat)).toBe(true);
    });

    it("is true if no svar and more than ten days since varsel", () => {
      const kandidat: SenOppfolgingKandidatResponseDTO = {
        status: SenOppfolgingStatus.KANDIDAT,
        uuid: "1",
        createdAt: new Date(),
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        varselAt: addDays(new Date(), -11),
        svar: undefined,
        vurderinger: [],
      };
      expect(isVarselUbesvart(kandidat)).toBe(true);
    });

    it("is false if kandidat with svar", () => {
      const kandidat: SenOppfolgingKandidatResponseDTO = {
        status: SenOppfolgingStatus.KANDIDAT,
        uuid: "1",
        createdAt: new Date(),
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        varselAt: addDays(new Date(), -5),
        svar: {
          svarAt: new Date(),
          onskerOppfolging: OnskerOppfolging.JA,
        },
        vurderinger: [],
      };
      expect(isVarselUbesvart(kandidat)).toBe(false);
    });

    it("is false if no svar and less than ten days since varsel", () => {
      const kandidat: SenOppfolgingKandidatResponseDTO = {
        status: SenOppfolgingStatus.KANDIDAT,
        uuid: "1",
        createdAt: new Date(),
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        varselAt: addDays(new Date(), -9),
        svar: undefined,
        vurderinger: [],
      };
      expect(isVarselUbesvart(kandidat)).toBe(false);
    });
  });

  describe("getVarselSvarfrist", () => {
    it("is ten days after varsel date", () => {
      const varselAt = new Date();
      const expectedSvarfrist = addDays(varselAt, 10);
      expect(getVarselSvarfrist(varselAt)).toEqual(expectedSvarfrist);
    });
  });
});
