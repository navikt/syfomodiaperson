import { describe, expect, it } from "vitest";
import {
  beregnAvslattePerioder,
  parsePeriode,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

describe("beregnAvslattePerioder", () => {
  it("regner ut avslått periode i starten av en søkt periode uten å miste dager pga tidssone-avvik", () => {
    // Bruker parsePeriode (samme som brukes for søknadens soktePerioder) og
    // native lokal-midnatt Date-objekter (samme som datepickeren produserer
    // for innvilgedePerioder), for å sikre at begge datosett er på samme tidsbasis.
    const soktePerioder = [
      parsePeriode({ fom: "2026-06-01", tom: "2026-06-07" }),
    ];
    const innvilgedePerioder = [
      { fom: new Date(2026, 5, 2), tom: new Date(2026, 5, 6) },
    ];

    const avslattePerioder = beregnAvslattePerioder(
      soktePerioder,
      innvilgedePerioder,
    );

    expect(avslattePerioder).to.have.lengthOf(2);
    expect(avslattePerioder[0].fom).to.deep.equal(new Date(2026, 5, 1));
    expect(avslattePerioder[0].tom).to.deep.equal(new Date(2026, 5, 1));
    expect(avslattePerioder[1].fom).to.deep.equal(new Date(2026, 5, 7));
    expect(avslattePerioder[1].tom).to.deep.equal(new Date(2026, 5, 7));
  });

  it("gir tom liste når innvilget periode er lik søkt periode", () => {
    const soktePerioder = [
      parsePeriode({ fom: "2026-06-01", tom: "2026-06-07" }),
    ];
    const innvilgedePerioder = [
      { fom: new Date(2026, 5, 1), tom: new Date(2026, 5, 7) },
    ];

    expect(
      beregnAvslattePerioder(soktePerioder, innvilgedePerioder),
    ).to.have.lengthOf(0);
  });
});
