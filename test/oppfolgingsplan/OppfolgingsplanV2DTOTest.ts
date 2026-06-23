import { describe, it, expect } from "vitest";
import { partitionOppfolgingsplanerByActiveTilfelle } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

function lagPlan(uuid: string, virksomhetsnummer: string, opprettet: string) {
  return {
    uuid,
    fnr: "12345678910",
    deltMedNavTidspunkt: opprettet,
    virksomhetsnummer,
    opprettet,
    sistEndret: opprettet,
    evalueringsdato: "2026-06-01",
  };
}

const aktivtTilfelle: OppfolgingstilfelleDTO = {
  start: new Date("2026-01-01"),
  end: new Date("2026-12-31"),
  antallSykedager: 100,
  varighetUker: 14,
  virksomhetsnummerList: ["111111111", "222222222"],
  arbeidstakerAtTilfelleEnd: true,
};

describe("partitionOppfolgingsplanerByActiveTilfelle", () => {
  it("returnerer tom liste når det ikke finnes planer", () => {
    const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
      [],
      aktivtTilfelle,
    );

    expect(aktive).toEqual([]);
    expect(inaktive).toEqual([]);
  });

  it("kun siste plan per virksomhet innenfor tilfellet er aktiv", () => {
    const gammelPlan = lagPlan("1", "111111111", "2026-02-01");
    const nyPlan = lagPlan("2", "111111111", "2026-03-01");

    const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
      [gammelPlan, nyPlan],
      aktivtTilfelle,
    );

    expect(aktive).toHaveLength(1);
    expect(aktive[0].uuid).toBe("2");
    expect(inaktive).toHaveLength(1);
    expect(inaktive[0].uuid).toBe("1");
  });

  it("siste plan per virksomhet er aktiv når det er flere virksomheter", () => {
    const plan1V1 = lagPlan("1", "111111111", "2026-02-01");
    const plan2V1 = lagPlan("2", "111111111", "2026-04-01");
    const plan1V2 = lagPlan("3", "222222222", "2026-03-01");

    const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
      [plan1V1, plan2V1, plan1V2],
      aktivtTilfelle,
    );

    expect(aktive).toHaveLength(2);
    const aktiveUuids = aktive.map((p) => p.uuid).sort();
    expect(aktiveUuids).toEqual(["2", "3"]);
    expect(inaktive).toHaveLength(1);
    expect(inaktive[0].uuid).toBe("1");
  });

  it("planer utenfor tilfellet er alltid inaktive", () => {
    const planForTilfelle = lagPlan("1", "111111111", "2025-06-01");
    const planInnenforTilfelle = lagPlan("2", "111111111", "2026-05-01");

    const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
      [planForTilfelle, planInnenforTilfelle],
      aktivtTilfelle,
    );

    expect(aktive).toHaveLength(1);
    expect(aktive[0].uuid).toBe("2");
    expect(inaktive).toHaveLength(1);
    expect(inaktive[0].uuid).toBe("1");
  });

  it("eneste plan innenfor tilfellet for en virksomhet er aktiv", () => {
    const plan = lagPlan("1", "111111111", "2026-05-01");

    const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
      [plan],
      aktivtTilfelle,
    );

    expect(aktive).toHaveLength(1);
    expect(aktive[0].uuid).toBe("1");
    expect(inaktive).toHaveLength(0);
  });

  describe("isLatestTilfelle = true", () => {
    it("inkluderer plan opprettet etter tilfelle-slutt", () => {
      const planEtterTilfelle = lagPlan("1", "111111111", "2027-03-01");

      const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
        [planEtterTilfelle],
        aktivtTilfelle,
        true,
      );

      expect(aktive).toHaveLength(1);
      expect(aktive[0].uuid).toBe("1");
      expect(inaktive).toHaveLength(0);
    });

    it("ekskluderer plan opprettet før tilfelle-start", () => {
      const planForTilfelle = lagPlan("1", "111111111", "2025-06-01");

      const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
        [planForTilfelle],
        aktivtTilfelle,
        true,
      );

      expect(aktive).toHaveLength(0);
      expect(inaktive).toHaveLength(1);
    });

    it("inkluderer siste plan per virksomhet uavhengig av tilfelle-slutt", () => {
      const planInnenfor = lagPlan("1", "111111111", "2026-05-01");
      const planEtter = lagPlan("2", "111111111", "2027-01-01");

      const [aktive, inaktive] = partitionOppfolgingsplanerByActiveTilfelle(
        [planInnenfor, planEtter],
        aktivtTilfelle,
        true,
      );

      expect(aktive).toHaveLength(1);
      expect(aktive[0].uuid).toBe("2");
      expect(inaktive).toHaveLength(1);
      expect(inaktive[0].uuid).toBe("1");
    });
  });
});
