import * as actiontyper from "./actiontyper";

export function hentFastlegerFeilet() {
  return {
    type: actiontyper.HENT_FASTLEGER_FEILET,
  };
}

export function henterFastleger() {
  return {
    type: actiontyper.HENTER_FASTLEGER,
  };
}

export function fastlegerIkkeFunnet() {
  return {
    type: actiontyper.FASTLEGER_IKKE_FUNNET,
  };
}

export function fastlegerHentet(data) {
  return {
    type: actiontyper.FASTLEGER_HENTET,
    data,
  };
}

export function hentFastleger(fnr) {
  return {
    type: actiontyper.HENT_FASTLEGER_FORESPURT,
    fnr,
  };
}
