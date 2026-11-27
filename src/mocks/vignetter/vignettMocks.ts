import { http, HttpResponse } from "msw";
import {
  ISFRISKTILARBEID_ROOT,
  ISHUSKELAPP_ROOT,
  ISMEROPPFOLGING_ROOT,
  ISNARMESTELEDER_ROOT,
  ISOPPFOLGINGSTILFELLE_ROOT,
  ISPERSONOPPGAVE_ROOT,
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  MEROPPFOLGING_BACKEND_V1_ROOT,
  MODIACONTEXTHOLDER_ROOT,
  PENSJON_PEN_UFOREGRAD_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
  SYFOPERSON_ROOT,
  SYFOSMREGISTER_ROOT,
  SYKEPENGEDAGER_INFORMASJON_ROOT,
  VEILARBOPPFOLGING_ROOT,
} from "@/apiConstants";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalKandidatVurderingRequestDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { KartleggingssporsmalFormSnapshotFieldType } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import {
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import {
  kartleggingssporsmalFlervalgFritekstV3Answered,
  kartleggingssporsmalFlervalgFritekstV3LowRiskAnswered,
} from "@/mocks/meroppfolging-backend/kartleggingssporsmalMockData";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import { getAbsoluteCalendarDaysBetween } from "@/utils/datoUtils";
import { NyeSykmeldingStatuser } from "@/utils/sykmeldinger/sykmeldingstatuser";
import { generateUUID } from "@/utils/utils";

interface Periode {
  fom: string;
  tom: string;
  grad: number;
}

interface Vignett {
  personident: string;
  navn: string;
  alder: number;
  kjonn: string;
  fodselsdato: string;
  arbeidsgiver: string;
  orgnummer: string;
  stilling: string;
  sykmelderEtternavn: string;
  varslet: string;
  svart: string;
  hasUtbetaling: boolean;
  hasGjentakendeSykefravar: boolean;
  diagnose: { kode: string; tekst: string };
  historikk: { fom: string; tom: string; kode: string }[];
  perioder: Periode[];
  utfordrendeBegrunnelse?: string;
  arbeidsgiverBegrunnelse?: string;
}

// Fictional H-numbers use month 41 so they cannot identify ordinary population-register persons.
const vignetter: Record<string, Vignett> = {
  kari: {
    personident: "01418410074",
    navn: "Kari Konsulent",
    alder: 42,
    kjonn: "KVINNE",
    fodselsdato: "1984-01-01",
    arbeidsgiver: "Nordkonsult AS",
    orgnummer: "900000001",
    stilling: "Seniorkonsulent",
    sykmelderEtternavn: "Brille",
    varslet: "2026-11-16",
    svart: "2026-11-18",
    hasUtbetaling: false,
    hasGjentakendeSykefravar: false,
    diagnose: {
      kode: "Z733",
      tekst: "Problem i forbindelse med stress, ikke klassifisert annet sted",
    },
    historikk: [
      { fom: "2026-10-05", tom: "2026-12-04", kode: "Z733" },
      { fom: "2025-03-10", tom: "2025-03-30", kode: "F430" },
      { fom: "2024-08-05", tom: "2025-03-02", kode: "Z730" },
      { fom: "2024-05-27", tom: "2024-06-14", kode: "F439" },
    ],
    perioder: [
      { fom: "2026-11-05", tom: "2026-12-04", grad: 50 },
      { fom: "2026-10-22", tom: "2026-11-04", grad: 50 },
      { fom: "2026-10-08", tom: "2026-10-21", grad: 100 },
      { fom: "2026-10-05", tom: "2026-10-07", grad: 100 },
    ],
  },
  sjur: {
    personident: "01417110093",
    navn: "Sjur Sjauer",
    alder: 55,
    kjonn: "MANN",
    fodselsdato: "1971-01-01",
    arbeidsgiver: "Bygglager AS",
    orgnummer: "900000002",
    stilling: "Lagerarbeider",
    sykmelderEtternavn: "Proktor",
    varslet: "2026-10-12",
    svart: "2026-10-13",
    hasUtbetaling: true,
    hasGjentakendeSykefravar: false,
    diagnose: { kode: "M545", tekst: "Lumbago" },
    historikk: [
      { fom: "2026-10-05", tom: "2026-11-22", kode: "M545" },
      { fom: "2024-03-04", tom: "2024-05-26", kode: "S924" },
    ],
    perioder: [
      { fom: "2026-11-09", tom: "2026-11-22", grad: 100 },
      { fom: "2026-10-26", tom: "2026-11-08", grad: 100 },
      { fom: "2026-10-05", tom: "2026-10-25", grad: 100 },
    ],
    utfordrendeBegrunnelse:
      "Jeg er bekymret for om ryggen blir bra igjen. Hvis ikke, kommer det til å bli vanskelig å fortsette i denne jobben. Legen sier jeg må ta tida til hjelp.",
    arbeidsgiverBegrunnelse:
      "Jeg kan ikke bære og løfte tungt, og sjefen min har ikke funnet alternative oppgaver til meg. Han er vanskelig å få tak i og vi har ikke fått snakket noe særlig sammen etter at jeg ble sykmeldt.",
  },
  synne: {
    personident: "01419510013",
    navn: "Synne Sykepleier",
    alder: 31,
    kjonn: "KVINNE",
    fodselsdato: "1995-01-01",
    arbeidsgiver: "Solsiden kommunale sykehjem",
    orgnummer: "900000003",
    stilling: "Sykepleier",
    sykmelderEtternavn: "Oetker",
    varslet: "2026-11-16",
    svart: "2026-11-18",
    hasUtbetaling: false,
    hasGjentakendeSykefravar: true,
    diagnose: {
      kode: "F410",
      tekst: "Panikklidelse [episodisk paroksysmal angst]",
    },
    historikk: [
      { fom: "2026-10-05", tom: "2026-11-29", kode: "F410" },
      { fom: "2026-02-17", tom: "2026-03-08", kode: "F419" },
      { fom: "2025-09-01", tom: "2025-09-28", kode: "F419" },
      { fom: "2025-03-03", tom: "2025-03-23", kode: "F419" },
      { fom: "2024-11-04", tom: "2024-12-01", kode: "F419" },
      { fom: "2024-06-10", tom: "2024-06-30", kode: "F419" },
    ],
    perioder: [
      { fom: "2026-11-16", tom: "2026-11-29", grad: 100 },
      { fom: "2026-10-19", tom: "2026-11-15", grad: 100 },
      { fom: "2026-10-05", tom: "2026-10-18", grad: 100 },
    ],
  },
};

function createSvar(
  vignett: Vignett,
  kandidatUuid: string,
): KartleggingssporsmalSvarResponseDTO {
  const svar = structuredClone(
    vignett.utfordrendeBegrunnelse
      ? kartleggingssporsmalFlervalgFritekstV3Answered
      : kartleggingssporsmalFlervalgFritekstV3LowRiskAnswered,
  );
  for (const field of svar.formSnapshot.fieldSnapshots) {
    if (field.fieldType === KartleggingssporsmalFormSnapshotFieldType.TEXT) {
      field.value =
        (field.fieldId === "mulighetForTilbakeTilJobbenUtfordrendeBegrunnelse"
          ? vignett.utfordrendeBegrunnelse
          : vignett.arbeidsgiverBegrunnelse) ?? "";
    } else {
      const selected = field.options.find((option) => option.wasSelected);
      if (!selected) continue;
      if (field.fieldId === "mulighetForTilbakeTilJobbenFlervalg") {
        selected.optionLabel = vignett.utfordrendeBegrunnelse
          ? "Jeg ser på det som utfordrende å komme tilbake til nåværende jobb og stilling"
          : "Jeg har tro på at jeg kommer tilbake til samme jobb og stilling.";
      }
      if (field.fieldId === "naarTilbakeTilJobbenFlervalg") {
        selected.optionLabel = "Mindre enn seks måneder.";
      }
    }
  }
  return {
    ...svar,
    uuid: generateUUID(),
    fnr: vignett.personident,
    kandidatId: kandidatUuid,
    createdAt: new Date(vignett.svart),
  };
}

function createSykmelding(
  vignett: Vignett,
  periode: Periode,
  diagnose = vignett.diagnose,
): SykmeldingNewFormatDTO {
  const timestamp = `${periode.fom}T08:00:00Z`;
  return {
    id: generateUUID(),
    mottattTidspunkt: timestamp,
    behandletTidspunkt: timestamp,
    behandlingsutfall: { status: BehandlingsutfallStatusDTO.OK, ruleHits: [] },
    arbeidsgiver: {
      navn: vignett.arbeidsgiver,
      yrkesbetegnelse: vignett.stilling,
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        fom: periode.fom,
        tom: periode.tom,
        type:
          periode.grad === 100
            ? PeriodetypeDTO.AKTIVITET_IKKE_MULIG
            : PeriodetypeDTO.GRADERT,
        ...(periode.grad < 100 && {
          gradert: { grad: periode.grad, reisetilskudd: false },
        }),
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: NyeSykmeldingStatuser.SENDT,
      timestamp,
      arbeidsgiver: {
        orgnummer: vignett.orgnummer,
        juridiskOrgnummer: vignett.orgnummer,
        orgNavn: vignett.arbeidsgiver,
      },
      sporsmalOgSvarListe: [],
    },
    medisinskVurdering: {
      hovedDiagnose: { ...diagnose, system: "ICD-10" },
      biDiagnoser: [],
      svangerskap: false,
      yrkesskade: false,
    },
    skjermesForPasient: false,
    utdypendeOpplysninger: new Map(),
    kontaktMedPasient: {},
    behandler: {
      fornavn: "Doktor",
      etternavn: vignett.sykmelderEtternavn,
      adresse: {},
    },
  };
}

function createOppfolgingstilfeller(
  vignett: Vignett,
): OppfolgingstilfellePersonDTO {
  return {
    personIdent: vignett.personident,
    hasGjentakendeSykefravar: vignett.hasGjentakendeSykefravar,
    oppfolgingstilfelleList: vignett.historikk.map(({ fom, tom }) => {
      const start = new Date(fom);
      const end = new Date(tom);
      const antallSykedager = getAbsoluteCalendarDaysBetween(start, end) + 1;
      return {
        start,
        end,
        arbeidstakerAtTilfelleEnd: true,
        antallSykedager,
        varighetUker: Math.ceil(antallSykedager / 7),
        virksomhetsnummerList: [vignett.orgnummer],
      };
    }),
  };
}

/**
 * Creates isolated local MSW overrides for Oxford Research's fictional cases.
 * Select with ?vignett=kari, ?vignett=sjur or ?vignett=synne before loading the app.
 * Unknown or absent selections leave the standard mocks unchanged.
 */
export function getVignettHandlers(search: string) {
  const key = new URLSearchParams(search).get("vignett");
  const vignett =
    key && Object.prototype.hasOwnProperty.call(vignetter, key)
      ? vignetter[key]
      : undefined;
  if (!vignett) return [];

  let kandidat: KartleggingssporsmalKandidatResponseDTO = {
    kandidatUuid: generateUUID(),
    personident: vignett.personident,
    createdAt: new Date(vignett.varslet),
    varsletAt: new Date(vignett.varslet),
    svarAt: new Date(vignett.svart),
    statusAt: new Date(vignett.svart),
    status: KandidatStatus.SVAR_MOTTATT,
    vurdering: null,
  };
  const svar = createSvar(vignett, kandidat.kandidatUuid);
  const sykmeldinger = [
    ...vignett.perioder.map((periode) => createSykmelding(vignett, periode)),
    ...vignett.historikk
      .slice(1)
      .map(({ fom, tom, kode }) =>
        createSykmelding(
          vignett,
          { fom, tom, grad: 100 },
          { kode, tekst: kode },
        ),
      ),
  ];
  const context = {
    aktivBruker: vignett.personident,
    aktivEnhet: ENHET_GRUNERLOKKA.nummer,
  };

  return [
    ...["/context/aktivbruker", "/context/v2/aktivbruker"].map((path) =>
      http.get(`${MODIACONTEXTHOLDER_ROOT}${path}`, () =>
        HttpResponse.json(context),
      ),
    ),
    http.get(`${SYFOPERSON_ROOT}/person/brukerinfo`, () =>
      HttpResponse.json({
        ...brukerinfoMock,
        aktivPersonident: vignett.personident,
        navn: vignett.navn,
        alder: vignett.alder,
        kjonn: vignett.kjonn,
        fodselsdato: vignett.fodselsdato,
        sikkerhetstiltak: [],
        vergemal: [],
      }),
    ),
    http.get(`${SYFOPERSON_ROOT}/person/egenansatt`, () =>
      HttpResponse.json(false),
    ),
    http.get(`${SYFOPERSON_ROOT}/person/kontaktinformasjon`, () =>
      HttpResponse.json({ epost: null, tlf: null, skalHaVarsel: true }),
    ),
    http.get(`${SYFOPERSON_ROOT}/person/arbeidsforhold`, () =>
      HttpResponse.json({
        personident: vignett.personident,
        arbeidsforhold: [
          {
            navArbeidsforholdId: 1,
            opprettet: "2024-01-01T00:00:00",
            sistBekreftet: "2026-10-05T00:00:00",
            orgnummer: vignett.orgnummer,
            type: "Ordinært arbeidsforhold",
            ansettelseStart: "2024-01-01",
            ansettelseSlutt: null,
            ansettelsesform: "Fast ansettelse",
            yrke: vignett.stilling,
            stillingsprosent: "100",
          },
        ],
      }),
    ),
    http.get("/ereg/api/v1/organisasjon/:virksomhetsnummer", () =>
      HttpResponse.json({
        navn: {
          navnelinje1: vignett.arbeidsgiver,
          redigertnavn: vignett.arbeidsgiver,
        },
      }),
    ),
    http.get(`${ISNARMESTELEDER_ROOT}/narmestelederrelasjon/personident`, () =>
      HttpResponse.json([]),
    ),
    http.get(
      `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
      () => HttpResponse.json(createOppfolgingstilfeller(vignett)),
    ),
    http.get(`${SYFOSMREGISTER_ROOT}/sykmeldinger`, () =>
      HttpResponse.json(sykmeldinger),
    ),
    http.get(`${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`, () =>
      HttpResponse.json([kandidat]),
    ),
    http.get(
      `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/kandidat/:kandidatUUID/svar`,
      () => HttpResponse.json(svar),
    ),
    http.put<
      { kandidatUUID: string },
      Omit<KartleggingssporsmalKandidatVurderingRequestDTO, "kandidatUuid">
    >(
      `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater/:kandidatUUID`,
      async ({ request }) => {
        const { vurderingAlternativ, vurderingFritekst } = await request.json();
        kandidat = {
          ...kandidat,
          status: KandidatStatus.FERDIGBEHANDLET,
          statusAt: new Date(),
          vurdering: {
            vurdertAt: new Date(),
            vurdertBy: VEILEDER_IDENT_DEFAULT,
            vurderingAlternativ,
            vurderingFritekst,
          },
        };
        return HttpResponse.json(kandidat);
      },
    ),
    http.get(`${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`, () =>
      HttpResponse.json({
        maxDate: vignett.hasUtbetaling
          ? {
              id: "vignett-sjur",
              fnr: vignett.personident,
              forelopig_beregnet_slutt: new Date("2027-10-03"),
              utbetalt_tom: new Date("2026-11-08"),
              tom: new Date("2026-11-08"),
              gjenstaende_sykedager: "235",
              opprettet: new Date("2026-10-26"),
            }
          : null,
      }),
    ),
    http.get(`${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`, () =>
      HttpResponse.json([]),
    ),
    http.get(`${ISHUSKELAPP_ROOT}/huskelapp`, ({ request }) =>
      new URL(request.url).searchParams.get("isActive") === "true"
        ? new HttpResponse(null, { status: 204 })
        : HttpResponse.json([]),
    ),
    http.get(`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`, () =>
      HttpResponse.json([]),
    ),
    http.post(
      `${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/query`,
      () => HttpResponse.json([]),
    ),
    http.post(`${VEILARBOPPFOLGING_ROOT}/hent-underOppfolging`, () =>
      HttpResponse.json({ underOppfolging: false }),
    ),
    http.get(`${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`, () =>
      HttpResponse.json([]),
    ),
    http.get(`${PENSJON_PEN_UFOREGRAD_ROOT}/uforegrad`, () =>
      HttpResponse.json({ uforegrad: null }),
    ),
    http.post(`${SYFOPERSON_ROOT}/person/aap-saker/query`, () =>
      HttpResponse.json({ soknader: [], vedtak: [] }),
    ),
    http.post(`${SYFOPERSON_ROOT}/person/tiltak/query`, () =>
      HttpResponse.json({ tiltak: [] }),
    ),
  ];
}
