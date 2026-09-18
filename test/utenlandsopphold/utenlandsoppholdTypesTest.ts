import { describe, expect, it } from "vitest";
import {
  AvslagBehandlingDTO,
  beregnAvslattePerioder,
  DelvisInnvilgetBehandlingDTO,
  HenlagtBehandlingDTO,
  IkkeAktuellBehandlingDTO,
  IkkeAktuellGrunnDTO,
  InnvilgetBehandlingDTO,
  parseBehandling,
  parsePeriode,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

describe("parseBehandling", () => {
  it("parser innvilget behandling med perioder", () => {
    const behandling: InnvilgetBehandlingDTO = {
      utfall: "INNVILGET",
      behandletAv: "Z123456",
      behandletTidspunkt: "2026-09-17T10:15:00",
      innvilgedePerioder: [{ fom: "2026-09-20", tom: "2026-09-25" }],
    };

    const parsedBehandling = parseBehandling(behandling);

    expect(parsedBehandling).to.deep.equal({
      utfall: "INNVILGET",
      behandletAv: "Z123456",
      behandletTidspunkt: new Date("2026-09-17T10:15:00"),
      innvilgedePerioder: [
        {
          fom: new Date(2026, 8, 20),
          tom: new Date(2026, 8, 25),
        },
      ],
    });
    expect(behandling.behandletTidspunkt).to.equal("2026-09-17T10:15:00");
    expect(behandling.innvilgedePerioder[0]).to.deep.equal({
      fom: "2026-09-20",
      tom: "2026-09-25",
    });
  });

  it("parser delvis innvilget behandling med tom periodeliste", () => {
    const behandling: DelvisInnvilgetBehandlingDTO = {
      utfall: "DELVIS_INNVILGET",
      behandletAv: "Z123456",
      behandletTidspunkt: "2026-09-17T10:15:00",
      innvilgedePerioder: [],
      begrunnelse: "Bare deler av perioden innvilges.",
    };

    const parsedBehandling = parseBehandling(behandling);

    expect(parsedBehandling).to.deep.equal({
      utfall: "DELVIS_INNVILGET",
      behandletAv: "Z123456",
      behandletTidspunkt: new Date("2026-09-17T10:15:00"),
      innvilgedePerioder: [],
      begrunnelse: "Bare deler av perioden innvilges.",
    });
  });

  it("parser avslått behandling uten å legge til irrelevante felt", () => {
    const behandling: AvslagBehandlingDTO = {
      utfall: "AVSLAG",
      behandletAv: "Z123456",
      behandletTidspunkt: "2026-09-17T10:15:00",
      begrunnelse: "Vilkårene er ikke oppfylt.",
    };

    const parsedBehandling = parseBehandling(behandling);

    expect(parsedBehandling).to.deep.equal({
      utfall: "AVSLAG",
      behandletAv: "Z123456",
      behandletTidspunkt: new Date("2026-09-17T10:15:00"),
      begrunnelse: "Vilkårene er ikke oppfylt.",
    });
  });

  it("parser henlagt behandling uten å legge til irrelevante felt", () => {
    const behandling: HenlagtBehandlingDTO = {
      utfall: "HENLAGT",
      behandletAv: "Z123456",
      behandletTidspunkt: "2026-09-17T10:15:00",
      begrunnelse: "Søknaden er trukket.",
    };

    const parsedBehandling = parseBehandling(behandling);

    expect(parsedBehandling).to.deep.equal({
      utfall: "HENLAGT",
      behandletAv: "Z123456",
      behandletTidspunkt: new Date("2026-09-17T10:15:00"),
      begrunnelse: "Søknaden er trukket.",
    });
  });

  it("parser ikke aktuell behandling uten å legge til irrelevante felt", () => {
    const behandling: IkkeAktuellBehandlingDTO = {
      utfall: "IKKE_AKTUELL",
      behandletAv: "Z123456",
      behandletTidspunkt: "2026-09-17T10:15:00",
      ikkeAktuellGrunn: IkkeAktuellGrunnDTO.DUPLIKAT,
    };

    const parsedBehandling = parseBehandling(behandling);

    expect(parsedBehandling).to.deep.equal({
      utfall: "IKKE_AKTUELL",
      behandletAv: "Z123456",
      behandletTidspunkt: new Date("2026-09-17T10:15:00"),
      ikkeAktuellGrunn: IkkeAktuellGrunnDTO.DUPLIKAT,
    });
  });
});

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
