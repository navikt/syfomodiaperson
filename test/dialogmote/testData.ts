import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";

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
