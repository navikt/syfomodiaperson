import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import {
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../mock/common/mockConstants";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AktivitetskravVarselDTO,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { generateUUID } from "@/utils/uuidUtils";
import { daysFromToday } from "./testUtils";
import { dagerMellomDatoer } from "@/utils/datoUtils";

export const generateOppfolgingstilfelle = (
  start: Date,
  end: Date
): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    arbeidstakerAtTilfelleEnd: true,
    end: end,
    start: start,
    antallSykedager: dagerMellomDatoer(start, end) + 1,
    varighetUker: 1,
  };
};

export const createAktivitetskrav = (
  stoppunktAt: Date,
  status: AktivitetskravStatus,
  vurderinger: AktivitetskravVurderingDTO[] = []
): AktivitetskravDTO => {
  return {
    createdAt: new Date(),
    inFinalState:
      status !== AktivitetskravStatus.AVVENT &&
      status !== AktivitetskravStatus.FORHANDSVARSEL &&
      status !== AktivitetskravStatus.NY &&
      status !== AktivitetskravStatus.NY_VURDERING,
    status,
    stoppunktAt,
    uuid: generateUUID(),
    vurderinger,
  };
};

export const createAktivitetskravVurdering = (
  status: AktivitetskravStatus,
  arsaker: VurderingArsak[],
  beskrivelse: string | undefined = "",
  createdAt = new Date(),
  frist?: Date,
  varsel?: AktivitetskravVarselDTO
): AktivitetskravVurderingDTO => {
  return {
    beskrivelse,
    createdAt,
    createdBy: VEILEDER_IDENT_DEFAULT,
    status,
    uuid: generateUUID(),
    arsaker,
    frist,
    varsel,
  };
};

export const avventVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT,
  [
    AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
    AvventVurderingArsak.INFORMASJON_BEHANDLER,
  ],
  "",
  new Date(),
  new Date()
);
export const avventVurderingUtenFrist = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT,
  [
    AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
    AvventVurderingArsak.INFORMASJON_BEHANDLER,
  ],
  "",
  new Date()
);
export const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT,
  [OppfyltVurderingArsak.FRISKMELDT]
);
export const forhandsvarselVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.FORHANDSVARSEL,
  [],
  "Begrunnelse for forhåndsvarsel",
  new Date(),
  undefined,
  {
    uuid: generateUUID(),
    createdAt: new Date(),
    svarfrist: daysFromToday(21),
    document: [],
  }
);

export const expiredForhandsvarselVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.FORHANDSVARSEL,
  [],
  "Begrunnelse for forhåndsvarsel",
  new Date(),
  undefined,
  {
    uuid: generateUUID(),
    createdAt: new Date(),
    svarfrist: daysFromToday(-1),
    document: [],
  }
);
