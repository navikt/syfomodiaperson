import * as actionstype from "./actiontyper";

export function hentAktivBruker(data) {
  return {
    type: actionstype.HENT_AKTIVBRUKER_FORESPURT,
    data,
  };
}

export function hentAktivBrukerFeilet() {
  return {
    type: actionstype.HENT_AKTIVBRUKER_FEILET,
  };
}

export function henterAktivBruker() {
  return {
    type: actionstype.HENTER_AKTIVBRUKER,
  };
}

export function aktivBrukerHentet(data) {
  return {
    type: actionstype.AKTIVBRUKER_HENTET,
    data,
  };
}

export function hentAktivEnhet(data) {
  return {
    type: actionstype.HENT_AKTIVENHET_FORESPURT,
    data,
  };
}

export function hentAktivEnhetFeilet() {
  return {
    type: actionstype.HENT_AKTIVENHET_FEILET,
  };
}

export function henterAktivEnhet() {
  return {
    type: actionstype.HENTER_AKTIVENHET,
  };
}

export function aktivEnhetHentet(data) {
  return {
    type: actionstype.AKTIVENHET_HENTET,
    data,
  };
}

export function pushModiaContextFeilet() {
  return {
    type: actionstype.PUSH_MODIACONTEXT_FEILET,
  };
}

export function pusherModiaContext() {
  return {
    type: actionstype.PUSHER_MODIACONTEXT,
  };
}

export function pushModiaContext(data) {
  return {
    type: actionstype.PUSH_MODIACONTEXT_FORESPURT,
    data,
  };
}

export function modiaContextPushet() {
  return {
    type: actionstype.MODIACONTEXT_PUSHET,
  };
}
