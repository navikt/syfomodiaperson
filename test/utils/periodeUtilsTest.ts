import {
  senesteTom,
  tidligsteFom,
  TilfellePeriode,
} from "@/utils/periodeUtils";
import { describe, expect, it } from "vitest";

function periodeOverlapperMedPeriode(
  periodeA_: TilfellePeriode,
  periodeB_: TilfellePeriode
): boolean {
  const periodeA = periodeA_;
  const periodeB = periodeB_;
  try {
    const forstePeriode =
      new Date(periodeA.fom).getTime() < new Date(periodeB.fom).getTime()
        ? periodeA
        : periodeB;
    const andrePeriode =
      new Date(periodeA.fom).getTime() < new Date(periodeB.fom).getTime()
        ? periodeB
        : periodeA;
    return (
      new Date(forstePeriode.tom).getTime() >=
      new Date(andrePeriode.fom).getTime()
    );
  } catch (e) {
    return false;
  }
}

describe("periodeUtils", () => {
  describe("tidligsteFom", () => {
    it("skal returnere den tidligste startdatoen fra en liste med perioder", () => {
      const fom1 = "2019-01-01";
      const fom2 = "2019-02-02";
      const fom3 = "2019-03-03";
      const tom = "2019-05-05";

      const perioder = [
        {
          fom: fom2,
          tom: tom,
        },
        {
          fom: fom3,
          tom: tom,
        },
        {
          fom: fom1,
          tom: tom,
        },
      ];

      const tidligsteStartdato = tidligsteFom(perioder);

      expect(tidligsteStartdato).to.equal(fom1);
    });
  });
  describe("senesteTom", () => {
    it("skal returnere den seneste sluttdatoen fra en liste med perioder", () => {
      const fom = "2019-05-05";
      const tom1 = "2019-01-01";
      const tom2 = "2019-02-02";
      const tom3 = "2019-03-03";

      const perioder = [
        {
          fom: fom,
          tom: tom2,
        },
        {
          fom: fom,
          tom: tom3,
        },
        {
          fom: fom,
          tom: tom1,
        },
      ];

      const senesteSluttdato = senesteTom(perioder);

      expect(senesteSluttdato).to.equal(tom3);
    });
  });
  describe("periodeOverlapperMedPeriode", () => {
    it("Skal gi true hvis to perioder overlapper", () => {
      const periodeA = {
        fom: "2019-01-01",
        tom: "2019-03-03",
      };
      const periodeB = {
        fom: "2019-02-02",
        tom: "2019-04-04",
      };

      const periodeneOverlapper = periodeOverlapperMedPeriode(
        periodeA,
        periodeB
      );

      expect(periodeneOverlapper).to.equal(true);
    });
    it("Skal gi false hvis to perioder ikke overlapper", () => {
      const periodeA = {
        fom: "2019-03-03",
        tom: "2019-04-04",
      };
      const periodeB = {
        fom: "2019-01-01",
        tom: "2019-02-02",
      };

      const periodeneOverlapper = periodeOverlapperMedPeriode(
        periodeA,
        periodeB
      );

      expect(periodeneOverlapper).to.equal(false);
    });
  });
});
