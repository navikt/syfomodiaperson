import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import {
  BehandlerDialogmeldingDTO,
  BehandlerType,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

export const arbeidstaker = {
  navn: "Arne Arbeidstaker",
  personident: "05087321470",
};
export const arbeidsgiver = {
  orgnr: "912345678",
};
export const navEnhet = {
  id: "0315",
  navn: "NAV Grünerløkka",
};
export const behandlendeEnhet = {
  enhetId: navEnhet.id,
  navn: navEnhet.navn,
};
export const veileder: Partial<VeilederinfoDTO> = {
  navn: "Vetle Veileder",
  epost: "vetle.veileder@nav.no",
  telefonnummer: "12345678",
};
export const behandler: BehandlerDialogmeldingDTO = {
  behandlerRef: "behandler-ref-uuid",
  kontor: "Greendale Legekontor",
  telefon: "11223344",
  fornavn: "Dean",
  etternavn: "Pelton",
  type: BehandlerType.FASTLEGE,
};
export const dialogmote: DialogmoteDTO = {
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: [],
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: [],
  },
  createdAt: "",
  opprettetAv: "",
  status: DialogmoteStatus.INNKALT,
  tildeltEnhet: "",
  tildeltVeilederIdent: "",
  updatedAt: "",
  uuid: "123abc",
  tid: "2021-05-10T09:00:00.000",
  sted: "Videomøte",
};
export const dialogmoteMedBehandler: DialogmoteDTO = {
  ...dialogmote,
  behandler: {
    behandlerType: behandler.type,
    type: "BEHANDLER",
    uuid: "456def",
    behandlerRef: "456def",
    varselList: [],
    behandlerKontor: "Greendale Legekontor",
    behandlerNavn: "Dean Pelton",
  },
};
