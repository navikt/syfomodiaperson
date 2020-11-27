import {
  HENT_DOKUMENTINFO_FEILET,
  HENTER_DOKUMENTINFO,
  DOKUMENTINFO_HENTET,
} from "../actions/dokumentinfo_actions";

const initiellState = {};

export default function dokumentinfo(state = initiellState, action) {
  const oppfolgingsplanDokument = {};
  switch (action.type) {
    case HENTER_DOKUMENTINFO:
      oppfolgingsplanDokument[action.planId] = {
        data: {},
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      };
      return { ...state, ...oppfolgingsplanDokument };
    case DOKUMENTINFO_HENTET:
      oppfolgingsplanDokument[action.planId] = {
        data: action.data,
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      };
      return { ...state, ...oppfolgingsplanDokument };
    case HENT_DOKUMENTINFO_FEILET:
      oppfolgingsplanDokument[action.planId] = {
        data: {},
        henter: false,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: true,
      };
      return { ...state, ...oppfolgingsplanDokument };
    default: {
      return state;
    }
  }
}
