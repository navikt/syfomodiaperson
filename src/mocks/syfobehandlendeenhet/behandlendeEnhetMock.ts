import {
  ENHET_GRUNERLOKKA,
  ENHET_NAV_UTLAND,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { BehandlendeEnhetResponseDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";

export const behandlendeEnhetMock = {
  enhetId: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};

const behandlendeEnhetNavUtlandMock = {
  enhetId: ENHET_NAV_UTLAND.nummer,
  navn: ENHET_NAV_UTLAND.navn,
};

export const behandlendeEnhetMockResponse = {
  geografiskEnhet: behandlendeEnhetMock,
  oppfolgingsenhetDTO: {
    enhet: behandlendeEnhetNavUtlandMock,
    createdAt: new Date("2024-10-15"),
    veilederident: VEILEDER_IDENT_DEFAULT,
  },
};

export const ingenTildeltOppfolgingsenhet: BehandlendeEnhetResponseDTO = {
  geografiskEnhet: behandlendeEnhetMock,
  oppfolgingsenhetDTO: null,
};
