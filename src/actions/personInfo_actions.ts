import { PersonAdresse } from "../types/PersonAdresse";

export const HENT_PERSON_ADRESSE_FORESPURT = "HENT_PERSON_ADRESSE_FORESPURT";
export const HENT_PERSON_ADRESSE_HENTER = "HENT_PERSON_ADRESSE_HENTER";
export const HENT_PERSON_ADRESSE_HENTET = "HENT_PERSON_ADRESSE_HENTET";
export const HENT_PERSON_ADRESSE_FEILET = "HENT_PERSON_ADRESSE_FEILET";

export const hentPersonAdresse = (fnr: string) => ({
  type: HENT_PERSON_ADRESSE_FORESPURT,
  fnr,
});

export const hentPersonAdresseHenter = () => ({
  type: HENT_PERSON_ADRESSE_HENTER,
});

export const hentPersonAdresseHentet = (data: PersonAdresse) => ({
  type: HENT_PERSON_ADRESSE_HENTET,
  data,
});

export const hentPersonAdresseFeilet = () => ({
  type: HENT_PERSON_ADRESSE_FEILET,
});
