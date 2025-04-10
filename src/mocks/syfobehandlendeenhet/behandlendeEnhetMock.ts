import { ENHET_GRUNERLOKKA, ENHET_NAV_UTLAND } from "../common/mockConstants";

const behandlendeEnhetMock = {
  enhetId: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};

const behandlendeEnhetNavUtlandMock = {
  enhetId: ENHET_NAV_UTLAND.nummer,
  navn: ENHET_NAV_UTLAND.navn,
};

export const behandlendeEnhetMockResponse = {
  geografiskEnhet: behandlendeEnhetMock,
  oppfolgingsenhet: behandlendeEnhetNavUtlandMock,
};
